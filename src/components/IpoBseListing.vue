<template>
  <h3>BSE</h3>
  <div class="row">
    <div class="col col-4 q-pa-md">
        <q-input v-model="bse.scrip_code" label="Scrip Code" />
    </div>
    <div class="col q-pa-md">
        <q-input v-model="bse.url" label="Exchange Url" />
    </div>
  </div>
  <div class="row">
      <div class="col q-pa-md">
          <q-input v-model="bse.listing_date" mask="date" label="Listing Date">
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
          <q-input v-model="bse.listing_price" label="Listing Price">
            <template v-slot:prepend>
                &#8377; 
            </template>
          </q-input>
      </div>
  </div>
  <div class="row">
      <div class="col q-pa-md">
          <q-input v-model="bse.high" label="Day High">
            <template v-slot:prepend>
                &#8377; 
            </template>
          </q-input>
      </div>
      <div class="col q-pa-md">
          <q-input v-model="bse.low" label="Day Low">
            <template v-slot:prepend>
                &#8377; 
            </template>
          </q-input>
      </div>
      <div class="col q-pa-md">
          <q-input v-model="bse.close" label="Day Close">
            <template v-slot:prepend>
                &#8377; 
            </template>
          </q-input>
      </div>
  </div>
  <div class="row">
      <div class="col q-pa-md">
          <q-input v-model="bse.preopen_volume" label="Pre Open Volume" />
      </div>
      <div class="col q-pa-md">
          <q-input v-model="bse.volume" label="Volume" />
      </div>
  </div>
  <div class="row">
      <div class="col q-pa-md">
          <q-input v-model="bse.delivery" label="Delivery" />
      </div>
      <div class="col q-pa-md">
          <q-input v-model="bse.free_float" label="Free Float" />
      </div>
  </div>
  <div class="row">
      <div class="col q-pa-md">
        <q-btn color="primary" label="Save BSE" @click="saveBse" />
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
const saveBse = async() => {
    const upbse = await axios.put('https://droplet.netserve.in/listings/'+bse.value.id, bse.value)
    console.log(upbse)
}
onMounted(async() =>{
    const data = await axios.get('https://droplet.netserve.in/listings?exchange=BSE&ipo_id='+id.value).then( r=> r.data)
    if(data.length > 0) bse.value = data[0]
    else bse.value = await axios.post('https://droplet.netserve.in/listings', {ipo_id: id.value, exchange: 'BSE'}).then(r => r.data)
})
</script>