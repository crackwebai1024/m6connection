<template>
  <v-container class="card-custom-shadow d-flex flex-wrap height-100 justify-start panel-container py-5 relative rounded white">
    <div
      v-show="info['prefix']"
      class="absolute align-center card-content__tag d-flex font-weight-regular justify-center red text-body-1 white--text"
    >
      {{ info['prefix'] ? info['prefix'] : apps.filter(app => app.id === info['app_id'])[0]['prefix'] }}
    </div>
    <div class="w-full">
      <v-row
        class="pl-5"
        no-gutters
      >
        <v-col cols="4">
          <v-badge
            avatar
            bordered
            :color="getBadgeColor()"
            offset-x="20"
            offset-y="20"
            overlap
          >
            <v-avatar size="90">
              <v-img
                v-if="info.image"
                :alt="info.image"
                class="d-inline-block rounded w-full"
                max-height="100px"
                :src="info.image"
              />
              <v-img
                v-else-if="info.iconLink"
                :alt="info.iconLink"
                class="d-inline-block rounded w-full"
                max-height="100px"
                :src="info.iconLink"
              />
              <v-icon
                v-else
                class="d-inline-block"
                size="100"
              >
                mdi-store
              </v-icon>
            </v-avatar>
          </v-badge>
        </v-col>
        <v-col cols="8 px-5">
          <v-row>
            <v-col
              class="custom-col"
              cols="12"
            >
              <span class="app-title">
                {{ info['title'] }}
              </span>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              class="custom-col"
              cols="12"
            >
              <span class="app-number">{{ info['record_number'] }}</span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
    <div>
      <v-row class="app-description">
        <v-col
          class="custom-col"
          cols="12"
        >
          <p class="my-0 py-0">
            {{ info['description'] }}
          </p>
        </v-col>
      </v-row>
      <v-row class="app-author">
        <v-col
          class="custom-col"
          cols="12"
        >
          {{ info['author'] }}
        </v-col>
      </v-row>
      <v-row class="app-created_at">
        <v-col
          class="custom-col"
          cols="12"
        >
          {{ dateFormater(info['created_at']) }}
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DynamicAppSummary',
  components: {
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
  }),
  computed: {
    ...mapGetters('DynamicAppsModule', {
      apps: 'getApps'
    })
  },
  methods: {
    dateFormater(e) {
      const date = new Date(e)
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]
      const year = date.getFullYear()
      const month = date.getMonth()
      const day = date.getDate()
      const hour = date.getHours()
      const mins = date.getMinutes()
      return `${months[month - 1]} ${day} ${year}, ${hour} : ${mins}`
    },
    getBadgeColor() {
      if (this.info.status) {
        if (this.info.status.toUpperCase() === 'PUBLISHED') return 'green'
        if (this.info.status.toUpperCase() === 'GREY') return 'yellow'
        if (this.info.status.toUpperCase() === 'ARCHIVED') return 'grey'
      } else {
        return 'grey'
      }
    }
  }
}
</script>

<style scoped>
.app-title {
  text-align: left;
  font: normal normal 600 20px/24px Raleway;
  letter-spacing: 0px;
  color: #606060;
  opacity: 1;
}
.app-number {
  text-align: left;
  font: normal normal normal 16px/21px Roboto;
  letter-spacing: 0px;
  color: #404040;
  opacity: 1;
}
.app-description {
  text-align: left;
  font: normal normal normal 16px/21px Roboto;
  letter-spacing: 0px;
  color: #404040;
  padding: 10px 30px;
  opacity: 1;
}
.app-author {
  background: #F0F0F0 0% 0% no-repeat padding-box;
  border-radius: 12px;
  text-align: left;
  font: normal normal normal 12px/16px Roboto;
  letter-spacing: 0px;
  color: #404040;
  opacity: 1;
  margin: 5px 10px;
}
.app-created_at {
  background: #F0F0F0 0% 0% no-repeat padding-box;
  border-radius: 12px;
  text-align: left;
  font: normal normal normal 12px/16px Roboto;
  letter-spacing: 0px;
  color: #404040;
  opacity: 1;
  margin: 5px 10px;
}
.custom-col {
  padding: 5px 10px;
}
.height-100 {
  height: 100%;
}
</style>
