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
            field-name="allotment_pdf"
            no-thumbnails
            auto-upload
            :form-fields = "[{name:'ipo_id', value: ipo.ipo_id}]"
            url="https://droplet.netserve.in/ipo/pdfupload"
            @uploaded = 'pdfUploaded'
          />
        </q-dialog>
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
  const init = async() => {
    const id = +props.IpoId
    const ip = await axios.get('https://droplet.netserve.in/ipos/'+id+'?expand=registrar').then(r => r.data)
    ipo.value = ip
  }

  init()
  
</script>