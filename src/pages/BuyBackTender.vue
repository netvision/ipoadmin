<template>
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col-9"><h3 class="text-h3 q-mb-md">Recent Buybacks (Tender Route)</h3></div>
      <q-space />
      <div class="col text-right"><q-btn @click="openBuybackModel({price_type: 'fixed'})">Add New</q-btn></div>
    </div>
    <div class="row">
      <div class="col q-pa-md">
        <q-list v-if="buybacks.length > 0">
              <q-expansion-item popup v-for="bb in buybacks" :key="bb.id" :header-style="{ backgroundColor: '#f2e1c9', borderBottom: '1px solid ##9c5b05' }">
                <template v-slot:header>
                  <q-item-section>
                    <q-item-label class="text-h6">{{bb.company_name}}</q-item-label>
                    <q-item-label>Buyback Price: &#8377;{{bb.price_high}} <br /><span class="text-orange-9">Buyback Size: &#8377;{{curFormat(bb.issue_size_amount)}} ({{ bb.issue_size_shares }} shares)</span></q-item-label>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>Open Date: {{dateFormat(bb.open_date)}}</q-item-label>
                    <q-item-label>Close: {{dateFormat(bb.close_date)}}</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label>Record Date: {{dateFormat(bb.record_date)}}</q-item-label>
                    <q-item-label>Last Date to buy: {{dateFormat(bb.last_date_to_buy)}}</q-item-label>
                  </q-item-section>
                </template>
                <q-card>
                  <q-card-section>
                    <div class="q-pa-md">
                      <p class="col">Face Value: <strong>&#8377;{{ bb.face_value ?? 'NA' }}</strong></p>
                      <p class="col">Promoters participations: <strong>{{ bb.promotors_participation ?? 'NA' }}</strong></p>
                      <p class="col" v-if="bb.promotors_participation == 'Yes'">Promoters: No of Shares Entitled: <strong>{{ bb.promotors_shares_entitlement ?? 'NA' }}</strong></p>
                      <p class="col" v-if="bb.promotors_participation == 'Yes'">Promoters: No of Shares Willing to Tender: <strong>{{ bb.promotors_willing_to_tender ?? 'NA' }}</strong></p>
                      <p class="col">General Reserve: <strong>{{ bb.general_reserve ?? 'NA' }}</strong></p>
                      <p class="col">Securities Premium: <strong>{{ bb.securities_premium ?? 'NA' }}</strong></p>
                      <p class="col">Retained Earnings: <strong>{{ bb.retained_earnings ?? 'NA' }}</strong></p>
                      <p class="col">Equity Shares Nominal Value: <strong>{{ bb.equity_shares_nominal_value ?? 'NA' }}</strong></p>


                      <p class="col">Total Paidup Percent: <strong>{{bb.total_paidup_percent ?? 'NA'}}</strong></p>
                      <p class="col">Entitlement Ratio (Reserve): <strong>{{bb.entitlement_ratio_reserved ?? 'NA'}}</strong></p>
                      <p class="col">Entitlement Ratio (General): <strong>{{bb.entitlement_ratio_general ?? 'NA'}}</strong></p>
                      <p class="col">Acceptance Ratio (Reserved): <strong>{{bb.acceptance_ratio_reserved ?? 'NA'}}</strong></p>
                      <p class="col">Acceptance Ratio (General): <strong>{{bb.acceptance_ratio_general ?? 'NA'}}</strong></p>
                      <q-separator />
                      <p><strong>Important Dates</strong></p>
                      <q-separator />
                      <p>Announcement Date: <strong>{{ dateFormat(bb.announcement_date) }}</strong></p>
                      <p>Boardmeeting Date: <strong>{{ dateFormat(bb.boardmeeting_date) }}</strong></p>
                      <p>Postal ballot result date: <strong>{{ dateFormat(bb.postal_ballot_result_date) }}</strong></p>
                      <p>Last Date to buy: <strong>{{ dateFormat(bb.last_date_to_buy) }}</strong></p>
                      <p>Record Date: <strong>{{ dateFormat(bb.record_date) }}</strong></p>
                      <p>Open Date: <strong>{{ dateFormat(bb.open_date) }}</strong></p>
                      <p>Close Date: <strong>{{ dateFormat(bb.close_date) }}</strong></p>
                      <p>Finalisation Date: <strong>{{ dateFormat(bb.finalisation_date) }}</strong></p>
                      <p>Bids Settlement Date: <strong>{{ dateFormat(bb.bids_settlement_date) }}</strong></p>

                      <q-separator />
                      <p><strong>Documents</strong></p>
                      <q-separator />
                      <p>Offer Letter: {{ bb.offer_letter_pdf }}</p>
                      <p>Announcement: {{ bb.announcement_pdf }}</p>
                      <p>Final Acceptance: {{ bb.final_acceptance_pdf }}</p>
                    </div>
                  </q-card-section>
                  <q-card-actions>
                    <q-btn-group flat>
                      <q-btn icon="mdi-file-edit" label="edit"  @click="openBuybackModel(bb)" />
                    </q-btn-group>
                  </q-card-actions>
                </q-card>
              </q-expansion-item>
            </q-list>
            <q-dialog v-model="buybackModel">
              <q-card>
                <q-card-section>
                  <h5 class="text-h5">{{ newBuyback.id ? 'Update Buyback' : 'Add Buyback' }}</h5>
                  <q-tabs
                    v-model="tab"
                    dense
                    class="text-grey"
                    active-color="primary"
                    indicator-color="secondary"
                    align="justify"
                    narrow-indicator
                  >
                    <q-tab name="overview" label="Overview" />
                    <q-tab name="dates" label="Important Dates" />
                    <q-tab name="other_info" label="Other Info and Documents" />
                  </q-tabs>

                  <q-separator />
                    <q-tab-panels v-model="tab" animated>
                      <q-tab-panel name="overview">
                        <div class="row q-gutter-md">
                          <div class="col">
                            <q-input outlined v-model="newBuyback.company_name" label="Company Name" />
                          </div>
                        </div>
                        <div class="row q-gutter-md q-mt-md">
                          <div class="col"><q-input outlined v-model="newBuyback.bse_code" label="BSE Code" /></div>
                          <div class="col"><q-input outlined v-model="newBuyback.nse_code" label="NSE Code" /></div>
                        </div>
                        <div class="row q-gutter-md q-mt-md">
                          <div class="col-3"><q-select outlined v-model="newBuyback.price_type" :options="['fixed', 'upto']" label="Price Type" /></div>
                          <div class="col">
                            <q-input outlined v-model="newBuyback.price_high" :label="(newBuyback.price_type == 'upto') ? 'Price Upto' : 'Price'" type="number">
                              <template v-slot:prepend>
                                &#8377;
                              </template>
                            </q-input>
                          </div>
                          <div class="col" v-if="newBuyback.price_type && newBuyback.price_type == 'upto'">
                            <q-input outlined v-model="newBuyback.price_low" label="Price Final" type="number">
                              <template v-slot:prepend>
                                &#8377;
                              </template>
                            </q-input>
                          </div>
                        </div>
                        <div class="row q-gutter-md q-mt-md">
                          <div class="col"><q-input outlined v-model="newBuyback.issue_size_shares" label="Issue Size (Shares)" @blur="sanitizeQty" /></div>
                          <div class="col">
                            <q-input outlined v-model="newBuyback.issue_size_amount" label="Issue Size (Amount)" @blur="sanitizeAmt">
                              <template v-slot:prepend>
                                &#8377;
                              </template>
                            </q-input>
                          </div>
                          <div class="col-3">
                            <q-input outlined v-model="newBuyback.face_value" label="Face Value">
                              <template v-slot:prepend>
                                &#8377;
                              </template>
                            </q-input>
                          </div>
                        </div>
                        <div class="row q-gutter-md q-mt-md">
                          <div class="col"><q-select outlined v-model="newBuyback.promotors_participation" :options="['No', 'Yes']" label="Promoters Participation" /></div>
                          <div class="col" v-if="newBuyback.promotors_participation == 'Yes'"><q-input outlined v-model="newBuyback.promotors_shares_entitlement" label="No. of Shares Entitled" /></div>
                          <div class="col" v-if="newBuyback.promotors_participation == 'Yes'"><q-input outlined v-model="newBuyback.promotors_willing_to_tender" label="Willing to Tender" /></div>
                        </div>
                        <div class="row q-gutter-md q-mt-md">
                          <div class="col"><p>Reserve Details</p></div>
                        </div>
                        <div class="row q-gutter-md">
                          <div class="col">
                              <q-input outlined v-model="newBuyback.securities_premium" label="Securities Premium" />
                          </div>
                          <div class="col">
                              <q-input outlined v-model="newBuyback.retained_earnings" label="Retained Earnings" />
                          </div>
                        </div>
                        <div class="row q-gutter-md">
                          <div class="col">
                              <q-input outlined v-model="newBuyback.equity_shares_nominal_value" label="Equity Shares Nominal Value" />
                          </div>
                          <div class="col">
                              <q-input outlined v-model="newBuyback.general_reserve" label="General Reserve" />
                          </div>
                        </div>
                        <div class="row q-gutter-md q-mt-md">
                          <div class="col"><q-input outlined v-model="newBuyback.total_paidup_percent" label="Total Paidup Percent" /></div>
                        </div>

                        <div class="row q-gutter-md q-mt-md">
                          <div class="col">
                          <q-select filled v-model="newBuyback.registrar_id" :options="registrars" option-value="id" option-label="name" label="Registrar" emit-value map-options>
                            <template v-slot:after>
                              <q-btn round dense flat icon="add" @click="registrarModel = true" />
                            </template>
                          </q-select>
                          <q-dialog v-model="registrarModel">
                            <q-card class="my-card" style="width:100vw">
                              <h3 class="text-h6 text-center">Add New Registrar</h3>
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
                                <q-btn v-close-popup flat color="primary" label="Add" @click="addRegistrar" />
                                <q-btn v-close-popup flat color="primary" label="Cancel" @click="resetRegistrarForm" />
                              </q-card-actions>
                            </q-card>
                          </q-dialog>
                        </div>
                        <div class="col">
                          <q-select filled v-model="newBuyback.manager_id" :options="brlms" option-value="id" option-label="name" label="Manager" emit-value map-options>
                            <template v-slot:after>
                              <q-btn round dense flat icon="add" @click="managerModel = true" />
                            </template>
                          </q-select>
                          <q-dialog v-model="managerModel">
                            <q-card class="brlm-card" style="width:100vw">
                              <h3 class="text-h6 text-center">Add New Manager</h3>
                              <q-card-section>
                                <div class="row no-wrap items-center">
                                  <div class="col text-h6 ellipsis">
                                    <q-input v-model="newBrlm.name" label="Name" />
                                  </div>
                                </div>
                                <div class="row no-wrap items-center">
                                  <div class="col text-h6 ellipsis">
                                    <q-input v-model="newBrlm.url" label="URL" type="url" />
                                  </div>
                                </div>
                              </q-card-section>

                              <q-card-actions align="right">
                                <q-btn v-close-popup flat color="primary" label="Add" @click="addBrlm" />
                                <q-btn v-close-popup flat color="primary" label="Cancel" @click="resetBrlmForm" />
                              </q-card-actions>
                            </q-card>
                          </q-dialog>
                        </div>
                      </div>
                      </q-tab-panel>
                      <q-tab-panel name="dates">
                        <div class="row q-gutter-md q-mt-md">
                          <div class="col">
                            <q-input outlined v-model="newBuyback.announcement_date" label="Announcement Date">
                            <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                                  <q-date v-model="newBuyback.announcement_date" mask="YYYY-MM-DD">
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
                            <q-input outlined v-model="newBuyback.boardmeeting_date" label="Boardmeeting Date">
                            <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                                  <q-date v-model="newBuyback.boardmeeting_date" mask="YYYY-MM-DD">
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
                            <q-input outlined v-model="newBuyback.postal_ballot_result_date" label="Postal Ballot Result Date">
                            <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                                  <q-date v-model="newBuyback.shareholder_approval_date" mask="YYYY-MM-DD">
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

                        <div class="row q-gutter-md q-mt-md">
                          <div class="col">
                            <q-input outlined v-model="newBuyback.last_date_to_buy" label="Last Date to Buy">
                            <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                                  <q-date v-model="newBuyback.last_date_to_buy" mask="YYYY-MM-DD">
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
                            <q-input outlined v-model="newBuyback.record_date" label="Record Date">
                            <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                                  <q-date v-model="newBuyback.record_date" mask="YYYY-MM-DD">
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

                        <div class="row q-gutter-md q-mt-md">
                          <div class="col">
                            <q-input outlined v-model="newBuyback.open_date" label="Open Date">
                            <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                                  <q-date v-model="newBuyback.open_date" mask="YYYY-MM-DD">
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
                            <q-input outlined v-model="newBuyback.close_date" label="Close Date">
                            <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                                  <q-date v-model="newBuyback.close_date" mask="YYYY-MM-DD">
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
                        <div class="row q-gutter-md q-mt-md">
                          <div class="col">
                            <q-input outlined v-model="newBuyback.finalisation_date" label="Finalisation Date">
                            <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                                  <q-date v-model="newBuyback.finalisation_date" mask="YYYY-MM-DD">
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
                            <q-input outlined v-model="newBuyback.bids_settlement_date" label="Bids Settlement Date">
                            <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                                  <q-date v-model="newBuyback.bids_settlement_date" mask="YYYY-MM-DD">
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
                      </q-tab-panel>
                      <q-tab-panel name="other_info">
                        <div class="row q-gutter-md q-mt-md">
                          <div class="col">
                            <q-input outlined v-model="newBuyback.entitlement_ratio_reserved" label="Entitlement Ratio (Reserved)" />
                          </div>
                          <div class="col">
                            <q-input outlined v-model="newBuyback.entitlement_ratio_general" label="Entitlement Ratio (General)" />
                          </div>
                        </div>
                        <div class="row q-gutter-md q-mt-md">
                          <div class="col">
                            <q-input outlined v-model="newBuyback.acceptance_ratio_reserved" label="Acceptance Ratio (Reserved)" />
                          </div>
                          <div class="col">
                            <q-input outlined v-model="newBuyback.acceptance_ratio_general" label="Acceptance Ratio (General)" />
                          </div>
                        </div>
                        <div v-if="newBuyback.id">
                          <div class="row q-gutter-md">
                            <div class="col q-pa-md" v-if="!newBuyback.offer_letter_pdf">
                              <q-btn flat color="primary" label="Upload pdf file of Offer Letter" @click="openUploadModel('offer_letter')" />
                            </div>
                            <div class="col q-pa-md" v-else>
                              <q-item>
                                <q-item-section top>
                                  <q-item-label>
                                    <span class="text-weight-medium">Offer Letter (Pdf)</span>
                                  </q-item-label>
                                  <q-item-label caption lines="1">
                                    {{newBuyback.offer_letter_pdf.slice(33)}}
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section top side>
                                  <div class="text-grey-8 q-gutter-xs">
                                    <q-btn class="gt-xs" size="12px" flat dense round icon="open_in_new" type="a" :href="newBuyback.offer_letter_pdf" target="__blank" />
                                    <q-btn class="gt-xs" size="12px" flat dense round icon="change_circle" @click="openUploadModel('offer_letter')" />
                                  </div>
                                </q-item-section>
                              </q-item>
                            </div>

                          </div>
                          <div class="row q-gutter-md">
                            <div class="col q-pa-md" v-if="!newBuyback.announcement_pdf">
                              <q-btn flat color="primary" label="Upload pdf file of Announcement" @click="openUploadModel('announcement')" />
                            </div>
                            <div class="col q-pa-md" v-else>
                              <q-item>
                                <q-item-section top>
                                  <q-item-label>
                                    <span class="text-weight-medium">Announcement (Pdf)</span>
                                  </q-item-label>
                                  <q-item-label caption lines="1">
                                    {{newBuyback.announcement_pdf.slice(33)}}
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section top side>
                                  <div class="text-grey-8 q-gutter-xs">
                                    <q-btn class="gt-xs" size="12px" flat dense round icon="open_in_new" type="a" :href="newBuyback.announcement_pdf" target="__blank" />
                                    <q-btn class="gt-xs" size="12px" flat dense round icon="change_circle" @click="openUploadModel('announcement')" />
                                  </div>
                                </q-item-section>
                              </q-item>
                            </div>
                          </div>
                          <div class="row q-gutter-md">
                            <div class="col q-pa-md" v-if="!newBuyback.final_acceptance_pdf">
                              <q-btn flat color="primary" label="Upload pdf file of Final Acceptance" @click="openUploadModel('final_acceptance')" />
                            </div>
                            <div class="col q-pa-md" v-else>
                              <q-item>
                                <q-item-section top>
                                  <q-item-label>
                                    <span class="text-weight-medium">Final Acceptance (Pdf)</span>
                                  </q-item-label>
                                  <q-item-label caption lines="1">
                                    {{newBuyback.final_acceptance_pdf.slice(33)}}
                                  </q-item-label>
                                </q-item-section>
                                <q-item-section top side>
                                  <div class="text-grey-8 q-gutter-xs">
                                    <q-btn class="gt-xs" size="12px" flat dense round icon="open_in_new" type="a" :href="newBuyback.final_acceptance_pdf" target="__blank" />
                                    <q-btn class="gt-xs" size="12px" flat dense round icon="change_circle" @click="openUploadModel('final_acceptance')" />
                                  </div>
                                </q-item-section>
                              </q-item>
                            </div>
                          </div>
                          <q-dialog v-model="pdfUpload">
                            <q-uploader
                              label="Upload PDF"
                              field-name="pdf_file"
                              no-thumbnails
                              auto-upload
                              :form-fields = "[{name:'ipo_id', value: newBuyback.id}, {name:'field', value: form_fields}]"
                              url="https://droplet.netserve.in/ipo/pdfupload"
                              @uploaded = 'pdfUploaded'
                            />
                          </q-dialog>
                        </div>
                      </q-tab-panel>
                    </q-tab-panels>
                </q-card-section>
                <q-separator />
                <q-card-actions align="right">
                  <q-btn flat color="primary" :label="(newBuyback.id) ? 'Edit' : 'Add'" @click="saveBuyback"/>
                  <q-btn v-close-popup flat color="primary" round icon="close" @click="closeBuybackModal" />
                </q-card-actions>
              </q-card>
            </q-dialog>
      </div>
    </div>
  </q-page>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { axios } from '../boot/axios'
