<template>
  <q-table
      title="Peer Comparision"
      :rows="rows"
      flat
      dense
      bordered
      :columns="columns"
      row-key="company"
      :pagination = "{
        rowsPerPage: 0
      }"
      selection="single"
      v-model="selectedRow"
    >
    <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="text-italic text-purple text-left"
          >
            {{ col.label }}

          </q-th>
        </q-tr>
      </template>
    <template v-slot:body="props">
        <q-tr :props="props" @contextmenu="onContextMenu($event, props)">
          <q-td v-for="col in columns" :key="col.name" :props="props">
            {{ props.row[col.field]}}
            <q-popup-edit v-model="props.row[col.field]" v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-td>
        </q-tr>
    </template>
  </q-table>

  <div class="q-pa-md">
      <q-btn-group>
        <q-btn label="Add Column" @click="addColModel = true" />
        <q-btn label="Edit Columns" @click="editColModel = true" />
        <q-btn label="Add Row" @click="addRowModel= true" />
      </q-btn-group>
  </div>
  <div class="row">
    <div class="col q-pa-md">
      <q-editor :toolbar="toolbar" v-model="htmlNotes" placeholder="Notes" />
    </div>

  </div>
  <div class="q-pa-md">
    <q-btn color="primary" label="Save" @click="savePeers" />
  </div>
    <q-dialog v-model="addColModel">
        <q-card style="width:100vw">
            <h3 class="text-h6 text-center">Add New Column</h3>
            <q-card-section>
              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">
                  <q-input v-model="colLabel" label="Column Title" />
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn v-close-popup flat color="primary" label="Add" @click="addColumn" />
            </q-card-actions>
          </q-card>
    </q-dialog>
    <q-dialog v-model="editColModel">
        <q-card class="brlm-card" style="width:100vw">
            <h3 class="text-h6 text-center">Edit Column</h3>
            <q-card-section>
              <div class="row no-wrap items-center" v-for="col in columns" :key="col.label">
                <div class="col text-h6 ellipsis">
                  <q-input v-model="col.label" label="Column" dense autofocus>
                    <template v-slot:after>
                      <q-btn round dense icon="remove" @click="removeCol(col)" />
                    </template>
                  </q-input>
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn v-close-popup flat color="primary" label="Save" @click="editColumns" />
            </q-card-actions>
          </q-card>
    </q-dialog>
    <q-dialog v-model="addRowModel">
        <q-card class="brlm-card" style="width:100vw">
            <h3 class="text-h6 text-center">Add New Row</h3>
            <q-card-section>
              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">
                  <q-input v-model="rowParticular" label="Name of the Company" />
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn v-close-popup flat color="primary" label="Add" @click="addRow" />
            </q-card-actions>
          </q-card>
    </q-dialog>
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">

          <span class="q-ml-sm">Delete this row?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="primary" @click="deleteRow" />
        </q-card-actions>
      </q-card>
    </q-dialog>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api, axios } from '../boot/axios'
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'

const data = defineProps({
    ipo_id: Number,
    content: String
  })
const $q = useQuasar()
const columns = ref([])
const rows = ref([])
const htmlNotes = ref('')
const toolbar = [
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        ['left', 'center', 'right', 'justify'],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
        ['viewsource']
      ]

const colLabel = ref('')
const rowParticular = ref('')

const addColModel = ref(false)
const editColModel = ref(false)
const addRowModel = ref(false)
const confirm = ref(false)

const selectedRow = ref({})

const addColumn = () => {
    let newColumn = {
        name: 'column'+columns.value.length,
        label: colLabel.value,
        field: 'column'+columns.value.length,
        align: 'right'
    }
    columns.value.push(newColumn)
    rows.value.map(row => row[newColumn.field] = null)
    console.log(rows.value)
}

const addRow = () => {
    let newRow = {}
    columns.value.forEach((col) =>{
        if(col.field == 'company'){
            newRow.company = rowParticular.value
        }
        else newRow[col.field] = null
    })
    rows.value.push(newRow)
}

const editColumns = () => {
  console.log(columns.value)
}

const removeCol = (col) => {
  const index = columns.value.findIndex(co => co.field === col.field)
  if(index > 0){
    rows.value.map(row =>{
      delete row[col.field]
    })
    columns.value.splice(index, 1)
  }
  console.log(rows.value)
}



const onContextMenu = (e, props) => {
  e.preventDefault()
   selectedRow.value = props.row
   confirm.value = true
  }

const deleteRow = () => {
  rows.value.splice(rows.value.findIndex(row => row === selectedRow.value), 1)
  selectedRow.value = {}
  confirm.value = false
}

const savePeers = async() => {
  let peers = {
    col: columns.value,
    row: rows.value,
    htmlNotes: htmlNotes.value
  }
  console.log(peers)
  const res = await axios.put('https://api.ipoinbox.com/ipos/'+data.ipo_id, {peers: JSON.stringify(peers)})

    if(res.status == 200) {
        $q.notify({
            message: 'Updated Successfully',
            icon: 'announcement'
            })
    }

}

onMounted(()=>{
  columns.value = [
        {name: 'company', label: 'Name of the Company', field: 'company', align: 'left'},
        {name: 'Column1', label: 'Face Value (Per Share)', field: 'column1'},
        {name: 'Column2', label: 'Total Revenue (in Cr.)', field: 'column2'},
        {name: 'Column3', label: 'EPS for Year (Basic)', field: 'column3'},
        {name: 'Column3', label: 'EPS for Year (Diluted)', field: 'column4'},
        {name: 'Column4', label: 'NAV Per Equity Share', field: 'column5'},
        {name: 'Column5', label: 'P/E', field: 'column6'},
        {name: 'Column6', label: 'Return on NetWorth (%)', field: 'column7'}
    ]

  if(data.content){
    let peers = JSON.parse(data.content)
    rows.value = peers.row
    columns.value = peers.col
    htmlNotes.value = (peers.htmlNotes) ? peers.htmlNotes : ''
  }

  console.log(columns.value.length)

})
</script>

<style>

</style>
