<template>
  <q-tabs
    v-model="infoTab"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="left"
    narrow-indicator
  >
    <q-tab name="basicinfo" label="Basic Info" />
    <q-tab name="history" label="History" />
    <q-tab name="holdings" label="Holdings" />
    <q-tab name="clients" label="Clients" />
    <q-tab name="property" label="Properties" />
    <q-tab name="litigations" label="Litigations" />
  </q-tabs>
  <q-separator />

  <q-tab-panels v-model="infoTab" animated>
    <q-tab-panel name="basicinfo">
      <div class="q-pa-md text-h5">Basic Info</div>
        <div class="bg-grey-3">
          <div class="row">
            <div class="col q-pa-md">
                <q-input v-model="compInfo.date_of_inc" mask="date" label="Date of Incorporation">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="compInfo.date_of_inc">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
                </q-input>
              </div>
            <div class="q-pa-md col col-6">
              <q-select
                  filled
                  v-model="compInfo.roc_id"
                  :options="rocOffices"
                  option-value="id"
                  option-label="name"
                  label="ROC Branch Name"
                  emit-value
                  map-options
                  use-input
                  >
                  <template v-slot:after>
                    <q-btn round dense flat icon="add" @click="rocOfficeModel = true" />
                  </template>
                </q-select>
                <q-dialog v-model="rocOfficeModel">
                  <q-card class="brlm-card" style="width:100vw">
                    <h3 class="text-h6 text-center">Add New Office</h3>
                    <q-card-section>
                      <div class="row no-wrap items-center">
                        <div class="col text-h6 ellipsis">
                          <q-input v-model="newRoc.name" label="Name" />
                        </div>
                      </div>
                    </q-card-section>

                    <q-card-actions align="right">
                      <q-btn v-close-popup flat color="primary" label="Add" @click="addRoc" />
                      <q-btn v-close-popup flat color="primary" label="Cancel" @click="resetRoc" />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
            </div>
          </div>
          <div class="row">
            <div class="q-pa-md col">
              <q-input v-model="compInfo.phone1" label="Phone No." />
            </div>
            <div class="q-pa-md col">
              <q-input v-model="compInfo.phone2" label="Phone No. (alternate)" />
            </div>
            <div class="q-pa-md col">
              <q-input v-model="compInfo.email" label="Email id" />
            </div>
          </div>
          <div class="row">
            <div class="q-pa-md col">
              <q-input v-model="compInfo.cin" label="Company Identication Number" />
            </div>
            <div class="q-pa-md col">
              <q-input v-model="compInfo.reg_no" label="Registration Number" />
            </div>
          </div>
          <div class="row">
            <div class="q-pa-md col">
            <p class="text-left text-h5">Brief Intro</p>
            <q-editor v-model="compInfo.brief_intro_html" :toolbar="toolbar" />
            </div>
          </div>
          <div class="row">
            <div class="q-pa-md col">
            <p class="text-left text-h5">Business Details</p>
            <q-editor v-model="compInfo.business_info" :toolbar="toolbar" />
            </div>
          </div>
          <div class="row q-gutter-sm">
            <div class="q-pa-md col rounded-borders bg-grey-2">
            <p class="text-h5">Registered Office</p>
              <p><q-input v-model="compInfo.reg_office_address" label="Full Address" /></p>
              <p><q-input v-model="compInfo.reg_office_city" label="City" /></p>
              <p><q-input v-model="compInfo.reg_office_pin" label="Pin" /></p>
              <p><q-input v-model="compInfo.reg_office_state" label="State" /></p>
            </div>
            <div class="q-pa-md col rounded-borders bg-grey-2">
            <p class="text-h5">Corporate Office</p>
              <p><q-input v-model="compInfo.corp_office_address" label="Full Address" /></p>
              <p><q-input v-model="compInfo.corp_office_city" label="City" /></p>
              <p><q-input v-model="compInfo.corp_office_pin" label="Pin" /></p>
              <p><q-input v-model="compInfo.corp_office_state" label="State" /></p>
            </div>
          </div>
          <div class="row">
            <div class="q-pa-md col col-12 text-h5">Company Secretary</div>
            <div class="q-pa-md col">
              <q-input v-model="compInfo.cs_name" label="Name" />
            </div>
            <div class="q-pa-md col">
              <q-input v-model="compInfo.cs_phone" label="Phone" />
            </div>
            <div class="q-pa-md col">
              <q-input v-model="compInfo.cs_email" label="email" />
            </div>
          </div>
          <div class="row">
            <div class="q-pa-md col">
              <q-btn flat color="primary" label="Save" @click="saveInfo" />
            </div>
          </div>
        </div>
    </q-tab-panel>
    <q-tab-panel name="history">
      <h3 class="text-h5">Historical Events <span><q-btn round dense flat icon="add" @click="eventModel = true" /></span></h3>
      <q-list v-if="events && events.length > 0">
        <q-item v-for="item in events" :key="item.id">
          <q-item-section top class="col-2">
            <q-item-label>{{ item.year }}</q-item-label>
          </q-item-section>
          <q-item-section top>
            <q-item-label lines="1">{{ item.heading }}</q-item-label>
            <q-item-label lines="2" v-if="item.detail_html" v-html="item.detail_html"></q-item-label>
          </q-item-section>
          <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn class="gt-xs" size="12px" flat dense round icon="delete" @click="delEvent(item)" />
            <q-btn class="gt-xs" size="12px" flat dense round icon="edit" @click="editEvent(item)" />
          </div>
        </q-item-section>
        </q-item>
      </q-list>
      <q-dialog v-model="eventModel">
        <q-card class="brlm-card" style="width:100vw">
          <h3 class="text-h6 text-center">{{ (newEvent.id) ? 'Update Event' : 'Add New Event' }}</h3>
          <q-card-section>
            <div class="row no-wrap items-center">
              <div class="col q-pa-md text-h6 ellipsis">
                <q-input v-model="newEvent.year" label="Year" />
              </div>
              <div class="col q-pa-md">
                <q-select
                  filled
                  v-model="newEvent.event_type"
                  :options="eventTypes"
                  label="Event type"
                  >
                </q-select>
              </div>
              <div class="col q-pa-md">
                <q-input v-model="newEvent.actual_date" mask="date" label="Actual Date">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="newEvent.actual_date">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
                </q-input>
              </div>
            </div>
            <div class="row">
              <div class="q-pa-md col">
                <q-input v-model="newEvent.heading" label="Event Heading" />
              </div>
            </div>
            <div class="row">
              <div class="q-pa-md col">
              <p class="text-left text-h6">Details</p>
              <q-editor v-model="newEvent.detail_html" :toolbar="toolbar" />
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn v-close-popup flat color="primary" :label="(!newEvent.id) ? 'Add' : 'Update'" @click="addEvent" />
            <q-btn v-close-popup flat color="primary" label="Cancel" @click="resetEvent" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-tab-panel>
    <q-tab-panel name="holdings">
      <h3 class="text-h5">Holdings and Subsidiaries<span><q-btn round dense flat icon="add" @click="holdingModel = true" /></span></h3>
      <q-list v-if="holdings && holdings.length > 0">
        <q-item v-for="item in holdings" :key="item.id">
          <q-item-section top class="col-2">
            <q-item-label>{{ item.holding_type }}</q-item-label>
          </q-item-section>
          <q-item-section top>
            <q-item-label lines="1">{{ item.name }} <span v-if="item.perc_of_holding">({{ item.perc_of_holding }}%)</span></q-item-label>
          </q-item-section>
          <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn class="gt-xs" size="12px" flat dense round icon="delete" @click="delHolding(item)" />
            <q-btn class="gt-xs" size="12px" flat dense round icon="edit" @click="editHolding(item)" />
          </div>
        </q-item-section>
        </q-item>
      </q-list>
      <q-dialog v-model="holdingModel">
        <q-card class="brlm-card" style="width:100vw">
          <h3 class="text-h6 text-center">{{ (newHolding.id) ? 'Update' : 'Add New Holding' }}</h3>
          <q-card-section>
            <div class="row no-wrap items-center">
              <div class="col col-6 q-pa-md text-h6 ellipsis">
                <q-input v-model="newHolding.name" label="Name" />
              </div>
              <div class="col q-pa-md">
                <q-select
                  filled
                  v-model="newHolding.holding_type"
                  :options="holdingTypes"
                  label="Holding type"
                  >
                </q-select>
              </div>
              <div class="col col-2 q-pa-md">
                <q-input v-model="newHolding.perc_of_holding" label="Percent of Holding" />
              </div>
            </div>
            <div class="row">
              <div class="q-pa-md col">
                <q-input v-model="newHolding.address" label="Address" />
              </div>
            </div>
            <div class="row">
              <div class="q-pa-md col">
                <q-input v-model="newHolding.phone" label="Phone" />
              </div>
              <div class="q-pa-md col">
                <q-input v-model="newHolding.email" label="Email Id" />
              </div>
              <div class="q-pa-md col">
                <q-input v-model="newHolding.url" label="URL" />
              </div>
            </div>

          </q-card-section>

          <q-card-actions align="right">
            <q-btn v-close-popup flat color="primary" :label="(!newHolding.id) ? 'Add' : 'Update'" @click="addHolding" />
            <q-btn v-close-popup flat color="primary" label="Cancel" @click="resetHolding" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-tab-panel>
    <q-tab-panel name="clients">
      <h3 class="text-h5">Clients<span><q-btn round dense flat icon="add" @click="clientModel = true" /></span></h3>
      <q-list v-if="clients && clients.length > 0">
        <q-item v-for="item in clients" :key="item.id">
          <q-item-section top avatar>
            <q-avatar>
              <img v-if="item.logo" :src="item.logo" /><img v-else src="https://droplet.netserve.in/clients-logo/default.png" />
            </q-avatar>
          </q-item-section>
          <q-item-section top>
            <q-item-label lines="1">{{ item.name }} </q-item-label>
            <q-item-label lines="1">{{ item.url }} </q-item-label>
          </q-item-section>
          <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn class="gt-xs" size="12px" flat dense round icon="delete" @click="delClient(item)" />
            <q-btn class="gt-xs" size="12px" flat dense round icon="edit" @click="editClient(item)" />
          </div>
        </q-item-section>
        </q-item>
      </q-list>
      <q-dialog v-model="clientModel">
        <q-card class="brlm-card" style="width:100vw">
          <h3 class="text-h6 text-center">{{(newClient.id) ? 'Update Client' : 'Add New Client'}}</h3>
          <q-card-section>
            <div class="row no-wrap items-center">
              <div class="col col-6 q-pa-md text-h6 ellipsis">
                <q-avatar @click="clLogoModel = true">
                  <img v-if="newClient.logo" :src="newClient.logo" /><img v-else src="https://droplet.netserve.in/clients-logo/default.png" />
                </q-avatar>
              </div>
            </div>
            <div class="row no-wrap items-center">
              <div class="col col-6 q-pa-md text-h6 ellipsis">
                <q-input v-model="newClient.name" label="Name" />
              </div>
            </div>
            <div class="row">
              <div class="q-pa-md col">
                <q-input v-model="newClient.url" label="URL" />
              </div>
            </div>

          </q-card-section>

          <q-card-actions align="right">
            <q-btn v-close-popup flat color="primary" :label="(!newHolding.id) ? 'Add' : 'Update'" @click="addClient" />
            <q-btn v-close-popup flat color="primary" label="Cancel" @click="resetClient" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="clLogoModel">
      <div class="col q-pa-md">
            <q-uploader
              label="Update Company Logo"
              field-name="logo"
              no-thumbnails
              auto-upload
              url="https://droplet.netserve.in/comp-client/logo"
              @uploaded = 'clLogoUpdate'
              style="max-width: 30%; width:30%"
            />
          </div>
      </q-dialog>
    </q-tab-panel>
    <q-tab-panel name="property">
      <h3 class="text-h5">Properties<span><q-btn round dense flat icon="add" @click="openPropertyModel" /></span></h3>
      <q-list v-if="properties && properties.length > 0">
        <q-item v-for="item in properties" :key="item.id">
          <q-item-section top class="col-2">
            <q-item-label>{{ item.type }}</q-item-label>
          </q-item-section>
          <q-item-section top>
            <q-item-label lines="1">{{ item.title }} </q-item-label>
            <q-item-label lines="1">{{ item.location }}, {{ item.city }}</q-item-label>
          </q-item-section>
          <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn class="gt-xs" size="12px" flat dense round icon="delete" @click="delProperty(item)" />
            <q-btn class="gt-xs" size="12px" flat dense round icon="edit" @click="editProperty(item)" />
          </div>
        </q-item-section>
        </q-item>
      </q-list>
      <q-dialog v-model="propertyModel">
        <q-card class="brlm-card" style="width:100vw">
          <h3 class="text-h6 text-center">{{ (newProperty.id) ? 'Update' : 'Add New Property' }}</h3>
          <q-card-section>
            <div class="row no-wrap items-center">
              <div class="col q-pa-md">
                <q-input v-model="newProperty.title" label="Title" />
              </div>
              <div class="col q-pa-md">
                <q-select
                  filled
                  v-model="newProperty.type"
                  :options="propertyTypes"
                  label="Property type"
                  >
                </q-select>
              </div>
              <div class="col q-pa-md">
                <q-input v-model="newProperty.purpose" label="Purpose" />
              </div>
            </div>
            <div class="row">
              <div class="q-pa-md col">
                <q-input v-model="newProperty.location" label="Address" />
              </div>
            </div>
            <div class="row">
              <div class="q-pa-md col">
                <q-input v-model="newProperty.detail" label="Description" />
              </div>
            </div>
            <div class="row">
              <div class="q-pa-md col">
                <q-input v-model="newProperty.city" label="City" />
              </div>
              <div class="q-pa-md col">
                <q-input v-model="newProperty.state" label="State" />
              </div>
            </div>
            <div class="row" v-if="newProperty.type === 'Leased'">
              <div class="q-pa-md col">
                <q-input v-model="newProperty.name_of_lessor" label="Name of Lessor" />
              </div>
              <div class="q-pa-md col">
                <q-input v-model="newProperty.rent_amount" label="Rent amount" />
              </div>
            </div>
            <div class="row" v-if="newProperty.type === 'Leased'">
              <div class="q-pa-md col">
                <q-input v-model="newProperty.lease_terms" label="Lease Terms" />
              </div>
            </div>

          </q-card-section>

          <q-card-actions align="right">
            <q-btn v-close-popup flat color="primary" :label="(!newProperty.id) ? 'Add' : 'Update'" @click="addProperty" />
            <q-btn v-close-popup flat color="primary" label="Cancel" @click="resetProperty" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-tab-panel>
    <q-tab-panel name="litigations">
      <h3 class="text-h5">Litigations<span><q-btn round dense flat icon="add" @click="litigationModel = true" /></span></h3>
      <q-list v-if="litigations && litigations.length > 0">
        <q-item v-for="item in litigations" :key="item.id">
          <q-item-section top class="col col-3">
            <q-item-label>{{ item.litigation_type }}</q-item-label>
          </q-item-section>
          <q-item-section top>
            <q-item-label lines="1">{{ item.details }} </q-item-label>
            <q-item-label lines="1" v-if="item.amount_involved" caption>Amount Involved:  &#8377;{{ item.amount_involved }}</q-item-label>
          </q-item-section>
          <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn class="gt-xs" size="12px" flat dense round icon="delete" @click="delLitigation(item)" />
            <q-btn class="gt-xs" size="12px" flat dense round icon="edit" @click="editLitigation(item)" />
          </div>
        </q-item-section>
        </q-item>
      </q-list>
      <q-dialog v-model="litigationModel">
        <q-card class="brlm-card" style="width:100vw">
          <h3 class="text-h6 text-center">{{ (newLitigation.id) ? 'Update' : 'Add New Litigation' }}</h3>
          <q-card-section>
            <div class="row no-wrap items-center">
             <div class="col q-pa-md">
                <q-select
                  filled
                  v-model="newLitigation.litigation_type"
                  :options="litigationTypes"
                  label="Litigation type"
                  >
                </q-select>
              </div>
            </div>
            <div class="row">
              <div class="q-pa-md col">
                <q-input v-model="newLitigation.details" label="Detail" />
              </div>
            </div>
            <div class="row">
              <div class="q-pa-md col">
                <q-input v-model="newLitigation.amount_involved" label="Amount" />
              </div>
              <div class="q-pa-md col">
                <q-input v-model="newLitigation.relevency" label="Relevency" />
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn v-close-popup flat color="primary" :label="(!newLitigation.id) ? 'Add' : 'Update'" @click="addLitigation" />
            <q-btn v-close-popup flat color="primary" label="Cancel" @click="resetLitigation" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-tab-panel>
  </q-tab-panels>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { axios } from '../boot/axios'

