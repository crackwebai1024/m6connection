<template>
  <div>
    <div
      v-if="!showInput"
      class="pointer"
      @click="showInput = !showInput"
    >
      <slot name="btn" />
    </div>
    <v-dialog
      v-model="showInput"
      class="overflow-visible"
      max-width="500"
    >
      <v-card>
        <v-card-title
          class="blue ctm-mb-16 d-flex headline justify-space-between"
        >
          <span class="white--text">{{ title }}</span>
        </v-card-title>
        <v-card-text>
          <v-container class="mt-2 p-0 white">
            <v-form
              ref="form"
              v-model="valid"
              @submit.prevent="function(){}"
            >
              <v-row class="ma-0 w-full">
                <v-col
                  class="py-0"
                  cols="12"
                >
                  <treeselect
                    v-model="itemInfo.type"
                    :multiple="false"
                    :normalizer="normalizer"
                    :options="options.type"
                    placeholder="Action Type"
                  />
                </v-col>
                <v-col
                  class="py-0"
                  cols="12"
                >
                  <v-select
                    v-model="itemInfo.application_id"
                    item-text="title"
                    item-value="id"
                    :items="availableApps"
                    label="Application"
                    @change="changeRecord($event)"
                  />
                </v-col>
                <v-col
                  class="py-0"
                  cols="12"
                >
                  <v-select
                    v-model="itemInfo.record_id"
                    :class="{ disabled: itemInfo.application_id === null }"
                    item-value="id"
                    :items="options.records"
                    label="Record"
                  >
                    <template
                      slot="selection"
                      slot-scope="data"
                    >
                      <!-- HTML that describe how select should render selected items -->
                      {{ data.item.record_number }} - {{ data.item.title }}
                    </template>
                    <template
                      slot="item"
                      slot-scope="data"
                    >
                      <!-- HTML that describe how select should render items when the select is open -->
                      {{ data.item.record_number }} - {{ data.item.title }}
                    </template>
                  </v-select>
                </v-col>
                <v-col
                  class="py-0"
                  cols="12"
                >
                  <v-text-field
                    ref="inputFeed"
                    v-model="itemInfo.title"
                    class="h-full outline-none text-body-1"
                    placeholder="Title"
                    :rules="textRules"
                  />
                </v-col>
                <v-col
                  class="py-0"
                  cols="12"
                >
                  <v-text-field
                    ref="inputFeed"
                    v-model="itemInfo.description"
                    class="h-full outline-none text-body-1"
                    placeholder="Summary"
                    :rules="textRules"
                  />
                </v-col>
                <v-col
                  class="py-0"
                  cols="12"
                >
                  <v-datetime-picker
                    v-model="itemInfo.due_date"
                    label="Due Datetime"
                    time-format="HH:mm:ss"
                  />
                </v-col>
                <v-col
                  class="py-0"
                  cols="12"
                >
                  <v-autocomplete
                    v-model="itemInfo.assignment_list"
                    chips
                    color="green"
                    deletable-chips
                    hide-details
                    hide-no-data
                    hide-selected
                    item-text="user.firstName"
                    item-value="user.id"
                    :items="companyUsers"
                    label="People"
                    multiple
                    single-line
                  >
                    <template
                      slot="item"
                      slot-scope="data"
                    >
                      <!-- HTML that describe how select should render items when the select is open -->
                      <span>
                        {{ data.item.user.firstName }}
                        {{ data.item.user.lastName }}
                      </span>
                    </template>
                  </v-autocomplete>
                </v-col>
              </v-row>
              <v-row class="justify-end ma-0 px-3 py-2 w-full">
                <v-btn
                  class="font-weight-bold mr-4 text-xl white--text"
                  color="secondary"
                  outlined
                  right
                  @click="showInput = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  class="font-weight-bold text-xl white--text"
                  color="primary"
                  :disabled="!valid"
                  outlined
                  right
                  @click="post"
                >
                  Submit
                </v-btn>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { validations } from '@/mixins/form-validations'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'AddFeedDialog',
  mixins: [validations],
  props: {
    title: {
      type: String,
      default: ''
    },
    isAdd: {
      type: Boolean,
      // eslint-disable-next-line vue/no-boolean-default
      default: true
    }
  },
  data: () => ({
    testValue: null,
    showDeleteDiaLog: false,
    testOptions: [
      {
        id: 'a',
        label: 'a',
        children: [
          {
            id: 'aa',
            label: 'aa'
          },
          {
            id: 'ab',
            label: 'ab'
          }
        ]
      },
      {
        id: 'b',
        label: 'b'
      },
      {
        id: 'c',
        label: 'c'
      }
    ],
    showInput: false,
    itemInfo: {
      id: null,
      author: null,
      due_date: null,
      assignment_list: null,
      description: null,
      title: null,
      type: null,
      application_id: null,
      record_id: null
    },
    res: {
      due_date: false
    },
    options: {
      records: [],
      type: []
    },
    availableApps: [
      {
        id: -1,
        title: 'ITApps'
      }
    ],
    imageFiles: [],
    docFiles: [],
    minimized: false,
    offset: true
  }),
  computed: {
    ...mapGetters('Companies', { companyUsers: 'getCurrentCompanyUsers' }),
    ...mapGetters('Auth', { user: 'getUser' })
  },
  mounted() {
    if (this.isAdd) {
      this.itemInfo['author'] = this.user.id
      this.selects({ params: ['wo_request_type'], nesting: 1 }).then(res => {
        this.options['type'] = res['data']['wo_request_type']
      })
    } else {
      this.itemInfo['id'] = this.action.id
      this.itemInfo['author'] = this.action.author
      this.itemInfo['due_date'] = new Date(this.action.due_date)
      this.itemInfo['assignment_list'] = this.action.wo_assignments.map(
        assignment => assignment.assignee
      )
      this.itemInfo['description'] = this.action.description
      this.itemInfo['title'] = this.action.title
      this.itemInfo['type'] = this.action.type.id
      this.itemInfo['application_id'] = this.action.application_id
      this.itemInfo['record_id'] = this.action.record && this.action.record.id
      this.selects({ params: ['wo_request_type'], nesting: 1 }).then(res => {
        this.options['type'] = res['data']['wo_request_type']
      })
    }

    // TODO: The available apps list should be on a global list on the store.
    this.getApps().then(response => {
      response.data.map(app => {
        this.availableApps.push({
          id: app.id,
          title: app.title
        })
      })
    })
  },
  methods: {
    ...mapActions('ITAppsModule', { selects: 'get_all_selects' }),
    ...mapActions('WorkOrderModule', {
      records: 'getRecords',
      getApps: 'getAvailableApps',
      postAction: 'postAction',
      updateActionItemInfo: 'updateActionItemInfo',
      getActions: 'getActionsFeed',
      workOrder: 'setWorkOrder'
    }),
    changeRecord(event) {
      if (event === -1) {
        this.records('itapps').then(res => {
          this.options['records'] = res['data']
        })
      } else {
        this.getActions(event).then(response => {
          this.options['records'] = response.data
        })
      }
    },
    onImagesChange(e) {
      this.imageFiles = e
      this.$refs.inputFeed.focus()
    },
    onDocsChange(e) {
      this.docFiles = e
      this.$refs.inputFeed.focus()
    },
    async deleteAction(activity) {
      await this.$store.dispatch('GSFeed/removeActivity', activity.id)
      if (activity.props) {
        await this.deleteAct(activity.props.id)
        this.$store.dispatch('GSFeed/setEmptyActionPost')
        this.$store.dispatch('WorkOrderModule/setWorkOrder')
      }
      this.showDeleteDiaLog = false
      await this.$store.dispatch('GSFeed/retrieveFeed')
    },
    post() {
      this.itemInfo['activity'] = {
        userID: this.user.id,
        data: {
          actor: JSON.stringify({
            created_at: new Date(),
            updated_at: new Date(),
            id: this.user.id,
            data: {
              image: this.user.profilePic,
              name: `${this.user.firstName} ${this.user.lastName}`
            }
          }),
          foreign_id: `${Date.now()}-post-${Math.floor(
            Math.random() * 9999999
          )}`,
          time: new Date().toISOString(),
          message: this.itemInfo.description,
          verb: 'action',
          object: 1
        }
      }
      this.itemInfo['company_id'] = this.user.companies.items.find(
        c => c.active
      )['id']
      this.itemInfo['start_date'] = new Date().toISOString().slice(0, 10)
      this.itemInfo['requested_date'] = new Date().toISOString().slice(0, 10)
      this.itemInfo['due_date'] = this.itemInfo.due_date
        .toISOString()
        .replace(/T/, ' ')
        .replace(/\..+/, '')
      this.showInput = false

      if (this.isAdd) {
        this.postAction(this.itemInfo).then(() => {
          this.workOrder()
        })
      } else {
        this.updateActionItemInfo(this.itemInfo).then(() => {
          this.workOrder()
        })
      }
    },
    normalizer(node) {
      return {
        label: node.value
      }
    }
  }
}
</script>

<style>
.disabled {
  pointer-events: none;
  color: #b6b6b6;
  cursor: not-allowed;
  background-image: none;
}
.modal-close-btn {
  position: absolute;
  left: -10px;
  top: -10px;
  z-index: 999;
  border: 2px solid #ccc;
  box-shadow: 1px 1px white;
  background-color: black;
  color: white !important;
}
.overflow-visible {
  overflow: visible;
}

.v-dialog.w-500 {
  max-width: 500px !important;
}

.v-card__title.ctm-mb-16 {
  margin-bottom: 16px !important;
}
</style>
