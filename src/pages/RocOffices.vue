<template>
  <h3 class="text-h5">Registrar of Companies, Branches<span><q-btn round dense flat icon="add" @click="rocModel = true" /></span></h3>
      <q-list v-if="offices && offices.length > 0">
        <q-item v-for="item in offices" :key="item.id">
          <q-item-section top class="col col-3">
            <q-item-label>{{ item.name }}</q-item-label>
          </q-item-section>
          <q-item-section top>
            <q-item-label lines="1" caption>{{ item.address }}</q-item-label>
            <q-item-label lines="1" caption>{{ item.city }} <span v-if="item.pin"> - {{ item.pin }}, </span> {{ item.state }}</q-item-label>
            <q-item-label lines="1" caption>Email: {{ item.email }} <span v-if="item.phone1">, Phone: {{ item.phone1 }}</span><span v-if="item.phone2">, {{ item.phone2 }}</span></q-item-label>
          </q-item-section>
          <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn class="gt-xs" size="12px" flat dense round icon="delete" @click="delOffice(item)" />
            <q-btn class="gt-xs" size="12px" flat dense round icon="edit" @click="editOffice(item)" />
          </div>
        </q-item-section>
        </q-item>
      </q-list>
      <q-dialog v-model="rocModel">
        <q-card class="brlm-card" style="width:100vw">
          <h3 class="text-h6 text-center">{{ (newOffice.id) ? 'Update' : 'Add New Office' }}</h3>
          <q-card-section>
            <div class="row">
              <div class="q-pa-md col">
                <q-input v-model="newOffice.name" label="Name" />
              </div>
              <div class="q-pa-md col">
                <q-input v-model="newOffice.area" label="Area Served" />
              </div>
            </div>
            <div class="row">
              <div class="q-pa-md col">
                <q-input v-model="newOffice.address" label="Full Address" />
              </div>
            </div>
            <div class="row">
              <div class="q-pa-md col">
                <q-input v-model="newOffice.city" label="City" />
              </div>
              <div class="q-pa-md col">
                <q-input v-model="newOffice.pin" label="PIN" />
              </div>
              <div class="q-pa-md col">
                <q-input v-model="newOffice.state" label="State" />
              </div>
            </div>
            <div class="row">
              <div class="q-pa-md col col-6">
                <q-input v-model="newOffice.email" label="Email" />
              </div>
              <div class="q-pa-md col">
                <q-input v-model="newOffice.phone1" label="Phone" />
              </div>
              <div class="q-pa-md col">
                <q-input v-model="newOffice.phone2" label="Alt. Phone" />
              </div>
            </div>
            <div class="row">
              <div class="q-pa-md col col-6">
                <q-input v-model="newOffice.name_of_registrar" label="Name of Registrar" />
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn v-close-popup flat color="primary" :label="(!newOffice.id) ? 'Add' : 'Update'" @click="addOffice" />
            <q-btn v-close-popup flat color="primary" label="Cancel" @click="resetOffice" />
          </q-card-actions>
        </q-card>
      </q-dialog>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { axios } from '../boot/axios'
const $q = useQuasar()
const offices = ref([])
const newOffice = ref({})
const rocModel = ref(false)

const addOffice = async() => {
  let res = (newOffice.value.id) ? await axios.put('https://droplet.netserve.in/roc-offices/'+newOffice.value.id, newOffice.value) : await axios.post('https://droplet.netserve.in/roc-offices', newOffice.value)
  if(res.status == 200 || res.status == 201) {
    if (res.status == 201) offices.value.push(res.data)
    $q.notify({
        message: 'Updated Successfully',
        icon: 'announcement'
        })
    newOffice.value = {}
  }
}

const resetOffice = () => {
  newOffice.value = {}
  rocModel.value = false
}

const editOffice = (item) => {
  newOffice.value = item
  rocModel.value = true
}

const delOffice = async(item) => {
  let res = await axios.delete('https://droplet.netserve.in/roc-offices/'+item.id)
  if(res.status == 204){
    offices.value = offices.value.filter(et => et.id != item.id)
    $q.notify({
        message: 'Deleted Successfully',
        icon: 'announcement'
        })
  }
}

onMounted(async() => {
  offices.value = await axios.get('https://droplet.netserve.in/roc-offices?per-page=50').then(r => r.data)
})
</script>
