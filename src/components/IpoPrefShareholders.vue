<template>
  <q-page class="q-pa-md">
  <div class="row q-gutter-md" style="max-width:600px">
        <div class="col q-pa-md" v-if="!ipo.prefshareholders_pdf">
          <q-btn flat color="primary" label="Upload pdf file of Preferential Allotments" @click="pdfUpload = true" />
        </div>
        <div class="col q-pa-md" v-else>
          <q-item>
            <q-item-section top>
              <q-item-label>
                <span class="text-weight-medium">Preferential Allotments (Pdf)</span>
              </q-item-label>
              <q-item-label caption lines="1">
                {{ipo.prefshareholders_pdf.slice(33)}}
              </q-item-label>
            </q-item-section>
            <q-item-section top side>
              <div class="text-grey-8 q-gutter-xs">
                <q-btn class="gt-xs" size="12px" flat dense round icon="open_in_new" type="a" :href="ipo.prefshareholders_pdf" target="__blank" />
                <q-btn class="gt-xs" size="12px" flat dense round icon="change_circle" @click="pdfUpload = true" />
              </div>
            </q-item-section>
          </q-item>
        </div>
    </div>
    <q-dialog v-model="pdfUpload">
      <q-uploader
        label="Preferential Shareholders PDF"
        field-name="pdf_file"
        no-thumbnails
        auto-upload
        :form-fields = "[{name:'ipo_id', value: ipoId}, {name:'field', value: 'prefshareholders'} ]"
        url="https://api.ipoinbox.com/ipo/pdfupload"
        @uploaded = 'pdfUploaded'
      />
    </q-dialog>
    <q-table
      title="Key Investors"
      :columns="columns"
      :rows = "ipoPrefAllotments"
      row-key="id"
      dense
      >
      <template v-slot:top>
        <div class="col-4 q-table__title">Key Investors</div>
        <q-space />
        <div class="col-7">Total Shares: {{ prefTotal }}</div>
        <div class="col-1"><q-btn class="gt-xs" size="12px" flat dense icon="add" @click="showModel" /></div>
      </template>
      <template v-slot:body-cell-index="props">
        <q-td :props="props">
          {{ props.rowIndex + 1 }}
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn size="12px" flat dense round icon="edit" @click="edit(props)" /> <q-btn size="12px" flat dense round icon="delete" @click="del(props)" />
        </q-td>
      </template>
    </q-table>

        <q-dialog v-model="prefAllotmentModel">
        <q-card class="my-card" style="width:150vw">
        <div class="row">
          <div class="col q-ma-md">
            <q-select
                    label="Name"
                    stack-label
                    square
                    bg-color="teal-1"
                    standout="bg-teal-3 text-white"
                    filled
                    v-model="allotment.allotee"
                    :options="options"
                    @filter="filter"
                    @filter-abort="filterAb"
                    @new-value="createSelectValue"
                    options-selected-class="text-primary"
                    options-dense
                    use-input
                    option-value="id"
                    option-label="name"
                />
          </div>
          <div class="col q-ma-md">
            <q-select v-model="allotment.category" :options="['Preferential', 'Marquee']" label="Category" stack-label  />
          </div>
        </div>
        <div class="row">
          <div class="col q-ma-md">
            <q-input type="text" v-model="allotment.qty_of_shares" @blur="removeComa" label="Quantity" />
          </div>
          <div class="col q-ma-md">
            <q-input type="text" v-model="allotment.issued_price" label="Price" />
          </div>
          <div class="col q-ma-md">
            <q-input label="Issue Date" v-model="allotment.date_of_allotment">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="allotment.date_of_allotment" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
        <div class="row">
          <div class="col q-ma-md text-center">
            <q-btn flat @click="addRecord" :label="(allotment.id) ? 'Edit' : 'Add'" />
          </div>
        </div>

        </q-card>
        </q-dialog>
        <div class="q-pa-md">
        <p class="text-left text-h6">Notes</p>
        <q-editor v-model="ipo.pref_note"></q-editor>
        <q-btn flat color="primary" label="Save Note" @click="savePrefNote" />
      </div>
  </q-page>
</template>
<script setup>
import { ref, onMounted} from 'vue'
import { useQuasar } from 'quasar'
import { axios } from '../boot/axios'

const props = defineProps({
    IpoId: String
  })
const $q = useQuasar()
const ipo = ref({})
const ipoId = ref(props.IpoId)
const pdfUpload = ref(false)

