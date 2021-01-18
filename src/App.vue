<template>
  <v-app id="complete-app">
    <div class="grey h-viewport lighten-3">
      <template v-if="loggedIn && (!$route.meta.public || $route.meta.topNav)">
        <top-nav />
        <template v-if="$route.meta.topNav">
          <router-view class="top-60" />
        </template>
        <template v-else>
          <v-row
            class="grey lighten-3 mx-auto nav-content relative w-full"
            no-gutters
          >
            <div
              v-if="showSidePanels"
              class="absolute h-full left-0 top-0 w-full"
            >
              <action-feed
                class="fixed left-0 max-w-side mt-60 top-0 w-side"
                :class="{'d-none': $vuetify.breakpoint.mdAndDown, 'w-side': $vuetify.breakpoint.lgAndUp}"
              />
              <m6-chat
                class="fixed mt-60 right-0 top-0"
                :class="{'d-none': $vuetify.breakpoint.xs, 'w-2__5': $vuetify.breakpoint.mdAndDown, 'w-side': $vuetify.breakpoint.lgAndUp }"
              />
            </div>

            <div
              v-if="showSidePanels"
              class="d-flex mt-60 w-full"
              :class="!$vuetify.breakpoint.mdAndDown ? 'justify-center' : 'justify-start'"
            >
              <router-view />
            </div>
            <v-col
              v-else
              cols="12"
            >
              <!-- Home / Company Profile -->
              <router-view class="mt-60" />
            </v-col>
          </v-row>
          <!-- Preview overlay -->
          <chat-wrapper />
          <general-overlay />
        </template>
        <footer-nav />
      </template>
      <template v-else>
        <router-view />
      </template>
    </div>
    <vue-snotify />
    <m6-notification
      :danger="notifDanger"
      :snackbar="notifShow"
      :success="notifSuccess"
      :text="notifText"
      top
      @closing="notifClose"
    />
  </v-app>
</template>

<script>
import TopNav from '@/views/Home/TopNav'
import FooterNav from '@/views/Home/FooterNav'
import ActionFeed from '@/views/Home/ActionFeed'
import M6Chat from '@/components/Home/M6Chat'
import ChatWrapper from '@/components/Home/M6Chat/ChatWrapper'
import GeneralOverlay from '@/components/Shared/GeneralOverlay'
import { mapState, mapGetters, mapMutations } from 'vuex'
// mapActions
export default {
  name: 'App',
  components: {
    TopNav,
    FooterNav,
    ActionFeed,
    M6Chat,
    ChatWrapper,
    GeneralOverlay
  },
  data: () => ({
    //
  }),
  computed: {
    ...mapState(['layout']),
    ...mapGetters('Auth', {
      loggedIn: 'loggedIn'
    }),
    ...mapState('PageControl', {
      showSidePanels: 'showSidePanels'
    }),
    ...mapState('SnackBarNotif', {
      notifShow: 'notifShow',
      notifSuccess: 'notifSuccess',
      notifDanger: 'notifDanger',
      notifText: 'notifText'
    })
  },
  methods: {
    ...mapMutations('SnackBarNotif', {
      notifClose: 'notifClose'
    })
  }
}
</script>

<style>
  .max-w-none {
    max-width: none !important;
  }
  #app {
    font-family: 'Raleway', sans-serif;
    font-size: 16px;
  }
  * {
    color: var(--v-secondary-lighten1);
  }
  .central-content {
    height: calc(100vh - 60px);
  }
  .mt-60 {
    margin-top: 60px;
  }
</style>
