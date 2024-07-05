<template>
    <q-page class="q-pa-md">

        <q-list>
            <q-item v-for="(ipo, i) in ipos" :key="i" >
                <q-item-label>{{ipo.company_name}}- <q-btn label="Subs" @click="updateSubs(ipo)" /></q-item-label>
            </q-item>
        </q-list>
        <q-dialog v-model="updateModel" full-width>
            <div class="q-pa-md" style="background-color:white">
                <h3>{{ip.company_name}}</h3>
                <q-list>
                    <q-item>
                        face value: {{ip.face_value_per_share}}<br />
                        lot size: {{ip.bit_lot}}<br />
                        fresh Issue: {{ip.fresh_issue}}<br />
                        Offer for Sale: {{ip.offer_for_sale}}
                    </q-item>

                    <q-item>
                        Quota:
                    </q-item>
                    <q-item v-for="cat in cat_data" :key="cat.id">{{cat.short_name}} : {{cat.applications}}</q-item>

                    <q-item>
                        Listed At: {{ip.listing_exchange}}
                    </q-item>
                    <q-item>
                        Registrar: {{ip.registrar}} <br /> {{ip.registrar_link}} <br /> {{ip.registrar_url}} <br /> {{ip.registrar_application_link}}
                    </q-item>
                    <q-item>
                        BRLMs: {{ip.brlm}}
                    </q-item>
                </q-list>
                <h4 class="text-h4">Subscriptions</h4>
                <q-list>
                    <q-item v-for="sub in subscriptions" :key="sub.id">{{sub.short_name}}:  {{sub.subscription_shares}}</q-item>
                </q-list>
            </div>
        </q-dialog>
    </q-page>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { api, axios } from '../boot/axios'
import { date } from 'quasar'
const ipos = ref([])
const subscriptions = ref([])
const cat_data = ref([])
const ip = ref({})
const updateModel = ref(false)
const openModel = async(curIpo) => {
    ip.value = curIpo
    subscriptions.value = await axios.get('https://uat.ipoinbox.com:5000/api/v1/ipo/get_subscription_data/'+curIpo.ipo_id).then(r => r.data.data)
    cat_data.value = await axios.get('https://uat.ipoinbox.com:5000/api/v1/ipo/get_category_alloted_data/'+curIpo.ipo_id).then(r => r.data.data)
    updateModel.value = true
}
const saveObjects = async() => {
    ipos.value.forEach(async(ipo) => {
        if(ipo.objects_of_the_Issue_html && ipo.new_id){
            let data = {issue_objects_html : ipo.objects_of_the_Issue_html}
            let res = await axios.put('https://api.ipoinbox.com/ipos/'+ipo.new_id, data)
        }
    })
}
console.log(ipos.value)

const updateSubs = async(ipo) => {
    let sub = await axios.get('https://api.ipoinbox.com/subscriptions?ipo_id='+ipo.ipo_id+'&expand=cat').then(r => r.data)
    let subscriptions = sub.filter(r => r.quota > 0 && r.cat_id != 6 && r.cat_id != 7)
    let start = new Date(ipo.open_date)
    let close = new Date(ipo.close_date)
    let data = []
    for (let i = 0; i <= date.getDateDiff(close, start, 'days'); i++){
        let day = date.addToDate(start, {days: i})
        day = date.formatDate(day, 'YYYY-MM-DD')
        if(date.getDayOfWeek(day) < 6) {
          for (let subs of subscriptions){
            if(i == 0){
              let log = { ipo_id: ipo.ipo_id, day: day, cat_id: subs.cat_id, subscription: subs.day1}
              data.push(log)
            }
            else if (i == 1){
              let log = { ipo_id: ipo.ipo_id, day: day, cat_id: subs.cat_id, subscription: subs.day2}
              data.push(log)
            }
            else if (i == date.getDateDiff(close, start, 'days')){
              let log = { ipo_id: ipo.ipo_id, day: day, cat_id: subs.cat_id, subscription: subs.day3, applications: subs.total_applications}
              data.push(log)
            }
            else {
              let log = { ipo_id: ipo.ipo_id, day: day, cat_id: subs.cat_id, subscription: null}
              data.push(log)
            }
          }
        }
    }
    if(data.length > 0) {
        for(let d of data){
            let res = await axios.post('https://api.ipoinbox.com/ipo-subscription-logs', d)
            console.log(res.status)
        }
    }
    ipos.value.splice(ipos.value.findIndex(ip => ip === ipo), 1)
}

onMounted(async() => {
    ipos.value =  await axios.get('https://api.ipoinbox.com/ipos').then(r => r.data)

})

 /*
const records = ref([])
const format_date = (v) =>{
        if(!v || v == null) return null
        else return v.split('T')[0]
    }

ipos.forEach(async(ipo) => {
    const newIpo = {
        company_name: ipo.company_name,
        company_url: ipo.company_url,
        open_date: format_date(ipo.open_date),
        close_date: format_date(ipo.close_date),
        face_value: ipo.face_value,
        price_band_high: ipo.price_band_high,
        price_band_low: ipo.price_band_low,
        lot_size: ipo.lot_size,
        issue_size: ipo.issue_size,
        rhp_url: ipo.rhp_url,
        about_html: ipo.about_company_html,
        promotors_html: ipo.about_promoters_html,
        anchor_date: format_date(ipo.anchor_date),
        basis_of_allotment_html: ipo.basis_of_allotment_html,
        allotment_status_html: ipo.allotment_status_html,
        review_html: ipo.review_and_ratings_html,
        consclusion_html: ipo.conclusion_html,
        issue_details: ipo.issue_details,
        t_finalisation_of_basis: format_date(ipo.t_c_finalisation_of_basis),
        t_initiation_of_refunds: format_date(ipo.t_c_Initiation_of_refunds),
        t_credit_of_equity_shares: format_date(ipo.t_c_credit_of_equity_shares),
        t_commencement: format_date(ipo.t_c_commencement),
        t_anchor_unlocking: format_date(ipo.t_c_unlocking)
    }
    const res = await axios.post('https://api.ipoinbox.com/ipos', newIpo)
        if(res){
            const data = {ipo_id: res.data.ipo_id, company_name: res.data.company_name}
            records.value.push(data)
        }
})

//string manipulated
const placeholder = document.createElement('div')
let content = "<p>Hello <img src='abc.png' alt='AMP Example' height='200'width='300'>. Learn more. <img src='another.png' alt='AMP Example' height='200'width='300' ></p>";
placeholder.innerHTML = content
placeholder.querySelectorAll('img').forEach(
    (el) => {
        const url = new URL(el.src)
        console.log(url)
        el.src = "https://github.com"+url.pathname
    }
)
console.log(placeholder.innerHTML)
*/

</script>
