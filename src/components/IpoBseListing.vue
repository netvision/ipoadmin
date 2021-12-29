<template>
  <h3>BSE</h3>
  <div class="row">
    <div class="col col-4 q-pa-md">
        <q-input v-model="bse.scrip_code" label="Scrip Code" @blur="saveData(bse.scrip_code, 'scrip_code')" />
    </div>
    <div class="col q-pa-md">
        <q-input v-model="bse.url" label="Exchange Url" @blur="saveData(bse.url, 'url')" />
    </div>
  </div>
  <div class="row">
      <div class="col q-pa-md">
          <q-input v-model="bse.listing_date" mask="date" label="Listing Date" @blur="saveData(bse.listing_date, 'listing_date')">
            <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                <q-date v-model="bse.listing_date">
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
          <q-input v-model="bse.listing_price" label="Listing Price" @blur="saveData(bse.listing_price, 'listing_price')">
            <template v-slot:prepend>
                &#8377; 
            </template>
          </q-input>
      </div>
  </div>
  <div class="row">
      <div class="col q-pa-md">
          <q-input v-model="bse.high" label="Day High" @blur="saveData(bse.high, 'high')">
            <template v-slot:prepend>
                &#8377; 
            </template>
          </q-input>
      </div>
      <div class="col q-pa-md">
          <q-input v-model="bse.low" label="Day Low" @blur="saveData(bse.low, 'low')">
            <template v-slot:prepend>
                &#8377; 
            </template>
          </q-input>
      </div>
      <div class="col q-pa-md">
          <q-input v-model="bse.close" label="Day Close" @blur="saveData(bse.close, 'close')">
            <template v-slot:prepend>
                &#8377; 
            </template>
          </q-input>
      </div>
  </div>
  <div class="row">
      <div class="col q-pa-md">
          <q-input v-model="bse.preopen_volume" label="Pre Open Volume" @blur="saveData(bse.preopen_volume, 'preopen_volume')" />
      </div>
      <div class="col q-pa-md">
          <q-input v-model="bse.volume" label="Volume" @blur="saveData(bse.volume, 'volume')" />
      </div>
  </div>
  <div class="row">
      <div class="col q-pa-md">
          <q-input v-model="bse.delivery" label="Delivery" @blur="saveData(bse.delivery, 'delivery')" />
      </div>
      <div class="col q-pa-md">
          <q-input v-model="bse.free_float" label="Free Float" @blur="saveData(bse.free_float, 'free_float')" />
      </div>
  </div>
</template>
<script setup>
import { ref, onMounted  } from 'vue' 
const props = defineProps({
    IpoId: String
  })
const bse = ref({})
const id = ref(props.IpoId)
import { axios } from '../boot/axios'
const saveData = async(v, f) =>{
    let data = {}
    if(f == 'listing_date') data = {listing_date : v}
    else if (f == 'scrip_code') data = {scrip_code : v}
    else if (f == 'url') data = {url : v}
    else {
        const val = v.toString().replace(/(,|[^\d.-]+)+/g, '')
        eval('bse.value.'+f+'='+ val)
        eval('data.' + f + '=' + val)
        }
    const upbse = await axios.put('https://droplet.netserve.in/listings/'+bse.value.id, data)
    console.log(upbse)
    console.log(data)
}
onMounted(async() =>{
    const data = await axios.get('https://droplet.netserve.in/listings?exchange=BSE&ipo_id='+id.value).then( r=> r.data)
    if(data.length > 0) bse.value = data[0]
    else bse.value = await axios.post('https://droplet.netserve.in/listings', {ipo_id: id.value, exchange: 'BSE'}).then(r => r.data)
})
</script>