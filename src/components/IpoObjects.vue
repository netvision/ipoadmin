<template>
  <q-editor :toolbar="toolbar" v-model="html_content" />
  <q-btn label="save" @click="saveObjects" />
</template>

<script setup>
import { ref, onMounted} from 'vue' 
import { useQuasar } from 'quasar'
import { api, axios } from '../boot/axios'
/* import { QuillEditor } from '@vueup/vue-quill'
//import ImageUploader from "quill-image-uploader";
import BlotFormatter from 'quill-blot-formatter';
import htmlEditButton from "quill-html-edit-button";
import '@vueup/vue-quill/dist/vue-quill.snow.css';
*/

const props = defineProps({
    ipo_id: Number,
    content: String
  })
const $q = useQuasar()
const html_content = ref(props.content)

const toolbar = [
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        ['left', 'center', 'right', 'justify'],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
        ['viewsource']
      ]
/*
const modules = [
    {
        module: htmlEditButton,
        name: "htmlEditButton"
    },
    {
        module: BlotFormatter,
        name: 'formatter'
    }
    ]*/

const saveObjects = async() => {
    const res = await axios.put('https://droplet.netserve.in/ipos/'+props.ipo_id, {issue_objects_html: html_content.value})

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