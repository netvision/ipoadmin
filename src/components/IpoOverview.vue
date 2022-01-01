<template>
  <div class="q-pa-md">
    <h2 class="text-h5">Overview</h2>
    <div class="row">
      <div class="col col-8 q-pa-md">
        <q-input v-model="overview.company_name" label="Company Name" />
      </div>
      <div class="col q-pa-md">
        <q-select 
          filled 
          v-model="overview.sector_id" 
          :options="sectors" 
          option-value="id" 
          option-label="name" 
          label="Sector" 
          emit-value 
          map-options
          use-input
          @filter="filterFn">
          <template v-slot:after>
            <q-btn round dense flat icon="add" @click="addSectorModel = true" />
          </template>
        </q-select>
        <q-dialog v-model="addSectorModel">
          <q-card class="brlm-card" style="width:100vw">
            <h3 class="text-h6 text-center">Add New Sector</h3>
            <q-card-section>
              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">
                  <q-input v-model="newSector.name" label="Name" />
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn v-close-popup flat color="primary" label="Add" @click="addSector" />
              <q-btn v-close-popup flat color="primary" label="Cancel" @click="resetSector" />
            </q-card-actions>
          </q-card>
        </q-dialog>
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
          <template v-slot:prepend>
            &#8377; 
          </template>
        </q-input>
      </div> 
      <div class="col q-pa-md">
        <q-input v-model="overview.price_band_low" label="Price Band (Low)">
          <template v-slot:prepend>
            &#8377; 
          </template>
        </q-input>
      </div>
      <div class="col q-pa-md">
        <q-input v-model="overview.price_band_high" label="Price Band (High)" @blur = 'updateAppAmount'>
          <template v-slot:prepend>
            &#8377; 
          </template>
        </q-input>
      </div>
    </div>
    <div class="row">
      <div class="col q-pa-md">
        <q-input v-model="overview.lot_size" label="Lot Size" @blur = 'updateAppAmount'>
          
        </q-input>
      </div>
      <div class="col q-pa-md">
        <q-input readonly v-model="application_amount" label="Application Amount">
          <template v-slot:prepend>
            &#8377; 
          </template>
        </q-input>
      </div>
      <div class="col q-pa-md">
        <q-input v-model="overview.issue_size" label="Issue Size (in Crore)" @blur="sanitizeNumber(overview.issue_size, 'issue_size')">
          <template v-slot:prepend>
            &#8377; 
          </template>
        </q-input>
      </div>
    </div>
    <div class="row">
      <div class="col q-pa-md">
        <q-input v-model="overview.fresh_issue" label="Fresh Issue" @blur="sanitizeNumber(overview.fresh_issue, 'fresh_issue')">
          
        </q-input>
      </div>
      <div class="col q-pa-md">
        <q-input v-model="overview.offer_for_sale" label="Offer for Sale" @blur="sanitizeNumber(overview.offer_for_sale, 'offer_for_sale')">
          
        </q-input>
      </div>
      <div class="col q-pa-md">
        <q-input v-model="overview.no_of_total_shares" label="Number of Total Shares" @blur="sanitizeNumber(overview.no_of_total_shares, 'no_of_total_shares')">
          
        </q-input>
      </div>
    </div>
    <div class="row">
      <div class="col q-pa-md">
       <q-input color="lime-11" bg-color="cyan-2" filled label="Quota" readonly>
         <template v-slot:append>
          <q-btn round flat icon="chevron_right" />
        </template>
       </q-input>
      </div>
      <div class="col q-pa-md" v-for="cat in invCategories" :key="cat.id">
        <q-input v-model="cat_quotas[cat.id]" :label="cat.short_name" @blur="saveQuota(cat.id)" />
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
        <q-select filled v-model="overview.registrar_id" :options="registrars" option-value="id" option-label="name" label="Registrar" emit-value map-options>
          <template v-slot:after>
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
          <template v-slot:after>
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
        <q-btn color="primary" label="Save" @click="saveOverview" />
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, onBeforeMount} from 'vue'
import { api, axios } from '../boot/axios'
import { useQuasar } from 'quasar'
const props = defineProps({
  IpoId: String
})
const emit = defineEmits(['step'])
const $q = useQuasar()
const overview = ref({})
const cat_quotas = ref([])
const ipodata = ref({})
const sectors = ref([])
const invCategories = ref([])
const registrars = ref([])
const brlms = ref([])
const newSector = ref({})
const newRg = ref({})
const newBrlm = ref({})
const application_amount = ref(0)
const addSectorModel = ref(false)
const addRegistrarForm = ref(false)
const addBrlmForm = ref(false)

