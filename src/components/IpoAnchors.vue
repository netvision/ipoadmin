<template>
<q-page class="q-pa-md">
  <div class="row q-gutter-md" style="max-width:600px">
        <div class="col q-pa-md" v-if="!ipo.anchors_pdf">
          <q-btn flat color="primary" label="Upload pdf file of Anchors" @click="pdfUpload = true" />
        </div>
        <div class="col q-pa-md" v-else>
          <q-item>
            <q-item-section top>
              <q-item-label>
                <span class="text-weight-medium">Anchors (Pdf)</span>
              </q-item-label>
              <q-item-label caption lines="1">
                {{ipo.anchors_pdf.slice(33)}}
              </q-item-label>
            </q-item-section>
            <q-item-section top side>
              <div class="text-grey-8 q-gutter-xs">
                <q-btn class="gt-xs" size="12px" flat dense round icon="open_in_new" type="a" :href="'https://api.ipoinbox.com/'+ipo.anchors_pdf" target="__blank" />
                <q-btn class="gt-xs" size="12px" flat dense round icon="change_circle" @click="pdfUpload = true" />
              </div>
            </q-item-section>
          </q-item>
        </div>
    </div>
    <q-dialog v-model="pdfUpload">
          <q-uploader
            label="Anchors PDF"
            field-name="pdf_file"
            no-thumbnails
            auto-upload
            :form-fields = "[{name:'ipo_id', value: ipoId}, {name:'field', value: 'anchors'} ]"
            url="https://api.ipoinbox.com/ipo/pdfupload"
            @uploaded = 'pdfUploaded'
          />
        </q-dialog>

        <q-table
      title="Anchors"
      :columns="columns"
      :rows = "ipoAnchors"
      row-key="id"
      dense
      >
      <template v-slot:top>
        <div class="col-4 q-table__title">Key Investors</div>
        <q-space />
        <div class="col-7">Total Shares: {{anchorsProp}}</div>
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

         <q-dialog v-model="anchorModel">
           <q-card class="my-card" style="width:150vw">
            <q-item>
                <q-item-section>
                    <q-select
                        square
                        bg-color="teal-1"
                        standout="bg-teal-3 text-white"
                        filled
                        v-model="anchor.a_id"
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
                </q-item-section>
                <q-item-section side top>
                    <q-input type="text" v-model="anchor.no_of_equity_shares" @blur="removeComa" />
                </q-item-section>
                <q-btn flat @click="addRecord" :label="(anchor.id) ? 'Edit' : 'Add'" />
            </q-item>
            </q-card>
           </q-dialog>
</q-page>

</template>
<script setup>
import { ref, onMounted} from 'vue'
import { api, axios } from '../boot/axios'
import { useQuasar } from 'quasar'
const props = defineProps({
    IpoId: String
  })
const ipoId = ref(props.IpoId)
const ipo = ref({})
//const ipo = ref({})
const anchors = ref([])
const ipoAnchors = ref([])
const anchor = ref({})
const options = ref([])
const anchorsProp = ref(0)
const pdfUpload = ref(false)
const anchorModel = ref(false)

const columns = ref([
  {
    name: 'index',
    label: '#',
    field: ''
  },
  {
    name: 'name',
    label: 'Name',
    field: row => row.anchor.name,
    align: 'left',
    sortable: true
  },
  {
    name: 'quantity',
    label: 'Quantity',
    field: 'no_of_equity_shares',
    align: 'left',
    sortable: true
  },
  {
    name: 'actions',
    label: 'Actions',
    field: '',
  }
])

const filter = (val, update, abort) => {
    update(() => {
          const needle = val.toLowerCase()
          options.value = options.value.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
        })
}

const filterAb = () => {
  options.value = anchors.value
}

const createSelectValue = async(val, done) => {
    let newAnchor = await axios.post('https://api.ipoinbox.com/anchors', {name: val.trim(), details:'#'})
    if(newAnchor.statusText == '201'){
        options.value.push(newAnchor.data)
        anchor.value.id = newAnchor.data
    }
    done(newAnchor.data, "add");
}

const addRecord = async() => {
    if(anchor.value.id){
        let res = await axios.put('https://api.ipoinbox.com/ipo-anchors/'+anchor.value.id, anchor.value)
    }
    else {
        let res = await axios.post('https://api.ipoinbox.com/ipo-anchors', {ipo_id: ipoId.value, anchor_id: anchor.value.a_id.id, no_of_equity_shares: anchor.value.no_of_equity_shares})
        if(res.status == 201){
            res.data.anchor = anchor.value.a_id
            ipoAnchors.value.push(res.data)
        }
        anchors.value.push(anchor.value.a_id)
        anchor.value = {}
        options.value = anchors.value
    }
    anchorModel.value = false
    getTotal()
 }

const showModel = () => {
    anchor.value = {}
    anchorModel.value = true
}

const edit = (i) => {
    anchor.value = i.row
    anchor.value.a_id = i.row.anchor
    anchorModel.value = true
    getTotal()
}

const del = async(i) => {
    let res = await axios.delete('https://api.ipoinbox.com/ipo-anchors/'+i.row.id)
    if(res.status == 204){
        ipoAnchors.value.splice(i.rowIndex, 1)
    }
    getTotal()
}
const getTotal = () => {
    anchorsProp.value = ipoAnchors.value.reduce((acc, cur) => acc + +cur.no_of_equity_shares, 0)
}

const removeComa = () => {
  anchor.value.no_of_equity_shares = (typeof anchor.value.no_of_equity_shares !== 'undefined') ? Math.abs(anchor.value.no_of_equity_shares.replace(/(,|[^\d.-]+)+/g, '')) :  null
}

const pdfUploaded = async(files) =>{
    let pdf_url = JSON.parse(files.xhr.response)
    const res = await axios.put('https://api.ipoinbox.com/ipos/'+ipoId.value, {anchors_pdf: pdf_url})
    ipo.value = res.data
    pdfUpload.value = false
  }

onMounted(async() => {
    ipo.value = await axios.get('https://api.ipoinbox.com/ipos/'+ipoId.value).then(r => r.data)
    ipoAnchors.value = await axios.get('https://api.ipoinbox.com/ipo-anchors?expand=anchor&ipo_id='+ipoId.value).then(r => r.data)
    anchors.value = await axios.get('https://api.ipoinbox.com/anchor').then(r => r.data)
    //ipo.value = await axios.get('https://api.ipoinbox.com/ipos/'+ipoId.value+'?fields=company_name,open_date').then(r => r.data)
    //console.log(ipoAnchors.value)
    options.value = anchors.value
    getTotal()
})
</script>
