/* eslint-disable vue/no-unused-vars */
<template>
  <div class="blue d-flex darken-3 fixed justify-center nav-bar px-4 top-0 w-full">
    <v-btn
      v-show="!chatOverlay"
      class="blue ml-auto pa-6 white--text"
      :class="{'d-none': $vuetify.breakpoint.smAndUp, 'v-overlay--active': !chatOverlay}"
      color="white"
      depressed
      fixed
      icon
      right
      rounded
      style="margin-top: -10px;"
      top
      @click="chatOverlay = true"
    >
      <v-icon>mdi-message</v-icon>
    </v-btn>
    <v-overlay
      class="record-overlay"
      opacity="0.7"
      :value="chatOverlay"
    >
      <v-row
        class="central-content flex flex-nowrap justify-space-between mx-auto relative top-6 transparent0 w-full"
        no-gutters
      >
        <div
          class="relative w-full"
        >
          <v-btn
            absolute
            class="blue--text ml-auto pa-6 white"
            color="white"
            depressed
            icon
            right
            rounded
            style="margin-top: -54px;"
            @click="chatOverlay = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <m6-chat
            class="ml-auto"
            :light-mode="true"
            @click.native="chatOverlay = false"
          />
        </div>
      </v-row>
    </v-overlay>
    <div class="align-center d-flex justify-space-between nav-content w-full">
      <div class="align-center d-flex w-side">
        <img
          alt="M6Connect"
          height="36px"
          src="@/assets/m6-home-logo.png"
        >
      </div>
      <v-tabs
        v-if="$vuetify.breakpoint.mdAndUp"
        active-class="blue darken-4"
        background-color="transparent"
        class="align-center d-flex justify-center mx-auto w-fit"
        color="white"
        height="60"
        :hide-slider="true"
        :value="3"
      >
        <v-tab
          v-for="(link, i) in quickAccessLinks"
          :key="'link' + i"
          class="mb-0 px-13"
          :to="link.url"
        >
          <apps-btn-drop-down
            v-if="link.text === 'apps'"
            :icon="link.icon"
          />
          <v-icon
            v-else
            color="white"
            size="30"
          >
            mdi-{{ link.icon }}
          </v-icon>
        </v-tab>
      </v-tabs>
      <div class="align-center d-flex justify-end w-side">
        <v-menu
          bottom
          class="mt-3"
          :close-on-content-click="false"
          content-class="elevation-0"
          elevation="0"
          offset-y
        >
          <template #activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              class="align-center btns-message d-flex justify-center mr-5 white--text"
              elevation="0"
              fab
              height="25"
              width="25"
              x-small
              v-on="on"
            >
              <v-icon size="19">
                mdi-plus
              </v-icon>
            </v-btn>
          </template>
          <v-list class="mb-2 pa-0 transparent">
            <v-list-item class="ma-0 pa-0 pt-1 uploadfile-btn">
              <v-tooltip
                class="tooltip-upload-file"
                left
              >
                <template #activator="{ on, attrs}">
                  <add-feed
                    class="w-full"
                    :title="'New Action'"
                  >
                    <v-btn
                      slot="btn"
                      block
                      class="align-center d-flex justify-center ma-0 pa-0 pointer px-3 upload-icon white--text"
                      color="yellow darken-1"
                      @click="modal = 'app-builder'"
                    >
                      Add Action
                    </v-btn>
                  </add-feed>
                </template>
                <span
                  class="black--text blue lighten-2 pa-1 rounded text-caption white--text"
                >New Action</span>
              </v-tooltip>
            </v-list-item>
            <v-list-item class="ma-0 pa-0 pt-1 uploadfile-btn">
              <v-tooltip
                class="tooltip-upload-file"
                left
              >
                <template #activator="{ on, attrs }">
                  <create-app
                    class="w-full"
                    :title="'New App'"
                  >
                    <v-btn
                      slot="btn"
                      block
                      class="align-center d-flex justify-center ma-0 pa-0 pointer px-3 upload-icon white--text"
                      color="green darken-1"
                    >
                      Add Application
                    </v-btn>
                  </create-app>
                </template>
                <span
                  class="black--text blue lighten-2 pa-1 rounded text-caption white--text"
                >Add New Record</span>
              </v-tooltip>
            </v-list-item>
            <v-list-item class="ma-0 pa-0 pt-1 uploadfile-btn">
              <v-tooltip
                class="tooltip-upload-file"
                left
              >
                <template #activator="{ on, attrs }">
                  <v-dialog
                    v-model="dialog"
                    max-width="500"
                  >
                    <template #activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        class="max-w-tight"
                        color="blue lighten-2 w-full mx-auto"
                        dark
                        v-on="on"
                      >
                        Add Record
                      </v-btn>
                    </template>
                    <new-record-dialog
                      :title="'Create Record'"
                      @closeModal="dialog = false"
                    />
                  </v-dialog>
                </template>
                <span
                  class="black--text blue lighten-2 pa-1 rounded text-caption white--text"
                >Add New Record</span>
              </v-tooltip>
            </v-list-item>
            <v-list-item class="ma-0 pa-0 pt-1 uploadfile-btn">
              <snap-shot-nav class="w-full" />
            </v-list-item>
          </v-list>
        </v-menu>
        <user-options />
        <span class="font-weight-bold white--text">
          {{ $h.dg(currentUser, "firstName", "") }}
          {{ $h.dg(currentUser, "lastName", "") }}
        </span>
        <company-home />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SnapShotNav from '@/components/Home/TopNav/SnapShotNav'
import UserOptions from '@/components/Home/TopNav/UserOptions'
// import AppTemplate from "@/views/Home/AppTemplate";
// import ProjectSocialMedia from "./ProjectSocialMedia";
// import PanelFull from "@/components/AppBuilder/Content/PanelFull";
// import PanelTwoColumns from "@/components/AppBuilder/Content/PanelTwoColumns";
import CreateApp from './AddAppDialog'
import AddFeed from './AddFeedDialog'
import CompanyHome from './CompanyHome'
import NewRecordDialog from './AddRecordDialog'
import AppsBtnDropDown from '@/components/Home/TopNav/AppsBtnDropDown'
import M6Chat from '@/components/Home/M6Chat'
export default {
  name: 'TopNav',
  components: {
    UserOptions,
    SnapShotNav,
    NewRecordDialog,
    // AppTemplate,
    // ProjectSocialMedia,
    // PanelFull,
    // PanelTwoColumns,
    AddFeed,
    CreateApp,
    CompanyHome,
    AppsBtnDropDown,
    M6Chat
  },
  data: () => ({
    user: {
      name: 'John Doe',
      imgSrc: 'https://cdn.vuetifyjs.com/images/john.jpg'
    },
    dialog: false,
    modal: '',
    company: {
      name: 'Sharp Healthcare'
    },
    quickAccessLinks: [
      { url: '/', icon: 'home' },
      { url: '/companies', icon: 'office-building'},
      { url: '/records', icon: 'view-comfy', text: 'apps'  },
      { url: '/store', icon: 'storefront' },
      { url: '/user/settings', icon: 'cog' }
    ],
    chatOverlay: false
  }),
  computed: {
    ...mapState('Auth', {
      currentUser: 'user'
    }),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    showLinksMessage: function () {
      return this.showLinks ? 'Less' : 'More'
    },
    heightShowLinksDiv: function () {
      return 7 * 35 + 'px'
    }
  },
  methods: {}
}
</script>


<style lang="scss" scoped>
.nav-bar {
  z-index: 100;
}
.nav-content {
  height: 60px;
  max-width: 1872px;
}
</style>
