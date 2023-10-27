<template>
  <q-ajax-bar ref="bar" position="top" color="accent" size="10px" />
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col-9"><h3 class="text-h3 q-mb-md">Recent Open Market Buybacks</h3></div>
      <q-space />
      <div class="col text-right"><q-btn @click="newBuyback">Add New</q-btn></div>
    </div>
    <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
          @update:model-value="showData"
        >
          <q-tab name="closed" label="Closed" />
          <q-tab name="current" label="Current" />
          <q-tab name="upcoming" label="Upcoming" />
        </q-tabs>

        <q-separator />
          <q-tab-panel :name="tab">
            <div class="text-h6 text-uppercase">{{tab}}</div>
            <q-list v-if="bbs">
              <q-expansion-item popup v-for="bb in bbs" :key="bb.id" :header-style="{ backgroundColor: '#f2e1c9', borderBottom: '1px solid ##9c5b05' }">
                <template v-slot:header>
                  <q-item-section>
                    <q-item-label class="text-h6">{{bb.company_name}}</q-item-label>
                    <q-item-label>Buyback Size: &#8377;{{curFormat(bb.buyback_size)}} <span class="text-orange-9">Utilised: &#8377;{{curFormat(bb.cumAmount)}} ({{ bb.utilPerc }}%)</span></q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Maximum Price: &#8377;{{bb.buyback_price_maximum}} </q-item-label>
                    <q-item-label><span :class="(bb.curPrice === 'NA' || bb.buyback_price_maximum > bb.curPrice) ? 'text-orange-9' : 'text-blue-9 text-bold'">CMP: &#8377;{{bb.curPrice}}</span></q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>Start Date: {{dateFormat(bb.start_date)}}</q-item-label>
                    <q-item-label>Close Date: {{dateFormat(bb.close_date)}}</q-item-label>
                  </q-item-section>
                </template>
                <q-card>
                  <q-card-section>
                    <div class="q-pa-md">
                      <p class="col">Buyback Size: <strong>&#8377;{{curFormat(bb.buyback_size)}}</strong></p>
                      <p class="col">Maximum Price: <strong>&#8377;{{bb.buyback_price_maximum}}</strong></p>
                      <p class="col">Total Share of the company: <strong>{{bb.total_shares}}</strong></p>

                      <p class="col">No. of Shares at MM Price: <strong>{{getQtyatMM(bb)}}</strong></p>
                      <p class="col">Percent of Total Shares: <strong>{{getPercOfTotal(bb)}}%</strong></p>

                      <p class="col">Shares in Public: <strong>{{bb.free_float}}</strong></p>
                      <p class="col">Percent of Shares in Public: <strong>{{getPercOfFreefloat(bb)}}%</strong></p>
                    </div>
                  </q-card-section>
                  <q-card-actions>
                    <q-btn-group flat>
                      <q-btn v-if="bb.canEdit" icon="mdi-file-edit" @click="showBuybackModal(bb)" label="edit" />
                      <q-btn v-if="bb.hasRecords" icon="mdi-file-table" @click="showRecords(bb)" label="records"/>
                    </q-btn-group>
                  </q-card-actions>
                </q-card>
              </q-expansion-item>
            </q-list>
        </q-tab-panel>
        <q-dialog v-model="buybackModal">
          <q-card class="my-card">
            <q-card-section>
              <h6 class="text-h6 q-mb-md">{{(buyback.id) ? 'Edit' : 'Add new '}} Buyback</h6>
              <div class="row q-gutter-md">
                <div class="col">
                  <q-input outlined v-model="buyback.company_name" label="Company Name" />
                </div>
              </div>
              <div class="row q-gutter-md q-mt-md">
                <div class="col"><q-input outlined v-model="buyback.bse_code" label="BSE Code" /></div>
                <div class="col"><q-input outlined v-model="buyback.nse_code" label="NSE Code" /></div>
              </div>
              <div class="row q-gutter-md q-mt-md">
                <div class="col"><q-input outlined v-model="buyback.buyback_size" label="Buyback Size" @blur="removeComma(buyback.buyback_size, 'buyback_size')" /></div>
                <div class="col"><q-input outlined v-model="buyback.buyback_price_maximum" label="Buyback Maximum Price" @blur="removeComma(buyback.buyback_price_maximum, 'buyback_price_maximum')"  /></div>
              </div>
              <div class="row q-gutter-md q-mt-md">
                <div class="col"><q-input outlined v-model="buyback.total_shares" label="Total Shares of the Company" @blur="removeComma(buyback.total_shares, 'total_shares')" /></div>
                <div class="col"><q-input outlined v-model="buyback.free_float" label="Shares in Public (Freefloat)" @blur="removeComma(buyback.free_float, 'free_float')" /></div>
              </div>

              <div class="row q-gutter-md q-mt-md">
                <div class="col">
                  <q-input filled v-model="buyback.start_date" label="Start Date">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="buyback.start_date" mask="YYYY-MM-DD">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col">
                  <q-input filled v-model="buyback.close_date" label="Close Date">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="buyback.close_date" mask="YYYY-MM-DD">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
              <q-btn flat color="primary" :label="(buyback.id) ? 'Edit' : 'Add'" @click="addBuyback"/>
              <q-btn v-close-popup flat color="primary" round icon="close" @click="closeBuybackModal" />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <q-dialog v-model="recordsModal" full-width>
          <div class="records q-pa-md">
              <q-table
                :rows="records"
                :columns="columns"
                row-key="name"
                hide-bottom
                virtual-scroll
                :rows-per-page-options="[0]"
                wrap-cells
                @row-dblclick="editRecord"
              >
              <template v-slot:top>
                <div class="col-4 q-table__title">Records</div>
                <q-space />
                <q-btn v-if="buyback.canAddRecords"
                  flat round dense
                  icon="add_circle_outline"
                  @click="newRecord(buyback.id)"
                  class="q-ml-md"
                />
              </template>
              </q-table>
            </div>
        </q-dialog>

        <q-dialog v-model="recordModal">
          <q-card class="my-card">
            <q-card-section>
              <h6 class="text-h6 q-mb-md">{{(record.id) ? 'Edit' : 'Add new '}} Record</h6>
              <div class="row q-gutter-md q-mt-md">
                <q-input filled v-model="record.record_date" label="Record Date">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="record.record_date" mask="YYYY-MM-DD">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
              </div>
              <div class="row q-gutter-md q-mt-md">
                <div class="col" v-if="buyback.nse_code"><q-input outlined v-model="record.nse" label="NSE" @blur = "sanitizeVal(record.nse, 'nse')" /></div>
                <div class="col" v-if="buyback.bse_code"><q-input outlined v-model="record.bse" label="BSE" @blur = "sanitizeVal(record.bse, 'bse')" /></div>
              </div>
              <div class="row q-gutter-md q-mt-md">
                <div class="col" v-if="buyback.nse_code"><q-input outlined v-model="record.deliverable_nse" label="Deliverable at NSE" @blur = "sanitizeVal(record.deliverable_nse, 'deliverable_nse')" /></div>
                <div class="col" v-if="buyback.bse_code"><q-input outlined v-model="record.deliverable_bse" label="Deliverable at BSE" @blur = "sanitizeVal(record.deliverable_bse, 'deliverable_bse')" /></div>
              </div>
              <div class="row q-gutter-md q-mt-md">
                <div class="col"><q-input outlined v-model="avg_price" label="Average Price" @blur = "calculateAmount" /></div>
                <div class="col"><q-input outlined v-model="record.amount" label="Total Amount" @blur = "sanitizeVal(record.amount, 'amount')" /></div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
              <q-btn flat color="primary" :label="(record.id) ? 'Edit' : 'Add'" @click="addRecord(cur_buyback)"/>
              <q-btn v-close-popup flat color="primary" round icon="close" @click="closeRecordModal" />
            </q-card-actions>
          </q-card>
        </q-dialog>
  </q-page>

