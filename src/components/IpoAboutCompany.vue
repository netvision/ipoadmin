<template>
<div class="q-pa-md relative-position">
  <q-img :src="company_header" style="width:100%; height:225px" fit="fill" @click="headerModel = true"></q-img>
  <q-img :src="company_logo" alt="click to change" style="width:150px; height:100px; position:absolute; bottom:10px; right:50px;" fit="contain" @click="logoModel = true"></q-img>
  <q-dialog v-model="logoModel">
    <div class="col q-pa-md">
          <q-uploader
            label="Update Company Logo"
            field-name="logo"
            no-thumbnails
            auto-upload
            :form-fields = "[{name:'ipo_id', value: ipo.ipo_id}]"
            url="https://droplet.netserve.in/ipo/logo"
            @uploaded = 'logoUpdate'
            style="max-width: 30%; width:30%"
          />
        </div>
  </q-dialog>
  <q-dialog v-model="headerModel">
    <div class="col q-pa-md">
          <q-uploader
            label="Update Company Header"
            field-name="header"
            no-thumbnails
            auto-upload
            :form-fields = "[{name:'ipo_id', value: ipo.ipo_id}]"
            url="https://droplet.netserve.in/ipo/header"
            @uploaded = 'headerUpdate'
            style="max-width: 30%; width:30%"
          />
        </div>
  </q-dialog>
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
    <q-tab name="review" label="Review &amp; Conclusion" />
  </q-tabs>
  <q-separator />

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="info">
      <div class="text-h6">Company Info</div>
      <CompanyInfo :ipo_id="ipo.ipo_id" :html_data="ipo.about_html" />
    </q-tab-panel>

    <q-tab-panel name="promoters">
      <div class="text-h6">Promoters</div>
      <Promoters :notes="ipo.promotors_html" :ipo_id="ipo.ipo_id" />
    </q-tab-panel>

    <q-tab-panel name="objects">
      <IpoObjects :ipo_id="ipo.ipo_id" />
    </q-tab-panel>
    <q-tab-panel name="financials">
      <IpoFinancials :content="ipo.financials" :ipo_id="ipo.ipo_id" />
    </q-tab-panel>
    <q-tab-panel name="peers">
      <IpoPeers :content="ipo.peers" :ipo_id="ipo.ipo_id" />
    </q-tab-panel>
    <q-tab-panel name="swot">
      <Swot :ipo_id="ipo.ipo_id" />
    </q-tab-panel>
    <q-tab-panel name="review">
      <div class="text-h6">Review &amp; Conclusion</div>
      <IpoReview :ipo_id="ipo.ipo_id" :content="ipo.review_html" />
    </q-tab-panel>
    <q-tab-panel name="conclusion">
      <div class="text-h6">Conclusion</div>
      <IpoConclusion :ipo_id="ipo.ipo_id" :content="ipo.conclusion_html" />
    </q-tab-panel>
  </q-tab-panels>
</template>


<script setup>
  import { ref, onMounted } from 'vue'
  import { api, axios } from '../boot/axios'
  import CompanyInfo from './CompanyInfo.vue'
  import IpoObjects from './IpoObjects.vue'
  import IpoFinancials from './IpoFinancials.vue'
  import IpoPeers from './IpoPeers.vue'
  import IpoReview from './IpoReview.vue'
  import IpoConclusion from './IpoConclusion.vue'
  import Promoters from './Promoters.vue'
  import Swot from './Swot.vue'
  const tab = ref()
  const props = defineProps({
    IpoId: String
  })
  const logoModel = ref(false)
  const headerModel = ref(false)
  const ipo = ref({})
  const company_logo = ref('')
  const company_header = ref('/defaultheader.jpg')
  const logoUpdate = async(files) => {
          const id = +props.IpoId
          company_logo.value = JSON.parse(files.xhr.response)
          await axios.put('https://droplet.netserve.in/ipos/'+id, {company_logo: company_logo.value})
          logoModel.value = false
        }
  const headerUpdate = async(files) => {
          const id = +props.IpoId
          company_header.value = JSON.parse(files.xhr.response)
          await axios.put('https://droplet.netserve.in/ipos/'+id, {header_img: company_header.value})
          headerModel.value = false
        }


  onMounted(async () => {
    const id = +props.IpoId
    const ip = await axios.get('https://droplet.netserve.in/ipos/'+id).then(r => r.data)
    ipo.value = ip
    company_logo.value = (ip.company_logo) ? ip.company_logo : '/placeholder-logo.png'
    company_header.value = (ip.header_img) ? ip.header_img : '/header-placeholder.png'
    tab.value = 'info'
  })
</script>
