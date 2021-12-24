<template>
  <h4 class="text-h4">Tentative Schedule</h4>
  <div class="row">
    <div class="col q-pa-md">
        <q-input v-model="schedule.t_finalisation_of_basis" mask="date" label="Finalisation of Basis of Allotment">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
              <q-date v-model="schedule.t_finalisation_of_basis">
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
        <q-input v-model="schedule.t_initiation_of_refunds" mask="date" label="Unblocking of Funds">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
              <q-date v-model="schedule.t_initiation_of_refunds">
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
        <q-input v-model="schedule.t_credit_of_equity_shares" mask="date" label="Credit of equity shares to DMAT accounts of Allottees">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
              <q-date v-model="schedule.t_credit_of_equity_shares">
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
        <q-input v-model="schedule.t_commencement" mask="date" label="Commencement of trading of Equity Shares on the Stock Exchanges">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
              <q-date v-model="schedule.t_commencement">
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
        <q-input v-model="schedule.t_anchor_unlocking" mask="date" label="Unlocking Date of Anchors">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
              <q-date v-model="schedule.t_anchor_unlocking">
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
  import { ref, onMounted  } from 'vue' 
  import { api, axios } from '../boot/axios'
  import { useQuasar } from 'quasar'
  const props = defineProps({
    IpoId: String
  })
  const emit = defineEmits(['step'])
  const $q = useQuasar()
  const schedule = ref({})
  const ipoId = ref(props.IpoId)
  const saveSchedule = async() => {
    const upIpo = await axios.put('https://droplet.netserve.in/ipos/'+ipoId.value, schedule.value)
    if(upIpo.status == '200'){
      $q.notify({
            message: 'Updated Successfully',
            icon: 'announcement'
          })
          emit('step', 'ok')
    }
  }

  onMounted(async() => {
   const ip = await axios.get('https://droplet.netserve.in/ipos/'+ipoId.value).then(r => r.data)
   schedule.value = ip
   console.log(ip)
  })

</script>