</template>
<script setup>
import { ref, onMounted } from 'vue'
import { axios } from '../boot/axios'
const data = ref([])
const cur_date = ref(new Date())
const bbs = ref([])
const tab = ref('current')
const buyback = ref({})
const buybackModal = ref(false)
const recordsModal = ref(false)
const records = ref([])
const recordModal = ref(false)
const record = ref({})
const avg_price = ref(null)
const columns = [
  { name: 'date', align: 'left', label: 'Date', field: 'record_date'},
  { name: 'bse', align: 'left', label: 'BSE', field: 'bse'},
  { name: 'pc_bse', align: 'left', label: '%', field: 'pc_bse'},
  { name: 'nse', align: 'left', label: 'NSE', field: 'nse'},
  { name: 'pc_nse', align: 'left', label: '%', field: 'pc_nse'},
  { name: 'total', align: 'left', label: 'Total', field: 'total'},
  { name: 'amount', align: 'left', label: 'Amount', field: 'amount'},
  { name: 'avg', align: 'left', label: 'Average Price', field: 'avg'},
  { name: 'cum_amount', align: 'left', label: 'Cumulative Amount', field: 'cum_amount'},
  { name: 'cum_qty', align: 'left', label: 'Cum Qty', field: 'cum_qty'},
  { name: 'pc_utilised', align: 'left', label: 'Fund Utilised (%)', field: 'pc_utilised'},
]

