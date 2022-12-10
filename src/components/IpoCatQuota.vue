<template>
  <h4 class="text-h4">Category Quota and Discount</h4>

</template>
<script setup>
import { ref, onMounted  } from 'vue'
import { api, axios } from '../boot/axios'

const ipo = ref({})
const invCategories = ref([])

const props = defineProps({
    IpoId: String
  })
const ipoId = ref(props.IpoId)

onMounted(async() => {
  invCategories.value = await axios.get('https://droplet.netserve.in/inv-categories?sort=cat_order').then(r => r.data)
  //ipo.value = await axios.get('https://droplet.netserve.in/ipos/'+ipoId.value).then(r => r.data)
})
</script>
