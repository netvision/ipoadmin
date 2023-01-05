<template>
  <q-table
      title="Profit And Loss"
      :rows="pl.rows"
      :columns="pl.columns"
      flat
      dense
      bordered
      row-key="particular"
      :pagination = "{
        rowsPerPage: 0
      }"
      selection="single"
      v-model="selectedRow"
    >
    <template v-slot:top-right>
      <q-btn-group flat>
      <q-btn label="Add Column" @click="() => {addColModel = true; tbl = 'pl'}" />
      <q-btn label="Edit Columns" @click="() => {editColModel = true; tbl = 'pl'}" />
      <q-btn label="Add Row" @click="() => {addRowModel= true; tbl = 'pl'}" />
    </q-btn-group>
    </template>
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
        <q-tr :props="props" @contextmenu="onContextMenu($event, props, 'pl')">
          <q-td v-for="col in pl.columns" :key="col.name" :props="props">
            {{ props.row[col.field]}}
            <q-popup-edit v-model="props.row[col.field]" v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-td>
        </q-tr>
    </template>
  </q-table>
  <q-separator spaced />
  <q-table
      title="Balance Sheet"
      :rows="bs.rows"
      :columns="bs.columns"
      flat
      dense
      bordered
      row-key="particular"
      :pagination = "{
        rowsPerPage: 0
      }"
      selection="single"
      v-model="selectedRow"
    >
    <template v-slot:top-right>
      <q-btn-group flat>
        <q-btn label="Add Column" @click="() => {addColModel = true; tbl = 'bs'}" />
        <q-btn label="Edit Columns" @click="() => {editColModel = true; tbl = 'bs'}" />
        <q-btn label="Add Row" @click="() => {addRowModel= true; tbl = 'bs'}" />
      </q-btn-group>
    </template>
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
        <q-tr :props="props" @contextmenu="onContextMenu($event, props, 'bs')">
          <q-td v-for="col in bs.columns" :key="col.name" :props="props">
            {{ props.row[col.field]}}
            <q-popup-edit v-model="props.row[col.field]" v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-td>
        </q-tr>
    </template>
  </q-table>
  <q-separator spaced />
  <div class="row">
    <div class="col q-pa-md">
      <q-editor :toolbar="toolbar" v-model="htmlNotes" placeholder="Notes" />
    </div>
  </div>

  <div class="q-pa-md">
    <q-btn color="primary" label="Save Financials" @click="saveFinancials" />
  </div>
    <q-dialog v-model="addColModel">
        <q-card class="brlm-card" style="width:100vw">
            <h3 class="text-h6 text-center">Add New Column</h3>
            <q-card-section>
              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">{{tbl}}
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
            <q-card-section v-if="tbl == 'pl'">
              <div class="row no-wrap items-center" v-for="col in pl.columns" :key="col.label">
                <div class="col text-h6 ellipsis">
                  <q-input v-model="col.label" autofocus label="Column">
                    <template v-slot:after>
                      <q-btn round dense icon="remove" @click="removeCol(col, tbl)" />
                    </template>
                  </q-input>
                </div>
              </div>
            </q-card-section>

            <q-card-section v-if="tbl == 'bs'">
              <div class="row no-wrap items-center" v-for="col in bs.columns" :key="col.label">
                <div class="col text-h6 ellipsis">
                  <q-input v-model="col.label" autofocus label="Column">
                    <template v-slot:after>
                      <q-btn round dense icon="remove" @click="removeCol(col, tbl)" />
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
                  <q-input v-model="rowParticular" label="Particluar" />
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
const tbl = ref('')
const pl = ref({})
const bs = ref({})
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
    if(tbl.value == 'pl'){
      let newColumn = {
        name: 'column'+pl.value.columns.length,
        label: colLabel.value,
        field: 'column'+pl.value.columns.length,
        align: 'right'
    }
      pl.value.columns.push(newColumn)
      pl.value.rows.map(row => row[newColumn.field] = null)
      console.log(pl.value.rows)
    }
    else if(tbl.value == 'bs'){
      let newColumn = {
        name: 'column'+bs.value.columns.length,
        label: colLabel.value,
        field: 'column'+bs.value.columns.length,
        align: 'right'
    }
      bs.value.columns.push(newColumn)
      bs.value.rows.map(row => row[newColumn.field] = null)
      console.log(bs.value.rows)
    }
}

