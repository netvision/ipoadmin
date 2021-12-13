<template>
    <q-page class="flex flex-center">
        <q-card square bordered class="q-pa-lg shadow-1">
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input square filled clearable v-model="email" type="email" label="email" />
              <q-input square filled clearable v-model="password" type="password" label="password" />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn unelevated color="light-green-7" size="lg" class="full-width" label="Login" @click="login" />
          </q-card-actions>
          
        </q-card>
    </q-page>
</template>
<script setup>
import { Auth } from '@aws-amplify/auth'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()
const login = async() =>{
    try {
        const user = await Auth.signIn(email.value, password.value);
        console.log(user)
        router.push('/')
    } catch (error) {
        console.log('error signing in', error);
    }
}

onMounted(async()=>{
  const isSignedIn = await Auth.currentAuthenticatedUser()
  if(isSignedIn) {router.push('/')}
})
</script>