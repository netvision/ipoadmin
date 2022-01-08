<template>
  <div>Financials {{ipo_id}}</div>
  <q-table
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="particular"
    >
    <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in columns" :key="col.name" :props="props">
            {{ props.row[col.field]}}
            <q-popup-edit v-model="props.row[col.field]" v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-td>
        </q-tr>
    </template>
  </q-table>
    <q-btn label="Add Column" @click="addColModel = true" />
    <q-btn label="Add Row" @click="addRowModel= true" />
    <q-dialog v-model="addColModel">
        <q-card class="brlm-card" style="width:100vw">
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const ipo_id = route.params.id

const columns = ref([])
const rows = ref([])

const colLabel = ref('')
const rowParticular = ref('')

const addColModel = ref(false)
const addRowModel = ref(false)

const addColumn = () => {
    let newColumn = {
        name: colLabel.value.replace(/[^a-z0-9]/gi, '_').toLowerCase(),
        label: colLabel.value, 
        field: 'c_'+colLabel.value.replace(/[^a-z0-9]/gi, '_').toLowerCase(),
    }
    columns.value.push(newColumn)
    rows.value.map(row => eval('row.'+newColumn.field+' = 0'))
    console.log(rows.value)
}

const addRow = () => {
    let newRow = {}
    columns.value.forEach((col) =>{
        if(col.field == 'particular'){
            newRow.particular = rowParticular.value
        }
        else eval('newRow.'+col.field+'= 0')
    })
    rows.value.push(newRow)
    console.log(rows.value)
}

onMounted(()=>{
    columns.value = [
        {name: 'particular', label: 'Particular', field: 'particular'}
    ]

    rows.value = [
        {particular: "Revenue from operations"}
    ]
})
</script>

<style>

</style>