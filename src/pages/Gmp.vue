<template>
<q-page class="q-pa-md">
    <h2 class="text-h4">Grey Market Premium</h2>
    <div class="row q-gutter-md">
        <div class="col-5 bg-orange-1 q-pa-md">
            <h3 class="text-h5">Latest IPOs/SME IPOs/FPOs</h3>
            <q-item v-for="ip in latestIpos" :key="ip.ipo_id">
                <q-btn flat :label="ip.company_name" @click="getGmp(ip)" />
            </q-item>
            <q-item>
                <q-select 
                    filled 
                    v-model="ipo" 
                    :options="iposOpt" 
                    option-value="ipo_id" 
                    option-label="company_name" 
                    label="Search IPOs Archives"
                    use-input
                    @update:model-value="getGmp()"
                    @filter="filterFn" />
            </q-item>
        </div>
        <div class="col bg-orange-1">        
        <q-list bordered class="rounded-borders">
            <q-item v-if="ipo">
                <q-item-section top>
                    <q-item-label header class="text-h4"><span>GMPs of {{ipo.company_name}}</span></q-item-label>
                </q-item-section>
                <q-item-section top side>
                    <div class="text-grey-8 q-gutter-xs">
                        <q-btn class="gt-xs" size="12px" flat dense icon="add" @click="showModel" />
                    </div>
                </q-item-section>
            </q-item>
            <q-item v-for="(g, i) in gmps" :key="i">
                <q-item-section>
                    <span style="border-bottome:1px solid #333" class="text-weight-medium">{{date.formatDate(g.date_time, 'DD-MM-YYYY | HH:mm')}}</span>
                </q-item-section>
                <q-item-section>
                   <span class="text-weight-medium">{{g.gmpType.short_name}}</span>
                </q-item-section>
                <q-item-section>
                <span class="text-weight-bold text-ligh-blue-8" v-if="g.gmp_value_low">&#8377;{{g.gmp_value_low}}-</span><span class="text-weight-bold text-ligh-blue-8">&#8377;{{g.gmp_value}}</span>
                </q-item-section>
                <q-item-section side>
                   <span class="text-weight-medium">{{g.type}}</span>
                </q-item-section>
                <q-item-section side>
                   <span class="text-weight-medium">{{g.volume}}</span>
                </q-item-section>
                <q-item-section side top>
                    <span class="text-weight-medium"> <q-btn size="12px" flat dense round icon="edit" @click="edit(i)" /> <q-btn size="12px" flat dense round icon="delete" @click="del(i)" /></span>
                </q-item-section>
                
            </q-item>
        </q-list>
           <q-dialog v-model="editModel" @hide="reset">
           <q-card class="my-card" style="width:150vw">
           <q-item>
            <q-item-section>
                    <q-input filled v-model="gmpDate">
                        <template v-slot:prepend>
                            <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-date v-model="gmpDate" mask="YYYY-MM-DD HH:mm">
                                <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                                </q-date>
                            </q-popup-proxy>
                            </q-icon>
                        </template>

                        <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-time v-model="gmpDate" mask="YYYY-MM-DD HH:mm" format24h>
                                <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                                </q-time>
                            </q-popup-proxy>
                            </q-icon>
                        </template>
                        </q-input>
                </q-item-section>
           </q-item>
            <q-item>
                <q-item-section>
                    <q-select
                        square
                        bg-color="teal-1"
                        standout="bg-teal-3 text-white"
                        filled
                        v-model="gmp.gmpType"
                        :options="gmpTypes"
                        @new-value="createSelectValue"
                        options-selected-class="text-primary"
                        options-dense
                        use-input
                        option-value="id" 
                        option-label="short_name"
                        label="GMP"
                    />
                </q-item-section>
                <q-item-section>
                    <q-select
                        square
                        filled
                        v-model="gmp.type"
                        :options="['Buyer', 'Seller']"
                        label="Type"
                    />
                </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section>
                     <q-input v-model="gmp.gmp_value_low" label="Price Range Low" type="number">
                        <template v-slot:prepend>
                            &#8377; 
                        </template>
                     </q-input>
                    </q-item-section>
                    <q-item-section>
                     <q-input v-model="gmp.gmp_value_high" label="Price Range high" type="number">
                        <template v-slot:prepend>
                            &#8377; 
                        </template>
                     </q-input>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section>
                     <q-select
                        square
                        bg-color="teal-1"
                        filled
                        v-model="gmp.volume"
                        :options="['Dry', 'Low', 'Moderate', 'High', 'Extreme']"
                        label="Volume"                        
                    />
                    </q-item-section>
                    <q-item-section side>
                     <q-btn @click="addRecord" :label="(gmp.id) ? 'Edit' : 'Add'" />
                    </q-item-section>
                </q-item>
                
            </q-card>
           </q-dialog>


        </div>
    </div>
