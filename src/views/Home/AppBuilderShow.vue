<template>
  <app-template
    :is-persistent="$route.name === 'record.show'"
    :open-dialog="true"
    :props-dialog="true"
  >
    <v-card
      slot="header"
      class="d-flex justify-center rounded-0 w-full"
      :color="headerBackgroundColor"
      flat
    >
      <v-card
        class="align-center d-flex justify-space-between max-w-lg mx-auto pb-4 pt-6 relative rounded-0 w-full"
        :color="headerBackgroundColor"
        flat
      >
        <div
          class="align-center d-flex w-full"
        >
          <v-col
            class="d-flex relative"
            cols="10"
          >
            <v-btn
              class="absolute"
              color="red darken-1"
              icon
              style="left: -40px; top: 13px;"
              @click="$router.back"
            >
              <v-icon>
                mdi-close
              </v-icon>
            </v-btn>
            <div class="d-flex w-full">
              <v-img
                v-if="record.image"
                :alt="record.image"
                class="rounded"
                height="150"
                :src="record.image"
                width="180"
              />

              <v-icon
                v-else
                size="180"
              >
                mdi-store
              </v-icon>

              <m6-upload
                accepted-file-type="image"
                btn-button="purple"
                class="absolute left-0 ml-3 mt-2 top-0"
                @loading="loading = !loading"
                @response="recordImageRes"
              >
                <v-icon>mdi-cloud-upload</v-icon>
              </m6-upload>

              <v-btn
                v-if="record.image"
                color="red darken-2"
                icon
                small
                @click="deleteRecordImage"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>

              <div class="pl-8 w-full">
                <p
                  class="font-weight-regular mb-1 text-h7"
                  :style="'color: ' + headerTextColor + ';'"
                >
                  {{ record['record_number'] }}
                </p>
                <v-spacer />
                <div
                  v-if="!editTitleMode"
                  class="relative w-fit"
                >
                  <p
                    class="font-weight-regular mb-1 text-h5"
                    :style="'height: 68px; overflow: hidden; text-overflow: ellipsis; color: ' + headerTextColor + ';'"
                  >
                    {{ record.title }}
                  </p>
                  <v-btn
                    class="absolute pointer"
                    color="grey darken-1"
                    icon
                    style="right: -40px; top: -10px;"
                    @click="showEditTitleMode"
                  >
                    <v-icon size="18">
                      mdi-pencil
                    </v-icon>
                  </v-btn>
                </div>
                <div
                  v-else
                  class="d-flex"
                >
                  <v-textarea
                    v-model="updatedTitle"
                    auto-grow
                    class="mb-0"
                    label="Edit Title"
                    name="input-7-1"
                    outlined
                    @keyup.enter="editTitle"
                    @keyup.esc="cancelEditTitle"
                  />
                  <div
                    class="d-flex flex-column"
                  >
                    <v-btn
                      class="ml-2"
                      color="red"
                      icon
                      @click="cancelEditTitle"
                    >
                      <v-icon size="22">
                        mdi-close
                      </v-icon>
                    </v-btn>
                    <v-btn
                      class="ml-2"
                      color="green accent-3"
                      :disabled="record.title === updatedTitle"
                      icon
                      @click="editTitle"
                    >
                      <v-icon
                        size="22"
                      >
                        mdi-check
                      </v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="2">
            <v-row
              align="center"
              no-gutters
            >
              <v-spacer />
              <div
                class="align-center d-flex flex-column justify-center"
              >
                <v-img
                  v-if="app.iconLink"
                  :alt="app.iconLink"
                  class="rounded-lg"
                  height="70"
                  :src="app.iconLink"
                  style="border-radius: 14px !important;"
                  width="70"
                />
                <v-avatar
                  v-else
                  :color="iconData.background"
                  size="100"
                  class="d-inline-block"
                >
                  <v-icon
                    :color="iconData.iconColor"
                    size="60"
                  >
                    {{ iconData.icon }}
                  </v-icon>
                </v-avatar>
                <span
                  class="mt-3 text-center"
                  :style="'color: ' + headerTextColor + ';'"
                >{{ app['title'] }}</span>
                <v-btn
                  color="red darken-2"
                  icon
                  small
                  @click="deletingRecord"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </v-row>
          </v-col>

          <m6-loading :loading="loading" />

          <m6-confirm-delete
            message="Are you sure you want to delete this record?"
            :show="showDeleteDialog"
            title="Delete Current Record"
            @cancel="cancelDelete"
            @confirm="confirmDelete"
          />
        </div>
      </v-card>
    </v-card>
    <div
      slot="tabs"
      class="d-flex"
    >
      <v-tabs
        v-model="currentTab"
        active-class="font-weight-black blue--text active-tab-company"
        :hide-slider="true"
      >
        <v-tab
          v-for="(tab, i) in $h.dg(app, 'tabs', [])"
          :key="`tabs-${i}`"
          class="blue--text capitalize"
        >
          {{ tab.title }}
        </v-tab>
      </v-tabs>
    </div>
    <div
      slot="btns"
      class="align-center d-flex"
    />
    <div
      v-for="(tab, i) in $h.dg(app, 'tabs', [])"
      v-show="i === currentTab"
      :key="`tab-item-${i}`"
      slot="content"
      class="w-full"
    >
      <panel-two-columns
        :left-column="tab.full_width ? 12 : 5"
        :right-column="tab.full_width ? 12 : 7"
      >
        <div slot="leftPanel">
          <div
            v-for="(panel, index) in panelsByColumn( $h.dg( tab, 'panels', []), 0 )"
            :key="`p-l-${index}`"
            class="card-custom-shadow mb-3 panel px-4 py-3 rounded white"
          >
            <h3>{{ panel.title }}</h3>
            <form-show-generator
              :action-record="true"
              :fields="$h.dg(panel, 'fields', [])"
              :helper-media-u-r-l="helperMediaURL"
              :panel="panel"
              :show-standard-fields="(tab.readOnly && index === 0)"
            />

            <div
              v-for="(table, index) in $h.dg(panel, 'tables', [])"
              :key="`panel-table-${index}`"
            >
              <generated-table
                edit-mode
                :record-i-d="Number($route.params.id)"
                :table="table"
              />
            </div>
          </div>
        </div>

        <div
          v-if="!tab.full_width"
          slot="rightPanel"
        >
          <div
            v-if="currentTab === 0"
            class="main-content px-0"
          >
            <project-social-media
              class="px-0"
              :external="true"
            />
          </div>
          <div v-else>
            <div
              v-for="(panel, index) in panelsByColumn( $h.dg( tab, 'panels', []), 1 )"
              :key="`p-l-${index}`"
              class="mb-3 panel px-4 py-3 white"
            >
              <h3>{{ panel.title }}</h3>

              <form-show-generator
                :action-record="true"
                :fields="$h.dg(panel, 'fields', [])"
                :panel="panel"
              />
            </div>
          </div>
        </div>
      </panel-two-columns>
    </div>
  </app-template>