const props = defineProps({
    ipo_id: Number,
  })

const infoTab = ref()
const $q = useQuasar()
const ipo_id = ref(props.ipo_id)

//new roc office
const rocOffices = ref([])
const rocOfficeModel = ref(false)
const newRoc = ref({})

const addRoc = async() => {
  console.log(newRoc.value)
}

const resetRoc = () => {
  newRoc.value = {}
}

//company basic info
const compInfo = ref({ipo_id: ipo_id.value, brief_intro_html: '', business_info: ''})
const toolbar = [
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
        ['viewsource']
      ]
const saveInfo = async() => {
    let res = (compInfo.value.id) ?  await axios.put('https://droplet.netserve.in/comp-infos/'+compInfo.value.id, compInfo.value) : await axios.post('https://droplet.netserve.in/comp-infos', compInfo.value)
    if(res.status == 200 || res.status == 201) {
        $q.notify({
            message: 'Updated Successfully',
            icon: 'announcement'
            })
    }
  }

//historical events
const events = ref([])
const newEvent = ref({ipo_id: ipo_id.value, detail_html: ''})
const eventModel = ref(false)
const eventTypes = ['Award', 'Certificate', 'Milestone', 'Name Change', 'TurnOver', 'Takeover', 'Other']
const addEvent = async() => {
  console.log(newEvent.value)
  let res = (newEvent.value.id) ? await axios.put('https://droplet.netserve.in/comp-histories/'+newEvent.value.id, newEvent.value) :  await axios.post('https://droplet.netserve.in/comp-histories', newEvent.value)

  if(res.status == 201) events.value.push(res.data)
  if(res.status == 200 || res.status == 201) {
    newEvent.value = {ipo_id: ipo_id.value, detail_html: ''}
    $q.notify({
        message: 'Updated Successfully',
        icon: 'announcement'
        })
    }
}
const resetEvent = () => {
  newEvent.value = {ipo_id: ipo_id.value, detail_html: ''}
}

