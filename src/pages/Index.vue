<template>
  <q-page class="flex flex-center">
    <router-view />
  <pre>{{nifty}}</pre>
  </q-page>
</template>

<script setup>
  import { axios } from '../boot/axios'
  import { Authenticator } from "@aws-amplify/ui-vue";
  import { onMounted, ref } from 'vue'
  import "@aws-amplify/ui-vue/styles.css";

  import Amplify from 'aws-amplify';
  import awsconfig from '../aws-exports';
  const nifty = ref([]);
  Amplify.configure(awsconfig);
  onMounted(()=>{
    axios.get('https://stock.netvisionindia.com/stock/').then(r=>{
      nifty.value = r.data
    })
  })
</script>