</template>

<script>
import AppTemplate from '@/views/Home/AppTemplate'
import ProjectSocialMedia from './ProjectSocialMedia'
import PanelTwoColumns from '@/components/AppBuilder/Content/PanelTwoColumns'
import { mapState, mapMutations, mapActions } from 'vuex'
import FormShowGenerator from '@/components/AppBuilder/Form/FormShowGenerator.vue'
import DeleteDialog from '@/components/Dialogs/DeleteDialog'
import GeneratedTable from '@/components/AppBuilder/GenericTable/GeneratedTable'

export default {
  name: 'AppBuilderShow',

  components: {
    AppTemplate,
    ProjectSocialMedia,
    PanelTwoColumns,
    FormShowGenerator,
    DeleteDialog,
    GeneratedTable
  },

  mounted() {
    this.$store.dispatch('AppBuilder/getApp', this.$route.params.id).then(res => {
      console.log(res)
      this.currentApp = res
      try {
        if (res.helperMedia) {
          this.helperMediaURL = res.helperMedia[0].helper_media ? res.helperMedia[0].helper_media : ''
        }
        if (res.metadata) {
          this.currentApp.metadata = JSON.parse(res.metadata)
          this.headerBackgroundColor = this.currentApp.metadata.appHeader ? this.currentApp.metadata.appHeader.headerBackgroundColor : '#fff'
          this.headerTextColor = this.currentApp.metadata.appHeader ? this.currentApp.metadata.appHeader.headerTextColor : '#AAA'
        } else {
          this.headerBackgroundColor = '#fff'
          this.headerTextColor = '#AAA'
        }
      // eslint-disable-next-line no-empty
      } catch (e) {}
    })
  },

  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),

    ...mapState('RecordsInstance', {
      record: 'currentRecord',
      showSelf: 'displayAppBuilderShow'
    }),

    ...mapState('AppBuilder', {
      app: 'app',
      iconData: 'iconData'
    }),

    panelsByColumn() {
      return (panels, column) => panels.filter(p => p.column === column)
    }
  },

  watch: {
    async record(val) {
      await this.$store.dispatch('GSFeed/setRoom', 'AppBuilder')
      await this.$store.dispatch('GSFeed/setBuilderFeed', val.record_number.replace('#', '_'))
      await this.$store.dispatch('GSFeed/cleanFeed')
      await this.$store.dispatch('GSFeed/retrieveFeed')
    }
  },

  methods: {
    ...mapActions('AppBuilder', {
      getApp: 'getApp',
      updateRecord: 'updateRecord',
      deleteRecord: 'deleteRecord'
    }),
    ...mapMutations('RecordsInstance', {
      displayAppBuilderShow: 'displayAppBuilderShow'
    }),
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),
    ...mapActions('AppBuilder', {
      updateRecord: 'updateRecord'
    }),
    ...mapActions('File', {
      deleteFileFromS3: 'deleteFileFromS3'
    }),
    deletingRecord() {
      this.showDeleteDialog = true
    },
    async deleteRecordImage() {
      try {
        this.loading = true
        if (this.$h.dg(this.record, 'image', '').length) {
          const splitLink = this.record.image.split('com')
          const key = splitLink[1].substr(1)

          await this.deleteFileFromS3({ key })
          this.record.image = ''
          await this.updateRecord(this.record)
        }

        this.loading = false
        this.notifSuccess('The image was deleted')
      } catch (e) {
        this.notifDanger('There was an error while deleting App Icon Image')
        this.loading = false
      }
    },
    async confirmDelete() {
      this.showDeleteDialog = false

      try {
        this.loading = true
        await this.deleteRecord(this.record.id)
        this.notifSuccess('The record was deleted')
        this.$router.push('/')
        this.loading = false
      } catch (e) {
        this.loading = false
        this.notifDanger('There was an error while deleting the Record')
      }
    },
    cancelDelete() {
      this.showDeleteDialog = false
    },
    async recordImageRes(res) {
      if (res.ok) {
        this.record.image = res.data.link
        try {
          this.loading = true
          await this.updateRecord(this.record)
          this.loading = false
          this.notifSuccess('Record Updated!')
        } catch (e) {
          this.loading = false
          this.notifDanger('There was an error while saving the file')
        }
      } else {
        this.notifDanger('There was an error while saving the file')
      }
    },
    showEditTitleMode() {
      this.updatedTitle = this.record.title
      this.editTitleMode = true
    },
    cancelEditTitle() {
      this.editTitleMode = false
    },
    async editTitle() {
      this.record.title = this.updatedTitle
      await this.updateRecord(this.record)
      this.editTitleMode = false
    }
  },

  data: () => ({
    tabs: [],
    currentTab: 0,
    loading: false,
    editTitleMode: false,
    updatedTitle: '',
    loading: false,
    currentApp: {},
    showDeleteDialog: false,
    headerBackgroundColor: '#fff',
    headerTextColor: '#aaa',
    helperMediaURL: ''
  })

}
</script>

<style lang="scss" scoped>
.flex-row {
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
}
</style>
