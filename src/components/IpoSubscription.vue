<template>
<div class="q-pa-md">
  <h4 class="text-h4">Subscriptions</h4>
  <ol>
      
      <li>
        Only those catagories are shown, whose quotas have been set in first 'overview' page.
      </li>
  </ol>
  <div v-for="(daylog, j) in daylogs" :key="j">
  <h4 class="text-h5">{{date.formatDate(daylog.day, 'ddd, Do MMM YYYY')}}</h4>
  <table class="subs">
    <tr v-for="(item, i) in daylog.logs" :key="i">
      <td>
        <q-input :label="item.cat_name" readonly standout placeholder="Placeholder">
        <template v-slot:append>
          <q-btn round dense flat icon="chevron_right" />
        </template>
        </q-input>
      </td>
      <td><q-input v-model="item.quota" label="Quota" outlined disable bg-color="cyan-2" /></td>
      <td><q-input v-model="item.subscription" label="Subscription" outlined @blur="sanitizeSubs(item.subscription, i, j)" /></td>
      <td><q-input v-model="item.applications" label="Total Applications" @blur="sanitizeApp(item.applications, i, j)" outlined /></td>
      <td><q-btn color="primary" label="Save" @click="save(item)" /></td>
    </tr>
  </table>
  </div>
  
  
</div>

</template>

<script setup>
  import { ref, onMounted } from 'vue' 
  import { axios } from '../boot/axios'
  import { date } from 'quasar'
  const props = defineProps({
    IpoId: String
  })
  const ipoId = ref(props.IpoId)
  const ipo = ref({})
  const daylogs = ref([])
  const save = async(item) => {
    let data = {
      ipo_id: ipoId.value,
      cat_id: item.cat_id,
      day: date.formatDate(item.day, 'YYYY-MM-DD'),
      subscription: item.subscription,
      applications: item.applications
    }
    if(item.id){
      let res = await axios.put('https://droplet.netserve.in/ipo-subscription-logs/'+item.id, data)
      console.log(res.status)
    }
    else{ 
      let res = await axios.post('https://droplet.netserve.in/ipo-subscription-logs', data)
      console.log(res.status)
    }
  }
  const sanitizeSubs = (v, i, j) => {
    let value = (v != 'null') ? v.replace(/(,|[^\d.-]+)+/g, '') : 0
    if(Number(value) < 0){
      value = Math.abs(daylogs.value[j].logs[i].quota) * Math.abs(value)
    }
    else{
      value = Number(value)
    }
    daylogs.value[j].logs[i].subscription = value
  }
  const sanitizeApp = (v, i, j) => {
    daylogs.value[j].logs[i].applications = (v != 'null') ? v.replace(/(,|[^\d.-]+)+/g, '') : 0
  }
  onMounted(async() => {
   let logs = await axios.get('https://droplet.netserve.in/ipo-subscription-logs?ipo_id='+ipoId.value+'&expand=cat').then(r=>r.data)
    let quotas = await axios.get('https://droplet.netserve.in/ipo-cat-quotas?ipo_id='+ipoId.value+'&expand=cat').then(r=>r.data)
    ipo.value = await axios.get('https://droplet.netserve.in/ipos/'+ipoId.value+'?fields=open_date,close_date').then(r => r.data)
    let start = new Date(ipo.value.open_date)
    let close = new Date(ipo.value.close_date)
    if(quotas.length > 0){
      for (let i = 0; i <= date.getDateDiff(close, start, 'days'); i++){
          let day = date.addToDate(start, {days: i})
          let dlogs = []
          if(date.getDayOfWeek(day) < 6) {
              for(let quota of quotas){
                if(quota.quota > 0 && quota.cat_id < 6){
                let log = {day: day, cat_id: quota.cat_id, cat_name: quota.cat.short_name, quota: quota.quota, discount: quota.discount}
                if(logs.length > 0){
                  let daylog = logs.filter(dl => dl.day === date.formatDate(day, 'YYYY-MM-DD') && dl.cat_id === quota.cat_id)
                  if(daylog.length > 0){
                    log.id = daylog[0].id
                    log.subscription = daylog[0].subscription
                    log.applications = daylog[0].applications
                  }
                  else{ 
                    log.subscription = null
                    log.applications = null
                  }
                }
                dlogs.push(log)
              }
          }
              
              daylogs.value.push({day: day, logs: dlogs})
            }
        }
    }
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
