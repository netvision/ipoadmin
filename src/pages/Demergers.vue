<template>
  <q-ajax-bar
      ref="bar"
      position="top"
      color="accent"
      size="10px"
    />
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col-9"><h3 class="text-h3 q-mb-md">Recently Announced Demergers</h3></div>
      <q-space />
      <div class="col text-right"><q-btn @click="openDemergerModel({price_type: 'fixed'})">Add New</q-btn></div>
    </div>
    <div class="row">
      <div class="col q-pa-md">
        <q-list v-if="demergers.length > 0">
          <q-expansion-item popup v-for="dm in demergers" :key="dm.id" :header-style="{ backgroundColor: '#f2e1c9', borderBottom: '1px solid ##9c5b05' }">
                <template v-slot:header>
                  <q-item-section>
                    <q-item-label class="text-h6">{{dm.demerged_company}}</q-item-label>
                    <q-item-label class="text-orange"><strong>CMP: {{ dm.curPriceDemerged }}</strong></q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>Ex Date: {{dateFormat(dm.ex_date)}}</q-item-label>
                    <q-item-label>Demerger Ratio: {{ getRatio(dm.demerger_ratio) }}</q-item-label>
                  </q-item-section>
                </template>
                <q-card>
                    <q-card-section>
                      <q-item>
                      <q-item-section>
                        <q-item-label>Demerged Company</q-item-label>
                        <q-item-label class="text-h6">{{dm.demerged_company}}</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-item-label>Closing Price on Exdate: {{ dm.cmp_exdate_demerged_company }}</q-item-label>
                        <q-item-label>Price on Listing Day: {{ dm.listing_day_price_demerged_company }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator class="q-ma-md" />
                    <q-item>
                      <q-item-section>
                        <q-item-label>New Company: </q-item-label>
                        <q-item-label class="text-h6">{{ dm.resulting_company }}</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-item-label>Demerger Ratio: {{ getRatio(dm.demerger_ratio) }}</q-item-label>
                        <q-item-label>Ex Date Ratio: {{ (dm.ex_date_ratio) ? getRatio(dm.ex_date_ratio) : 'NA'}}</q-item-label>
                        <q-item-label>Face Value: {{ dm.face_value ?? 'NA' }}</q-item-label>
                        <q-item-label>Listing Date: {{ dateFormat(dm.listing_date) }}</q-item-label>
                        <q-item-label>Listing Price: {{ dm.listing_price }}</q-item-label>
                        <q-item-label>Listing Value: {{ dm.listing_value }}</q-item-label>
                        <q-item-label>Market Lot: {{ dm.market_lot }}</q-item-label>
                        <q-item-label>ISIN No: {{ dm.isin_no }}</q-item-label>
                        <q-item-label>No. of Shares: {{ dm.no_of_shares }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    </q-card-section>
                    <q-card-actions>
                    <q-btn-group flat>
                      <q-btn icon="mdi-file-edit" label="edit"  @click="editDemerger(dm)" />
                    </q-btn-group>
                  </q-card-actions>
                </q-card>
          </q-expansion-item>
        </q-list>
      </div>
    </div>
    <q-dialog v-model="demergerModal" @hide="() => newDemerger = {}">
      <q-card class="q-pa-md" style="width:90vw; max-width:700px">
        <h3 class="text-h5 text-center">{{ (newDemerger.id) ? 'Edit' : 'New' }} Demerger</h3>
        <q-separator class="q-my-md" color="orange" />
        <p class="text-h6 q-mt-xs">Demerged Company</p>
        <div class="row q-gutter-md">
          <div class="col">
            <q-input outlined v-model="newDemerger.demerged_company" label="Parent Company Name" />
          </div>
        </div>
        <div class="row q-gutter-md q-mt-xs">
          <div class="col">
            <q-input outlined v-model="newDemerger.demerged_company_bsecode" label="BSE Code" />
          </div>
          <div class="col">
            <q-input outlined v-model="newDemerger.demerged_company_nsecode" label="NSE Code" />
          </div>
        </div>
        <div class="row q-gutter-md q-mt-xs">
          <div class="col">
            <q-input outlined v-model="newDemerger.cmp_exdate_demerged_company" label="Ex Date Closing Price">
              <template v-slot:prepend>
                &#8377;
              </template>
            </q-input>
          </div>
          <div class="col">
            <q-input outlined v-model="newDemerger.listing_day_price_demerged_company" label="Listing Day Price">
              <template v-slot:prepend>
                &#8377;
              </template>
            </q-input>
          </div>
        </div>
        <q-separator class="q-my-md" color="orange" />
        <p class="text-h6 q-mt-xs">Resulting Company</p>
        <div class="row q-gutter-md">
          <div class="col">
            <q-input outlined v-model="newDemerger.resulting_company" label="New Company Name" />
          </div>
        </div>
        <div class="row q-gutter-md q-mt-xs">
          <div class="col">
            <q-input outlined v-model="newDemerger.resulting_bsecode" label="BSE Code" />
          </div>
          <div class="col">
            <q-input outlined v-model="newDemerger.resulting_nsecode" label="NSE Code" />
          </div>
        </div>
        <div class="row q-gutter-md q-mt-xs">
          <div class="col">
            <q-input outlined v-model="newDemerger.face_value" label="Face Value">
              <template v-slot:prepend>
                &#8377;
              </template>
            </q-input>
          </div>
          <div class="col">
            <q-input outlined v-model="newDemerger.demerger_ratio" label="Demerger Ratio" />
          </div>
        </div>
        <div class="row q-gutter-md q-mt-xs">
          <div class="col">
            <q-input outlined v-model="newDemerger.ex_date" label="Ex Date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="newDemerger.ex_date" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            </q-input>
          </div>
          <div class="col">
            <q-input outlined v-model="newDemerger.ex_date_ratio" label="Ex Date Ratio" />
          </div>
        </div>
        <div class="row q-gutter-md q-mt-xs">
          <div class="col">
            <q-input outlined v-model="newDemerger.listing_date" label="Listing Date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="newDemerger.listing_date" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            </q-input>
          </div>
          <div class="col">
            <q-input outlined v-model="newDemerger.listing_price" label="Listing Price">
              <template v-slot:prepend>
                &#8377;
              </template>
            </q-input>
          </div>
        </div>
        <div class="row q-gutter-md q-mt-xs">
          <div class="col">
            <q-input outlined v-model="newDemerger.listing_value" label="Listing Value" />
          </div>
          <div class="col">
            <q-input outlined v-model="newDemerger.market_lot" label="Market Lot" />
          </div>
        </div>
        <div class="row q-gutter-md q-mt-xs">
          <div class="col">
            <q-input outlined v-model="newDemerger.no_of_shares" label="No. of Shares" />
          </div>
          <div class="col">
            <q-input outlined v-model="newDemerger.isin_no" label="ISIN No." />
          </div>
        </div>

        <q-card-actions align="right">
          <q-btn flat color="primary" :label="(newDemerger.id) ? 'Edit' : 'Add'" @click="saveDemerger"/>
          <q-btn v-close-popup flat color="primary" round icon="close" @click="closeDemergerModal" />
        </q-card-actions>
     </q-card>
    </q-dialog>
  </q-page>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { axios } from '../boot/axios'
import { Fraction } from 'fractional/index.js'

const getRatio = (fr) => {
  let r = new Fraction(fr / 100)
  return r.numerator+':'+r.denominator
}

/* following is suggested by chatGPT to get ration from  percentage **

const percentToRatio = (percent) => {
  const decimal = percent / 100;
  let numerator = decimal;
  let denominator = 1;
  while (numerator % 1 !== 0) {
    numerator *= 10;
    denominator *= 10;
  }
  const gcd = getGCD(numerator, denominator);
  numerator /= gcd;
  denominator /= gcd;
  return `${numerator}:${denominator}`;
}

const getGCD = (a, b) => {
  if (b === 0) {
    return a;
  } else {
    return getGCD(b, a % b);
  }
}

console.log(percentToRatio(20.20202020))
*/

const demergers = ref([])
const newDemerger = ref({})
const demergerModal = ref(false)

const openDemergerModel = () => demergerModal.value = true
const editDemerger = (d) => {
  newDemerger.value = d
  demergerModal.value = true
}

const closeDemergerModal = () => {
  newDemerger.value = {}
  demergerModal.value = false
}

const saveDemerger = async() => {
  let res = (newDemerger.value.id) ?  await axios.put('https://api.ipoinbox.com/demergers/'+newDemerger.value.id, newDemerger.value) : await axios.post('https://api.ipoinbox.com/demergers', newDemerger.value)
  if(res.status == 201) demergers.value.push(res.data)
  demergerModal.value = false
}

const dateFormat = (dateString) => {
    if(dateString != null){
	    const date = new Date(dateString)
	    return new Intl.DateTimeFormat('default', {dateStyle: 'medium'}).format(date)
    }
    else return ''
}

onMounted(async() => {
  let res = await axios.get('https://api.ipoinbox.com/demergers').then(r => r.data)
  let promises = res.map(async(v) => {
    let curPriceDemerged = 'NA'
    let curPriceResulting = 'NA'
    if(v.demerged_company_nsecode){
      let liveData = await axios.get('https://stockapi.ipoinbox.com/quote?symbol='+v.demerged_company_nsecode.trim())
      curPriceDemerged = liveData.data.priceInfo.lastPrice
    }
    if(v.resulting_nsecode){
      let liveData = await axios.get('https://stockapi.ipoinbox.com/quote?symbol='+v.resulting_nsecode.trim())
      curPriceResulting = liveData.data.priceInfo.lastPrice
    }
    return {
      curPriceDemerged,
      curPriceResulting,
      ...v
    }
  })

  demergers.value = await Promise.all(promises)

})
</script>