const filterFn = (val, update, abort) => {
  update(() => {
          const needle = val.toLowerCase()
          sectors.value = sectors.value.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
        })
}

const addSector = async() => {
  const newSec = await axios.post('https://droplet.netserve.in/sectors', newSector.value).then(r => r.data)
  sectors.value.push(newSec)
  overview.value.sector = newSec
}
const resetSector = () => {
  newSector.value = {}
  addSectorModel.value = false
}

const sanitizeNumber = (v, field) => {
  const val = Math.abs(v.replace(/(,|[^\d.-]+)+/g, ''))
  eval('overview.value.'+field+'='+val)
}
const addRegistrar = async() =>{
  const newReg = await axios.post('https://droplet.netserve.in/registrars', newRg.value).then(r => r.data)
  registrars.value.push(newReg)
  overview.value.registrar = newReg
}
const resetRegistrarForm = () => {
  newRg.value = {}
}

const updateAppAmount = () =>{
  application_amount.value = (overview.value.price_band_high && overview.value.lot_size ) ? overview.value.price_band_high*overview.value.lot_size : 0
}

const addBrlm = async() => {
  const newBr = await axios.post('https://droplet.netserve.in/brlms', newBrlm.value).then(r => r.data)
  console.log(overview.value.brlms)
  brlms.value.push(newBr)
  //overview.value.brlms = (overview.value.brlms.length > 0) ? overview.value.brlms.push(newBr) : [newBr]
}

const resetBrlmForm = () => {
  newBrlm.value= {}
}

const saveQuota = async(id) => {
  const ipo_id = +props.IpoId
  cat_quotas.value[id] = cat_quotas.value[id].replace(/(,|[^\d.-]+)+/g, '')
  const cur_quota = await axios.get('https://droplet.netserve.in/subscriptions?ipo_id='+ipo_id+'&cat_id='+id).then(r => r.data)
  
  if(cur_quota.length > 0){
    await axios.put('https://droplet.netserve.in/subscriptions/'+cur_quota[0].id, {quota: cat_quotas.value[id]})
  }
  
  else await axios.post('https://droplet.netserve.in/subscriptions', {quota: cat_quotas.value[id], cat_id: id, ipo_id: ipo_id})

  //console.log({quota: cat_quotas.value[id], cat_id: id, ipo_id: ipo_id})
}

const saveOverview = async() => {
  const id = +props.IpoId
  overview.value.brlms_json = JSON.stringify(overview.value.brlms)
  const upIpo = await axios.put('https://droplet.netserve.in/ipos/'+id, overview.value)
  if(upIpo.status == '200'){
    $q.notify({
          message: 'Updated Successfully',
          icon: 'announcement'
        })
        emit('step', 'ok')
  }
  console.log(upIpo)
}

onBeforeMount(async()=>{
  const id = +props.IpoId
  sectors.value = await axios.get('https://droplet.netserve.in/sectors').then(r => r.data)
  registrars.value = await axios.get('https://droplet.netserve.in/registrars').then(r => r.data)
  invCategories.value = await axios.get('https://droplet.netserve.in/inv-categories').then(r => r.data)
  brlms.value = await axios.get('https://droplet.netserve.in/brlms').then(r => r.data)
  const ipo = await axios.get('https://droplet.netserve.in/ipos/'+id).then(r => r.data)
  console.log(ipo)
  overview.value = ipo
  overview.value.brlms = JSON.parse(ipo.brlms_json)
  const quotas = await axios.get('https://droplet.netserve.in/subscriptions?ipo_id='+id).then(r => r.data)
  invCategories.value.forEach(cat => {
    cat_quotas.value[cat.id] = (quotas.filter(qt => qt.cat_id == cat.id)[0]) ? quotas.filter(qt => qt.cat_id == cat.id)[0].quota : 0
  })
  console.log(cat_quotas.value)
  updateAppAmount()
  
})
</script>