const buybacks = ref([])
const newBuyback = ref({price_type: 'fixed'})
const buybackModel = ref(false)
const managerModel = ref(false)
const registrarModel = ref(false)
const tab = ref('overview')
const pdfUpload = ref(false)
const form_fields = ref([])

const openUploadModel = (field) => {
  form_fields.value = field
  pdfUpload.value = true
}

const pdfUploaded = async(files) =>{
    const id = newBuyback.value.id
    newBuyback.value[form_fields.value+'_pdf'] = JSON.parse(files.xhr.response)
    //const res = await axios.put('https://droplet.netserve.in/buyback-tenders/'+id, {basis_of_allotment_pdf: pdf_url.value})
    console.log(newBuyback.value)
    pdfUpload.value = false
  }


const registrars = ref([])
const brlms = ref([])
const newRg = ref({})
const newBrlm = ref({})

const addRegistrar = async() =>{
  const newReg = await axios.post('https://droplet.netserve.in/registrars', newRg.value).then(r => r.data)
  registrars.value.push(newReg)
  newBuyback.value.registrar_id = newReg.id
}
const resetRegistrarForm = () => {
  newRg.value = {}
}

const addBrlm = async() => {
  const newBr = await axios.post('https://droplet.netserve.in/brlms', newBrlm.value).then(r => r.data)
  brlms.value.push(newBr)
  newBuyback.value.manager_id = newBr.id
  //overview.value.brlms = (overview.value.brlms.length > 0) ? overview.value.brlms.push(newBr) : [newBr]
}

