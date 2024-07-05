<template>
    <q-page class="q-pa-md">
        <h4 class="text-h4">Overview - {{ipo.company_name}} - {{ipo.new_id}}</h4>

        <div>{{ipo.objects_of_the_Issue_html}}</div>
        <q-list>
            <q-item>
                face value: {{ipo.face_value_per_share}}
            </q-item>
            <q-item>
                lot size: {{ipo.bit_lot}}
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

    </q-page>
</template>
<script setup>
    import { ref, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import { api, axios } from '../boot/axios'
    import ipoData from '../ipo1.json'
    const route = useRoute()
    const ipo_id = route.params.id
    const ipo = ipoData.filter(ip => ip.ipo_id == ipo_id)[0]
    const listing = ref({})
    const subscriptions = ref([])
    const cat_data = ref([])
    const bse_data = ref({})
    const nse_data = ref({})

    const saveBse = async() => {
        if(ipo.new_id){
            let res = await axios.post('https://api.ipoinbox.com/listings', bse_data.value )
            console.log(res)
        }
    }

    const saveNse = async() => {
        if(ipo.new_id){
            let res = await axios.post('https://api.ipoinbox.com/listings', nse_data.value )
            console.log(res)
        }
    }

    const format_date = (v) =>{
        if(!v || v == null) return null
        else return v.split('T')[0]
    }

    onMounted(async() => {
         listing.value = await axios.get('https://uat.ipoinbox.com:5000/api/v1/ipo/get_listing_data/'+ipo.ipo_id).then(r => r.data.data)
         subscriptions.value = await axios.get('https://uat.ipoinbox.com:5000/api/v1/ipo/get_subscription_data/'+ipo.ipo_id).then(r => r.data.data)
         cat_data.value = await axios.get('https://uat.ipoinbox.com:5000/api/v1/ipo/get_category_alloted_data/'+ipo.ipo_id).then(r => r.data.data)
         if(ipo.bse_script_code){
             bse_data.value = {
                 ipo_id: ipo.new_id,
                 exchange: 'BSE',
                 listing_date: format_date(listing.value.date),
                 scrip_code: ipo.bse_script_code,
                 url: ipo.company_bse_url,
                 listing_price: listing.value.bse_listing_price,
                 high: listing.value.bse_listing_price_high,
                 low: listing.value.bse_listing_price_low,
                 close: listing.value.bse_listing_closing,
                 preopen_volume: listing.value.bse_preopen_price,
                 volume: listing.value.bse_listing_volume_price,
                 delivery: listing.value.bse_listing_delivery_volume_price,
                 free_float: listing.value.bse_free_float
             }
         }
         if(ipo.nse_script_code){
             nse_data.value = {
                 ipo_id: ipo.new_id,
                 exchange: 'NSE',
                 listing_date: format_date(listing.value.date),
                 scrip_code: ipo.nse_script_code,
                 url: ipo.company_nse_url,
                 listing_price: listing.value.nse_listing_price,
                 high: listing.value.nse_listing_price_high,
                 low: listing.value.nse_listing_price_low,
                 close: listing.value.nse_listing_closing,
                 preopen_volume: listing.value.nse_preopen_price,
                 volume: listing.value.nse_listing_volume_price,
                 delivery: listing.value.nse_listing_delivery_volume_price,
                 free_float: listing.value.nse_free_float
             }
         }
    })

</script>