const prefTotal = ref(0)
const allotment = ref({
  'date_of_allotment': new Date()
})
const prefAllotmentModel = ref(false)
const ipoPrefAllotments = ref([])
const allottee = ref({})
const options = ref([])

const columns = ref([
  {
    name: 'index',
    label: '#',
    field: ''
  },
  {
    name: 'name',
    label: 'Name',
    field: row => row.allotee.name,
    align: 'left',
    sortable: true
  },
  {
    name: 'type',
    label: 'Type',
    field: 'category',
    align: 'left',
    sortable: true
  },
  {
    name: 'quantity',
    label: 'Quantity',
    field: 'qty_of_shares',
    align: 'left',
    sortable: true
  },
  {
    name: 'issue_price',
    label: 'Issued price',
    field: 'issued_price',
    align: 'left',
    sortable: true
  },
  {
    name: 'date',
    label: 'Issued Date',
    field: 'date_of_allotment',
    sortable: true
  },
  {
    name: 'actions',
    label: 'Actions',
    field: '',
  }
])

const filter = (val, update, abort) => {
  update(async() => {
        const needle = val.toLowerCase()
        options.value = await axios.get('https://api.ipoinbox.com/pref-shareholders?filter[name][like]='+val).then(r => r.data)
      })
  abort(() => {
    options.value = []
  })
}

const filterAb = () => {
  options.value = []
}

const createSelectValue = async(val, done) => {
    let newShareholder = await axios.post('https://api.ipoinbox.com/pref-shareholders', {name: val.trim(), detail:'#'})
    if(newShareholder.statusText == '201'){
        options.value.push(newShareholder.data)
        allotee.value.id = newShareholder.data
    }
    done(newShareholder.data, "add");
}

const addRecord = async() => {
  let allot = allotment.value
  allot.ipo_id = ipoId.value
  allot.allotee_id = allotment.value.allotee.id
  //delete allot.allotee
   if(allot.id){
        let res = await axios.put('https://api.ipoinbox.com/ipo-pref-allotments/'+allot.id, allot)
    }
    else {
        let res = await axios.post('https://api.ipoinbox.com/ipo-pref-allotments', allot)
        if(res.status == 201){
            allotment.value.id = res.data.id
            ipoPrefAllotments.value.push(allotment.value)
        }

        allotment.value = {}
    }
    prefAllotmentModel.value = false
    getTotal()
    console.log(allotment.value)
 }

 const edit = (item) => {
  /* console.log(item.row) */
    allotment.value = item.row
    prefAllotmentModel.value = true
}

const del = async(item) => {
    let res = await axios.delete('https://api.ipoinbox.com/ipo-pref-allotments/'+item.row.id)
    if(res.status == 204){
        ipoPrefAllotments.value.splice(item.rowIndex, 1)
    }
    getTotal()
}

const getTotal = () => {
    prefTotal.value = ipoPrefAllotments.value.reduce((acc, cur) => acc + cur.qty_of_shares, 0)
}

const removeComa = () => {
  allotment.value.qty_of_shares = (typeof allotment.value.qty_of_shares !== 'undefined') ? Math.abs(allotment.value.qty_of_shares.replace(/(,|[^\d.-]+)+/g, '')) :  null
}

const pdfUploaded = async(files) =>{
    let pdf_url = JSON.parse(files.xhr.response)
    const res = await axios.put('https://api.ipoinbox.com/ipos/'+ipoId.value, {prefshareholders_pdf: pdf_url})
    ipo.value = res.data
    pdfUpload.value = false
  }

  const savePrefNote = async() => {
    if (ipo.value.ipo_id){
      let res = await axios.put('https://api.ipoinbox.com/ipos/'+ipo.value.ipo_id, ipo.value)
    if(res.status == 200 || res.status == 201) {
        $q.notify({
            message: 'Updated Successfully',
            icon: 'announcement'
            })
    }
    }
  }

const showModel = () => {
    allotment.value = {}
    prefAllotmentModel.value = true
}

onMounted(async() => {
  ipo.value = await axios.get('https://api.ipoinbox.com/ipos/'+ipoId.value).then(r => r.data)
  ipoPrefAllotments.value = await axios.get('https://api.ipoinbox.com/ipo-pref-allotments?expand=allotee&ipo_id='+ipoId.value).then(r => r.data)
  //options.value = await axios.get('https://api.ipoinbox.com/pref-shareholders').then(r => r.data)
  getTotal()
})
</script>
