import Amplify from 'aws-amplify'
import { Auth } from '@aws-amplify/auth'
import awsconfig from '../aws-exports'
Amplify.configure(awsconfig)

export default ({ Vue, router }) => {
    router.beforeEach(async(to, from, next) => {
        if (to.matched.some(record => record.meta.requiresAuth)) {
            try {
              const isSignedIn = await Auth.currentAuthenticatedUser()
              if (isSignedIn) {
                next()
              } else {
                  console.log("not signed in")
                next('/auth/login')
              }
            } catch (error) {
              console.log(error)
              next('/auth/login')
            }
          } else {
            next()
          }
      
    })
}