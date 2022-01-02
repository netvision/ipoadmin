<template>
    <q-page class="q-pa-md">
        <pre>{{ipo}}</pre>
        <pre>{{cat_data}}</pre>
        <pre>{{subscriptions}}</pre>
        <pre>{{listing}}</pre>
        
        <q-btn label="save" @click="save" />
    </q-page>
</template>
<script setup>
    import { ref, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import { api, axios } from '../boot/axios'
    import ipoData from '../ipo.json'
    const route = useRoute()
    const ipo_id = route.params.id
    const ipo = ipoData.data.filter(ip => ip.ipo_id == ipo_id)[0]
    const listing = ref({})
    const subscriptions = ref([])
    const cat_data = ref([])
    
    const format_date = (v) =>{
        if(!v || v == null) return null
        else return v.split('T')[0]
    }

    onMounted(async() => {
         listing.value = await axios.get('https://uat.ipoinbox.com:5000/api/v1/ipo/get_listing_data/'+ipo.ipo_id).then(r => r.data.data)
         subscriptions.value = await axios.get('https://uat.ipoinbox.com:5000/api/v1/ipo/get_subscription_data/'+ipo.ipo_id).then(r => r.data.data)
         cat_data.value = await axios.get('https://uat.ipoinbox.com:5000/api/v1/ipo/get_category_alloted_data/'+ipo.ipo_id).then(r => r.data.data)
    })
    
</script>