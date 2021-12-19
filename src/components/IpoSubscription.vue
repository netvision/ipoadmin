<template>
<div class="q-pa-md">
  <h4 class="text-h4">Subscriptions</h4>
  <table class="subs">
    <tr v-for="cat in invCategories" :key="cat.id">
      <td>
        <q-input :label="cat.short_name" type="url" readonly standout>
        <template v-slot:append>
          <q-btn round dense flat icon="chevron_right" />
        </template>
        </q-input>
      </td>
      <td><q-input v-model="day1[cat.short_name]" label="Day1" type="url" outlined /></td>
      <td><q-input v-model="day2[cat.short_name]" label="Day2" type="url" outlined /></td>
      <td><q-input v-model="day3[cat.short_name]" label="Day3" type="url" outlined /></td>
      <td><q-input v-model="total[cat.short_name]" label="Total" type="url" outlined /></td>
    </tr>
  </table>
  <div class="row">
    <div class="col q-pa-md">
        <q-btn color="primary" label="Save" @click="saveSubscription" />
    </div>
  </div>
</div>
</template>

<script setup>
  import { ref, onMounted } from 'vue' 
  import { api, axios } from '../boot/axios'
  const invCategories = ref([])
  const props = defineProps({
    IpoId: String
  })
  const ipoId = ref(props.IpoId)
  const day1 = ref({})
  const day2 = ref({})
  const day3 = ref({})
  const total = ref({})
  const saveSubscription = () => {
    console.log(total)
  }
  onMounted(async() => {
    invCategories.value = await axios.get('https://droplet.netserve.in/inv-categories').then(r => r.data)
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
