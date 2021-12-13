<template>
  <div class="q-pa-md">
    <h2 class="text-h5">Overview</h2>
    <div class="row">
      <div class="col col-8 q-pa-md">
        <q-input v-model="overview.company_name" label="Company Name" />
      </div>
      <div class="col q-pa-md">
        <q-select filled v-model="overview.sector" :options="sectors" option-value="id" option-label="name" label="Sector" />
      </div>
    </div>
    <div class="row">
      <div class="col q-pa-md">
        <q-input v-model="overview.anchor_date" mask="date" label="Anchor Date">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
              <q-date v-model="overview.anchor_date">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
        </q-input>
      </div>
      <div class="col q-pa-md">
        <q-input v-model="overview.open_date" mask="date" label="Open Date">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
              <q-date v-model="overview.open_date">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
        </q-input>
      </div>
      <div class="col q-pa-md">
        <q-input v-model="overview.close_date" mask="date" label="Close Date">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
              <q-date v-model="overview.close_date">
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
    <div class="row">
      <div class="col q-pa-md">
        <q-input v-model="overview.face_value" label="Face Value">
          <template v-slot:before>
            &#8377; 
          </template>
        </q-input>
      </div> 
      <div class="col q-pa-md">
        <q-input v-model="overview.price_band_low" label="Price Band (Low)">
          <template v-slot:before>
            &#8377; 
          </template>
        </q-input>
      </div>
      <div class="col q-pa-md">
        <q-input v-model="overview.price_band_high" label="Price Band (High)">
          <template v-slot:before>
            &#8377; 
          </template>
        </q-input>
      </div>
    </div>
    <div class="row">
      <div class="col q-pa-md">
        <q-input v-model="overview.lot_size" label="Lot Size">
          
        </q-input>
      </div>
      <div class="col q-pa-md">
        <q-input v-model="overview.application_amount" label="Application Amount">
          <template v-slot:before>
            &#8377; 
          </template>
        </q-input>
      </div>
      <div class="col q-pa-md">
        <q-input v-model="overview.issue_size" label="Issue Size (in Crore)">
          <template v-slot:before>
            &#8377; 
          </template>
        </q-input>
      </div>
    </div>
    <div class="row">
      <div class="col q-pa-md">
        <q-input v-model="overview.fresh_issue" label="Fresh Issue">
          
        </q-input>
      </div>
      <div class="col q-pa-md">
        <q-input v-model="overview.offer_for_sale" label="Offer for Sale">
          
        </q-input>
      </div>
      <div class="col q-pa-md">
        <q-input v-model="overview.market_cap_at_ipo" label="Market Cap (in Crore)">
          <template v-slot:before>
            &#8377; 
          </template>
          <template v-slot:hint>
           in Crore
          </template>
        </q-input>
      </div>
    </div>
    <div class="row">
      <div class="col col-4 q-pa-md">
        <q-select filled v-model="overview.listed_at" :options="['BSE', 'NSE', 'BSE & NSE']" label="Listed at" />
      </div>
      <div class="col q-pa-md">
        <q-input v-model="overview.rhp_url" type="url" hint="URL" label="RHP Link">
          
        </q-input>
      </div>
    </div>
    <div class="row">
      <div class="col col-4 q-pa-md">
        <q-select filled v-model="overview.registrar" :options="registrars" option-value="id" option-label="name" label="Registrar">
          <template v-slot:append>
            <q-btn round dense flat icon="add" @click="addRegistrarForm = true" />
          </template>
        </q-select>
        <q-dialog v-model="addRegistrarForm">
          <q-card class="my-card" style="width:100vw">
            <h3 class="text-h6 text-center">Add New Registrar</h3>
            <q-card-section>
              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">
                  <q-input v-model="newRg.name" label="Name" />
                </div>
              </div>
              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">
                  <q-input v-model="newRg.url" label="URL" type="url" />
                </div>
              </div>
              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">
                  <q-input v-model="newRg.email" label="Email" type="email" />
                </div>
              </div>
              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">
                  <q-input v-model="newRg.address" label="address"  />
                </div>
              </div>
              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">
                  <q-input v-model="newRg.app_link" label="Mobile App Link" type="url" />
                </div>
              </div>
              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">
                  <q-input v-model="newRg.allotment_link" label="Allotment Link" type="url" />
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn v-close-popup flat color="primary" label="Add" @click="addRegistrar" />
              <q-btn v-close-popup flat color="primary" label="Cancel" @click="resetRegistrarForm" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
      <div class="col q-pa-md">
        <q-select filled v-model="overview.brlms" :options="brlms" option-label="name" label="BRLMs" multiple>
          <template v-slot:append>
            <q-btn round dense flat icon="add" @click="addBrlmForm = true" />
          </template>
        </q-select>
        <q-dialog v-model="addBrlmForm">
          <q-card class="brlm-card" style="width:100vw">
            <h3 class="text-h6 text-center">Add New BRLM</h3>
            <q-card-section>
              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">
                  <q-input v-model="newBrlm.name" label="Name" />
                </div>
              </div>
              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">
                  <q-input v-model="newBrlm.url" label="URL" type="url" />
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn v-close-popup flat color="primary" label="Add" @click="addBrlm" />
              <q-btn v-close-popup flat color="primary" label="Cancel" @click="resetBrlmForm" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>
    <div class="row">
      <div class="col q-pa-md">
        <q-btn color="primary" label="Save and Continue" @click="saveOverview" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount} from 'vue'
