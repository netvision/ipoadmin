<template>
    <q-page class="q-pa-md">
        
        <q-list>
            <q-item clickable v-for="ipo in ipos" :key="ipo.ipo_id" :to="'/old-ipo/'+ipo.ipo_id">
                <q-item-label>{{ipo.company_name}}</q-item-label>
            </q-item>
        </q-list>
    </q-page>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import ipoData from '../ipo1.json'
import { api, axios } from '../boot/axios'
const ipos = ref(ipoData)
const saveObjects = async() => {
    ipos.value.forEach(async(ipo) => {
        if(ipo.objects_of_the_Issue_html && ipo.new_id){
            let data = {issue_objects_html : ipo.objects_of_the_Issue_html}
            let res = await axios.put('https://droplet.netserve.in/ipos/'+ipo.new_id, data)
        }
    })
}
console.log('done')
/*
onMounted(async() => {
    let newIpos =  await axios.get('https://droplet.netserve.in/ipos').then(r => r.data)
    ipos.value.map(ipo => {
        let rec = newIpos.filter(ip => ip.company_name === ipo.company_name)
        if(rec.length > 0) return ipo.new_id = rec[0].ipo_id
    })
    console.log(ipos.value)
})
*/
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
    const res = await axios.post('https://droplet.netserve.in/ipos', newIpo)
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