const addRow = () => {
    let newRow = {}
    if(tbl.value == 'pl'){
      pl.value.columns.forEach((col) =>{
          if(col.field == 'particular'){
              newRow.particular = rowParticular.value
          }
          else newRow[col.field] = null
      })
      pl.value.rows.push(newRow)
    }
    else if(tbl.value == 'bs'){
      bs.value.columns.forEach((col) =>{
          if(col.field == 'particular'){
              newRow.particular = rowParticular.value
          }
          else newRow[col.field] = null
      })
      bs.value.rows.push(newRow)
    }
}

const editColumns = () => {
  console.log(pl.value.columns)
}

const removeCol = (col, tbl) => {
  if(tbl == 'pl'){
    const index = pl.value.columns.findIndex(co => co.field === col.field)
    if(index > 0){
      pl.value.rows.map(row =>{
        delete row[col.field]
      })
      pl.value.columns.splice(index, 1)
    }
    console.log(pl.value.rows)
  }
  else if(tbl == 'bs'){
    const index = bs.value.columns.findIndex(co => co.field === col.field)
    if(index > 0){
      bs.value.rows.map(row =>{
        delete row[col.field]
      })
      bs.value.columns.splice(index, 1)
    }
    console.log(bs.value.rows)
  }
}



const onContextMenu = (e, props, tb) => {
  e.preventDefault()
  tbl.value = tb
   selectedRow.value = props.row
   confirm.value = true
  }

const deleteRow = () => {
  if(tbl.value == 'pl'){
    pl.value.rows.splice(pl.value.rows.findIndex(row => row === selectedRow.value), 1)
      selectedRow.value = {}
      confirm.value = false
    }
    else if(tbl.value == 'bs'){
      bs.value.rows.splice(bs.value.rows.findIndex(row => row === selectedRow.value), 1)
      selectedRow.value = {}
      confirm.value = false
    }
}

const saveFinancials = async() => {

  let financials = {
    pl: pl.value,
    bs: bs.value,
    htmlNotes: htmlNotes.value
  }

  const res = await axios.put('https://droplet.netserve.in/ipos/'+data.ipo_id, {financials: JSON.stringify(financials)})

    if(res.status == 200) {
        $q.notify({
            message: 'Updated Successfully',
            icon: 'announcement'
            })
    }

 console.log(financials)
}

onMounted(()=>{
   pl.value = {
       columns: [
            {name: 'particular', label: 'Particular', field: 'particular', align: 'left'}
          ],
        rows: [
            {particular: "Revenue from operations"},
            {particular: "Restated Profit/Loss for the Year"},
            {particular: "Basic Restated Earning Per Equity Share"},
            {particular: "Diluted Restated Earning Per Equity Share"},
            {particular: "Operating Cash Flow"}
          ]
        }
    bs.value = {
      columns: [
            {name: 'particular', label: 'Particular', field: 'particular', align: 'left'}
          ],
        rows: [
            {particular: "Cash & Cash Equivalent"},
            {particular: "Total Assets"},
            {particular: "Non-current Borrowing"},
            {particular: "Return on Net Worth (%)"},
          ]
    }

    if(data.content){
      let fin = JSON.parse(data.content)
        pl.value = (fin.pl) ? fin.pl : pl.value
        bs.value = (fin.bs) ? fin.bs : bs.value
        htmlNotes.value = (fin.htmlNotes) ? fin.htmlNotes : ''
    }
})
</script>

<style>

</style>
