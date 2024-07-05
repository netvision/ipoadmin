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
    <tr v-for="(item, i) in subscriptions" :key="i">
      <td>
        <q-input :label="item.cat.short_name" readonly standout placeholder="Placeholder">
        <template v-slot:append>
          <q-btn round dense flat icon="chevron_right" />
        </template>
        </q-input>
      </td>
      <td><q-input v-model="item.quota" label="Quota" outlined disable bg-color="cyan-2" /></td>
      <td><q-input v-model="item.day1" label="Day1" outlined @blur="saveSubs(item.day1, i, 'day1')" /></td>
      <td><q-input v-model="item.day2" label="Day2" outlined @blur="saveSubs(item.day2, i, 'day2')" /></td>
      <td><q-input v-model="item.day3" label="Day3" outlined @blur="saveSubs(item.day3, i, 'day3')" /></td>
      <td><q-input v-model="item.discount" label="Cat Discount" outlined @blur="saveSubs(item.discount, i, 'discount')" /></td>
      <td><q-input v-model="item.total_applications" label="Total Applications" outlined @blur="saveSubs(item.total_applications, i, 'total_applications')" /></td>

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
  const saveSubs = async(v, i, d) => {
    let data = {}
    let value = (v != 'null') ? v.replace(/(,|[^\d.-]+)+/g, '') : 0
    const id = subscriptions.value[i].id
    if(Number(value) < 0){
      value = Math.abs(subscriptions.value[i].quota) * Math.abs(value)
    }
    else{
      value = Number(value)
    }
    eval('subscriptions.value[i].'+d+' = '+value)
    eval('data.'+d+'='+value)
    console.log(data)
    const subs = await axios.put('https://api.ipoinbox.com/subscriptions/'+id, data)
    console.log(subs)

  }

  onMounted(async() => {
    const sub = await axios.get('https://api.ipoinbox.com/subscriptions?ipo_id='+ipoId.value+'&expand=cat').then(r => r.data)
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
