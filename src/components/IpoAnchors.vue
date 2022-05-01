<template>
<q-page class="q-pa-md">
    <q-list bordered class="rounded-borders" style="max-width: 600px">
            <q-item>
                <q-item-section top>
                    <q-item-label header class="text-h4">Anchors ({{anchorsProp}})</q-item-label>
                </q-item-section>
                <q-item-section top side>
                    <div class="text-grey-8 q-gutter-xs">
                        <q-btn class="gt-xs" size="12px" flat dense icon="add" @click="showModel" />
                    </div>
                </q-item-section>
            </q-item>
            <q-item v-for="(anc, i) in ipoAnchors" :key="i">
                <q-item-section top>
                   <span class="text-weight-medium">{{anc.anchor.name}}</span>
                </q-item-section>
                <q-item-section side>
                <span class="text-weight-medium">{{anc.no_of_equity_shares}}</span>
                </q-item-section>
                <q-item-section top side>
                    <span class="text-weight-medium"> <q-btn size="12px" flat dense round icon="edit" @click="edit(i)" /> <q-btn size="12px" flat dense round icon="delete" @click="del(i)" /></span>
                </q-item-section>
            </q-item>
        </q-list>
           <q-dialog v-model="editModel">
           <q-card class="my-card" style="width:150vw">
            <q-item>
                <q-item-section>
                    <q-select
                        square
                        bg-color="teal-1"
                        standout="bg-teal-3 text-white"
                        filled
                        v-model="anchor.a_id"
                        :options="options"
                        @filter="selectFilterFunction"
                        @new-value="createSelectValue"
                        options-selected-class="text-primary"
                        options-dense
                        use-input
                        option-value="id" 
                        option-label="name"
                    />
                </q-item-section>
                <q-item-section side top>
                    <q-input type="text" v-model="anchor.no_of_equity_shares" />
                </q-item-section>
                <q-btn flat @click="addRecord" :label="(anchor.id) ? 'Edit' : 'Add'" />
            </q-item>
            </q-card>
           </q-dialog>
</q-page>
    
</template>
<script setup>
import { ref, onMounted} from 'vue'
import { api, axios } from '../boot/axios'
import { useQuasar } from 'quasar'
const props = defineProps({
    IpoId: String
  })
const ipoId = ref(props.IpoId)

//const ipo = ref({})
const anchors = ref([])
const ipoAnchors = ref([])
const newAnchor = ref({})
const anchor = ref({})
const options = ref([])
const anchorsProp = ref(0)

const editModel = ref(false)

const selectFilterFunction = (val, update, abort) => {
    update(() => {
          const needle = val.toLowerCase()
          options.value = options.value.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
        })
}

const createSelectValue = async(val, done) => {
    let newAnchor = await axios.post('https://droplet.netserve.in/anchors', {name: val, details:'#'})
    if(newAnchor.statusText == '201'){
        options.value.push(newAnchor.data)
        anchor.value.id = newAnchor.data
    }
    done(newAnchor.data, "add");
}

const addRecord = async() => {
    if(anchor.value.id){
        let res = await axios.put('https://droplet.netserve.in/ipo-anchors/'+anchor.value.id, anchor.value)
    }
    else { 
        let res = await axios.post('https://droplet.netserve.in/ipo-anchors', {ipo_id: ipoId.value, anchor_id: anchor.value.a_id.id, no_of_equity_shares: anchor.value.no_of_equity_shares})
        if(res.status == 201){
            res.data.anchor = anchor.value.a_id
            ipoAnchors.value.push(res.data)
        }
        anchors.value.push(anchor.value.a_id)
        anchor.value = {}
        options.value = anchors.value
    }
    editModel.value = false
    getTotal()
 }

const showModel = () => {
    anchor.value = {}
    editModel.value = true
}

const edit = (i) => {
    console.log(ipoAnchors.value[i])
    anchor.value = ipoAnchors.value[i]
    anchor.value.a_id = ipoAnchors.value[i].anchor
    editModel.value = true
    getTotal()
}

const del = async(i) => {
    let res = await axios.delete('https://droplet.netserve.in/ipo-anchors/'+ipoAnchors.value[i].id)
    if(res.status == 204){
        ipoAnchors.value.splice(i, 1)
    }
    getTotal()
}
const getTotal = () => {
    anchorsProp.value = ipoAnchors.value.reduce((acc, cur) => acc + +cur.no_of_equity_shares, 0)
}
onMounted(async() => {
    ipoAnchors.value = await axios.get('https://droplet.netserve.in/ipo-anchors?expand=anchor&ipo_id='+ipoId.value).then(r => r.data)
    anchors.value = await axios.get('https://droplet.netserve.in/anchor').then(r => r.data)
    //ipo.value = await axios.get('https://droplet.netserve.in/ipos/'+ipoId.value+'?fields=company_name,open_date').then(r => r.data)
    //console.log(ipoAnchors.value)
    options.value = anchors.value
    getTotal()
})
</script>