const editEvent = (item) => {
  newEvent.value = item
  eventModel.value = true
}

const delEvent = async(item) => {
  let res = await axios.delete('https://droplet.netserve.in/comp-histories/'+item.id)
  if(res.status == 204){
    events.value = events.value.filter(et => et.id != item.id)
  }
}

//holdings and subsidiaries
const holdings = ref([])
const newHolding = ref({ipo_id: ipo_id.value})
const holdingModel = ref(false)
const holdingTypes = ['Holding', 'Subsidiary', 'Joint venture', 'Associate', 'Other']

const addHolding = async() => {
  console.log(newHolding.value)
  let res = (newHolding.value.id) ? await axios.put('https://droplet.netserve.in/comp-holdings/'+newHolding.value.id, newHolding.value) : await axios.post('https://droplet.netserve.in/comp-holdings', newHolding.value)
  if(res.status == 200 || res.status == 201) {
    if (res.status == 201) holdings.value.push(res.data)
    newHolding.value = {ipo_id: ipo_id.value}
    $q.notify({
        message: 'Updated Successfully',
        icon: 'announcement'
        })
    }
}
const resetHolding = () => {
  newHolding.value = {ipo_id: ipo_id.value}
}

const editHolding = (item) => {
  newHolding.value = item
  holdingModel.value = true
}

