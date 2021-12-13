<template>
<div class="q-pa-md relative-position">
  <q-img :src="company_header" style="width:100%; height:225px" fit="fill">
  </q-img>
  <q-img :src="company_logo" style="width:150px; height:100px; position:absolute; bottom:10px; right:50px; object-fit:cover" fit="none">
  </q-img>
  
</div>
  <q-tabs
    v-model="tab"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="left"
    narrow-indicator
  >
    <q-tab name="info" label="Company Info" />
    <q-tab name="promoters" label="Promoters" />
    <q-tab name="objects" label="Objects of the Issue" />
    <q-tab name="financials" label="Company Financials" />
    <q-tab name="peers" label="Peers" />
    <q-tab name="swot" label="SWOT" />
    <q-tab name="review" label="Review" />
  </q-tabs>
  <q-separator />

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="info">
      <div class="row q-gutter-md">
        <div class="col-3 q-pa-md">
          <q-uploader
            label="Update Company Logo"
            field-name="logo"
            no-thumbnails
            auto-upload
            :form-fields = "[{name:'ipo_id', value: ipo.ipo_id}]"
            url="https://droplet.netserve.in/ipo/logo"
            @uploaded = 'logoUpdate'
          />
        </div>
        <div class="col q-pa-md">
          <q-uploader
            label="Update Company Header"
            field-name="header"
            no-thumbnails
            auto-upload
            :form-fields = "[{name:'ipo_id', value: ipo.ipo_id}]"
            url="https://droplet.netserve.in/ipo/header"
            @uploaded = 'headerUpdate'
          />
        </div>
      </div>
      <div class="row q-gutter-md">
        <div class="col q-pa-md">
          <div class="text-h6">Company Info</div>
          <Editor :html-content="ipo.about_company_html" @update="saveInfo" />
        </div>
      </div>
    </q-tab-panel>

    <q-tab-panel name="promoters">
      <div class="text-h6">Promoters</div>
      <Editor :html-content="ipo.about_promoters_html" @update="savePromotors" />
    </q-tab-panel>

    <q-tab-panel name="objects">
      <div class="text-h6">Objects of the Issue</div>
      <Editor :html-content="ipo.objects_of_the_Issue_html" @update="saveObject" />
    </q-tab-panel>
    <q-tab-panel name="financials">
      <div class="text-h6">Company Financials</div>
      <Editor :html-content="ipo.financials_html" @update="saveFinancials" />
    </q-tab-panel>
    <q-tab-panel name="peers">
      <div class="text-h6">Peers</div>
      <Editor :html-content="ipo.peer_html" @update="savePeers" />
    </q-tab-panel>
    <q-tab-panel name="swot">
      <div class="text-h4">Strengths, Weaknesses, Opportinities and Threats</div>
      <div class="row q-gutter-md">
        <div class="col q-pa-md">
          <h3 class="text-h5">Strengths</h3>
          <q-slider v-model="ipo.swot_strengths_scoring" :min="0" :max="10" :step="1" label :label-value="'Strength Score: ' + ipo.swot_strengths_scoring " label-always color="purple" />
          <q-editor v-model="ipo.swot_strengths_html" min-height="5rem" />
        </div>
        <div class="col q-pa-md">
          <h3 class="text-h5">Weaknesses</h3>
          <q-slider v-model="ipo.swot_weaknesses_scoring" :min="0" :max="10" :step="1" label :label-value="'Weakness Score: ' + ipo.swot_weaknesses_scoring " label-always color="purple" />
          <q-editor v-model="ipo.swot_weaknesses_html" min-height="5rem" />
        </div>
      </div>
      <div class="row q-gutter-md">
        <div class="col q-pa-md">
          <h3 class="text-h5">Opportunities</h3>
          <q-slider v-model="ipo.swot_opportunities_scoring" :min="0" :max="10" :step="1" label :label-value="'Opportunity Score: ' + ipo.swot_opportunities_scoring " label-always color="purple" />
          <q-editor v-model="ipo.swot_opportunities_html" min-height="5rem" />
        </div>
        <div class="col q-pa-md">
          <h3 class="text-h5">Threats</h3>
          <q-slider v-model="ipo.swot_threats_scoring" :min="0" :max="10" :step="1" label :label-value="'Threats Score: ' + ipo.swot_threats_scoring " label-always color="purple" />
          <q-editor v-model="ipo.swot_threats_html" min-height="5rem" />
        </div>
      </div>
      <q-btn color="primary" label="Save Swot" @click="saveSwot" />
    </q-tab-panel>
    <q-tab-panel name="review">
      <div class="text-h6">Review</div>
      <Editor :html-content="ipo.review_and_ratings_html" @update="saveReview" />
    </q-tab-panel>
  </q-tab-panels>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
    data(){
      return {
        swotStrengthScore: 0,
        swotWeaknessScore: 0,
       }
    },

    methods: {
        
        saveReview(value){
          console.log(value)
        },

        savePeers(value){
          console.log(value)
        },

        saveFinancials(value){
          console.log(value)
        },

        saveObject(value){
          console.log(value)
        },

        savePromotors(value){
          console.log(value)
        },

        saveInfo(value){
          console.log(value)
        }
    }
})
</script>

<script setup>
  import { ref  } from 'vue' 
  import { api, axios } from '../boot/axios'
  import Editor from './Editor.vue'
  const tab = ref('info')
  const props = defineProps({
    ipo_id: String
  })
  const ipo = ref({})
  const company_logo = ref(String)
  const company_header = ref(String)
  const logoUpdate = (files) => {
          company_logo.value = JSON.parse(files.xhr.response)
        }
  const headerUpdate = (files) => {
          company_header.value = JSON.parse(files.xhr.response)
        }
  const saveSwot = () => {
    console.log(ipo.value.swot_threats_scoring)
  }
  const init = async () => {
    const id = +props.ipo_id
    const ip = await api.get('/ipo/id/'+id).then(r => r.data.data)
    ipo.value = ip
    company_logo.value = 'https://uat.ipoinbox.com:5000/resources/images/ipo/'+ip.company_logo
    company_header.value = 'https://uat.ipoinbox.com:5000/resources/images/ipo/'+ip.company_background_logo
  }

  init()
</script>
