<template>
  <QuillEditor contentType="html" v-model:content="html_content" theme="snow" :toolbar="toolbarOptions" :modules = "modules" />
  <q-btn label="save" @click="saveInfo" />
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

var toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'image'],
  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],        // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['clean', 'htmlEditButton', 'formatter']                                         // remove formatting button
]


const modules = [
    {
        module: htmlEditButton,
        name: "htmlEditButton"
    },
    {
        module: BlotFormatter,
        name: 'formatter'
    },
    {
        module: ImageUploader,
        options: {
            
               upload: file => {
                   return new Promise((resolve, reject) => {
                       const formData = new FormData();
                    formData.append("image", file);

                    fetch(
                        "https://droplet.netserve.in/ipo/editimg",
                        {
                        method: "POST",
                        body: formData
                        }
                    )
                        .then(response => response.json())
                        .then(result => {
                        console.log(result);
                        resolve(result);
                        })
                        .catch(error => {
                        reject("Upload failed");
                        console.error("Error:", error);
                        });
                    })
               } 
            
        }
    }
    ]

const saveInfo = async() => {
    const res = await axios.put('https://droplet.netserve.in/ipos/'+props.ipo_id, {about_html: html_content.value})

    if(res.status == 200) {
        $q.notify({
            message: 'Updated Successfully',
            icon: 'announcement'
            })
    }
}

</script>

<style>

</style>