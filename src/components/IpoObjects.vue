<template>
  <h3 class="text-h5">Objects of the IPO<span><q-btn round dense flat icon="add" @click="objectModel = true" /></span></h3>
      <q-list v-if="objects && objects.length > 0">
        <q-item v-for="item in objects" :key="item.id">
          <q-item-section top class="col col-3">
            <q-item-label>&#8377;{{ convtToCr(item.amount) }}Cr.</q-item-label>
            <q-item-label>{{ getPerc(item.amount) }}%</q-item-label>
          </q-item-section>
          <q-item-section top>
            <q-item-label lines="1">{{ item.title?.title }} </q-item-label>
            <q-item-label lines="1" v-if="item.details" caption>{{ item.details }}</q-item-label>
          </q-item-section>
          <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn class="gt-xs" size="12px" flat dense round icon="delete" @click="delObject(item)" />
            <q-btn class="gt-xs" size="12px" flat dense round icon="edit" @click="editObject(item)" />
          </div>
        </q-item-section>
        </q-item>
        <q-item>
          Total &#8377;{{ total }}Cr.
        </q-item>
      </q-list>
      <q-dialog v-model="objectModel">
        <q-card class="brlm-card" style="width:100vw">
          <h3 class="text-h6 text-center">{{ (newObject.id) ? 'Update' : 'Add New Object' }}</h3>
          <q-card-section>
            <div class="row">
              <div class="q-pa-md col">
                <q-select
                  v-model="newObject.title"
                  :options="titles"
                  option-value="id"
                  option-label="title"
                  label="Heading"
                  map-options
                  >
                  <template v-slot:after>
                    <q-btn round dense flat icon="add" @click="addTitleModel = true" />
                  </template>
                </q-select>
                <q-dialog v-model="addTitleModel">
                  <q-card class="brlm-card" style="width:100vw">
                    <h3 class="text-h6 text-center">Add New Heading</h3>
                    <q-card-section>
                      <div class="row no-wrap items-center">
                        <div class="col text-h6 ellipsis">
                          <q-input v-model="newTitle" label="Heading" />
                        </div>
                      </div>
                    </q-card-section>

                    <q-card-actions align="right">
                      <q-btn v-close-popup flat color="primary" label="Add" @click="addTitle" />
                      <q-btn v-close-popup flat color="primary" label="Cancel" @click="resetTitle" />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
              </div>
              <div class="q-pa-md col">
                <q-input v-model="newObject.amount" label="Amount" />
              </div>
            </div>
            <div class="row">
              <div class="q-pa-md col">
                <q-input v-model="newObject.details" label="Detail" />
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn v-close-popup flat color="primary" :label="(!newObject.id) ? 'Add' : 'Update'" @click="saveObject" />
            <q-btn v-close-popup flat color="primary" label="Cancel" @click="resetObject" />
          </q-card-actions>
        </q-card>
      </q-dialog>
</template>

<script setup>
import { ref, onMounted, computed} from 'vue'
import { useQuasar } from 'quasar'
import { api, axios } from '../boot/axios'

const props = defineProps({
    ipo_id: Number,
  })
const $q = useQuasar()
const objects = ref([])
const titles = ref([])
const newObject = ref({ipo_id: props.ipo_id})
const objectModel = ref(false)
const issueSize = ref()
const addTitleModel = ref(false)
const newTitle = ref('')

const addTitle = async() => {
  let res = await axios.post('https://api.ipoinbox.com/ipo-object-titles', {title: newTitle.value})
  if(res){
    titles.value.push(res.data)
    newObject.value.title_id = res.data.id
  }
  addTitleModel.value = false
}

const resetTitle = () => {
  newTitle.value = {}
  addTitleModel.value = false
}

const toolbar = [
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        ['left', 'center', 'right', 'justify'],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
        ['viewsource']
      ]

const saveObject = async() => {
  let item = newObject.value
  item.title_id = item.title.id
  if(!item.id) delete item.title

  let res = (item.id) ? await axios.put('https://api.ipoinbox.com/ipo-objects/'+item.id, item) : await axios.post('https://api.ipoinbox.com/ipo-objects?expand=title', item)
  if(res.status == 200 || res.status == 201) {
    if (res.status == 201) {
      objects.value.push(res.data)
    }
    $q.notify({
        message: 'Updated Successfully',
        icon: 'announcement'
        })
    newObject.value = {ipo_id: props.ipo_id}
  }

}

const resetObject = () => {
  newObject.value = {ipo_id: props.ipo_id}
}

const editObject = (item) => {
  newObject.value = item
  objectModel.value = true
}

const delObject = async(item) => {
  let res = await axios.delete('https://api.ipoinbox.com/ipo-objects/'+item.id)
  if(res.status == 204){
    objects.value = objects.value.filter(et => et.id != item.id)
  }
}

const convtToCr = (fig) => parseFloat((fig/10000000).toFixed(3))

const getPerc = (fig) => parseFloat((fig*100/issueSize.value).toFixed(2))

const total = computed({
  get(){
    let fig = 0
    if(objects.value.length > 0){
      fig = objects.value.reduce((acc, itm) => acc + Number(itm.amount), 0)
    }
    return convtToCr(fig)
  }
})

onMounted(async() => {
  objects.value = await axios.get('https://api.ipoinbox.com/ipo-objects?expand=title&filter[ipoId][eq]='+props.ipo_id).then(r => r.data)
  titles.value = await axios.get('https://api.ipoinbox.com/ipo-object-titles').then(r => r.data)
  let ipo = await axios.get('https://api.ipoinbox.com/ipos/'+props.ipo_id+'?fields=issue_size').then(r => r.data)
  issueSize.value = 10000000 * Number(ipo.issue_size)
})
</script>

<style>

</style>
