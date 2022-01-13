<template>
  <QuillEditor contentType="html" v-model:content="html_content" theme="snow" :toolbar="['bold', 'italic', 'underline', { 'list': 'ordered'}, { 'list': 'bullet' }, 'htmlEditButton', 'formatter']" :modules = "modules" />
  <q-btn label="save" @click="saveConclusion" />
</template>

<script setup>
import { ref, onMounted} from 'vue'
import { useQuasar } from 'quasar'
import { api, axios } from '../boot/axios'
import { QuillEditor } from '@vueup/vue-quill'
import ImageUploader from "quill-image-uploader";
import BlotFormatter from 'quill-blot-formatter';
import htmlEditButton from "quill-html-edit-button";
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const props = defineProps({
    ipo_id: Number,
    content: String
  })
const $q = useQuasar()
const html_content = ref(props.content)

const modules = [
    {
        module: htmlEditButton,
        name: "htmlEditButton"
    },
    {
        module: BlotFormatter,
        name: 'formatter'
    },
    
    ]

const saveConclusion = async() => {
    const res = await axios.put('https://droplet.netserve.in/ipos/'+props.ipo_id, {conclusion_html: html_content.value})

    if(res.status == 200) {
        $q.notify({
            message: 'Updated Successfully',
            icon: 'announcement'
            })
    }
}
onMounted(() => {
    console.log(props)
})
</script>

<style>

</style>