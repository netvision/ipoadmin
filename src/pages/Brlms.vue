<template>
<q-page class="q-pa-md q-ma-md">
    <q-table style="max-width:800px"
        title="Book Running Lead Managers"
        :rows="brlms"
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
            <q-btn flat color="primary" icon="add" label="New BRLM" style="margin-left:5px" @click="newBrlmModel = true" />
        </template>
        <template v-slot:body="props">
            <q-tr :props="props">
                <q-td key="name" :props="props">
                    {{props.row.name}}
                    <q-popup-edit v-model="props.row.name" @save="(value, initialValue)=>editName(value, initialValue, props.row.id)" title="Edit" v-slot="scope">
                        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
                    </q-popup-edit>
                </q-td>
                <q-td key="url" :props="props">
                    {{props.row.url}}
                    <q-popup-edit v-model="props.row.url" @save="(value, initialValue)=>editUrl(value, initialValue, props.row.id)" title="Edit" v-slot="scope">
                        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
                    </q-popup-edit>
                </q-td>
            </q-tr>
        </template>
    </q-table>
    <q-dialog v-model="newBrlmModel">
        <q-card class="brlm-card" style="width:100vw">
            <h3 class="text-h6 text-center">Add New BRLM</h3>
            <q-card-section>
              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">
                  <q-input v-model="newBrlm.name" label="Name" />
                </div>
              </div>
              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">
                  <q-input v-model="newBrlm.url" label="URL" />
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn v-close-popup flat color="primary" label="Add" @click="addBrlm" />
              <q-btn v-close-popup flat color="primary" label="Cancel" @click="resetBrlm" />
            </q-card-actions>
          </q-card>
    </q-dialog>
</q-page>

</template>

<script setup>
import { ref, onMounted} from 'vue'
import { axios } from '../boot/axios'

const columns = [
    {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
    {name: 'url', align: 'left', label: 'URL', field: 'url'}
]
let filter = ref('')
const pagination = ref()

const brlms = ref([])
const newBrlm = ref({})

const newBrlmModel = ref(false)
const newSBrlm = ref({})

const addBrlm = async() => {
  const newbr = await axios.post('https://api.ipoinbox.com/brlms', newBrlm.value).then(r => r.data)
  brlms.value.push(newbr)
  newBrlmModel.value = false
}
const resetBrlm = () => {
  newBrlm.value = {}
  newSectorModel.value = false
}

const editName = async(v, i, id) => {
    const edName = await axios.put('https://api.ipoinbox.com/brlms/'+id, {name: v}).then(r => r.data)
    console.log(edName)
}

const editUrl = async(v, i, id) => {
    const edUrl = await axios.put('https://api.ipoinbox.com/brlms/'+id, {url: v}).then(r => r.data)
    console.log(edUrl)
}

onMounted(async() => {
    brlms.value = await axios.get('https://api.ipoinbox.com/brlms').then(r => r.data)
})
</script>

<style>

</style>
