<template>
    <div class="text-h4">Strengths, Weaknesses, Opportinities and Threats</div>
      <div class="row q-gutter-md">
        <div class="col q-pa-md">
          <h3 class="text-h5">Strengths</h3>
          <q-slider v-model="swot.strengths_score" :min="0" :max="10" :step="1" label :label-value="'Strength Score: ' + swot.strengths_score" label-always color="purple" />
          <q-editor :toolbar="toolbar" v-model="swot.strengths_html" min-height="5rem" />
        </div>
        <div class="col q-pa-md">
          <h3 class="text-h5">Weaknesses</h3>
          <q-slider v-model="swot.weaknesses_score" :min="0" :max="10" :step="1" label :label-value="'Weakness Score: ' + swot.weaknesses_score" label-always color="purple" />
          <q-editor :toolbar="toolbar" v-model="swot.weaknesses_html" min-height="5rem" />
        </div>
      </div>
      <div class="row q-gutter-md">
        <div class="col q-pa-md">
          <h3 class="text-h5">Opportunities</h3>
          <q-slider v-model="swot.opportunities_score" :min="0" :max="10" :step="1" label :label-value="'Opportunity Score: ' + swot.opportunities_score" label-always color="purple" />
          <q-editor :toolbar="toolbar" v-model="swot.opportunities_html" min-height="5rem" />
        </div>
        <div class="col q-pa-md">
          <h3 class="text-h5">Threats</h3>
          <q-slider v-model="swot.threats_score" :min="0" :max="10" :step="1" label :label-value="'Threats Score: ' + swot.threats_score" label-always color="purple" />
          <q-editor :toolbar="toolbar" v-model="swot.threats_html" min-height="5rem" />
        </div>
      </div>
      <q-btn color="primary" label="Save Swot" @click="saveSwot" />
</template>
<script setup>
import { ref, onMounted  } from 'vue' 
import { api, axios } from '../boot/axios'

const props = defineProps({
    ipo_id: Number
  })
const swot = ref({})
const toolbar = [
        [
          {
            label: "Align",
            fixedLabel: true,
            list: 'only-icons',
            options: ['left', 'center', 'right', 'justify']
          },
        ],
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
        ['viewsource']
      ]


const saveSwot = async() => {
    const id = +props.ipo_id
    const swotUp = await axios.put('https://droplet.netserve.in/ipos/'+id, {swot: JSON.stringify(swot.value)})
    console.log(swotUp.data)
  }

onMounted(async () => {
    const id = +props.ipo_id
    const ip = await axios.get('https://droplet.netserve.in/ipos/'+id).then(r => r.data)
    swot.value = (ip.swot) ? JSON.parse(ip.swot) : {strengths_score : 0, strengths_html: '', weaknesses_score : 0, weaknesses_html: '', opportunities_score: '', opportunities_html: '', threats_score: 0, threats_html: ''}
    
  })
</script>