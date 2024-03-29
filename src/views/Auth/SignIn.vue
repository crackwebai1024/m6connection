<template>
  <auth-layout>
    <template #nav-btn>
      <router-link
        class="float-right text-dec-none"
        :to="{ name: 'auth.SignUp' }"
      >
        <v-btn
          class="custom-blue-text"
          text
        >
          Sign Up
        </v-btn>
      </router-link>
    </template>
    <template #header>
      <div class="d-flex justify-center">
        <h1 class="custom-blue-text text-xs-6">
          {{ $t('SignIn.title') }}
        </h1>
      </div>
      <div class="d-flex justify-center">
        <span class="custom-blue-text">
          {{ $t('SignIn.subtitle') }}
        </span>
      </div>
    </template>
    <template #body>
      <v-form ref="form">
        <v-container class="pb-0" >
          <v-row justify="center">
            <v-col
              cols="10"
              class="pb-0"
            >
              <v-flex>
                <v-text-field
                  v-model="user.email"
                  dark
                  :label="$t('SignIn.email')"
                  :rules="rules.email"
                />
              </v-flex>

              <v-flex>
                <v-text-field
                  v-model="user.password"
                  :append-icon="showPass ? 'mdi-eye-outline' : 'mdi-eye-off'"
                  counter
                  dark
                  :hint="$t('SignIn.minCharacters', { num: '8' })"
                  :label="$tc('SignIn.password', 1)"
                  :rules="[rules.required, rules.min]"
                  :type="showPass ? 'text' : 'password'"
                  @click:append="onPasswordClick"
                  @keyup.enter="SignIn"
                />
              </v-flex>


            </v-col>
          </v-row>
        </v-container>
      </v-form>

      <m6-loading :loading="loading" />

    </template>

    <template #action-btn>
      <div class="flex-center ">
        <v-btn
          color="#a4ceea"
          @click="SignIn"
          block
        >
          <span class="black--text">{{ $t('SignIn.login') }}</span>
        </v-btn>
      </div>
    </template>
  </auth-layout>
</template>

<script>
import AuthLayout from '@/components/Auth/AuthLayout'
import { mapActions, mapMutations } from 'vuex'

export default {
  components: {
    AuthLayout
  },
  data: () => ({
    screen: {},
    customBlue: '#a4ceea',
    loading: false,
    user: {
      email: '',
      password: ''
    },
    showPass: false,
    rules: {
      required: value => !!value || 'Required.',
      counter: value => value.length <= 20 || 'Max 20 characters',
      min: v => v.length >= 8 || 'Min 8 characters',
      email: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ]
    }
  }),
  methods: {
    ...mapActions('Auth', {
      userSignIn: 'signin'
    }),
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger'
    }),
    onPasswordClick() {
      this.showPass = !this.showPass
    },
    async SignIn() {
      this.loading = true
      if (!this.$refs.form.validate()) {
        this.notifDanger('Please fill in both fields')
        this.loading = false
        return
      } else {
        try {
          await this.userSignIn(this.user)
          const { data: userLogged } = await this.$store.dispatch('Auth/getUserData')

          // Start GSChat
          await this.$store.dispatch('GSChat/getGSToken', userLogged)
          
          const user = {
            id: userLogged.id,
            name: `${userLogged.firstName} ${userLogged.lastName}`,
            image: userLogged.profilePic
          }
          await this.$store.dispatch('GSChat/setUser', user)
          await this.$store.dispatch('GSChat/retrieveChats', userLogged.id)

          // Start GSFeed
          await this.$store.dispatch('GSFeed/getGSFeedToken', userLogged)
          await this.$store.dispatch('GSFeed/setUser', user)


          this.loading = false
          this.$router.push({ name: 'home' })
        } catch (error) {
          if( this.$h.dg(error, 'type', '') == "UserNotConfirmedException" ) {

            this.$router.push({
              name: 'auth.SignUp',
              query: { email: this.user.email }
            })
          } else {
            this.notifDanger(this.$t('SignIn.error.signin'))
          }
          this.loading = false
        }
      }
    },
    getQueryParams() {
      const email = this.$h.dg(this.$route, 'query.email', '')
      if (email) {
        this.user.email = email
      }
    }
  },
  mounted() {
    this.getQueryParams()
  }
}
</script>

<style lang="scss" scoped >
.bottom-logo {
    width: 25%;
    height: auto;
}
.custom-blue-text {
  color: #a4ceea !important;
}
.header-btns {
    float: right;
}
.text-dec-none {
    text-decoration: none;
}
.float-right {
    float: right;
}

.flex-center {
  display: flex;
  display: -webkit-flex;
  display: -ms-flexbox;
  justify-content: center;
  .v-btn--block {
    display: block;
    flex: 0;
    min-width: 70% !important;
  }
}

</style>
