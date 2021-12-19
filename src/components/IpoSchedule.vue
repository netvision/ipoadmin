<template>
  <h4 class="text-h4">Tentative Schedule</h4>
  <div class="row">
    <div class="col q-pa-md">
        <q-input v-model="schedule.finalisation_of_allotment" mask="date" label="Finalisation of Basis of Allotment">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
              <q-date v-model="schedule.finalisation_of_allotment">
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
        <q-input v-model="schedule.unblocking_of_funds" mask="date" label="Unblocking of Funds">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
              <q-date v-model="schedule.unblocking_of_funds">
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
        <q-input v-model="schedule.credit_of_shares" mask="date" label="Credit of equity shares to DMAT accounts of Allottees">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
              <q-date v-model="schedule.credit_of_shares">
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
        <q-input v-model="schedule.tantative_listing_date" mask="date" label="Commencement of trading of Equity Shares on the Stock Exchanges">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
              <q-date v-model="schedule.tantative_listing_date">
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
        <q-input v-model="schedule.anchors_unblocking_date" mask="date" label="Unlocking Date of Anchors">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
              <q-date v-model="schedule.anchors_unblocking_date">
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
        <q-btn color="primary" label="Save and Continue" @click="saveSchedule" />
      </div>
  </div>
</template>

<script setup>
  import { ref  } from 'vue' 

  const props = defineProps({
    IpoId: String
  })
  const schedule = ref({
    finalisation_of_allotment: '',
    unblocking_of_funds: '',
    credit_of_shares:'',
    tantative_listing_date:'',
    anchors_unblocking_date:''
  })
  const ipoId = ref(props.IpoId)
  const saveSchedule = () => {
    console.log(schedule)
  }

</script>