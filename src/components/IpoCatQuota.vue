<template>
  <h4 class="text-h4">Category Quota and Discount</h4>
  <table class="subs">
    <tr v-for="cat in invCategories" :key="cat.id">
      <td>
        <q-input :label="cat.short_name" readonly standout>
        <template v-slot:append>
          <q-btn round dense flat icon="chevron_right" />
        </template>
        </q-input>
      </td>
      <td>
       <q-input v-model="cat.quota" label="Quota" @blur="saveQuota(cat)">

        </q-input>
      </td>
      <td>
        <q-input v-model="cat.discount" label="Discount (if any)" @blur="saveDisc(cat)"  />
      </td>
      <td><q-spinner-dots v-if="cat.spinner"
            color="primary"
            size="1em"
          />
          <q-icon v-if="!cat.spinner" :name="cat.icon" /></td>
    </tr>
  </table>
</template>
<script setup>
import { ref, onMounted  } from 'vue'
import { api, axios } from '../boot/axios'
const emit = defineEmits(['step'])
const ipo = ref({})
const invCategories = ref([])
const quotas = ref([])
const icon = ref()

const props = defineProps({
    IpoId: String
  })
const ipoId = ref(props.IpoId)

const saveQuota = async (c) => {
  c.spinner = true
    try {
      if(c.quota_id){
        let res = await axios.put('https://droplet.netserve.in/ipo-cat-quotas/'+c.quota_id, {quota: c.quota}).then(r => r.data)
        console.log(res)
      }
      else{
        let res = await axios.post('https://droplet.netserve.in/ipo-cat-quotas', {ipo_id: ipoId.value, cat_id: c.id, quota: c.quota}).then(r => r.data)
        c.quota_id = res.id
      }

      c.icon = 'check'
      c.spinner = false
    }
    catch(e){
      c.spinner = false
      c.icon = 'error'
      console.log(e)
    }
}

const saveDisc = async(c) => {
  c.spinner = true
    try {
      if(c.quota_id){
        let res = await axios.put('https://droplet.netserve.in/ipo-cat-quotas/'+c.quota_id, {discount: c.discount}).then(r => r.data)
        console.log(res)
      }
      else{
        let res = await axios.post('https://droplet.netserve.in/ipo-cat-quotas', {ipo_id: ipoId.value, cat_id: c.id, discount: c.discount}).then(r => r.data)
        c.quota_id = res.id
      }

      c.icon = 'check'
      c.spinner = false
    }
    catch(e){
      c.spinner = false
      c.icon = 'error'
      console.log(e)
    }
}

onMounted(async() => {
  invCategories.value = await axios.get('https://droplet.netserve.in/inv-categories?sort=cat_order').then(r => r.data)
  let res = await axios.get('https://droplet.netserve.in/ipo-cat-quotas?ipo_id='+ipoId.value).then(r => r.data)
  if(res.length > 0) {
    invCategories.value = invCategories.value.map(cat => ({
      ...cat,
      quota_id: res.filter(q => q.cat_id == cat.id)[0]?.id ?? null,
      quota: res.filter(q => q.cat_id == cat.id)[0]?.quota ?? null,
      discount: res.filter(q => q.cat_id == cat.id)[0]?.discount ?? null,
      icon: null,
      spinner: false
    }))
  }
})
</script>
<style>
table.subs{
  max-width: 90vw
}

</style>
