<template>
    <q-input v-model="blogId" label="Blog Id" /><br />
  <q-editor v-model="html_content" :toolbar="toolbar" />
  <q-btn label="save" @click="saveInfo" />
</template>

<script setup>
import { ref } from 'vue' 
import { useQuasar } from 'quasar'
import { api, axios } from '../boot/axios'

const props = defineProps({
    ipo_id: Number,
    content: String,
    blog_id: Number,
  })
const $q = useQuasar()
const blogId = ref(props.blog_id)
const html_content = ref(props.content)
const toolbar = [
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        ['left', 'center', 'right', 'justify'],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
        ['viewsource']
      ]

const saveInfo = async() => {
    const res = await axios.put('https://droplet.netserve.in/ipos/'+props.ipo_id, {about_html: html_content.value, blog_id: blogId.value})

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