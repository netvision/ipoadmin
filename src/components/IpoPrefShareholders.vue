<template>
  <q-page class="q-pa-md">
  <h3>Preferential ShareHolders</h3>
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
            url="https://droplet.netserve.in/ipo/pdfupload"
            @uploaded = 'pdfUploaded'
          />
        </q-dialog>
  </q-page>
</template>
<script setup>
import { ConsoleLogger } from '@aws-amplify/core';
import { ref, onMounted} from 'vue'
import { axios } from '../boot/axios'

const props = defineProps({
    IpoId: String
  })
const ipo = ref({})
const ipoId = ref(props.IpoId)
const pdfUpload = ref(false)

const pdfUploaded = async(files) =>{
    let pdf_url = JSON.parse(files.xhr.response)
    const res = await axios.put('https://droplet.netserve.in/ipos/'+ipoId.value, {prefshareholders_pdf: pdf_url})
    ipo.value = res.data
    pdfUpload.value = false
  }

onMounted(async() => {
  ipo.value = await axios.get('https://droplet.netserve.in/ipos/'+ipoId.value).then(r => r.data)
  console.log(ipo.value)
})
</script>
