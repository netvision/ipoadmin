<template>
    <q-card class="my-card">
        <q-card-section v-if="details && details.length > 0">
            <q-list separator>
                <q-item v-for="item in details" :key = "item.id" clickable @click="editRecord(item)">
                    <q-item-section>
                    <q-item-label>{{item.name}}</q-item-label>
                    <q-item-label caption>{{item.type}}</q-item-label>
                    </q-item-section>

                    <q-item-section side top>
                    <q-item-label caption>{{item.shares_offered}} ({{item.percent_of_holding}})</q-item-label>
                    <q-item-label>{{item.amount_in_cr}} Cr.</q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
        </q-card-section>
        <q-separator />
        <q-card-section v-if="Object.entries(newRecord).length === 0">
            <q-btn label="Add record" @click="addRecord" flat text-color="blue-10" />
        </q-card-section>
        <q-card-section v-if="newRecord && Object.entries(newRecord).length > 0">
            <div class="row bg-blue-grey-11 q-pa-md">
                <div class="col-6"><q-input v-model="newRecord.name" label="Name" /></div>
                <div class="col-6"><q-input v-model="newRecord.type" label="Type" /></div>
            </div>
            <div class="row bg-blue-grey-11 q-pa-md">
                <div class="col"><q-input v-model="newRecord.shares_offered" label="No. of shares offered" /></div>
                <div class="col"><q-input v-model="newRecord.amount_in_cr" label="Amount in Cr." /></div>
                <div class="col"><q-input v-model="newRecord.percent_of_holding" label="Percentage of total holding" /></div>
            </div>
            <div align="right" class="bg-blue-grey-11 q-pa-md">
                <q-btn label="Cancel" @click="newRecord = {}" flat /><q-btn :label="(newRecord.id) ? 'Edit' : 'Save'" @click="saveRecord" flat />
            </div>
        </q-card-section>
        <q-card-actions align="right">
            <q-btn v-close-popup flat color="primary" round icon="close" />
        </q-card-actions>
    </q-card>
</template>
<script setup>
    import { ref, onMounted } from 'vue'
    import { axios } from '../boot/axios'
    const props = defineProps({
        ipoId: Number
    })

    const details = ref([])
    const newRecord = ref({})

    const addRecord = () => {
        newRecord.value = {
            ipo_id: props.ipoId,
            name: '',
            type: '',
            shares_offered: 0,
            amount_in_cr: 0,
            precent_of_holding: 0
        }
    }

    const editRecord = (item) => {
        newRecord.value = item
    }

    const saveRecord = async() => {
        let record = newRecord.value
        record.amount = +record.amount_in_cr * 10000000
        if(record.id){
            let data = await axios.put('https://droplet.netserve.in/ip-ofs-details/'+record.id, record).then(r => r.data)
            if(data){
                newRecord.value = {}
            }
        }
        else {
            let data = await axios.post('https://droplet.netserve.in/ip-ofs-details', record).then(r => r.data)
            data.amount_in_cr = Math.round(data.amount / 10000000, 3)
            details.value.push(data)
            newRecord.value = {}
        }
    }

    onMounted(async() => {
        let data = await axios.get('https://droplet.netserve.in/ip-ofs-details?ipo_id='+props.ipoId).then(r => r.data)
        details.value = data.map( r => {
            r.amount_in_cr = Math.round(r.amount / 10000000, 3)
            return r
        })
        console.log(details.value)
    })
</script>