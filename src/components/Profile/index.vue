<template>
  <div class="ma-0 px-2 pt-3 pb-0 h-full w-main-content">
        <!-- General use list component-->
    <template v-if="get_screen_status()">
      <record-container class="main-content" :data="get_record_full_screen()" />
    </template>
    <template v-else>
      <v-row class="main-content mx-auto d-flex justify-space-between ma-0 mb-3 py-2 px-5 white width-100 vertical-scroll dont-show-scroll rounded-pill">
        <v-col cols="5" class="pa-0">
          <img alt="" class="mr-2"  height="35" src="@/assets/sharp-logo2.png">
        </v-col>
        <v-col cols="2" class="pa-0 d-flex align-center">
          <v-row class="d-flex align-center">
            <v-tabs
              class="d-flex justify-center"
              height="35"
              :active-class="'font-weight-medium'"
              :hide-slider="true"
              v-model="tab"
            >
              <v-tab
                class="black--text px-2"
                v-for="(item,index) in items"
                :key="item"
                @click="currentTab = index"
              >
                {{ item }}
              </v-tab>
            </v-tabs>
          </v-row>
        </v-col>      
        <v-col cols="5" class="d-flex justify-end pa-0">
          <v-icon :large="true" class="black--text">mdi-magnify</v-icon>
        </v-col>
      </v-row>
      <v-tabs-items class="main-content mx-auto transparent" v-model="tab">
        <v-btn
          v-show="currentTab == 0 && !(showColumnLeft && !showColumnRight)"
          @click="showColumnLeft = !showColumnLeft"
          color="blue lighten-1"
          dark
          absolute
          top
          left
          fab
        >
          <v-icon v-if="showColumnLeft">mdi-chevron-left</v-icon>
          <v-icon v-else>mdi-chevron-right</v-icon>
        </v-btn>
        <v-btn
          v-show="currentTab == 0 && !(showColumnRight && !showColumnLeft)"
          color="blue lighten-1"
          @click="showColumnRight = !showColumnRight"
          dark
          absolute
          top
          right
          fab
        >
          <v-icon v-if="!showColumnRight">mdi-chevron-left</v-icon>
          <v-icon v-else>mdi-chevron-right</v-icon>
        </v-btn>

        <v-row no-gutters class="transparent" v-show="currentTab == 0">
          <v-expand-x-transition>
            <v-card v-show="showColumnLeft"
              elevation="0"
              :height="showColumnLeft ? 'auto': '0'"
              :width="showColumnLeft ? showColumnRight ? '50%' : '100%' : '0'"
              :class="{'pr-1' : showColumnRight && showColumnLeft}"
              class="transparent"
            >
              <post-profile/>
            </v-card>
          </v-expand-x-transition>
          <v-expand-x-transition>
            <v-card v-show="showColumnRight"
              elevation="0"
              :height="showColumnRight ? 'auto': '0'"
              :width="showColumnRight ? showColumnLeft ? '50%' : '100%' : '0'"
              :class="{'pl-2' : showColumnRight && showColumnLeft}"
              class="transparent"
            >
              <profile-info/>
              <template v-for="i in 2">
                <chart-card :key="'chart'+i"/>
              </template>
            </v-card>
          </v-expand-x-transition>
        </v-row>
        <v-row no-gutters class="transparent" v-show="currentTab == 1">
          <v-col cols="6" class="pr-2">
            <employees/>
          </v-col>
          <v-col cols="6" class="pl-2">
            <month-employee/>
          </v-col>
        </v-row>
      </v-tabs-items>
    </template>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import PostProfile from '@/components/Profile/Wall/PostProfile'
import ProfileInfo from './Wall/ProfileInfo'
import ChartCard from './Wall/ChartCard'
import Employees from './People/Employees'
import MonthEmployee from './People/MonthEmployee'
import RecordContainer from '@/components/RecordMode/RecordContainer'

export default {
  components: {
    PostProfile,
    ProfileInfo,
    ChartCard,
    Employees,
    MonthEmployee,
    RecordContainer
  },
  data: () => ({
    tab: null,
    items: [
      'Profile', 'People', 'Details',
    ],
    currentTab: 0,
    showColumnLeft: true,
    showColumnRight: true
  }),
  name: "CompanyProfilePage",
  computed: {
    ...mapGetters({
      get_screen_status: "GeneralListModule/get_screen_status",
      get_record_full_screen: "GeneralListModule/get_record_full_screen",
      get_image_preview_overlay: "get_image_preview_overlay"
    }),
  },
  methods: {
  }
};
</script>

<style lang="scss" scoped>
  .v-tab {
    font-weight: 300;
    min-width: 40px;
    text-transform: none;
  }
  .v-btn--fab.v-size--default {
    top: -15px !important;
    height: 40px;
    width: 40px;
    &.v-btn--right {
      right: 5px;
    }
    &.v-btn--left {
      left: 5px;
    }
  }
</style>