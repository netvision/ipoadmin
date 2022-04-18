<template>
<q-page class="q-pa-md q-ma-md">
    <q-table style="max-width:800px"
        title="Anchors"
        :rows="anchors"
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
            <q-btn flat color="primary" icon="add" label="New Anchor" style="margin-left:5px" @click="newAnchorModel = true" />
        </template>
        <template v-slot:body="props">
            <q-tr :props="props">
                <q-td key="name" :props="props">
                    {{props.row.name}}
                    <q-popup-edit v-model="props.row.name" @save="(value, initialValue)=>editName(value, initialValue, props.row.id)" title="Edit" v-slot="scope">
                        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
                    </q-popup-edit>
                </q-td>
                <q-td key="details" :props="props">
                    {{props.row.details}}
                    <q-popup-edit v-model="props.row.details" @save="(value, initialValue)=>editUrl(value, initialValue, props.row.id)" title="Edit" v-slot="scope">
                        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
                    </q-popup-edit>
                </q-td>
                <q-td key="del" :props="props">
                    <q-btn flat icon="delete" @click="del(props.row.id)" />
                </q-td>
            </q-tr>
        </template>
    </q-table>
    <q-dialog v-model="newAnchorModel">
        <q-card class="brlm-card" style="width:100vw">
            <h3 class="text-h6 text-center">Add New Anchor</h3>
            <q-card-section>
              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">
                  <q-input v-model="newAnchor.name" label="Name" />
                </div>
              </div>
              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">
                  <q-input v-model="newAnchor.details" label="URL" />
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn v-close-popup flat color="primary" label="Add" @click="addAnchor" />
              <q-btn v-close-popup flat color="primary" label="Cancel" @click="resetAnchor" />
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
    {name: 'details', align: 'left', label: 'Detail', field: 'details'},
    {name: 'del', align: 'left', label: '#'}
]
let filter = ref('')
const pagination = ref()

const anchors = ref([])
const newAnchor = ref({})

const newAnchorModel = ref(false)
const newSAnchor = ref({})

const addAnchor = async() => {
  const newAn = await axios.post('https://droplet.netserve.in/anchor', newAnchor.value).then(r => r.data)
  anchors.value.push(newAn)
  newAnchorModel.value = false
}
const resetAnchor = () => {
  newAnchor.value = {}
  newAnchorModel.value = false
}

const editName = async(v, i, id) => {
    const edName = await axios.put('https://droplet.netserve.in/anchors/'+id, {name: v}).then(r => r.data)
    console.log(edName)
}

const editUrl = async(v, i, id) => {
    const edUrl = await axios.put('https://droplet.netserve.in/anchors/'+id, {details: v}).then(r => r.data)
    console.log(edUrl)
}

const del = async(id) => {
    let res = await axios.delete('https://droplet.netserve.in/anchors/'+id)
    if(res.status == 204){
        anchors.value.splice(anchors.value.findIndex(x => x.id == id), 1)
    }
}

onMounted(async() => {
    anchors.value = await axios.get('https://droplet.netserve.in/anchors').then(r => r.data)
    /*
    let test = await axios.get('https://www.bseindia.com/markets/PublicIssues/BSEBidDetails_ofs.aspx?flag=NR&Scripcode=500312')
    let parser = new DOMParser()
    let html = parser.parseFromString(test.data, 'text/html')
    console.log(html.getElementById('divID').querySelector('table tr').innerText)
    */
})
</script>

<style>

</style>