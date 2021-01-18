<template>
  <v-container
    fill-height
    fluid
    grid-list-md
    pa-0
  >
    <v-layout
      row
      wrap
    >
      <v-flex
        class="rel"
        fill-height
        hidden-sm-and-down
        md6
        pa-0
      >
        <left-side-screen />
      </v-flex>

      <v-flex
        d-flex
        xs12
        md6
        class="right-background"
      >
        <v-layout column>
          <v-flex d-flex>
            <v-layout
              row
              wrap
            >
              <v-flex
                xs12
              >
                <v-flex class="overflow-hidden" >
                  <slot name="nav-btn" />
                </v-flex>

                <v-flex >
                  <slot name="header" />
                </v-flex>

                <slot name="body"  />


                <v-flex class="d-flex justify-center" >
                  <router-link :to="{ name: 'auth.ForgotPassword' }" class="text-dec-none" >
                    <v-btn text class="custom-blue-text" >
                      Forgot Your Password?
                    </v-btn>
                  </router-link>
                </v-flex>

                <v-flex>
                  <slot name="action-btn" />
                </v-flex>

                <v-flex class="d-flex justify-center pa-0" >
                  <powered-by-m6 class="bottom-logo mt-6" />
                </v-flex>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import LeftSideScreen from './LeftSideScreen'
import PoweredByM6 from './PoweredByM6'
import { mapActions, mapState } from 'vuex'

export default {
  components: {
    LeftSideScreen,
    PoweredByM6
  },

  methods: {
    ...mapActions('Companies', {
      getCompanyByID: 'getCompanyByID'
    })
  },

  async mounted() {
    try {
      await this.getCompanyByID(process.env.VUE_APP_CURRENT_COMPANY_ID)
    } catch(e) {

    }
  }
}
</script>

<style lang="scss" scoped >
.right-background {
  background-color: #191e24;
}
.bottom-logo {
  width: 30%;
  height: auto;
}
.text-dec-none {
  text-decoration: none;
}
.custom-blue-text {
  color: #a4ceea !important;
}

.overflow-hidden {
  overflow: hidden;
}

.flex-center {
    display: flex; 
    align-items: center; 
    justify-content: center;
}
</style>