const delHolding = async(item) => {
  let res = await axios.delete('https://droplet.netserve.in/comp-holdings/'+item.id)
  if(res.status == 204){
    holdings.value = holdings.value.filter(et => et.id != item.id)
  }
}

//clientele tab
const clients = ref([])
const newClient = ref({ipo_id: ipo_id.value})
const clLogoModel = ref(false)
const clientModel = ref(false)
const clLogoUpdate = async(files) => {
          let logo = JSON.parse(files.xhr.response)
          newClient.value.logo = logo
          clLogoModel.value = false
        }
const addClient = async() => {
  let res = (newClient.value.id) ? await axios.put('https://droplet.netserve.in/comp-clients/'+newClient.value.id, newClient.value) : await axios.post('https://droplet.netserve.in/comp-clients', newClient.value)

  if(res.status == 200 || res.status == 201) {
    if (res.status == 201) clients.value.push(res.data)
    newClient.value = {ipo_id: ipo_id.value}
    $q.notify({
        message: 'Updated Successfully',
        icon: 'announcement'
        })
  }
}

const resetClient = () => {
  newClient.value = {ipo_id: ipo_id.value}
}

const editClient = (item) => {
  newClient.value = item
  clientModel.value = true
}

const delClient = async(item) => {
  let res = await axios.delete('https://droplet.netserve.in/comp-clients/'+item.id)
  if(res.status == 204){
    clients.value = clients.value.filter(et => et.id != item.id)
  }
}

