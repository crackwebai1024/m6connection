<template>
  <div>
    <v-card>
      <v-card-text>
        <v-form ref="form">
          <v-container class="pa-0">
            <h1 class="blue--text pb-3 text-center">
              Edit Your Company
            </h1>
            <v-tabs-items
              v-model="secondColumnComponent.tab"
              class="pt-3"
            >
              <v-tab-item>
                <v-row>
                  <v-col class="col-md-4 col-xs-12 pt-0">
                    <v-text-field
                      v-model="company.legalCompanyName"
                      label="Legal Company Name"
                      :rules="rules.genericRules"
                    />
                  </v-col>
                  <v-col class="col-md-4 col-xs-12 pt-0">
                    <v-text-field
                      v-model="company.name"
                      label="Company Name"
                      :rules="rules.genericRules"
                    />
                  </v-col>
                  <v-col class="col-md-4 col-xs-12 pt-0">
                    <v-text-field
                      v-model="company.email"
                      label="Public Company Email"
                      :rules="rules.emailRules"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="col-md-4 col-xs-12 pt-0">
                    <vue-tel-input-vuetify
                      v-model="company.phone"
                      label="Public Company Phone"
                      :rules="rules.genericRules"
                    />
                  </v-col>
                  <v-col class="col-md-4 col-xs-12 pt-0">
                    <v-text-field
                      v-model="company.website"
                      label="Company Website"
                    />
                  </v-col>
                  <v-col class="col-md-4 col-xs-12 pt-0">
                    <v-autocomplete
                      v-model="company.preferredOSDHPDClass"
                      :items="OSHPDOlist"
                      label="Prefered OSHPD Class"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="col-md-12 col-xs-12 pt-0">
                    <v-autocomplete
                      v-model="company.companyInsuranceStatus"
                      chips
                      item-text="label"
                      item-value="val"
                      :items="companyInsuranceStatus"
                      label="Company Insurance Status"
                      multiple
                    />
                  </v-col>
                </v-row>
              </v-tab-item>
              <v-tab-item>
                <v-row>
                  <v-col class="col-md-6 col-xs-12 pt-0">
                    <vuetify-money
                      v-model="company.projectSize.from"
                      label="Project Size From"
                      :options="options"
                    />
                  </v-col>
                  <v-col class="col-md-6 col-xs-12 pt-0">
                    <vuetify-money
                      v-model="company.projectSize.to"
                      label="Project Size To"
                      :options="options"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="col-md-6 col-xs-12 pt-0">
                    <vuetify-money
                      v-model="company.projectCapability.from"
                      label="Project Capability From"
                      :options="options"
                    />
                  </v-col>
                  <v-col class="col-md-6 col-xs-12 pt-0">
                    <vuetify-money
                      v-model="company.projectCapability.to"
                      label="Project Capability To"
                      :options="options"
                    />
                  </v-col>
                </v-row>
              </v-tab-item>
              <v-tab-item>
                <v-row>
                  <v-col
                    class="pa-0 text-right"
                    cols="12"
                  >
                    <v-tooltip left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          v-bind="attrs"
                          color="primary darken-2"
                          dark
                          fab
                          x-small
                          v-on="on"
                          @click="socialMediaAdd"
                        >
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </template>
                      <span>Add A New Link</span>
                    </v-tooltip>
                  </v-col>
                  <v-col>
                    <social-media-c-u
                      :items="this.company.socialMediaLinks"
                      @change=" e => company.socialMediaLinks = e"
                    />
                  </v-col>
                </v-row>
              </v-tab-item>
              <v-tab-item>
                <company-address-table
                  :items="company.locations"
                  @deletingAddress="e => company.locations = e"
                />
              </v-tab-item>
              <v-tab-item>
                <!-- <CompanyCodesCU /> -->
                <company-codes-display />
              </v-tab-item>
              <v-tab-item>
                <v-row>
                  <v-col class="col pa-0 pr-3 text-right">
                    <m6-upload
                      btn-button="purple"
                      @loading="loading = !loading"
                      @response="reponseProfileImg"
                    >
                      <v-icon>mdi-cloud-upload</v-icon>
                    </m6-upload>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="col pa-0 text-center">
                    <img
                      v-if="$h.dg(company, 'logo')"
                      alt="user profile image"
                      class="round-img"
                      :src="$h.dg(company, 'logo')"
                    >

                    <v-icon
                      v-else
                      size="5rem"
                    >
                      mdi-bank
                    </v-icon>
                  </v-col>
                </v-row>
              </v-tab-item>
            </v-tabs-items>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions v-if="secondColumnComponent.tab !== 4 ">
        <v-spacer />
        <v-btn
          class="darken-2 green white--text"
          @click="updating"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>

    <m6-loading :loading="loading" />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import SocialMediaCU from './CompanyShowSubComponents/SocialMediaCU'
import CompanyAddressTable from './CompanyShowSubComponents/CompanyAddressTable'
import CompanyCodesCU from './CompanyShowSubComponents/CompanyCodesCU'
import CompanyCodesDisplay from './CompanyShowSubComponents/CompanyCodesDisplay'

export default {
  name: 'CompanyShow',
  components: {
    SocialMediaCU,
    CompanyAddressTable,
    CompanyCodesCU,
    CompanyCodesDisplay
  },
  data: () => ({
    defaultSocialMediaLink: { icon: '', name: '', link: '' },
    value: '',
    options: {
      locale: 'en-US',
      decimal: '.',
      thousands: ',',
      prefix: '$',
      suffix: '',
      length: 12,
      precision: 2
    },
    company: {
      projectCapability: { to: '', from: '' },
      projectSize: { to: '', from: '' }
    },
    loading: false,
    OSHPDOlist: Array.from({ length: 20 }, (v, k) => k + 1),
    rules: {
      genericRules: [
        v => !!v || 'This field is required'
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ],
      websiteRules: [
        v => !!v || 'Website is required',
        v => /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(v) || 'Website must be valid'
      ]
    }
  }),
  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany',
      companyInsuranceStatus: 'companyInsuranceStatus'
    }),
    ...mapState('UserSettingsControl', {
      secondColumnComponent: 'secondColumnComponent'
    })
  },
  methods: {
    ...mapActions('Companies', {
      updateCompany: 'updateCompany'
    }),
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),
    validate() {
      return this.$refs.form.validate()
    },
    async reponseProfileImg(res) {
      if (res.ok) {
        this.company.logo = res.data.link

        try {
          this.loading = true
          await this.updateCompany(this.company)
          this.loading = false
          this.notifSuccess('Company Updated!')
        } catch (e) {
          this.loading = false
          this.notifDanger('There was an error while saving the file')
        }
      } else {
        this.notifDanger('There was an error while saving the file')
      }
    },
    async updating() {
      if (!this.validate()) {
        this.notifDanger('Please fill in all of the fields')
        return
      }

      try {
        this.loading = true
        await this.updateCompany(this.company)
        this.loading = false
        this.notifSuccess('The company was saved')
      } catch (e) {
        this.loading = false
        this.notifDanger('There was an error while saving the user')
      }
    },
    socialMediaAdd() {
      this.company.socialMediaLinks.push({
        ...this.defaultSocialMediaLink
      })
    }
  },
  mounted() {
    const company = { ...this.currentCompany }
    if (!company.projectCapability) {
      company.projectCapability = {
        to: '0',
        from: '0'
      }
    }
    if (!company.projectSize) company.projectSize = { to: '0', from: '0' }
    if (!company.socialMediaLinks) company.socialMediaLinks = []
    if (!company.locations) company.locations = []

    this.company = company
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
