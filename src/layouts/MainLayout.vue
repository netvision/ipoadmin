<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-black text-white">
        <a href="/"><q-img :src="logo" style="width: 180px" /></a>
        <q-space />
        <q-select
          use-input
          dark
          v-model="ipo"
          clearable
          :options="ipoOpts"
          option-label="company_name"
          label="Search IPO"
          @update:model-value="goTo"
          @filter="searchIpos"
          @filter-abort="abortSearch" />
          <q-space />
        <q-btn flat icon="home" to="/" />
        <q-btn flat label="GMP" to="/gmp" />
        <q-btn flat label="BuyBacks" to="/buybacks" />
        <q-btn-dropdown flat label="masters">
          <q-btn flat label="Sectors" to="/sectors" />
          <q-btn flat label="Registrars" to="/registrars" />
          <q-btn flat label="BLRMs" to="/brlms" />
          <q-btn flat label="Anchors" to="/anchors" />
        </q-btn-dropdown>
        <q-btn-dropdown flat icon="account_circle">
          <q-list>
            <q-item>
              <q-item-section>
                <q-btn unelevated square @click="changePw" label="Change Password" />
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                 <q-btn unelevated square @click="logout" label="Logout" />
              </q-item-section>
            </q-item>

          </q-list>
        </q-btn-dropdown>

      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-dialog v-model="changepwModel">
      <q-card style="width: 300px">
        <q-card-section>
          <div class="text-h6">Change Password</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
           <q-input square filled clearable v-model="curPassword" type="password" label="Current Password" />
          <q-input square filled clearable v-model="newPassword" type="password" label="New Password" />
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Change" v-close-popup @click="update" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import logo from '../assets/logo.png'
import { ref } from 'vue'
import { Auth } from '@aws-amplify/auth'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { axios } from '../boot/axios'

const router = useRouter()
const newPassword = ref('')
const curPassword = ref('')
const changepwModel = ref(false)
const ipo = ref()
const ipoOpts = ref([])
const $q = useQuasar()

const goTo = (v) => {
  router.push('/ipo/'+v.ipo_id)
}

const searchIpos = (val, update, abort) => {
  update(async() => {
    if(val.length > 1) {
      try {
        let res = await axios.get('https://droplet.netserve.in/ipos?fields=ipo_id,company_name&filter[company_name][like]='+val).then(r => r.data)
        ipoOpts.value = res
      }
      catch(e){
        console.log(e)
      }
    }
  })
}

const abortSearch = () => {
  ipoOpts.value = []
}

const update = async () => {

    let user = await Auth.currentAuthenticatedUser()
    try{
      const res = await Auth.changePassword(user, curPassword.value, newPassword.value)
      if(res === 'SUCCESS'){
        $q.notify({
          message: 'Password Changed Successfully',
          icon: 'announcement'
        })
      }
    }
    catch(err){
      $q.notify({
          message: 'Password Couldnt be Changed.'+err,
          icon: 'announcement'
        })
    }
}

const logout = async() => {
  try {
        await Auth.signOut();
        router.go()
    } catch (error) {
        console.log('error signing out: ', error);
    }
}

const changePw = () => changepwModel.value = true

</script>
