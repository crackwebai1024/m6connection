<template>
  <v-container
    class="d-flex dont-show-scroll h-full ma-0 pb-0 pt-5 px-0 vertical-scroll"
    :class="{
      'w-full': $vuetify.breakpoint.xs,
      'w-3__5': $vuetify.breakpoint.md || $vuetify.breakpoint.sm,
      'max-w-md w-content': $vuetify.breakpoint.lgAndUp,
    }"
  >
    <!-- General use list component-->
    <!-- Companies List Component (add main-content class)-->
    <v-row>
      <app-template-plain :props-dialog="true">
        <div
          slot="header"
          class="align-center d-flex justify-space-between max-w-lg mx-auto px-8 py-5 w-full"
        >
          <div class="align-center d-flex">
            <div v-if="project">
              <v-img
                v-if="project.projectImage"
                alt="Project Image"
                height="150"
                :src="project.projectImage"
              />
              <div
                v-else
                class="d-flex grey items-center justify-center lighten-3 mr-6"
                style="width: 150px; height: 150px; border-radius: 5px"
              >
                <v-icon
                  color="grey lighten-1"
                  size="38"
                >
                  mdi-image-filter-hdr
                </v-icon>
              </div>
            </div>
            <div>
              <h2>{{ $h.dg(project, "title", "") }}</h2>
              <p
                class="mb-0"
                v-text="$h.dg(project, 'description', '')"
              />
              <p
                class="mb-0"
                v-text="$h.dg(project, 'manager.label', '')"
              />
            </div>
          </div>
          <div class="absolute mr-3 mt-3 right-0 top-0">
            <div class="relative">
              <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    icon
                    v-on="on"
                    @click="$router.replace('/app/cpm')"
                  >
                    <v-icon color="blue lighten-1">
                      mdi-keyboard-return
                    </v-icon>
                  </v-btn>
                </template>
                <span
                  class="grey lighten-4 px-3 py-2 rounded"
                >Project List</span>
              </v-tooltip>
            </div>
          </div>
        </div>
        <div
          slot="tabs"
          class="align-center d-flex"
        >
          <v-tabs
            v-model="activeTab"
            active-class="font-weight-black blue--text active-tab-company"
          >
            <v-tab
              v-for="tab in tabs"
              :key="tab.id"
              class="blue--text capitalize"
            >
              {{ tab }}
            </v-tab>
          </v-tabs>
        </div>
        <div
          slot="btns"
          class="align-center d-flex"
        />
        <div
          slot="content"
          class="w-full"
        >
          <template v-if="activeTab === 0">
            <panel-two-columns
              :left-column="4"
              :right-column="8"
            >
              <div
                slot="leftPanel"
                class=""
              >
                <edit-panel-dialog
                  v-if="panelToEdit.items"
                  v-model="showEditPanel"
                  :panel.sync="panelToEdit"
                  @update="updateProject"
                />
                <v-col
                  v-for="(panel, index) in projectInformation"
                  :key="index"
                  class="card-custom-shadow mb-3 px-6 py-5 rounded white"
                >
                  <h3
                    class="font-weight-bold grey--text spacing-tight text--darken-3"
                    style="position: relative"
                  >
                    {{ panel.title }}
                    <v-btn
                      absolute
                      fab
                      right
                      x-small
                      @click="showPanelEditModal(panel)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </h3>
                  <v-row
                    v-for="(item, index) in panel.items"
                    :key="index"
                  >
                    <v-col class="align-center d-flex flex-grow-0 flex-shrink-0">
                      <img
                        v-if="item.icon === 'mdi-currency-usd'"
                        alt="Money Icon"
                        src="../../assets/money-icon.svg"
                        width="30"
                      >
                      <v-icon
                        v-else
                        color="grey lighten-1"
                      >
                        {{ item.icon || 'mdi-information' }}
                      </v-icon>
                    </v-col>
                    <v-col class="flex-grow-1 flex-shrink-0">
                      <v-input :messages="item.label">
                        <template v-if="item.icon === 'mdi-currency-usd'">
                          <b class="grey--text text--darken-3 text--lighten-2">
                            {{ '$' + currencyFormatting(item.value) }}
                          </b>
                        </template>
                        <b
                          v-else
                          class="grey--text text--darken-3 text--lighten-2"
                        >{{ item.value || '' }}</b>
                      </v-input>
                    </v-col>
                  </v-row>
                </v-col>
                <div class="d-none overflow-hidden">
                  <div class="align-center d-flex my-3">
                    <v-icon
                      class="grey--text text--darken-3"
                      size="22"
                    >
                      mdi-clipboard-file-outline
                    </v-icon>
                    <p
                      class="font-weight-ligshten grey--text mb-0 ml-3 text--darken-3 text-body-2 w-4/5"
                    >
                      Company Name
                    </p>
                  </div>
                  <div class="align-center d-flex my-3">
                    <v-icon
                      class="grey--text text--darken-3"
                      size="22"
                    >
                      mdi-email-outline
                    </v-icon>
                    <p
                      class="font-weight-ligshten grey--text mb-0 ml-3 text--darken-3 text-body-2 w-4/5"
                    >
                      company@gmail.com
                    </p>
                  </div>
                  <div class="align-center d-flex my-3">
                    <v-icon
                      class="grey--text text--darken-3"
                      size="22"
                    >
                      mdi-clipboard-file-outline
                    </v-icon>
                    <p
                      class="font-weight-ligshten grey--text mb-0 ml-3 text--darken-3 text-body-2 w-4/5"
                    >
                      Company Last Name
                    </p>
                  </div>
                  <div class="align-center d-flex my-3">
                    <v-icon
                      class="grey--text text--darken-3"
                      size="22"
                    >
                      mdi-phone
                    </v-icon>
                    <p
                      class="font-weight-ligshten grey--text mb-0 ml-3 text--darken-3 text-body-2 w-4/5"
                    >
                      (+51) 9874363722
                    </p>
                  </div>
                  <div class="align-center d-flex my-3">
                    <v-icon
                      class="grey--text text--darken-3"
                      size="22"
                    >
                      mdi-earth
                    </v-icon>
                    <p
                      class="font-weight-ligshten grey--text mb-0 ml-3 text--darken-3 text-body-2 w-4/5"
                    >
                      www.company.com
                    </p>
                  </div>
                </div>
              </div>

              <div
                slot="rightPanel"
                class="mb-4 panel px-0"
              >
                <project-social-media
                  class="px-0"
                  :external="true"
                />
              </div>
            </panel-two-columns>
          </template>
          <!--FINANCIALS-->
          <template v-if="activeTab === 1">
            <panel-full>
              <template slot="content">
                <financial-cost-summary />
              </template>
            </panel-full>
            <v-spacer />
            <panel-full>
              <template slot="content">
                <reconciliation />
              </template>
            </panel-full>
            <v-spacer />
            <panel-full>
              <template slot="content">
                <financial-commitments />
              </template>
            </panel-full>
            <v-spacer />
            <panel-full>
              <template slot="content">
                <financial-spendings />
              </template>
            </panel-full>
            <panel-full>
              <template slot="content">
                <budgets />
              </template>
            </panel-full>
            <v-spacer />
          </template>
          <!--FINANCIALS-->

          <!--SCHEDULE-->
          <template v-if="activeTab === 2">
            <!-- <panel-full
              v-if="!panelSettings.mileTracker"
            >
              <template slot="content">
                <milestones :type="type" />
              </template>
            </panel-full> -->
            <!-- <panel-full v-if="!panelSettings.mileSchedule">
              <template slot="content">
                <schedule :type="type" />
              </template>
            </panel-full>
            <panel-full v-if="isPlannedProject">
              <template slot="content">
                <forecasts />
              </template>
            </panel-full> -->
          </template>
          <!--SCHEDULE-->

          <!--DOCUMENT MANAGER-->
          <template v-if="activeTab === 3">
            <panel-full>
              <template slot="content">
                <project-files />
              </template>
            </panel-full>
          </template>
          <!--DOCUMENT MANAGER-->

          <!-- UPDATES -->
          <template v-if="activeTab === 4">
            <panel-two-columns>
              <budget-comment slot="leftPanel" />
              <status-comment slot="rightPanel" />
            </panel-two-columns>
          </template>
          <!-- UPDATES -->

          <!--REPORTS-->
          <template v-if="activeTab === 5">
            <!-- <panel-full v-if="!panelSettings.mileSchedule">
              <template slot="content">
                <schedule :type="type" />
              </template>
            </panel-full>
            <panel-full v-if="isPlannedProject">
              <template slot="content">
                <forecasts />
              </template>
            </panel-full> -->
          </template>
          <!--REPORTS-->

          <!--SETTINGS-->
          <template v-if="activeTab === 6">
            <panel-full>
              <settings-tab slot="content" />
            </panel-full>
          </template>
        </div>
      </app-template-plain>
    </v-row>
  </v-container>
