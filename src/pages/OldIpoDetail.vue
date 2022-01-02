<template>
    <q-page class="q-pa-md">
        <h4 class="text-h4">Overview</h4>
        <q-list>
            <q-item>
                face value: {{ipo.face_value}}
            </q-item>
            <q-item>
                fresh Issue: {{ipo.fresh_issue}}
            </q-item>
            <q-item>
                Offer for Sale: {{ipo.offer_for_sale}}
            </q-item>
            <q-item>
                Listed At: {{ipo.listing_exchange}}
            </q-item>
            <q-item>
                Registrar: {{ipo.registrar}} / {{ipo.registrar_link}} / {{ipo.registrar_url}} / {{ipo.registrar_application_link}}
            </q-item>
            <q-item>
                BRLMs: {{ipo.brlm}}
            </q-item>
            <q-item>
                Quota: 
            </q-item>
            <q-item v-for="cat in cat_data" :key="cat.id">{{cat.short_name}} : {{cat.applications}}</q-item>
        </q-list>
        <h4 class="text-h4">Subscriptions</h4>
        <q-list>
            <q-item v-for="sub in subscriptions" :key="sub.id">{{sub.short_name}}:  {{sub.subscription_shares}}</q-item>
        </q-list>
        <h4 class="text-h4">BSE Listing</h4>
        <q-list>
            <q-item>Date: {{listing.date}}</q-item>
            <q-item>Listing Price: {{listing.bse_listing_price}}</q-item>
            <q-item>High: {{listing.bse_listing_price_high}}</q-item>
            <q-item>Low: {{listing.bse_listing_price_low}}</q-item>
            
            <q-item>volume: {{listing.bse_listing_volume_price}}</q-item>
            <q-item>Delivery: {{listing.bse_listing_delivery_volume_price}}</q-item>
            <q-item>Free Float: {{listing.bse_free_float}}</q-item>
        </q-list>
        <h4 class="text-h4">NSE Listing</h4>
        <q-list>
            <q-item>Date: {{listing.date}}</q-item>
            <q-item>Listing Price: {{listing.nse_listing_price}}</q-item>
            <q-item>High: {{listing.nse_listing_price_high}}</q-item>
            <q-item>Low: {{listing.nse_listing_price_low}}</q-item>
            
            <q-item>volume: {{listing.nse_listing_volume_price}}</q-item>
            <q-item>Delivery: {{listing.nse_listing_delivery_volume_price}}</q-item>
            <q-item>Free Float: {{listing.nse_free_float}}</q-item>
        </q-list>
        
        
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