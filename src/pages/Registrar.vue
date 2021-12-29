<template>
    <q-page class="q-pa-md">
        <q-list bordered class="rounded-borders" style="max-width: 600px">
            <q-item>
                <q-item-section top>
                    <q-item-label header class="text-h4">Registrars</q-item-label>
                </q-item-section>
                <q-item-section top side>
                    <div class="text-grey-8 q-gutter-xs">
                        <q-btn class="gt-xs" size="12px" flat dense label="Add New" @click="editRegModel = true" />
                    </div>
                </q-item-section>
            </q-item>
        <q-item v-for="(reg, i) in registrars" :key="i">
            
            <q-item-section top>
                <q-item-label lines="1">
                    <span class="text-weight-medium">{{reg.name}}</span>
                </q-item-label>
                <q-item-label caption lines="2">
                    {{reg.url}}
                </q-item-label>
            </q-item-section>

            <q-item-section top side>
                <div class="text-grey-8 q-gutter-xs">
                    <q-btn class="gt-xs" size="12px" flat dense round icon="edit" @click="editReg(i)"/>
                </div>
            </q-item-section>
        </q-item>
        </q-list>
        <q-dialog v-model="editRegModel">
            <q-card class="my-card" style="width:100vw">
            <h3 class="text-h6 text-center"><span v-if="newRg.id">Edit</span><span v-else>Add New</span> Registrar</h3>
            <q-card-section>
              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">
                  <q-input v-model="newRg.name" label="Name" />
                </div>
              </div>
              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">
                  <q-input v-model="newRg.url" label="URL" type="url" />
                </div>
              </div>
              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">
                  <q-input v-model="newRg.email" label="Email" type="email" />
                </div>
              </div>
              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">
                  <q-input v-model="newRg.address" label="address"  />
                </div>
              </div>
              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">
                  <q-input v-model="newRg.app_link" label="Mobile App Link" type="url" />
                </div>
              </div>
              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">
                  <q-input v-model="newRg.allotment_link" label="Allotment Link" type="url" />
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn v-if="newRg.id" v-close-popup flat color="primary" label="Update" @click="addRegistrar" />
              <q-btn v-else v-close-popup flat color="primary" label="Add" @click="addRegistrar" />
              <q-btn v-close-popup flat color="primary" label="Cancel" @click="resetRegistrarForm" />
            </q-card-actions>
          </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup>
import { ref, onMounted} from 'vue'
import { axios } from '../boot/axios'

const registrars = ref([])

const newRg = ref({})

const editRegModel = ref(false)

const editReg = (index) =>{
    console.log(index)
    newRg.value = registrars.value[index]
    editRegModel.value = true
    console.log(newRg.value)
}

const addRegistrar = async() =>{
    if(newRg.value.id){
        const upReg = await axios.put('https://droplet.netserve.in/registrars/'+newRg.value.id, newRg.value).then(r => r.data)
        console.log(upReg)
    }
    else {
        const newReg = await axios.post('https://droplet.netserve.in/registrars', newRg.value).then(r => r.data)
        registrars.value.push(newReg)
        console.log(newReg)
    } 
    
    
    editRegModel.value = false
}

const resetRegistrarForm = () =>{
    newRg.value = {}
    editRegModel.value = false
}

onMounted(async()=>{
    registrars.value = await axios.get('https://droplet.netserve.in/registrars').then(r => r.data)
})

</script>

<style>

</style>