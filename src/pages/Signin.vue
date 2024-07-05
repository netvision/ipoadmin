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
    <q-dialog v-model='changepw'>
      <q-card style="width: 300px">
        <q-card-section>
          <div class="text-h6">Please Change your Password</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input square filled clearable v-model="newPassword" type="password" label="New Password" />
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Change" v-close-popup @click="update" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const changepw = ref(false)
const email = ref('')
const password = ref('')
const user = ref({})
const router = useRouter()
const newPassword = ref('')
const login = async() =>{
   /*
    try {
        user.value = await Auth.signIn(email.value, password.value);
        if(user.value.challengeName === 'NEW_PASSWORD_REQUIRED'){
          changepw.value = true
        }
        else{
        console.log(user.value.challengeName)
        router.push('/')
        }
    } catch (error) {
        console.log('error signing in', error);
    }
        */
}

const update = async() => {
  /*
  console.log(user.value)
  try{
    const upUser = await Auth.completeNewPassword(
      user.value,
      newPassword.value,
      {}
    )
    console.log(upUser)
    router.push('/')
  }
  catch (error) {
    console.log(error)
  }
    */
}

onMounted(async()=>{
  /*
  const isSignedIn = await Auth.currentAuthenticatedUser()
  if(isSignedIn) {router.push('/')}
  */
})
</script>
