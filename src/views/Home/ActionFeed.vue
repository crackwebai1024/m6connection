<template>
  <div
    v-if="!loading"
    class="dont-show-scroll h-sidepanel max-w-side pl-4 transparent vertical-scroll w-full actionfeed"
  >
    <div class="align-center d-flex justify-space-between mb-1 mt-4 pl-3">
      <h4 :class=" !lightMode ? 'grey--text text--darken-2' : 'white--text' ">
        Activity Center
        <v-icon
          @click="actionFeedCalendar"
        >
          mdi-calendar-clock
        </v-icon>
      </h4>
      <v-dialog
        v-model="actionFeedCalendarModal"
        max-width="600px"
        persistent
      >
        <v-card>
          <v-card-title>
            <v-toolbar
              flat
            >
              <v-btn
                class="mr-4"
                color="grey darken-2"
                outlined
                @click="setToday"
              >
                Today
              </v-btn>
              <v-btn
                color="grey darken-2"
                fab
                small
                text
                @click="prev"
              >
                <v-icon small>
                  mdi-chevron-left
                </v-icon>
              </v-btn>
              <v-btn
                color="grey darken-2"
                fab
                small
                text
                @click="next"
              >
                <v-icon small>
                  mdi-chevron-right
                </v-icon>
              </v-btn>
              <v-toolbar-title v-if="$refs.calendar">
                {{ $refs.calendar.title }}
              </v-toolbar-title>
              <v-spacer />
              <v-menu
                bottom
                right
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    color="grey darken-2"
                    outlined
                    v-on="on"
                  >
                    <span>{{ calendarTypeToLabel[calendarType] }}</span>
                    <v-icon right>
                      mdi-menu-down
                    </v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="calendarType = 'day'">
                    <v-list-item-title>Day</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="calendarType = 'week'">
                    <v-list-item-title>Week</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="calendarType = 'month'">
                    <v-list-item-title>Month</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="calendarType = '4day'">
                    <v-list-item-title>4 days</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
          </v-card-title>
          <v-card-text>
            <v-calendar
              ref="calendar"
              v-model="calendarValue"
              :event-color="getEventColor"
              :event-overlap-threshold="30"
              :events="calendarEvents"
              :type="calendarType"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="blue darken-1"
              text
              @click="actionFeedCalendarModal = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <div class="align-center d-flex">
        <v-menu
          bottom
          offset-y
          transition="slide-y-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              :class="['capitalize font-weight-bold mb-0 pl-1 px-0 text--darken-1 transparent', {'white--text': lightMode}, {'purple--text': !lightMode} ]"
              elevation="0"
              v-on="on"
            >
              {{ filterTag.value }}
              <v-icon :class=" !lightMode ? 'blue--text text--darken-3' : 'white--text' ">
                mdi-chevron-down
              </v-icon>
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item
              v-for="(item, i) in areas"
              :key="i"
            >
              <v-list-item-title
                :class="item.type === 'title' ? 'grey--text' : 'black--text pointer'"
                @click="item.function"
              >
                {{ item.text }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn
          color="grey darken-4"
          icon
          @click="showSearchInputFunction"
        >
          <v-icon :class=" !lightMode ? 'grey--text text--darken-2' : 'white--text' ">
            mdi-magnify
          </v-icon>
        </v-btn>
      </div>
    </div>
    <input
      v-show="showSearchInput"
      ref="searchInput"
      v-model="searchInput"
      class="search-input"
      placeholder="Start Typing to Search"
      type="text"
    >

    <action-feed-item
      v-for="(notification, index) in filteredNotifications.filter((e, i) => i < currentIndex)"
      :key="'notification-'+index"
      :notification="notification"
    />
    <infinite-loading
      :identifier="filteredNotifications"
      infinite-scroll-disabled="busy"
      @infinite="infiniteHandler"
    >
      <div slot="spinner" />
      <div slot="no-more" />
      <div slot="no-results" />
    </infinite-loading>
    <div v-if="filteredNotifications.length === 0">
      No results found
    </div>
  </div>
  <v-container
    v-else
    class="dont-show-scroll h-full px-4 text-center transparent vertical-scroll"
  >
    <v-progress-circular
      color="primary"
      indeterminate
    />
  </v-container>
</template>

<script>
import ActionFeedItem from './ActionFeedItem'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'ActionFeed',
  components: {
    ActionFeedItem
  },
  props: {
    lightMode: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    busy: false,
    currentIndex: 0,
    loading: true,
    user: {},
    showSearchInput: false,
    searchInput: '',
    showActionBtns: false,
    // action feed data
    notifications: [],
    status: [],
    actionFeedCalendarModal: false,
    // calendar part
    calendarType: 'month',
    calendarTypes: ['month', 'week', 'day', '4day'],
    calendarTypeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
      '4day': '4 Days'
    },
    calendarValue: '',
    calendarColors: [
      'blue',
      'indigo',
      'deep-purple',
      'cyan',
      'green',
      'orange',
      'grey darken-1'
    ]
  }),
  computed: {
    ...mapGetters('Auth', { cUser: 'getUser' }),
    ...mapGetters('WorkOrderModule', {
      actFeed: 'getActionFeed',
      filterTag: 'getFilter'
    }),
    areas() {
      return [
        {
          text: 'Everyone',
          type: 'subtitle',
          function: () => {
            this.setFilterTag({ key: 'everyone', value: 'Everyone' })
            this.workOrder()
          }
        },
        {
          text: 'My company',
          type: 'subtitle',
          function: () => {
            this.setFilterTag({ key: 'company', value: 'My company' })
            this.workOrder()
          }
        },
        {
          text: 'Records',
          type: 'title',
          function: () => {}
        },
        {
          text: 'All Apps',
          type: 'subtitle',
          function: () => {
            this.setFilterTag({ key: 'all_apps', value: 'All Apps' })
            this.workOrder()
          }
        },
        {
          text: 'ITApps',
          type: 'subtitle',
          function: () => {
            this.setFilterTag({ key: 'itapps', value: 'ITApps' })
            this.workOrder()
          }
        },
        {
          text: 'Teams',
          type: 'title',
          function: () => {}
        },
        {
          text: 'All my teams',
          type: 'subtitle',
          function: () => {
            this.setFilterTag({ key: 'all_teams', value: 'All my teams' })
            this.workOrder()
          }
        },
        {
          text: 'IT Team XY',
          type: 'subtitle',
          function: () => {
            this.setFilterTag({ key: 'it_team_xy', value: 'IT Team XY' })
            this.workOrder()
          }
        },
        {
          text: 'CPM Team Z',
          type: 'subtitle',
          function: () => {
            this.setFilterTag({ key: 'cpm_team_z', value: 'CPM Team Z' })
            this.workOrder()
          }
        },
        {
          text: 'Departments',
          type: 'title',
          function: () => {}
        },
        {
          text: 'All my departments',
          type: 'subtitle',
          function: () => {
            this.setFilterTag({
              key: 'all_departments',
              value: 'All my departments'
            })
            this.workOrder()
          }
        },
        {
          text: 'Finances',
          type: 'subtitle',
          function: () => {
            this.setFilterTag({ key: 'finances', value: 'Finances' })
            this.workOrder()
          }
        },
        {
          text: 'Operations',
          type: 'subtitle',
          function: () => {
            this.setFilterTag({ key: 'operations', value: 'Operations' })
            this.workOrder()
          }
        }
      ]
    },
    filteredNotifications() {
      return this.actFeed.filter(notification => {
        if (typeof notification.post.actor.data === 'object') {
          return notification.post.actor.data.name.toUpperCase().trim().indexOf(this.searchInput.toUpperCase().trim()) !== -1
          || notification.description.toUpperCase().trim().indexOf(this.searchInput.toUpperCase().trim()) !== -1
        }

        return notification.description.toUpperCase().trim().indexOf(this.searchInput.toUpperCase().trim()) !== -1
      })
    },
    calendarEvents() {
      const feeds = this.actFeed.filter(notification => {
        if (typeof notification.post.actor.data === 'object') {
          return notification.post.actor.data.name.toUpperCase().trim().indexOf(this.searchInput.toUpperCase().trim()) !== -1
          || notification.description.toUpperCase().trim().indexOf(this.searchInput.toUpperCase().trim()) !== -1
        }

        return notification.description.toUpperCase().trim().indexOf(this.searchInput.toUpperCase().trim()) !== -1
      })
      const events = []
      feeds.map(row => {
        events.push({
          name: row.title,
          start: row.start_date,
          end: row.due_date,
          color: this.genEventColor(),
          timed: false
        })
      })
      return events
    }
  },
  watch: {
    cUser: function (val) {
      this.user = val
      this.loading = true
      this.workOrder().then(() => {
        this.loading = false
      })
    },
    actFeed: function () {
      this.currentIndex = 0
    }
  },
  mounted() {
    this.setFilterTag({ key: 'everyone', value: 'Everyone' })
    this.user = this.cUser
    this.select('/wo_status').then(res => {
      this.status = res.data
    })
    this.workOrder().then(() => {
      this.loading = false
    })
  },
  methods: {
    ...mapActions('WorkOrderModule', {
      workOrder: 'setWorkOrder',
      setFilterTag: 'setWorkFilter'
    }),
    ...mapActions('ITAppsModule', {
      select: 'get_selects'
    }),
    infiniteHandler($state) {
      this.busy = true
      setTimeout(() => {
        if (this.currentIndex < this.filteredNotifications.length) {
          this.currentIndex++
          $state.loaded()
        } else {
          $state.complete()
        }
        this.busy = false
      }, 100)
    },
    showSearchInputFunction() {
      this.showSearchInput = !this.showSearchInput
      this.$nextTick(() => this.$refs.searchInput.focus())
    },
    actionFeedCalendar() {
      this.actionFeedCalendarModal = true
    },
    getEventColor(event) {
      return event.color
    },
    genEventColor() {
      return this.calendarColors[this.rnd(0, this.calendarColors.length - 1)]
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
    setToday() {
      this.calendarValue = ''
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    }
  }
}
</script>

<style lang="scss">
  .card-content__tag {
    z-index: 0;
    top: 0px;
    right: 0;
    padding: 0 16px;
    height: 34px;
    border-radius: 0px 4px;
  }
  .feed-btns {
    bottom: 0;
    left: 0;
  }
  .action-btns {
    bottom: 0;
    right: 0;
  }
  .message-box {
    border-left: 2px solid grey;
  }
</style>