</template>

<script>
const defaults = {
  money: '0.00',
  text: 'N/A',
  date: '--/--/----',
  percent: '0'
}
import { mapGetters, mapActions } from 'vuex'
import RecordContainer from '@/components/RecordMode/RecordContainer'
import AppTemplatePlain from '@/views/Home/AppTemplatePlain'
import PanelFull from '@/components/AppBuilder/Content/PanelFull'
import PanelTwoColumns from '@/components/AppBuilder/Content/PanelTwoColumns'
import FinancialCostSummary from '@/modules/cpm/components/projects/panels/FinancialCostSummary'
import Budgets from '@/modules/cpm/components/projects/panels/Financial/Budgets'
import Reconciliation from '@/modules/cpm/components/projects/panels/Reconciliation'
import FinancialCommitments from '@/modules/cpm/components/projects/panels/FinancialCommitments'
import FinancialSpendings from '@/modules/cpm/components/projects/panels/FinancialSpendings'
import ProjectSocialMedia from '@/views/Home/ProjectSocialMedia'
import Milestones from '@/modules/cpm/components/projects/panels/schedule/Milestones'
import Schedule from '@/modules/cpm/components/projects/panels/schedule/SchedulePanel'
import Forecasts from '@/modules/cpm/components/projects/panels/Forecasts/ForecastsPanel'
import ProjectFiles from '@/modules/cpm/components/projects/panels/ProjectFiles'
import SettingsTab from '@/modules/cpm/components/settings/Settings.vue'
import {
  db,
  newFirebaseInit,
  doFirebaseAuth
} from '@/utils/Firebase'
import StatusComment from '../../modules/cpm/components/projects/panels/StatusComment.vue'
import BudgetComment from '../../modules/cpm/components/projects/panels/BudgetComment.vue'
import EditPanelDialog from '../Dialogs/EditPanelDialog'

