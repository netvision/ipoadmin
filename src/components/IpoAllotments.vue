<template>
  <h4 class="text-h4">Allotments</h4>
  <div class="row q-gutter-md" style="max-width:600px">
        <div class="col q-pa-md" v-if="!ipo.basis_of_allotment_pdf">
          <q-btn flat color="primary" label="Upload pdf file of Basis of Allotment" @click="pdfUpload = true" />
        </div>
        <div class="col q-pa-md" v-else>
          <q-item>
            <q-item-section top>
              <q-item-label>
                <span class="text-weight-medium">Basis of Allotment (Pdf)</span>
              </q-item-label>
              <q-item-label caption lines="1">
                {{ipo.basis_of_allotment_pdf.slice(33)}}
              </q-item-label>
            </q-item-section>
            <q-item-section top side>
              <div class="text-grey-8 q-gutter-xs">
                <q-btn class="gt-xs" size="12px" flat dense round icon="open_in_new" type="a" :href="ipo.basis_of_allotment_pdf" target="__blank" />
                <q-btn class="gt-xs" size="12px" flat dense round icon="change_circle" @click="pdfUpload = true" />
              </div>
            </q-item-section>
          </q-item>

        </div>
        <q-input label="Issue Price" v-model="ipo.issue_price">
          <template v-slot:prepend>
                &#8377;
            </template>
        </q-input>
        <q-dialog v-model="pdfUpload">
          <q-uploader
            label="Basis of Allotment PDF"
            field-name="pdf_file"
            no-thumbnails
            auto-upload
            :form-fields = "[{name:'ipo_id', value: ipo.ipo_id}, {name:'field', value: 'allotment'}]"
            url="https://droplet.netserve.in/ipo/pdfupload"
            @uploaded = 'pdfUploaded'
          />
        </q-dialog>
  </div>
  <div class="row q-gutter-md">
    <div class="col q-pa-md">
      <table class="subs">
        <tr><th rowspan="2">Category</th><th rowspan="2">Reserved as Per Prospectus</th><th colspan="2">Recieved Bids</th><th colspan="2">Qualified Bids</th></tr>
        <tr><th>Bids</th><th>Applications</th><th>Bids</th><th>Applications</th></tr>
        <tr v-for="boa in boaData" :key="boa.id">
          <td>
            <q-input :label="boa.cat.short_name" readonly standout placeholder="Placeholder">
              <template v-slot:append>
                <q-btn round dense flat icon="chevron_right" />
              </template>
            </q-input>
          </td>
          <td><q-input v-model="boa.quota" label="Quota" outlined disable bg-color="cyan-2" /></td>
          <td><q-input v-model="boa.recieved_bids" label="Recieved Bids" outlined @blur="update(boa, 'recieved_bids')" /></td>
          <td><q-input v-model="boa.recieved_apps" label="Recieved Applications" outlined @blur="update(boa, 'recieved_apps')" /></td>
          <td><q-input v-model="boa.qualified_bids" label="Qualified Bids" outlined  @blur="update(boa, 'qualified_bids')" /></td>
          <td><q-input v-model="boa.qualified_apps" label="Qualified Applications" outlined @blur="update(boa, 'qualified_apps')" /></td>
        </tr>
      </table>
    </div>
  </div>
  <div class="row q-gutter-md">
    <div class="col q-pa-md">
      <h3 class="text-h5">Basis of Allotment</h3>
      <q-editor v-model="ipo.basis_of_allotment_html" :model-value="ipo.basis_of_allotment_html ?? ''" min-height="5rem" />
    </div>
    <div class="col q-pa-md">
      <h3 class="text-h5">Allotment Status</h3>
      <q-editor v-model="ipo.allotment_status_html" :model-value="ipo.allotment_status_html ?? ''" min-height="5rem" />
    </div>
  </div>
  <div class="row">
    <div class="col q-pa-md">
      <q-btn color="primary" label="Save and Continue" @click="saveAllotments" />
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted  } from 'vue'
  import { axios } from '../boot/axios'
  import { useQuasar } from 'quasar'
  const props = defineProps({
      IpoId: String
    })
  const $q = useQuasar()
  const emit = defineEmits(['step'])
  const ipo = ref({})
  const boaData = ref([])
  const pdf_url = ref('')
  const pdfUpload = ref(false)
  const saveAllotments = async() =>{
    const id = +props.IpoId
    const upIpo = await axios.put('https://droplet.netserve.in/ipos/'+id, ipo.value)
    if(upIpo.status == '200'){
      $q.notify({
              message: 'Updated Successfully',
              icon: 'announcement'
            })
            emit('step', 'ok')
      }
    emit('step', 'ok')
  }

  const pdfUploaded = async(files) =>{
    const id = +props.IpoId
    pdf_url.value = JSON.parse(files.xhr.response)
    const res = await axios.put('https://droplet.netserve.in/ipos/'+id, {basis_of_allotment_pdf: pdf_url.value})
    ipo.value = res.data
    pdfUpload.value = false
  }

  const update = async(boa, field) => {
    if(boa[field] !== null){
      boa[field] = boa[field].replace(/(,|[^\d.-]+)+/g, '')
      let res = await axios.put('https://droplet.netserve.in/ipo-cat-quotas/'+boa.id, boa)
      if(res.status !== 200) boa[field] = 'error'
    }

  }

  onMounted(async() =>{
    const id = +props.IpoId
    let data = await axios.get('https://droplet.netserve.in/ipo-cat-quotas?ipo_id='+id+'&expand=cat').then(r=>r.data)
    boaData.value = data.sort((a, b) => a.cat.cat_order - b.cat.cat_order).filter(r=>r.quota > 0)
    const ip = await axios.get('https://droplet.netserve.in/ipos/'+id+'?expand=registrar').then(r => r.data)
    ipo.value = ip
  })

</script>
<style scoped>
table.subs{
  width: auto
}
table.subs td.first{
  border-bottom: 1px solid #333;
  padding :4px
}
table.subs th{
  border: 1px solid #ccc;
  border-radius: 5px;
  padding :4px
}
</style>