const showData = (tab) => {
  if(tab === 'closed') bbs.value = data.value.filter(x => cur_date.value > new Date(x.close_date))
  else if (tab === 'upcoming') bbs.value = data.value.filter(x => cur_date.value < new Date(x.start_date))
  else bbs.value = data.value.filter(r => cur_date.value > new Date(r.start_date) && cur_date.value < new Date(r.close_date))
}

const curFormat = (val) => {
    return (val/10000000).toFixed(2) + ' Cr';
}

const dateFormat = (dateString) => {
    if(dateString != null){
	    const date = new Date(dateString)
	    return new Intl.DateTimeFormat('default', {dateStyle: 'medium'}).format(date)
    }
    else return ''
}

const getQtyatMM = (bb) => (bb.buyback_size / bb.buyback_price_maximum).toFixed(0)

const getPercOfTotal = (bb) => ((bb.buyback_size / bb.buyback_price_maximum).toFixed(0) * 100 / bb.total_shares).toFixed(2)

const getPercOfFreefloat = (bb) => ((bb.buyback_size / bb.buyback_price_maximum).toFixed(0) * 100 / bb.free_float).toFixed(2)


const newBuyback = () => {
  buyback.value = {}
  buybackModal.value = true
}
const showBuybackModal = (bb) => {
  buyback.value = bb
  buybackModal.value = true
}

const closeBuybackModal = () => {
  buyback.value = {}
  buybackModal.value = false
}

const addBuyback = async() => {
  if(buyback.value.id){
    let res = await axios.put('https://droplet.netserve.in/ip-buyback-opens/'+buyback.value.id, buyback.value)
    console.log(res.status)
  }
  else{
    let res = await axios.post('https://droplet.netserve.in/ip-buyback-opens', buyback.value)
    console.log(res.status)
  }
  window.location.reload()
}

const showRecords = (bb) => {
  buyback.value = bb
  records.value = bb.records.filter(r => r.bse || r.nse)
  records.value.forEach((rec, i) => {
    rec.total = +(rec.bse) + +(rec.nse)
    rec.avg = (rec.amount / rec.total).toFixed(2)
    rec.pc_bse = (rec.deliverable_bse) ? (rec.bse * 100 / rec.deliverable_bse).toFixed(2) : 'NA'
    rec.pc_nse = (rec.deliverable_nse) ? (rec.nse * 100 / rec.deliverable_nse).toFixed(2) : 'NA'
    rec.cum_amount = records.value.slice(0, i+1).reduce((a, b) => a + +(b.amount), 0).toFixed(2)
    rec.cum_qty = records.value.slice(0, i+1).reduce((a, b) => (a + +(b.bse) + +(b.nse)), 0)
    rec.pc_utilised = (rec.cum_amount * 100 / bb.buyback_size).toFixed(2)
    /*
    if(i == 0){
      rec.cum_amount = rec.amount
      rec.cum_qty = rec.total
    }
    else{
    rec.cum_amount = +(records.value[i-1].amount) + +(rec.amount)
    rec.cum_qty = records.value[i-1].bse + records.value[i-1].nse + rec.total
    }
    rec.pc_utilised = (rec.cum_amount * 100 / bb.buyback_size).toFixed(2)
    */
  })
  recordsModal.value = true
}

