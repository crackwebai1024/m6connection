<template>
  <div class="text-center">
    <v-dialog
      v-model="show"
      :width=" $vuetify.breakpoint.smAndDown ? '60vw' : '40vw' "
      persistent
    >
      <v-card>
        <v-card-text>
          <v-form ref="form" >
            <v-container>
              <v-row>
                <v-col col-xs-12 >

                  <div class="flex-column justify-end" >
                    <m6-upload 
                      btnButton="purple" 
                      @response="reponseProfileImg" 
                      @loading="loading = !loading" 
                    >
                      <v-icon>mdi-cloud-upload</v-icon>
                    </m6-upload>
                  </div>

                  <div class="flex-column flex-center" >

                    <img v-if="$h.dg(user, 'profilePic')" :src="$h.dg(user, 'profilePic')" class="round-img" alt="user profile image">

                    <v-icon v-else size="10rem"  >mdi-account-circle</v-icon>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col col-xs-12 col-md-6 >
                  <v-text-field v-model="user.firstName" label="First Name" :rules="formRules" />
                </v-col>
                <v-col col-xs-12 col-md-6 >
                  <v-text-field v-model="user.lastName" label="Last Name" :rules="formRules" />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            text
            @click="$emit('close')"
          >
            close
          </v-btn>
          <v-btn
            color="green"
            class="white--text"
            @click="updateUser"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <m6-loading :loading="loading" />
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
  props: {
    show: {
      default: false, 
      type: Boolean
    },
    isCurrentUser: {
      default: false,
      type: Boolean
    }
  },
  data: () => ({
    formRules: [ v => !!v || 'Name is required' ],
    loading: false,
    user: {}
  }),
  methods: {
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess' 
    }),
    ...mapActions('Auth', {
      updateUserData: 'updateUserData'
    }),
    ...mapActions('GSFeed', {
      updUser: 'updateUser'
    }),
    async reponseProfileImg(res) {
      if(res.ok) {
        this.user.profilePic = res.data.link

        try {
          this.loading = true
          await this.updateUserData(this.user)
          this.loading = false
          this.notifSuccess('Updated!')
        } catch(e) {
          this.notifDanger('There was an error while saving the file')  
        }
        
      } else {
        this.notifDanger('There was an error while saving the file')
      }
    },
    validate() {
      return this.$refs.form.validate()
    },
    async updateUser() {
      if( !this.validate() ) {
        this.notifDanger('Please fill in all of the fields')
        return 
      }
      
      try{
        this.loading = true
        await this.updateUserData(this.user)
        await this.updUser({
          id: this.user.id,
          name: `${this.user.firstName} ${this.user.lastName}`,
          image: this.user.profilePic
        })
        this.loading = false
        this.notifSuccess('The user was saved')
        this.$emit('close')
      } catch(e) {
        this.notifDanger('There was an error while saving the user')
      }
      
    }
  },
  computed: {
    ...mapState('Auth', {
      currentUser: 'user'
    }),
    ...mapState('UserSettingsControl', {
      userSettingsToShow: "userToShow"
    }),
  },
  watch: {

    show(){
      if( this.isCurrentUser ) {
        this.user = {...this.currentUser}
      } else {
        this.user = {...this.userSettingsToShow.user}
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.round-img {
  object-fit: cover;
  border-radius: 50%;
  width: 10rem;
  height: 10rem;
  margin-bottom: -0.5rem;
}
</style>

