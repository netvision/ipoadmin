<template>
  <h3>NSE</h3>
  <div class="row">
    <div class="col col-4 q-pa-md">
        <q-input v-model="nse.scrip_code" label="Scrip Code" />
    </div>
    <div class="col q-pa-md">
        <q-input v-model="nse.url" label="Exchange Url" />
    </div>
  </div>
  <div class="row">
      <div class="col q-pa-md">
          <q-input v-model="nse.listing_date" mask="date" label="Listing Date">
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
          <q-input v-model="nse.listing_price" label="Listing Price">
            <template v-slot:prepend>
                &#8377; 
            </template>
          </q-input>
      </div>
  </div>
  <div class="row">
      <div class="col q-pa-md">
          <q-input v-model="nse.high" label="Day High">
            <template v-slot:prepend>
                &#8377; 
            </template>
          </q-input>
      </div>
      <div class="col q-pa-md">
          <q-input v-model="nse.low" label="Day Low">
            <template v-slot:prepend>
                &#8377; 
            </template>
          </q-input>
      </div>
      <div class="col q-pa-md">
          <q-input v-model="nse.close" label="Day Close">
            <template v-slot:prepend>
                &#8377; 
            </template>
          </q-input>
      </div>
  </div>
  <div class="row">
      <div class="col q-pa-md">
          <q-input v-model="nse.preopen_volume" label="Pre Open Volume" />
      </div>
      <div class="col q-pa-md">
          <q-input v-model="nse.volume" label="Volume" />
      </div>
  </div>
  <div class="row">
      <div class="col q-pa-md">
          <q-input v-model="nse.delivery" label="Delivery" />
      </div>
      <div class="col q-pa-md">
          <q-input v-model="nse.free_float" label="Free Float" />
      </div>
  </div>
  <div class="row">
      <div class="col q-pa-md">
        <q-btn color="primary" label="Save NSE" @click="saveNse" />
      </div>
  </div>
</template>
<script setup>
import { ref, onMounted  } from 'vue' 
const props = defineProps({
    IpoId: String
  })
const nse = ref({})
const id = ref(props.IpoId)
import { axios } from '../boot/axios'
const saveNse = async() => {
    const upNse = await axios.put('https://droplet.netserve.in/listings/'+nse.value.id, nse.value)
    console.log(upNse)
}
onMounted(async() =>{
    const data = await axios.get('https://droplet.netserve.in/listings?exchange=NSE&ipo_id='+id.value).then( r=> r.data)
    if(data.length > 0) nse.value = data[0]
    else nse.value = await axios.post('https://droplet.netserve.in/listings', {ipo_id: id.value, exchange: 'NSE'}).then(r => r.data)
})
</script>