<template>
  <h3>NSE</h3>
  <div class="row">
    <div class="col col-4 q-pa-md">
        <q-input v-model="nse.scrip_code" label="Scrip Code" @blur="saveData(nse.scrip_code, 'scrip_code')" />
    </div>
    <div class="col q-pa-md">
        <q-input v-model="nse.url" label="Exchange Url" @blur="saveData(nse.url, 'url')" />
    </div>
  </div>
  <div class="row">
      <div class="col q-pa-md">
          <q-input v-model="nse.listing_date" mask="date" label="Listing Date" @blur="saveData(nse.listing_date, 'listing_date')">
            <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                <q-date v-model="nse.listing_date">
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
          <q-input v-model="issuePrice" label="Issue Price" readonly>
            <template v-slot:prepend>
                &#8377;
            </template>
          </q-input>
      </div>
      <div class="col q-pa-md">
          <q-input v-model="nse.listing_price" label="Listing Price" @blur="saveData(nse.listing_price, 'listing_price')">
            <template v-slot:prepend>
                &#8377;
            </template>
          </q-input>
      </div>
  </div>
  <div class="row">
      <div class="col q-pa-md">
          <q-input v-model="nse.high" label="Day High" @blur="saveData(nse.high, 'high')">
            <template v-slot:prepend>
                &#8377;
            </template>
          </q-input>
      </div>
      <div class="col q-pa-md">
          <q-input v-model="nse.low" label="Day Low" @blur="saveData(nse.low, 'low')">
            <template v-slot:prepend>
                &#8377;
            </template>
          </q-input>
      </div>
      <div class="col q-pa-md">
          <q-input v-model="nse.close" label="Day Close" @blur="saveData(nse.close, 'close')">
            <template v-slot:prepend>
                &#8377;
            </template>
          </q-input>
      </div>
  </div>
  <div class="row">
      <div class="col q-pa-md">
          <q-input v-model="nse.preopen_volume" label="Pre Open Volume" @blur="saveData(nse.preopen_volume, 'preopen_volume')" />
      </div>
      <div class="col q-pa-md">
          <q-input v-model="nse.volume" label="Volume" @blur="saveData(nse.volume, 'volume')" />
      </div>
  </div>
  <div class="row">
      <div class="col q-pa-md">
          <q-input v-model="nse.delivery" label="Delivery" @blur="saveData(nse.delivery, 'delivery')" />
      </div>
      <div class="col q-pa-md">
          <q-input v-model="nse.free_float" label="Free Float" @blur="saveData(nse.free_float, 'free_float')"/>
      </div>
  </div>
</template>
<script setup>
import { ref, onMounted  } from 'vue'
import { axios } from '../boot/axios'
const props = defineProps({
    IpoId: String,
    IssuePrice: Number
  })
const nse = ref({})
const id = ref(props.IpoId)
const issuePrice = ref(props.IssuePrice)
const saveData = async(v, f) =>{
    let data = {}
    if(f == 'listing_date') data = {listing_date : v}
    else if (f == 'scrip_code') data = {scrip_code : v}
    else if (f == 'url') data = {url : v}
    else {
        const val = v.toString().replace(/(,|[^\d.-]+)+/g, '')
        eval('nse.value.'+f+'='+ val)
        eval('data.' + f + '=' + val)
        }
    const upbse = await axios.put('https://droplet.netserve.in/listings/'+nse.value.id, data)
    console.log(upbse)
    console.log(data)
}
onMounted(async() =>{
    const data = await axios.get('https://droplet.netserve.in/listings?exchange=NSE&ipo_id='+id.value).then( r=> r.data)
    if(data.length > 0) nse.value = data[0]
    else nse.value = await axios.post('https://droplet.netserve.in/listings', {ipo_id: id.value, exchange: 'NSE'}).then(r => r.data)
    console.log(issuePrice)
})
</script>
