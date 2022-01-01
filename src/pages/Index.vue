<template>
  <q-page class="q-pa-md">
    <q-table
      title="Initial Public Offerings"
      :rows="ipos"
      :columns="columns"
      row-key="id"
      :filter="filter"
      virtual-scroll
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      @row-click = 'editIpo'
      separator = 'cell'
      >
      <template v-slot:top-right>
        
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn flat color="primary" icon="add" label="New IPO" style="margin-left:5px" @click="newIpo = true" />
      </template>
      <template v-slot:body-cell-open="props">
        <q-td :props="props">
          <div>
            {{formatDate(props.value)}}
          </div>
          <div class="my-table-details">
            {{ props.row.details }}
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-close="props">
        <q-td :props="props">
          <div>
            {{formatDate(props.value)}}
          </div>
          <div class="my-table-details">
            {{ props.row.details }}
          </div>
        </q-td>
      </template>
    </q-table>
    <q-dialog v-model="newIpo">
      <q-card class="new-ipo-dialog">
        <q-card-section>
          <div class="text-h6">New IPO</div>
          <div class="row">
            <div class="col q-pa-md">
              <q-input v-model="ipoValues.company_name" label="Company Name" />
            </div>
          </div>
          <div class="row">
            <div class="col q-pa-md">
              <q-input v-model="ipoValues.company_url" label="Company Website" />
            </div>
          </div>
          <div class="row">
            <div class="col q-pa-md">
              <q-input v-model="ipoValues.price_band_low" label="Price Band (Low)">
                <template v-slot:prepend>
                  &#8377; 
                </template>
              </q-input>
            </div>
            <div class="col q-pa-md">
              <q-input v-model="ipoValues.price_band_high" label="Price Band (High)">
                <template v-slot:prepend>
                  &#8377; 
                </template>
              </q-input>
            </div>
          </div>
          <div class="row">
            <div class="col q-pa-md">
              <q-input v-model="ipoValues.open_date" mask="date" label="Open Date">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="ipoValues.open_date">
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
              <q-input v-model="ipoValues.close_date" mask="date" label="Close Date">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="ipoValues.close_date">
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

        <q-card-actions>
          <q-btn flat @click="addIpo">Add</q-btn>
          <q-btn flat @click="reset">Reset</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<style scoped>
.new-ipo-dialog{
  width:100%;
  max-width:500px;
}
</style>
<script setup>
  import { axios } from '../boot/axios'
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useQuasar } from 'quasar'
  import ipoData from '../ipo.json'

  const oldIpo = ipoData.data
  const ipos = ref([])
  const $q = useQuasar()
  const newIpo = ref(false)
  const ipoValues = ref({})
  const nifty = ref([])
  let filter = ref('')
  const pagination = ref()
  const router = useRouter()
  const columns = [
      { name: 'id', label: 'IPO ID', field: 'ipo_id', sortable: true },
      { name: 'name', label: 'Company Name', field: 'company_name', sortable: true, align: 'left' },
      { name: 'price_band_low', label: 'Price Band Low', field: 'price_band_low'},
      { name: 'price_band_high', label: 'Price Band High', field: 'price_band_high'},
      { name: 'open', label: 'Open Date', field: 'open_date' },
      { name: 'close', label: 'close Date', field: 'close_date' },
    ]
  const formatDate = (v) =>{
    if(!v) return 'null'
    else return v.split('T')[0].split("-").reverse().join("-")
  }
  const editIpo = (e, r, i) =>{
    router.push('/ipo/'+r.ipo_id)
  }

  const addIpo = async() => {
    console.log(ipoValues)
    const nIpo = await axios.post('https://droplet.netserve.in/ipos', ipoValues.value)
    
    if(nIpo.status == '201'){
      $q.notify({
          message: 'IPO Added!',
          icon: 'announcement'
        })
      router.push('/ipo/'+nIpo.data.ipo_id)
    }
    newIpo.value = false
  }

  const reset = () => {
    ipoValues.value = {}
    newIpo.value = false
  }
  onMounted(async()=>{
    //const ipo = await axios.get('https://uat.ipoinbox.com:5000/api/v1/ipo').then(r => r.data)
    const ipo = await axios.get('https://droplet.netserve.in/ipos').then(r => r.data)
    console.log(ipo)
    ipos.value = ipo
    console.log(oldIpo)
  })
</script>
