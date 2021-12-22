<template>
  <q-page class="q-pa-md">
    <h2>{{ipo.company_name}}</h2>
    <q-stepper v-model="step" header-nav ref="stepper" color="secondary" animated>
      <q-step :name="1" title="overview" :done="done1">
        <IpoOverview :IpoId="ipo_id" @step='step = 2' />
      </q-step>
      <q-step :name="2" title="About Company" :done="done2">
        <IpoAboutCompany :IpoId="ipo_id" />
      </q-step>
      <q-step :name="3" title="Schedule" :done="done3">
        <IpoSchedule :IpoId="ipo_id" />
      </q-step>
      <q-step :name="4" title="Subscriptions" :done="done4">
        <IpoSubscription :IpoId="ipo_id" />
      </q-step>
      <q-step :name="5" title="Allotments" :done="done5">
        <IpoAllotments :IpoId="ipo_id" />
      </q-step>
      <q-step :name="6" title="Listing Data" :done="done6">
        <IpoListing />
      </q-step>
    </q-stepper>
  </q-page>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { axios } from '../boot/axios'
  import IpoOverview from '../components/IpoOverview.vue'
  import IpoAboutCompany from '../components/IpoAboutCompany.vue'
  import IpoSubscription from '../components/IpoSubscription.vue'
  import IpoSchedule from '../components/IpoSchedule.vue'
  import IpoAllotments from '../components/IpoAllotments.vue'
  import IpoListing from '../components/IpoListing.vue'
  const route = useRoute()
  const ipo_id = route.params.id
  const ipo = ref({})
  const step = ref(null)
  const done1 = ref(false)
  const done2 = ref(false)
  const done3 = ref(false)
  const done4 = ref(false)
  const done5 = ref(false)
  const done6 = ref(false)
  onMounted(async() => {
    ipo.value = await axios.get('https://droplet.netserve.in/ipos/'+ipo_id).then(r => r.data)
    console.log(ipo.value)
  })
</script>
