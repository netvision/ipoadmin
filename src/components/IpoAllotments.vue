<template>
  <h4 class="text-h4">Allotments</h4>
  <div class="row q-gutter-md">
        <div class="col q-pa-md">
           <q-uploader
            label="Basis of Allotment PDF"
            field-name="allotment_pdf"
            no-thumbnails
            auto-upload
            :form-fields = "[{name:'ipo_id', value: ipo.ipo_id}]"
            url="https://droplet.netserve.in/ipo/pdfupload"
            @uploaded = 'pdfUploaded'
          />
        </div>
        
  </div>
  <div class="row q-gutter-md">
        <div class="col q-pa-md">
          <h3 class="text-h5">Basis of Allotment</h3>
          <q-editor v-model="ipo.basis_of_allotment_html" min-height="5rem" />
        </div>
        <div class="col q-pa-md">
          <h3 class="text-h5">Allotment Status</h3>
          <q-editor v-model="ipo.allotment_status_html" min-height="5rem" />
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
  import { api, axios } from '../boot/axios'
  import { useQuasar } from 'quasar'
  const props = defineProps({
      IpoId: String
    })
  const $q = useQuasar()
  const emit = defineEmits(['step'])
  const ipo = ref({})
  const pdf_url = ref('')
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
    await axios.put('https://droplet.netserve.in/ipos/'+id, {basis_of_allotment_pdf: pdf_url.value})
  }
  const init = async() => {
    const id = +props.IpoId
    const ip = await axios.get('https://droplet.netserve.in/ipos/'+id+'?expand=registrar').then(r => r.data)
    ipo.value = ip
    ipo.value.allotment_status_html = (ipo.value.allotment_status_html) ? ipo.value.allotment_status_html : 'Please input'
    ipo.value.basis_of_allotment_html = (ipo.value.basis_of_allotment_html) ? ipo.value.basis_of_allotment_html : 'Please input'
  }

  init()
  
</script>