</q-page>
    
</template>
<script setup>
    import { axios } from '../boot/axios'
    import { onMounted, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { useQuasar, date } from 'quasar'

    const ipos = ref([])
    const ipo = ref()
    const $q = useQuasar()

    const latestIpos = ref([])

    const iposOpt = ref([])
    const timeStamp = Date.now()
    const gmpDate = ref(date.formatDate(timeStamp, 'YYYY-MM-DD HH:mm:ss'))
    const gmps = ref([])
    const gmp = ref({})
    const gmpTypes = ref([])

    const editModel = ref(false)

    const showModel = () => editModel.value = true

    const edit = (i) => {
        gmp.value = gmps.value[i]
        gmpDate.value = gmps.value[i].date_time
        editModel.value = true
    }

    const del = async(i) => {
        let res = await axios.delete('https://droplet.netserve.in/gmps/'+gmps.value[i].id)
        if(res.status == 204){
            gmps.value.splice(i, 1)
        }
    }

    const reset = () => {
        gmp.value = {}
        gmpDate.value = date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss')
    }

    const addRecord = async() => {
        gmp.value.ipo_id = ipo.value.ipo_id
        gmp.value.date_time = gmpDate.value
        gmp.value.gmp_type_id = gmp.value.gmpType.id
        
        if(gmp.value.id){
            let res = await axios.put('https://droplet.netserve.in/gmps/'+gmp.value.id, gmp.value)
        }
        else{
            gmp.value.gmp_value = gmp.value.gmp_value_high
            let res = await axios.post('https://droplet.netserve.in/gmps', gmp.value)
            if(res.status == 201){
                gmp.value.id = res.data.id
                gmps.value.push(gmp.value)
            }
        }
        editModel.value = false
    }

    const filterFn = (val, update, abort) => {
        update(() => {
                const needle = val.toLowerCase()
                iposOpt.value = ipos.value.filter(v => v.company_name.toLowerCase().indexOf(needle) > -1)
                })
        }

    const getGmp = async(ip) => {
        if(ip){
            ipo.value = ip
        }
           gmps.value = await axios.get('https://droplet.netserve.in/gmps?expand=gmpType&ipo_id='+ipo.value.ipo_id).then(r => r.data)
           gmps.value.map(g => {if(g.gmp_value > 0 && g.gmp_value_high === null) g.gmp_value_high = g.gmp_value})
        }

    const createSelectValue = async(val, done) => {
            let newGmpType = await axios.post('https://droplet.netserve.in/gmp-types', {short_name: val, name: val})
            if(newGmpType.statusText == '201'){
                gmps.value.push(newGmpType.data)
                gmp.value.gmpType = newGmpType.data
            }
            done(newGmpType.data, "add");
        }

    onMounted(async() => {
        ipos.value = await axios.get('https://droplet.netserve.in/ipos?sort=-open_date').then(r => r.data)
        latestIpos.value = ipos.value.slice(0, 10)
        iposOpt.value = ipos.value
        gmpTypes.value = await axios.get('https://droplet.netserve.in/gmp-types').then(r => r.data)

        console.log(date.formatDate(gmpDate.value, 'DD-MM-YYYY'))
        
    })
</script>