const resetBrlmForm = () => {
  newBrlm.value= {}
}

const openBuybackModel = (buyback) => {
  newBuyback.value = buyback
  buybackModel.value = true
}

const saveBuyback = async() => {
  let res = (newBuyback.value.id) ?  await axios.put('https://droplet.netserve.in/buyback-tenders/'+newBuyback.value.id, newBuyback.value) : await axios.post('https://droplet.netserve.in/buyback-tenders', newBuyback.value)
  if(res.status == 201) buybacks.value.push(res.data)
  buybackModel.value = false
}

const closeBuybackModal = () => {
  buybackModel.value = false
  newBuyback.value = {price_type: 'fixed'}
}


const curFormat = (val) => {
    return (val/10000000).toFixed(2) + ' Cr';
}

const dateFormat = (dateString) => {
    if(dateString != null){
	    const date = new Date(dateString)
	    return new Intl.DateTimeFormat('default', {dateStyle: 'medium'}).format(date)
    }
    else return ''
}

const sanitizeAmt = () => {
  newBuyback.value.issue_size_amount = Math.abs(newBuyback.value.issue_size_amount.replace(/(,|[^\d.-]+)+/g, ''))
  if(!newBuyback.value.issue_size_shares && newBuyback.value.price_high) {
    newBuyback.value.issue_size_shares = Math.round(newBuyback.value.issue_size_amount / +newBuyback.value.price_high)
  }
}

const sanitizeQty = () => {
  newBuyback.value.issue_size_shares = Math.abs(newBuyback.value.issue_size_shares.replace(/(,|[^\d.-]+)+/g, ''))
  if(!newBuyback.value.issue_size_amount && newBuyback.value.price_high) {
    newBuyback.value.issue_size_amount = newBuyback.value.issue_size_shares * +newBuyback.value.price_high
  }
}

onMounted(async() => {
  buybacks.value = await axios.get('https://droplet.netserve.in/buyback-tenders').then( r => r.data)
  //console.log(buybacks.value)
  registrars.value = await axios.get('https://droplet.netserve.in/registrars').then(r => r.data)
  brlms.value = await axios.get('https://droplet.netserve.in/brlms').then(r => r.data)
})
</script>