export default {
  name: 'Apps',
  components: {
    EditPanelDialog,
    RecordContainer,
    AppTemplatePlain,
    PanelFull,
    PanelTwoColumns,
    Milestones,
    FinancialCostSummary,
    Reconciliation,
    ProjectSocialMedia,
    FinancialCommitments,
    FinancialSpendings,
    Schedule,
    Forecasts,
    SettingsTab,
    Budgets,
    ProjectFiles,
    StatusComment,
    BudgetComment
  },
  data: () => ({
    showEditPanel: false,
    panelToEdit: {},
    projectInformation: [
      {
        title: 'Project Quickview',
        type: 'basic',
        items: [
          {
            label: 'Project Title',
            value: '',
            model: 'title',
            default: defaults.text,
            icon: 'mdi-information'
          },
          {
            label: 'Project Manager',
            value: '',
            default: defaults.text,
            icon: 'mdi-badge-account'
          },
          {
            label: 'Region',
            value: '',
            model: 'region',
            default: defaults.text,
            icon: 'mdi-information'
          },
          {
            label: 'Status',
            value: '',
            model: 'status',
            default: defaults.text,
            icon: 'mdi-list-status'
          },
          {
            label: 'Category 1',
            value: '',
            default: defaults.text,
            icon: 'mdi-subtitles-outline'
          },
          {
            label: 'Range',
            value: '',
            default: defaults.text,
            icon: 'mdi-information'
          },
          {
            label: 'Prior Spend',
            value: '',
            default: defaults.text,
            icon: 'mdi-information'
          },
          {
            label: 'Current Financial Year Actuals with Forecasted',
            value: '',
            default: defaults.text,
            icon: 'mdi-information'
          },
          {
            label: 'YTD Actuals Capitals',
            value: '',
            default: defaults.money,
            icon: 'mdi-currency-usd'
          },
          {
            label: 'CPA Capital',
            value: '',
            default: defaults.money,
            icon: 'mdi-currency-usd'
          },
          {
            label: 'CPA Capital With Contingency',
            value: '',
            default: defaults.money,
            icon: 'mdi-currency-usd'
          },
          {
            label: 'General Contractor',
            value: '',
            default: defaults.text,
            icon: 'mdi-badge-account'
          },
          {
            label: 'Description',
            value: '',
            model: 'description',
            default: defaults.text,
            icon: 'mdi-information'
          },
          {
            label: 'Phase',
            value: '',
            default: defaults.text,
            icon: 'mdi-badge-account'
          },
          {
            label: 'Target Date / Phase',
            value: '',
            default: defaults.date,
            icon: 'mdi-calendar'
          },
          {
            label: 'Construction Start',
            value: '',
            default: defaults.date,
            icon: 'mdi-calendar'
          },
          {
            label: 'Anticipated Construction Finish',
            value: '',
            default: defaults.date,
            icon: 'mdi-calendar'
          },
          {
            label: 'Complete Budget',
            value: '',
            default: defaults.percent,
            icon: 'mdi-percent'
          },
          {
            label: 'Complete Schedule',
            value: '',
            default: defaults.percent,
            icon: 'mdi-percent'
          },
          {
            label: 'Complete',
            value: '',
            default: defaults.percent,
            icon: 'mdi-percent'
          },
          {
            label: 'Budget Status',
            value: '',
            default: defaults.percent,
            icon: 'mdi-percent'
          },
          {
            label: 'Total Project Budget',
            value: '',
            default: defaults.money,
            icon: 'mdi-currency-usd'
          },
          {
            label: 'Spent to Date',
            value: '',
            default: defaults.money,
            icon: 'mdi-currency-usd'
          }
        ]
      }
      // {
      //   title: "Schedule & Budget",
      //   type: "schedule", // use the same for editpaneldialog.vue
      //   items: [
      //     {
      //       label: "Phase",
      //       value: "",
      //       default: defaults.text,
      //       icon: "mdi-badge-account",
      //     },
      //     {
      //       label: "Target Date / Phase",
      //       value: "",
      //       default: defaults.date,
      //       icon: "mdi-calendar",
      //     },
      //     {
      //       label: "Construction Start",
      //       value: "",
      //       default: defaults.date,
      //       icon: "mdi-calendar",
      //     },
      //     {
      //       label: "Anticipated Construction Finish",
      //       value: "",
      //       default: defaults.date,
      //       icon: "mdi-calendar",
      //     },
      //     {
      //       label: "Complete Budget",
      //       value: "",
      //       default: defaults.percent,
      //       icon: "mdi-percent",
      //     },
      //     {
      //       label: "Complete Schedule",
      //       value: "",
      //       default: defaults.percent,
      //       icon: "mdi-percent",
      //     },
      //     {
      //       label: "Complete",
      //       value: "",
      //       default: defaults.percent,
      //       icon: "mdi-percent",
      //     },
      //     {
      //       label: "Budget Status",
      //       value: "",
      //       default: defaults.percent,
      //       icon: "mdi-percent",
      //     },
      //     {
      //       label: "Total Project Budget",
      //       value: "",
      //       default: defaults.money,
      //       icon: "mdi-currency-usd",
      //     },
      //   ],
      // },
      // {
      //   title: "Commitments & Spendings",
      //   type: "milestones",
      //   items: [
      //     {
      //       label: "Spent to Date",
      //       value: "",
      //       default: defaults.money,
      //       icon: "mdi-currency-usd",
      //     },
      //   ],
      // },
    ],
    tab: null,
    items: ['Profile', 'People', 'Details'],
    currentTab: 0,
    project: {},
    type: 'project',
    tabs: [
      'Home',
      'Financials',
      'Schedule',
      'Document Manager',
      'Updates',
      'Reports',
      'Settings'
    ],
    activeTab: 0
  }),
  computed: {
    isPlannedProject() {
      return this.$h.dg(this.$route, 'name') === 'cpm.forecasting.show'
    },
    ...mapGetters({
      getScreenStatus: 'GeneralListModule/get_screen_status',
      getRecordFullScreen: 'GeneralListModule/get_record_full_screen',
      getImagePreviewOverlay: 'get_image_preview_overlay'
    }),
    ...mapGetters({
      panelSettings: 'hideCpmPanels/getPanelSettings'
    })
  },
  async created() {
    // Init Firebase
    await newFirebaseInit()
    await doFirebaseAuth()

    const res = await db
      .collection('cpm_projects')
      .doc(this.$route.params.id)
      .get()
    this.project = res.data()
    await this.$store.dispatch('GSFeed/setRoom', 'cpm')
    await this.$store.dispatch('GSFeed/setCpmFeed', this.$route.params.id)
    await this.$store.dispatch('GSFeed/retrieveFeed')

    await this.getPanelSettings()
  },
  beforeDestroy() {},
  methods: {
    async updateProject() {
      const res = await db
        .collection('cpm_projects')
        .doc(this.$route.params.id)
        .get()
      this.project = res.data()
    },
    showPanelEditModal(panel) {
      this.panelToEdit = { ...panel }
      this.showEditPanel = true
    },
    camelize(str) {
      return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
          return index === 0 ? word.toLowerCase() : word.toUpperCase()
        })
        .replace(/\s+/g, '')
        .replace('/', '')
    },
    ...mapActions({
      getPanelSettings: 'hideCpmPanels/getSettings'
    }),
    currencyFormatting(value) {
      if (isNaN(value)) {
        return 0
      }
      return Math.round(value).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
    }
  },
  watch: {
    project: function () {
      if (this.project) {
        this.projectInformation.forEach(
          function (panel) {
            panel.items.map(
              function (item) {
                if (this.project[panel.type]) {
                  item.value =
                    typeof item.model !== 'undefined'
                      ? this.project[item.model]
                      : this.project[panel.type][this.camelize(item.label)] ||
                        ''
                }
              }.bind(this)
            )
          }.bind(this)
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
