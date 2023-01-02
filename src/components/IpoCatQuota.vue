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
        <template v-slot:append>
          <span class="text-body1">({{ cat.perc }}%)</span>
        </template>
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
    IpoId: String,
    total: Number
  })
const ipoId = ref(props.IpoId)
const total = ref(props.total)

const saveQuota = async (c) => {
  console.log(c)
  c.spinner = true
  c.quota = Math.abs(c.quota.replace(/(,|[^\d.-]+)+/g, ''))
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
      c.perc = (c.quota * 100 / total.value).toFixed(2)
    }
    catch(e){
      c.spinner = false
      c.icon = 'error'
      console.log(e)
    }
}

const saveDisc = async(c) => {

  if(c.discount != null){
    c.spinner = true
  c.discount = Math.abs(c.discount.replace(/(,|[^\d.-]+)+/g, ''))
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
}

onMounted(async() => {
  invCategories.value = await axios.get('https://droplet.netserve.in/inv-categories?sort=cat_order').then(r => r.data)
  let res = await axios.get('https://droplet.netserve.in/ipo-cat-quotas?ipo_id='+ipoId.value).then(r => r.data)
  if(res.length > 0) {
    invCategories.value = invCategories.value.map(cat => {
      let item = res.filter(q => q.cat_id == cat.id)
      let perc = (item[0]?.quota > 0) ? item[0].quota * 100 / total.value : 0
      return{
      ...cat,
      quota_id: item[0]?.id ?? null,
      quota: item[0]?.quota ?? null,
      discount: item[0]?.discount ?? null,
      icon: null,
      spinner: false,
      perc: perc.toFixed(2)
      }
    })
  }
  console.log(total.value)
})
</script>
<style>
table.subs{
  max-width: 90vw
}
</style>