const calculateAmount = () => {
  if(avg_price.value && !record.value.amount){
    let nse = record.value.nse ?? 0
    let bse = record.value.bse ?? 0
    record.value.amount = ((Number(nse) + Number(bse)) * avg_price.value).toFixed(2)
  }
}

const calculateAvg = () => {
  if(record.value.amount){
    let nse = record.value.nse ?? 0
    let bse = record.value.bse ?? 0
    avg_price.value = (Number(record.value.amount) / (Number(nse) + Number(bse))).toFixed(2)
  }
}

const newRecord = (id) => {
  recordModal.value = true
  record.value.buyback_id = id
}

const addRecord = async() => {
  record.value.nse = record.value.nse ?? 0
  record.value.bse = record.value.bse ?? 0
  if(!record.value.id){
    let res = await axios.post('https://droplet.netserve.in/ip-buyback-open-records', record.value)
  }
  else {
    let res = await axios.put('https://droplet.netserve.in/ip-buyback-open-records/'+record.value.id, record.value)
  }
  window.location.reload()
}

const editRecord = (e, r, i) => {
  if(buyback.value.canAddRecords){
    record.value = {
      id: r.id,
      bse: r.bse,
      deliverable_bse: r.deliverable_bse,
      deliverable_nse: r.deliverable_nse,
      nse: r.nse,
      amount: r.amount,
      total: r.total,
      record_date: r.record_date
    }
    recordModal.value = true
  }
}

const closeRecordModal = () => {
  record.value = {}
  avg_price.value = null
  recordModal.value = false
}
const removeComma = (v, f) => {
  const val = (isNaN(v)) ? Math.abs(v.replace(/(,|[^\d.-]+)+/g, '')) : v
  buyback.value[f] = val
}

const sanitizeVal = (v, f) => {
  let val = 0
  if(v){
    val = (isNaN(v)) ? Math.abs(v.replace(/(,|[^\d.-]+)+/g, '')) : v
  }
  record.value[f] = val
  calculateAmount()
  calculateAvg()
}

onMounted(async () => {
  let res = await axios.get('https://droplet.netserve.in/ip-buyback-opens?sort=-start_date&expand=records').then(r => r.data)

  let promises = res.map(async (v) =>{
    let curPrice = 'NA'
    let cumAmount = 0
    let utilPerc = 0
    let canEdit = true
    let canAddRecords = true
    let hasRecords = true
    if(v.nse_code){
      //await axios.get('https://droplet.netserve.in/ipo/nselive?code='+v.nse_code.trim()).then(r => r.data.replace(/\n/g, '').replace(/'/g, "\"").replace(/None/g, "0").replace(/False/g, "0"))
      //let liveData = await axios.get('https://droplet.netserve.in/ipo/nselive?code='+v.nse_code.trim()).then(r => r.data.replace(/\n/g, '').replace(/'/g, "\"").replace(/None/g, "0").replace(/False/g, "0"))
      let curData = await axios.get('https://droplet.netserve.in/ipo/getbhav?code='+v.nse_code.trim()).then(r => r.data[0])
      console.log(curData)
      curPrice = curData[' CLOSE_PRICE'].trim()
    }
    if(v.records.length > 0){
      cumAmount = v.records.reduce((a, b) => a + +(b.amount), 0).toFixed(2)
      utilPerc = (cumAmount * 100 / v.buyback_size).toFixed(2)
    }
    if(cur_date.value > new Date(v.close_date)){
      canEdit = false
      canAddRecords = false
    }
    if(cur_date.value < new Date(v.start_date)){
      canAddRecords = false
      hasRecords = false
    }
    return {
      curPrice,
      cumAmount,
      utilPerc,
      canEdit,
      canAddRecords,
      hasRecords,
      ...v
      }
    })
  data.value = await Promise.all(promises)
  data.value.sort((a,b) => b.utilPerc - a.utilPerc)
  bbs.value = data.value.filter(r => cur_date.value > new Date(r.start_date) && cur_date.value < new Date(r.close_date))
})
</script>