//property tab
const properties = ref([])
const newProperty = ref({ipo_id: ipo_id.value})
const propertyModel = ref(false)
const propertyTypes = ref(['Own', 'Leased', 'Intellectual'])

const openPropertyModel = () =>{
  newProperty.value = {ipo_id: ipo_id.value}
  propertyModel.value = true
}

const addProperty = async() => {
  let res = (newProperty.value.id) ? await axios.put('https://droplet.netserve.in/comp-properties/'+newProperty.value.id, newProperty.value) : await axios.post('https://droplet.netserve.in/comp-properties', newProperty.value)
  if(res.status == 200 || res.status == 201) {
    if (res.status == 201) properties.value.push(res.data)
    $q.notify({
        message: 'Updated Successfully',
        icon: 'announcement'
        })
  }
}

const resetProperty = () => {
  newProperty.value = {ipo_id: ipo_id.value}
}

const editProperty = (item) => {
  newProperty.value = item
  propertyModel.value = true
}

const delProperty = async(item) => {
  let res = await axios.delete('https://droplet.netserve.in/comp-properties/'+item.id)
  if(res.status == 204){
    properties.value = properties.value.filter(et => et.id != item.id)
  }
}

//Litigation Tab
const litigations = ref([])
const newLitigation = ref({ipo_id: ipo_id.value})
const litigationModel = ref(false)
const litigationTypes = ref(['Against Company', 'Against Promoters', 'Against Group Company', 'Against Directors', 'Others'])
const addLitigation = async() => {
  console.log(newLitigation.value)
  let res = (newLitigation.value.id) ? await axios.put('https://droplet.netserve.in/comp-litigations/'+newLitigation.value.id, newLitigation.value) : await axios.post('https://droplet.netserve.in/comp-litigations', newLitigation.value)
  console.log(res)
  if(res.status == 200 || res.status == 201) {
    if (res.status == 201) litigations.value.push(res.data)
    $q.notify({
        message: 'Updated Successfully',
        icon: 'announcement'
        })
    newLitigation.value = {ipo_id: ipo_id.value}
  }
}

