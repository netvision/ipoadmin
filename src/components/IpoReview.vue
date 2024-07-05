<template>
  <q-editor v-model="html_content" :toolbar="toolbar" />
  <q-btn label="save" @click="saveReview" />
</template>
<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { api, axios } from '../boot/axios'

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

const saveReview = async() => {
    const res = await axios.put('https://api.ipoinbox.com/ipos/'+props.ipo_id, {review_html: html_content.value})

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
