<template>
    <div class="q-pa-md">
        <div class="flex justify-end">
        <q-btn flat label="Add Promoter" @click="promoterModel = true" />
        </div>
        <q-separator spaced />
        <div class="flex flex-start q-gutter-xs">
        <q-card v-for="promoter in promoters" :key="promoter.id" class="col-4" style="max-width:32%" flat bordered>
            <q-card-section horizontal>
                <q-card-section class="col-5 flex items-start">
                <q-img
                    class="rounded-borders"
                    :src="promoter.photo"
                />
                <div class="q-pa-md">
                    <p class="text-subtitle1">Pre-offer Shareholding</p>
                    <p class="text-overline">{{promoter.pre_offer_shares}} ({{promoter.pre_offer_percentage}}%)</p>
                    <q-separator spaced />
                    <p class="text-subtitle1">Post-offer Shareholding</p>
                    <p class="text-overline">{{promoter.post_offer_shares}} ({{promoter.post_offer_percentage}}%)</p>
                </div>
                </q-card-section>
                <q-card-section class="q-pt-xs">
                <div class="text-overline">{{promoter.type}}</div>
                <div class="text-h5 q-mt-sm q-mb-xs">{{promoter.name}}</div>
                <div class="text-caption text-grey" v-html="promoter.description"></div>
                </q-card-section>
            </q-card-section>

            <q-separator />
            <q-card-actions class="flex row justify-end">
                <q-btn flat color="primary" @click="editPromoter(promoter)" label="Edit" />
            </q-card-actions>
        </q-card>
        </div>
        <q-dialog v-model="promoterModel" @hide="resetNewPromoter">
            <q-card class="my-card" flat bordered>
                <q-card-section horizontal>
                    <q-card-section class="col-4 flex items-start ">
                    <q-img
                        class="rounded-borders item-start"
                        :src="newPromoter.photo"
                        @click="photoUpdateModel = true"
                    />
                    
                    </q-card-section>
                    <q-card-section class="col-8">
                        <div class="row no-wrap items-center">
                            <div class="col text-h6 ellipsis">
                                <q-select v-model="newPromoter.type" :options="['Institutional', 'Individual']" label="Type" />
                            </div>
                        </div>
                    <div class="row no-wrap items-center">
                        <div class="col text-h6 ellipsis">
                            <q-input v-model="newPromoter.name" label="Name" />
                        </div>
                    </div>
                    <q-separator />
                    <div class="text-h6 q-mt-sm q-mb-xs">Pre Offer Holding</div>
                    <div class="row no-wrap items-center">
                        <div class="col-6 text-h6 ellipsis">
                            <q-input v-model="newPromoter.pre_offer_shares" label="No of Shares" @blur="sanitizeNumber(newPromoter.pre_offer_shares, 'pre_offer_shares')" />
                        </div>
                        <div class="col-6 text-h6 ellipsis">
                            <q-input v-model="newPromoter.pre_offer_percentage" label="Percentage" @blur="sanitizeNumber(newPromoter.pre_offer_percentage, 'pre_offer_percentage')" />
                        </div>
                    </div>
                    <q-separator />
                    <h6 class="text-h6 q-mt-sm q-mb-xs">Post Offer Holding</h6>
                    <div class="row no-wrap items-center">
                        <div class="col-6 text-h6 ellipsis">
                            <q-input v-model="newPromoter.post_offer_shares" label="No of Shares" @blur="sanitizeNumber(newPromoter.post_offer_shares, 'post_offer_shares')" />
                        </div>
                        <div class="col-6 text-h6 ellipsis">
                            <q-input v-model="newPromoter.post_offer_percentage" label="Percentage" @blur="sanitizeNumber(newPromoter.post_offer_percentage, 'post_offer_percentage')" />
                        </div>
                    </div>
                    <q-separator />
                    <div class="row no-wrap items-center">
                        <div class="col text-h6 ellipsis">
                            <q-input v-model="newPromoter.description" label="Description" type="textarea" />
                        </div>
                    </div>
                    </q-card-section>
                </q-card-section>

                <q-separator />

                <q-card-actions class="flex row justify-end">
                    
                    <q-btn flat color="primary" @click="savePromoter" label="save" />
                </q-card-actions>
            </q-card>
            <q-dialog v-model="photoUpdateModel" flat bordered>
                <div class="flex row justify-start">
                    <q-uploader
                        label="Promoter Photo or Logo"
                        field-name="photo"
                        no-thumbnails
                        auto-upload
                        url="https://droplet.netserve.in/promoter/photo"
                        @uploaded = 'photoUpdate'
                    />
                </div>
            </q-dialog>
        </q-dialog>
    </div>
</template>
<script setup>
import { ref, onMounted  } from 'vue'
import { api, axios } from '../boot/axios'
import promoterPhoto from '../assets/promote-placeholder.png'
const props = defineProps({
    ipo_id: Number
  })
const promoterModel = ref(false)
const photoUpdateModel = ref(false)
const promoters = ref([])
const newPromoter = ref({
    photo : promoterPhoto,
    type: 'Individual',
    description: "please paste html here"
})

const sanitizeNumber = (v, field) => {
  const val = Math.abs(v.replace(/(,|[^\d.-]+)+/g, ''))
  eval('newPromoter.value.'+field+'='+val)
}

const resetNewPromoter = (evt) => {
    newPromoter.value = {
            photo : promoterPhoto,
            type: 'Individual',
            description: "please paste html here"
        }
}
const editPromoter = (promoter) => {
    newPromoter.value = promoter
    if(!promoter.photo) newPromoter.value.photo = promoterPhoto
    promoterModel.value = true
}

const photoUpdate = async(files) => {
          newPromoter.value.photo = JSON.parse(files.xhr.response)
          photoUpdateModel.value = false
          console.log(newPromoter.value.photo)
        }

const savePromoter = async() => {
    if(newPromoter.value.id){
        let res = await axios.put('https://droplet.netserve.in/promoters/'+newPromoter.value.id, newPromoter.value)
        console.log(res.statusText)
    }
    else{
        newPromoter.value.photo = (newPromoter.value.photo == "http://localhost:8080/img/promote-placeholder.png") ? null : newPromoter.value.photo 
        newPromoter.value.ipo_id = +props.ipo_id
        let res = await axios.post('https://droplet.netserve.in/promoters', newPromoter.value)
        if(res.status == 201) promoters.value.push(res.data)
    }
    promoterModel.value = false
}

onMounted(async() => {
        let ipo_id = +props.ipo_id
      promoters.value = await axios.get('https://droplet.netserve.in/promoters?ipo_id='+ipo_id).then(r => r.data)
      console.log(promoters.value)
  })
</script>
<style lang="sass" scoped>
    .my-card
        width: 100%
        max-width: 600px
</style>
