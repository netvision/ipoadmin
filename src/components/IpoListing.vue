<template>
<div class="q-pa-md">
  <h4 class="text-h4">Listing Day Data</h4>
  <div class="row">
    <div class="col q-pa-md">
      <q-input v-model="issue_price" label="Issue Price" />
    </div>
    <div class="col q-pa-md">
      <q-input v-model="listing_date" mask="date" label="Listing Date">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
              <q-date v-model="listing_date">
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
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab name="nse" label="NSE" />
        <q-tab name="bse" label="BSE" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="nse">
          <div class="text-h6">NSE</div>
           <div class="row">
            <div class="col q-pa-md">
              <q-input v-model="nse.listing_price" label="Listing Price" />
            </div>
            <div class="col q-pa-md">
              <q-input v-model="nse.high_price" label="Listing Day High Price" />
            </div>
            <div class="col q-pa-md">
              <q-input v-model="nse.low_price" label="Listing Day Low Price" />
            </div>
            <div class="col q-pa-md">
              <q-input v-model="nse.close_price" label="Listing Day Close Price" />
            </div>
          </div>
          <div class="row">
            <div class="col q-pa-md">
              <q-input v-model="nse.volume" label="Listing Day Volume" />
            </div>
            <div class="col q-pa-md">
              <q-input v-model="nse.delivery" label="Listing Day Delivery" />
            </div>
            <div class="col q-pa-md">
              <q-input v-model="nse.pre_open" label="Pre Open Volume" />
            </div>
            <div class="col q-pa-md">
              <q-input v-model="nse.free_float" label="Free Float" />
            </div>
          </div>
          <div class="row">
            <div class="col q-pa-md">
              <q-btn color="primary" label="Save NSE Data" @click="saveNse" />
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="bse">
          <div class="text-h6">BSE</div>
          <div class="row">
            <div class="col q-pa-md">
              <q-input v-model="bse.listing_price" label="Listing Price" />
            </div>
            <div class="col q-pa-md">
              <q-input v-model="bse.high_price" label="Listing Day High Price" />
            </div>
            <div class="col q-pa-md">
              <q-input v-model="bse.low_price" label="Listing Day Low Price" />
            </div>
            <div class="col q-pa-md">
              <q-input v-model="bse.close_price" label="Listing Day Close Price" />
            </div>
          </div>
          <div class="row">
            <div class="col q-pa-md">
              <q-input v-model="bse.volume" label="Listing Day Volume" />
            </div>
            <div class="col q-pa-md">
              <q-input v-model="bse.delivery" label="Listing Day Delivery" />
            </div>
            <div class="col q-pa-md">
              <q-input v-model="bse.pre_open" label="Pre Open Volume" />
            </div>
            <div class="col q-pa-md">
              <q-input v-model="bse.free_float" label="Free Float" />
            </div>
          </div>
          <div class="row">
            <div class="col q-pa-md">
              <q-btn color="primary" label="Save BSE Data" @click="saveBse" />
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
      
    </div>
  </div>
</div>
</template>

<script setup>
  import { ref  } from 'vue' 

  const props = defineProps({
    IpoId: String
  })
  const ipoId = ref(props.IpoId)
  const tab = ref('nse')
  const listing_date = ref('')
  const issue_price = ref('')
  const bse = ref({})
  const nse = ref({})


</script>