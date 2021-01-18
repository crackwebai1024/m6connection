<template>
  <div class="text-center">
    <v-dialog
      v-model="show"
      width="60vw"
      persistent
    >
      <v-card>
        <v-card-title class="headline blue darken-2 white--text">
          Want to join a new company?
          <v-spacer />
          <v-btn color="white" icon @click="$emit('close')" >
              <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
            <v-form ref="form" >
                <v-autocomplete
                    :items="filteredCompanies"
                    item-text="name"
                    item-value="id"
                    return-object
                    v-model="newCompanyToJoin"
                    :label="$t('SignUp.companyName')"
                    :rules="[rules.required]"
                    required
                />
            </v-form>

        </v-card-text>

        <v-card-actions>
            <v-spacer />
            <v-btn color="green darken-2" class="white--text" @click="joinCompany" >
                Join!
            </v-btn>
        </v-card-actions>       
      </v-card>
      <m6-loading :loading="loading" />
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
export default {
    props: {
        show: {
            default: false,
            type: Boolean
        }
    },
    data: () => ({
        loading: false,
        newCompanyToJoin: {},
        rules: {
            required: value => !!value || 'Required'
        }
    }),
    methods: {
        ...mapActions('Companies', {
            listCompanies: 'getList',
            createUserCompany: 'createUserCompany'
        }),
        ...mapMutations('SnackBarNotif', {
            notifDanger: 'notifDanger',
            notifSuccess: 'notifSuccess'
        }),
        validate () {
            this.$refs.form.validate()
        },
        async joinCompany() {

            if( !this.newCompanyToJoin.id ) {
                this.notifDanger('Please pick a company')
                return
            }
            
            try {
                this.loading = true
                await this.createUserCompany({ companyID: this.newCompanyToJoin.id })
                this.notifSuccess('Your request has been sent')
                this.loading = false
                this.$emit('close')
            } catch(e) {
                this.notifDanger('There was an error while sending the request')
                this.loading = false
            }
        }
    },
    computed: {
        ...mapState('Companies', {
            companiesList: 'list',
        }),
        ...mapGetters('Auth', {
            userCompanies: 'getCurrentUserCompanies'
        }),
        filteredCompanies(){
            const usersJoinedCompanies = this.userCompanies.map( c => c.company.id )
            return this.companiesList.filter( c => !usersJoinedCompanies.includes(c.id) )
        }
    },
    async mounted() {
        if(!this.companiesList.length){
            try {
                this.loading = true
                await this.listCompanies()
                this.loading = false
            } catch(e) {
                this.loading = false
            }
        }
    }
}
</script>