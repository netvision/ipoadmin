<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-black text-white">
        <a href="/"><q-img :src="logo" style="width: 180px" /></a>
        <q-toolbar-title>
          Admin Dashboard
        </q-toolbar-title>
        <q-btn flat round dense icon="logout" @click="logout" />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>


import logo from '../assets/logo.png'
import { defineComponent, ref } from 'vue'
import { Auth } from '@aws-amplify/auth'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'MainLayout',

  components: {
    
  },

  setup () {
    
    const router = useRouter()
    return {
      logo,
      
      async logout(){
        try {
            await Auth.signOut();
            router.go()
        } catch (error) {
            console.log('error signing out: ', error);
        }
      }
    }
  }
})
</script>
