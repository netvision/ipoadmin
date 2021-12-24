<template>
<div class="q-pa-md">
  <h4 class="text-h4">Subscriptions</h4>
  <ol>
      <li>
        Values are autosaved! so there is no save button.
      </li>
      <li>
        Only those catagories are shown, whose quotas have been set in first 'overview' page.
      </li>
  </ol>
  <table class="subs">
    <tr v-for="item in subscriptions" :key="item.id">
      <td>
        <q-input :label="item.cat.short_name" readonly standout placeholder="Placeholder">
        <template v-slot:append>
          <q-btn round dense flat icon="chevron_right" />
        </template>
        </q-input>
      </td>
      <td><q-input v-model="item.quota" label="Quota" outlined disable color="lime-11" bg-color="green" /></td>
      <td><q-input v-model="item.day1" label="Day1" outlined @blur="saveSubs(item.id, 1, item.day1)" /></td>
      <td><q-input v-model="item.day2" label="Day2" outlined @blur="saveSubs(item.id, 2, item.day2)" /></td>
      <td><q-input v-model="item.day3" label="Day3" outlined @blur="saveSubs(item.id, 3, item.day3)" /></td>
    </tr>
  </table>
  
</div>
</template>

<script setup>
  import { ref, onMounted } from 'vue' 
  import { api, axios } from '../boot/axios'
  const subscriptions = ref([])
  const props = defineProps({
    IpoId: String
  })
  const ipoId = ref(props.IpoId)
  const day1 = ref({})
  const day2 = ref({})
  const day3 = ref({})
  const total = ref({})
  const saveSubs = async(id, d, v) => {
    let data = {}
    if(d == 1) data = {day1: v}
    if(d == 2) data = {day2: v}
    if(d == 3) data = {day3: v}
    const subs = await axios.put('https://droplet.netserve.in/subscriptions/'+id, data)
    
    console.log(subs)
  }
  onMounted(async() => {
    const sub = await axios.get('https://droplet.netserve.in/subscriptions?ipo_id='+ipoId.value+'&expand=cat').then(r => r.data)
    subscriptions.value = sub.filter(r => r.quota > 0)
  })

</script>
<style scoped>
table.subs{
  width: auto
}
table.subs td.first{
  border-bottom: 1px solid #333;
  padding :4px
}
</style>