const resetLitigation = () => {
  newLitigation.value = {ipo_id: ipo_id.value}
}

const editLitigation = (item) => {
  newLitigation.value = item
  litigationModel.value = true
}

const delLitigation = async(item) => {
  let res = await axios.delete('https://droplet.netserve.in/comp-litigations/'+item.id)
  if(res.status == 204){
    litigations.value = litigations.value.filter(et => et.id != item.id)
  }
}

onMounted(async() => {
  rocOffices.value = await axios.get('https://droplet.netserve.in/roc-offices?per-page=50').then(r => r.data)
  let info = await axios.get('https://droplet.netserve.in/comp-info?filter[ipoId][eq]='+ipo_id.value)
  if(info.data.length) compInfo.value = info.data[0]
  //console.log(info.data)
  events.value = await axios.get('https://droplet.netserve.in/comp-history?per-page=50&filter[ipoId][eq]='+ipo_id.value).then(r => r.data)
  holdings.value = await axios.get('https://droplet.netserve.in/comp-holding?per-page=50&filter[ipoId][eq]='+ipo_id.value).then(r => r.data)
  clients.value = await axios.get('https://droplet.netserve.in/comp-client?per-page=50&filter[ipoId][eq]='+ipo_id.value).then(r => r.data)
  properties.value = await axios.get('https://droplet.netserve.in/comp-properties?per-page=50&filter[ipoId][eq]='+ipo_id.value).then(r => r.data)
  litigations.value = await axios.get('https://droplet.netserve.in/comp-litigations?per-page=50&filter[ipoId][eq]='+ipo_id.value).then(r => r.data)
  console.log(litigations.value)
})

</script>

<style>

</style>