import { api, axios } from '../boot/axios'
const props = defineProps({
  ipo: String
})
const overview = ref({})
const ipodata = ref({})
const sectors = ref([])
const registrars = ref([])
const brlms = ref([])
const newRg = ref({})
const newBrlm = ref({})
const addRegistrarForm = ref(false)
const addBrlmForm = ref(false)
const addRegistrar = async() =>{
  const newReg = await axios.post('https://droplet.netserve.in/registrars', newRg.value).then(r => r.data)
  registrars.value.push(newReg)
  overview.value.registrar = newReg
}
const resetRegistrarForm = () => {
  newRg.value = {}
}

const addBrlm = async() => {
  const newBr = await axios.post('https://droplet.netserve.in/brlms', newBrlm.value).then(r => r.data)
  brlms.value.push(newBr)
  overview.value.brlms = (overview.value.brlms) ? overview.value.brlms.push(newBr) : [newBr]
}

const resetBrlmForm = () => {
  newBrlm.value= {}
}

const saveOverview = () => {
  console.log(overview.value.brlms[0])
}

onBeforeMount(async()=>{
  const id = +props.ipo
  sectors.value = await axios.get('https://droplet.netserve.in/sectors').then(r => r.data)
  registrars.value = await axios.get('https://droplet.netserve.in/registrars').then(r => r.data)
  brlms.value = await axios.get('https://droplet.netserve.in/brlms').then(r => r.data)
  const ipo = await api.get('/ipo/id/'+id).then(r => r.data.data)
  console.log(ipo)
  ipodata.value = ipo
  overview.value = {
    company_name: ipo.company_name,
    market_cap_at_ipo: ipo.market_cap_at_time_of_ipo,
    open_date: ipo.open_date,
    close_date: ipo.close_date,
    price_band_low: ipo.price_band_low,
    price_band_high: ipo.price_band_high,
    face_value: ipo.face_value,
    lot_size: ipo.bit_lot,
    issue_size: ipo.issue_size,
    application_amount: (ipo.application_amount > 0) ? ipo.application_amount : (+ipo.bit_lot)*(+ipo.price_band_high),
    anchor_date: ipo.anchor_date,
    fresh_issue: ipo.fresh_issue,
    offer_for_sale: ipo.offer_for_sale,
  }
})
</script>
