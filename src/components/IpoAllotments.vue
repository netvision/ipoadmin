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
          />
        </div>
        <div class="col q-pa-md">
          <q-input v-model="ipo.registrar_application_link" label="Check Status" type="url" />
        </div>
        <div class="col q-pa-md">
          <q-input v-model="ipo.registrar_application_link" label="Mobile App Link" type="url" />
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
</template>

<script setup>
  import { ref  } from 'vue' 
  import { api, axios } from '../boot/axios'
  const props = defineProps({
    ipo_id: String
  })
  const ipo = ref({})
  const init = async () => {
    const id = +props.ipo_id
    const ip = await api.get('/ipo/id/'+id).then(r => r.data.data)
    ipo.value = ip
    }
  init()
</script>