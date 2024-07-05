<template>
<q-page class="q-pa-md q-ma-md">
    <q-table style="max-width:600px"
        title="Sectors"
        :rows="sectors"
        :columns="columns"
        row-key="id"
        :filter="filter"
        virtual-scroll
        v-model:pagination="pagination"
        :rows-per-page-options="[0]"
        separator = 'cell'>
        <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
                <q-icon name="search" />
            </template>
            </q-input>
            <q-btn flat color="primary" icon="add" label="New Sector" style="margin-left:5px" @click="newSectorModel = true" />
        </template>
        <template v-slot:body="props">
            <q-tr :props="props">
                <q-td key="name" :props="props">
                    {{props.row.name}}
                    <q-popup-edit v-model="props.row.name" @save="(value, initialValue)=>editSector(value, initialValue, props.row.id)" title="Edit" v-slot="scope">
                        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
                    </q-popup-edit>
                </q-td>
            </q-tr>
        </template>
    </q-table>
    <q-dialog v-model="newSectorModel">
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
</q-page>

</template>

<script setup>
import { ref, onMounted} from 'vue'
import { axios } from '../boot/axios'

const columns = [
    {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true}
]
let filter = ref('')
const pagination = ref()

const sectors = ref([])

const newSectorModel = ref(false)
const newSector = ref({})

const addSector = async() => {
  const newSec = await axios.post('https://api.ipoinbox.com/sectors', newSector.value).then(r => r.data)
  sectors.value.push(newSec)
  newSectorModel.value = false
}
const resetSector = () => {
  newSector.value = {}
  newSectorModel.value = false
}

const editSector = async(v, i, id) => {
    const edSec = await axios.put('https://api.ipoinbox.com/sectors/'+id, {name: v}).then(r => r.data)
    console.log(edSec)
}

onMounted(async() => {
    sectors.value = await axios.get('https://api.ipoinbox.com/sectors').then(r => r.data)
})
</script>

<style>

</style>
