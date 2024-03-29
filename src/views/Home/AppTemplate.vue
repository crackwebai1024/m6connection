<template>
  <div>
    <div @click="dialog = true">
      <slot name="actionbtn" />
    </div>
    <template>
      <v-row v-if="dialog" class="dont-show-scroll mx-0 vertical-scroll">
        <v-card class="grey lighten-3 relative w-full" tile>
          <div class="w-full white">
            <slot name="header" />
            <v-divider class="blue-grey lighten-5 max-w-lg mx-auto w-full" />
            <div
              class="align-center d-flex justify-space-between max-w-lg mx-auto py-1 w-full"
            >
              <slot name="tabs" />
              <v-spacer />
              <slot name="btns" />
            </div>
          </div>
          <div
            class="details-content grey h-fit lighten-3 min-h-full pt-3 relative"
          >
            <v-row
              class="align-start d-flex justify-space-between max-w-lg mx-auto pt-1 w-full"
            >
              <slot name="content" />
            </v-row>
            <v-badge
              class="absolute left-0 ml-5 mt-5 top-0 w-fit"
              color="blue"
              offset-x="17"
              offset-y="17"
              overlap
              :style="actionOverlay ? 'z-index: 203;' : ''"
            >
              <v-btn
                :class="
                  actionOverlay
                    ? 'white ml-auto pa-6 white--text'
                    : 'darken-2 grey ml-auto pa-6 white--text'
                "
                :color="!actionOverlay ? 'white' : 'grey darken-2'"
                depressed
                icon
                rounded
                @click="actionOverlay = !actionOverlay"
              >
                <v-icon>mdi-menu</v-icon>
              </v-btn>
              <template v-slot:badge> 12 </template>
            </v-badge>
            <v-overlay
              class="record-overlay"
              opacity="0.7"
              :value="actionOverlay"
            >
              <v-row
                class="central-content flex flex-nowrap justify-space-between mx-auto relative top-6 transparent0 w-full"
                no-gutters
              >
                <v-col class="dont-show-scroll vertical-scroll" cols="3">
                  <div class="w-full" style="height: 310px" />
                  <action-feed :light-mode="true" />
                </v-col>
              </v-row>
            </v-overlay>
          </div>
        </v-card>
        <v-btn
          v-show="!chatOverlay"
          bottom
          class="blue ml-auto pa-6 white--text"
          color="white"
          depressed
          fixed
          icon
          right
          rounded
          @click="chatOverlay = true"
        >
          <v-icon>mdi-message</v-icon>
        </v-btn>
        <v-overlay class="record-overlay" opacity="0.7" :value="chatOverlay">
          <v-row
            class="central-content flex flex-nowrap justify-space-between mx-auto relative top-6 transparent0 w-full"
            no-gutters
          >
            <v-col cols="9" />
            <div class="relative w-side">
              <v-btn
                absolute
                class="blue--text ml-auto pa-6 white"
                color="white"
                depressed
                icon
                left
                rounded
                style="left: -50px; top: 6px"
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
      </v-row>
    </template>
  </div>
</template>

<script>
import ActionFeed from "@/views/Home/ActionFeed";
import M6Chat from "@/components/Home/M6Chat";
export default {
  name: "AppTemplate",
  components: {
    ActionFeed,
    M6Chat,
  },
  props: {
    propsDialog: {
      type: Boolean,
      default: false,
    },
    isPersistent: {
      type: Boolean,
      default: false,
    },
    openDialog: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    dialog: false,
    chatOverlay: false,
    actionOverlay: true,
  }),
  watch: {
    propsDialog(val) {
      this.dialog = val;
    },
  },
  created() {
    this.dialog = this.openDialog;
  },
};
</script>

<style lang="scss">
.spacing-tight {
  letter-spacing: 1px;
}
.links {
  transition: height 5s;
  height: 150px;
  overflow: hidden;
  -webkit-transition: height 0.5s ease;
  -moz-transition: height 0.5s ease;
  -o-transition: height 0.5s ease;
  transition: height 0.5s ease;
}
.active-tab-company {
  border-bottom: 3px solid rgb(49, 174, 220);
}
.v-dialog--scrollable {
  position: absolute;
  top: 60px;
  height: calc(100vh - 60px) !important;
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-y: scroll;
}
.v-dialog--scrollable::-webkit-scrollbar {
  width: 0px;
}
.add-field .v-input input {
  border-bottom: 1px solid #f8f3ec;
  margin-bottom: -1px;
}
.panel {
  min-height: 300px;
}
.v-tabs-slider {
  color: #2196f3;
}
.record-overlay .v-overlay__content {
  width: 100%;
  height: 100%;
  top: 60px;
}
</style>
