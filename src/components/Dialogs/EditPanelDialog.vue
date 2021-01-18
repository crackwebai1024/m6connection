<template>
  <v-dialog
    v-model="show"
    class=""
    max-width="600px"
    persistent
  >
    <v-card class="">
      <v-card-title class="elevation-1 primary">
        <span class="font-weight-bold white--text">{{ panel.title || 'Panel Title' }}</span>
      </v-card-title>
      <v-card-text
        class="pa-0 vertical-scroll"
        :style="{height: height(), overflowX: &quot;hidden&quot;}"
      >
        <v-row
          v-for="(item, index) in panel.items"
          :key="index"
          class="d-block my-4 px-5 white"
        >
          <template v-if="item.default === defaults.money">
            <div class="d-flex">
              <v-col class="align-center d-flex flex-grow-0 flex-shrink-1 pa-0">
                <v-icon>{{ item.icon }}</v-icon>
              </v-col>
              <v-col class="flex-grow-1 flex-shrink-0">
                <label class="text-subtitle-2"> {{ item.label }} </label>
                <money
                  v-model="panelItems[camelize(item.label)]"
                  :label="item.label"
                />
              </v-col>
            </div>
          </template>

          <template v-else-if="item.default === defaults.date">
            <label class="ml-8 text-subtitle-2"> {{ item.label }} </label>
            <v-menu
              v-model="datePickers[index]"
              :close-on-content-click="false"
              offset-y
            >
              <template v-slot:activator="{on, attrs}">
                <v-text-field
                  v-model="panelItems[camelize(item.label)]"
                  v-bind="attrs"
                  :label="item.label"
                  :prepend-icon="item.icon"
                  single-line
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="panelItems[camelize(item.label)]"
                elevation="13"
                header-color="white"
                @input="datePickers[index] = false"
              />
            </v-menu>
          </template>
          <template v-else>
            <label class="ml-8 text-subtitle-2"> {{ item.label }} </label>
            <v-text-field
              v-model="panelItems[camelize(item.label)]"
              :label="item.label"
              :prepend-icon="item.icon"
              single-line
            />
          </template>
        </v-row>
      </v-card-text>
      <v-card-actions class="white">
        <v-spacer />
        <v-btn
          color="grey text--darken"
          text
          @click="closeDialog"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary white--text"
          @click="savePanel"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { Money } from 'v-money'
import { db } from '@/utils/Firebase'
export default {
  name: 'EditPanelDialog',
  components: { Money },
  model: {
    prop: 'show',
    event: 'show-change'
  },
  props: {
    show: {
      type: [Boolean, String],
      default: false
    },
    panel: {
      type: [Object, Array],
      default: () => new Array()
    }
  },
  data: () => ({
    datePickers: {},
    defaults: {
      money: '0.00',
      text: 'N/A',
      date: '--/--/----',
      percent: '0'
    },
    panelItems: {} // we can still use the same object
    // as prop and create a custom key for vmodels, so we dont modify current value
  }),
  mounted() {
    this.panel.items.forEach((item, index) => {
      this.panelItems[this.camelize(item.label)] = item.value
    })
  },
  methods: {
    camelize(str) {
      return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase()
      }).replace(/\s+/g, '').replace('/', '')
    },
    height() {
      const viewportSize = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      ) * 0.6

      return `${viewportSize}px`
    },
    closeDialog() {
      this.$emit('show-change', false)
    },
    // Move this function to Vuex mutations
    savePanel() {
      let filteredItems = {...this.panelItems}
      delete filteredItems['projectTitle']
      delete filteredItems['description']
      delete filteredItems['status']

      let doc = {}

      if (this.panel.title === 'Project Quickview') {
        doc = {
          status: this.panelItems.status || '',
          description: this.panelItems.description || '',
          title: this.panelItems.projectTitle || '',
          basic: filteredItems
        }
      } else if (this.panel.title === 'Schedule & Budget') {
        doc = {
          schedule: this.panelItems
        }
      } else {
        doc = {
          milestones: this.panelItems

        }
      }
      // this.$snotify.success('Changes saved')
      db.collection('cpm_projects').doc(this.$route.params.id).update(doc)
        .then(doc => {
          this.$snotify.success('Changes saved')
          this.$emit('update')
          this.closeDialog()
        })
        .catch(err => this.$snotify.error('Something went wrong', 'Changes not saved'))
    }
  }
}
</script>

<style>
.v-text-field {
    margin-top: 0
}
</style>
