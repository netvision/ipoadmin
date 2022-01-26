<template>
    <q-page class="q-pa-md">
    <h2>Listing Day Data</h2>
    <div class="row">
        <div class="col q-pa-md bg-yellow-2">
            <ipo-bse-listing :IpoId = "id" v-if="exchange == 'BSE & NSE' || exchange == 'BSE'" :IssuePrice = "IssuePrice" />
        </div>
        <div class="col q-pa-md bg-cyan-2">
            <ipo-nse-listing :IpoId = "id" v-if="exchange == 'BSE & NSE' || exchange == 'NSE'" :IssuePrice = "IssuePrice" />
        </div>
    </div>
    </q-page>
</template>
<script setup>
import IpoBseListing from './IpoBseListing.vue'
import IpoNseListing from './IpoNseListing.vue'
import { ref  } from 'vue' 

const props = defineProps({
    IpoId: String,
    exchange: String,
    IssuePrice: Number
  })

  const id = ref(props.IpoId)
  const exchange = ref(props.exchange)
  const IssuePrice = ref(props.IssuePrice)
  console.log(id)
</script>
