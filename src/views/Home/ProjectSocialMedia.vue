<!--eslint-disable vue/v-on-function-call-->
<!-- eslint-disable vue/no-parsing-error -->
<template>
  <v-container
    class="py-0 w-full"
  >
    <header-component
      v-if="!readOnly"
      class="card-custom-shadow h-auto mb-4 rounded"
      hasslot
      :info="{title: '', icon: ''}"
    >
      <template
        v-if="!external"
        v-slot:select
      >
        <v-menu
          bottom
          offset-y
          transition="slide-y-transition"
        >
          <template #activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              class="capitalize font-weight-bold mb-0 pl-1 purple--text px-0 text--darken-1 transparent"
              elevation="0"
              v-on="on"
            >
              {{ titlePage }}
              <v-icon class="blue--text text--darken-3">
                mdi-chevron-down
              </v-icon>
            </v-btn>
          </template>
          <template v-if="!postListShow">
            <v-list dense>
              <v-list-item
                v-for="(item, i) in areas"
                :key="i"
              >
                <v-list-item-title
                  :class="item.type === 'title' ? 'grey--text' : 'black--text pointer' "
                  @click="item.function"
                >
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </template>
        </v-menu>
      </template>
      <template #input>
        <v-icon
          v-if="user.profilePic === ''"
          color="primary"
          size="40"
        >
          mdi-account-outline
        </v-icon>
        <img
          v-else
          :alt="user.firstName"
          class="mr-1 rounded-circle"
          height="40"
          :src="user.profilePic"
          width="40"
        >
        <v-row>
          <v-col
            class="pt-0"
            cols="12"
          >
            <v-text-field
              v-model="activityText"
              class="font-weight-bold ml-1"
              dense
              :disabled="postListShow"
              flat
              height="40"
              hide-details
              :label="`Whats on your mind, ${user.firstName}?`"
              rounded
              single-line
              solo-inverted
              @keyup.enter="addActivity"
            >
              <template #append>
                <v-row
                  class="align-center d-flex"
                  style="min-width: 108px;"
                >
                  <v-menu
                    bottom
                    offset-y
                    open-on-hover
                  >
                    <template #activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        color="primary"
                        dark
                        icon
                        v-on="on"
                        @click="$refs.fileInput.click()"
                      >
                        <v-icon>mdi-file-plus-outline</v-icon>
                      </v-btn>
                    </template>
                  </v-menu>
                  <v-menu
                    v-model="menu"
                    bottom
                    :close-on-content-click="false"
                    offset-y
                  >
                    <template #activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        color="primary"
                        dark
                        icon
                        v-on="on"
                      >
                        <v-icon>mdi-apps</v-icon>
                      </v-btn>
                    </template>
                    <v-list width="256">
                      <v-list-item>
                        <v-select
                          v-model="itemInfo.applicationId"
                          item-text="title"
                          item-value="id"
                          :items="availableApps"
                          label="Application"
                          @change="changeApp($event)"
                        >
                          <template
                            slot="selection"
                            slot-scope="data"
                          >
                            <!-- HTML that describe how select should render selected items -->
                            {{ data.item.title.length < 8 ?
                              data.item.title : data.item.title.substr(0, 7) + '...'
                            }}
                          </template>
                        </v-select>
                      </v-list-item>
                      <v-list-item>
                        <v-select
                          v-model="itemInfo.recordId"
                          :class="{ disabled: itemInfo.applicationId === null }"
                          height="50"
                          :item-value="Object"
                          :items="options.records"
                          label="Record"
                          @change="selectRecord($event)"
                        >
                          <template
                            slot="selection"
                            slot-scope="data"
                          >
                            <!-- HTML that describe how select should render selected items -->
                            {{ data.item.record_number }} - {{ data.item.title.length < 8 ?
                              data.item.title : data.item.title.substr(0, 7) + '...'
                            }}
                          </template>
                          <template
                            slot="item"
                            slot-scope="data"
                          >
                            <!-- HTML that describe how select should render items when the select is open -->
                            {{ data.item.record_number }} - {{ data.item.title }}
                          </template>
                        </v-select>
                      </v-list-item>
                      <v-list-item>
                        <v-select
                          v-model="itemInfo.panel"
                          :class="{ disabled: itemInfo.applicationId === null }"
                          height="50"
                          item-text="label"
                          :item-value="Object"
                          :items="options.panles"
                          label="Panel"
                          @change="selectPanel($event)"
                        >
                          <template
                            slot="selection"
                            slot-scope="data"
                          >
                            <!-- HTML that describe how select should render selected items -->
                            {{ data.item.label.length < 8 ?
                              data.item.label : data.item.label.substr(0, 7) + '...'
                            }}
                          </template>
                        </v-select>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  <v-btn
                    :disabled="postListShow"
                    icon
                    @click="addActivity"
                  >
                    <v-icon
                      class="blue--text text--lighten-1"
                    >
                      mdi-send
                    </v-icon>
                  </v-btn>
                </v-row>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12">
            <div class="w-full">
              <input
                v-show="false"
                ref="fileInput"
                multiple
                type="file"
                @change="onFilesChange"
              >
              <div
                v-if="srcVideoOrImageFiles.length > 0"
                class="align-center d-flex grey--text my-2 text-caption"
              >
                <v-divider class="blue-grey lighten-5" />
                <span class="mx-3">Image/Video</span>
                <v-divider class="blue-grey lighten-5" />
              </div>
              <div v-if="srcVideoOrImageFiles.length > 0">
                <div class="d-flex images-container mx-1 preview__container px-0 py-0">
                  <div
                    v-for="(srcVideoOrImage, index) in srcVideoOrImageFiles"
                    :key="'previewVI-' + index"
                    class="mx-1 relative w-fit"
                    @click="removeVideoOrImage(index)"
                  >
                    <template v-if="srcVideoOrImage.type === 'image'">
                      <img
                        class="image-preview"
                        :src="srcVideoOrImage.url"
                        style="width: 100px; height: 100px;"
                      >
                      <v-btn
                        class="absolute btn-chat-shadow ml-2 right-0 top-0 v-close-btn"
                        color="grey lighten-2"
                        fab
                        @click="removeVideoOrImage(index)"
                      >
                        <v-icon
                          size="12"
                        >
                          mdi-close
                        </v-icon>
                      </v-btn>
                    </template>
                    <template v-else>
                      <video
                        controls
                        height="100"
                        width="100"
                      >
                        <source
                          :src="srcVideoOrImage.url"
                          :type="srcVideoOrImage.type"
                        >
                        Your browser does not support the video tag.
                      </video>
                      <v-btn
                        class="absolute btn-chat-shadow ml-2 right-0 top-0 v-close-btn"
                        color="grey lighten-2"
                        fab
                        @click="removeVideoOrImage(index)"
                      >
                        <v-icon
                          size="12"
                        >
                          mdi-close
                        </v-icon>
                      </v-btn>
                    </template>
                  </div>
                </div>
              </div>
              <div
                v-if="docsFiles.length > 0"
                class="align-center d-flex grey--text my-2 text-caption"
              >
                <v-divider class="blue-grey lighten-5" />
                <span class="mx-3">Documents</span>
                <v-divider class="blue-grey lighten-5" />
              </div>
              <div v-if="docsFiles.length > 0">
                <div class="d-flex images-container mx-1 my-1 preview__container px-0 py-0">
                  <div
                    v-for="(doc, index) in docsFiles"
                    :key="'doc-' + index"
                    class="mx-1 relative w-fit"
                  >
                    <v-chip
                      class="ma-2"
                      color="primary"
                    >
                      <span class="white--text">{{ doc.name }}</span>
                    </v-chip>
                    <v-btn
                      class="absolute btn-chat-shadow ml-2 my-1 right-0 top-0 v-close-btn"
                      color="grey lighten-2"
                      fab
                      @click="removeFile(index)"
                    >
                      <v-icon
                        size="12"
                      >
                        mdi-close
                      </v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
              <div
                v-if="itemInfo['panel']"
                class="align-center d-flex grey--text my-2 text-caption"
              >
                <v-divider class="blue-grey lighten-5" />
                <span class="mx-3">Panel</span>
                <v-divider class="blue-grey lighten-5" />
              </div>
              <div
                v-if="itemInfo['panel']"
                class="mx-1 relative w-full"
              >
                <v-row no-gutters>
                  <v-col
                    class="pr-3"
                    cols="3"
                  >
                    <p class="grey--text my-0 py-0 text-caption text-center">
                      App
                    </p>
                    <v-spacer />
                    <p class="my-0 py-0">
                      {{ itemInfo['recordId']['app']['title'].length < 30 ?
                        itemInfo['recordId']['app']['title'] : itemInfo['recordId']['app']['title'].substr(0, 20) + '...' }}
                    </p>
                  </v-col>
                  <v-col
                    class="pr-3"
                    cols="3"
                  >
                    <p class="grey--text my-0 py-0 text-caption text-center">
                      Record
                    </p>
                    <v-spacer />
                    <p class="my-0 py-0">
                      {{ itemInfo['panel']['recordTitle'].length < 30 ?
                        itemInfo['panel']['recordTitle'] : itemInfo['panel']['recordTitle'].substr(0, 20) + '...' }}
                    </p>
                  </v-col>
                  <v-col
                    class="pr-3"
                    cols="3"
                  >
                    <p class="grey--text my-0 py-0 text-caption text-center">
                      Tab
                    </p>
                    <v-spacer />
                    <p class="my-0 py-0">
                      {{ itemInfo['panel']['tabTitle'].length < 30 ?
                        itemInfo['panel']['tabTitle'] : itemInfo['panel']['tabTitle'].substr(0, 20) + '...' }}
                    </p>
                  </v-col>
                  <v-col
                    class="pr-3"
                    cols="3"
                  >
                    <p class="grey--text my-0 py-0 text-caption text-center">
                      Panel
                    </p>
                    <v-spacer />
                    <p class="my-0 py-0">
                      {{ itemInfo['panel']['panelTitle'].length < 30 ?
                        itemInfo['panel']['panelTitle'] : itemInfo['panel']['panelTitle'].substr(0, 20) + '...' }}
                    </p>
                  </v-col>
                </v-row>
                <v-btn
                  class="absolute btn-chat-shadow ml-2 my-1 right-0 top-0 v-close-btn"
                  color="grey lighten-2"
                  fab
                  @click="itemInfo['panel'] = undefined"
                >
                  <v-icon
                    size="12"
                  >
                    mdi-close
                  </v-icon>
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </template>
    </header-component>
    <v-skeleton-loader
      v-if="showSkeletonPost"
      class="my-3"
      type="list-item-avatar-three-line, actions"
    />
    <M6Loading
      :loading="showLoading"
    />
    <posts-list
      v-if="!postListShow"
      :external="external"
    />
  </v-container>
</template>

<script>
/* eslint-disable camelcase */
import HeaderComponent from '@/components/Home/HeaderComponent'
import PostsList from '@/components/Home/SocialMedia/PostsList'
import { mapActions, mapGetters } from 'vuex'

export default {
  // eslint-disable-next-line vue/match-component-file-name
  name: 'SocialMedia',
  components: {
    HeaderComponent,
    PostsList
  },
  props: {
    external: {
      type: Boolean,
      default: false
    },
    postListShow: {
      type: Boolean,
      default: false
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    titlePage: '',
    menu: false,
    showLoading: false,
    activityText: '',
    docsFiles: [],
    imageFiles: [],
    urlInfo: {},
    itemInfo: {
      applicationId: null,
      recordId: null,
      panel: null
    },
    showSkeletonPost: false,
    options: {
      records: [],
      panles: [],
      type: []
    },
    availableApps: []
  }),

  computed: {
    ...mapGetters('Auth', { user: 'getUser' }),
    srcVideoOrImageFiles() {
      const srcVideoOrImages = []
      this.imageFiles.forEach(file => {
        if (file['type'].substr(0, file['type'].indexOf('/')) === 'video') {
          srcVideoOrImages.push({
            url: URL.createObjectURL(file),
            type: file['type']
          })
        }
        if (file['type'].substr(0, file['type'].indexOf('/')) === 'image') {
          srcVideoOrImages.push({
            url: URL.createObjectURL(file),
            type: 'image'
          })
        }
      })
      return srcVideoOrImages
    },
    areas() {
      return [
        {
          text: 'Private',
          type: 'subtitle',
          function: () => {
            this.privateState()
          }
        },
        {
          text: 'Everyone',
          type: 'subtitle',
          function: () => {
            this.printSc('Everyone')
          }
        },
        {
          text: 'My company',
          type: 'subtitle',
          function: () => {
            this.companyState()
          }
        },
        {
          text: 'Teams',
          type: 'title',
          function() {}
        },
        {
          text: 'All my teams',
          type: 'subtitle',
          function: () => {
            this.printSc('All my teams')
          }
        },
        {
          text: 'IT Team XY',
          type: 'subtitle',
          function: () => {
            this.printSc('IT Team XY')
          }
        },
        {
          text: 'CPM Team Z',
          type: 'subtitle',
          function: () => {
            this.printSc('CPM Team Z')
          }
        },
        {
          text: 'Departments',
          type: 'title',
          function() {}
        },
        {
          text: 'All my departments',
          type: 'subtitle',
          function: () => {
            this.printSc('All my departments')
          }
        },
        {
          text: 'Finances',
          type: 'subtitle',
          function: () => {
            this.printSc('Finances')
          }
        },
        {
          text: 'Operations',
          type: 'subtitle',
          function: () => {
            this.printSc('Operations')
          }
        }
      ]
    }
  },
  mounted() {
    this.$store.dispatch('GSFeed/cleanFeed')
    if (!this.external) {
      this.companyState()
    }

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
    ...mapActions('SocialNetworkModule', ['filter_posts']),
    ...mapActions('AppAttachments', { getPostsUrl: 'get_post_file_url' }),
    ...mapActions('AppAttachments', {
      setStreamFiles: 'set_stream_attachments'
    }),
    ...mapActions('WorkOrderModule', {
      getApps: 'getAvailableApps',
      getActions: 'getActionsFeed'
    }),
    ...mapActions('AppBuilder', {
      getFieldValues: 'getFieldValuesPerPanel'
    }),
    changeApp(event) {
      this.getActions(event).then(response => {
        this.options['records'] = response.data
      })
    },
    getRecord(label) {
      const res = `${label['recordTitle'].length < 30
        ? label['recordTitle'] : label['recordTitle'].substr(0, 20) + '...'} - ${label['label'].length < 30
        ? label['label'] : label['label'].substr(0, 20) + '...'}`
      return res
    },
    async selectRecord($event) {
      this.itemInfo['panel'] = null
      this.options['panles'] = []

      const app = await this.$store.dispatch('AppBuilder/getApp', $event['app']['id'])

      app['tabs'].forEach(tab => {
        tab.panels.forEach(panel => {
          this.options['panles'].push({
            id: $event['id'],
            recordTitle: $event.title,
            label: `${tab['title']} - ${panel['title']}`,
            tabTitle: tab['title'],
            panelTitle: panel['title'],
            fields: panel['fields'],
            panelId: panel['id'],
            subtitle: $event.app.title,
            image: $event.app.iconLink,
            description: $event.description
          })
        })
      })
    },
    async selectPanel($event) {
      const values = await this.getFieldValues({
        recordID: $event['id'],
        panelID: $event['panelId']
      })

      const panel = []

      $event['fields'].forEach(field => {
        panel.push({ name: field.label, value: values['values'][field.id] })
      })

      this.urlInfo = {
        url: `${new URL(location.href)['href']}record/${$event.id}`,
        id: $event.id,
        panel: panel,
        description: $event['description'],
        panel_title: $event['panelTitle'],
        subtitle: $event['subtitle'],
        title: $event['recordTitle'],
        image: $event['image']
      }
      this.menu = false
    },
    printSc(msg) {
      this.titlePage = `${msg}`
    },
    onFilesChange(files) {
      files['srcElement']['files'].forEach(file => {
        const type = file['type'].substr(0, file['type'].indexOf('/'))
        if (type === 'image' || type === 'video') {
          this.imageFiles.push(file)
        } else {
          this.docsFiles.push(file)
        }
      })
    },
    async privateState() {
      this.titlePage = 'Private'
      await this.$store.dispatch('GSFeed/setRoom', 'users')
      await this.$store.dispatch('GSFeed/setFeed', this.user.id)
      this.reloadFeed()
    },
    async companyState() {
      this.titlePage = 'My Company'
      await this.$store.dispatch('GSFeed/setRoom', 'companies')
      await this.$store.dispatch('GSFeed/setCompanyFeed', this.user.id)
      this.reloadFeed()
    },
    addActivity() {
      this.showLoading = true
      this.showSkeletonPost = true
      const comp = this.user.companies.items.find(item => item.active === true)
      const urls = this.urlify()

      const activity = {
        req: {
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
            message: this.activityText,
            external_url: urls,
            record_url: this.urlInfo,
            verb: 'post',
            object: 1,
            images: this.imageFiles
          }
        },
        compID: comp.company.id
      }

      this.activityText = ''

      this.$store.dispatch('GSFeed/addActivity', activity).then(async res => {
        if (this.imageFiles.length > 0) {
          const urls = []
          for (let index = 0; index < this.imageFiles.length; index++) {
            const image = this.imageFiles[index]
            const url = await this.setStreamFiles({
              files: image,
              headers: {
                'Content-Type': image['type'],
                'Content-Name': image['name'],
                'Stream-Id': res['data']['results'][0]['id'],
                'Stream-type': 'post'
              }
            })
            urls.push(url['attachUrl'])
            if (index === this.imageFiles.length - 1) {
              this.imageFiles = []
              this.showLoading = false
              const activity = res['data']['results'][0]
              if (typeof activity['actor'] === 'string') {
                activity['actor'] = JSON.parse(activity['actor'])
              }

              activity['actor']['data']['name'] = `${this.user.firstName} ${this.user.lastName}`
              activity['actor']['data']['image'] = this.user.profilePic
              activity['images'] = urls

              this.$store.dispatch('GSFeed/updateActivity', activity)
            }
          }
        }

        if (this.docsFiles.length > 0) {
          const urls = []
          for (let index = 0; index < this.docsFiles.length; index++) {
            const file = this.docsFiles[index]
            const url = await this.setStreamFiles({
              files: file,
              headers: {
                'Content-Type': file['type'],
                'Content-Name': file['name'],
                'Stream-Id': res['data']['results'][0]['id'],
                'Stream-type': 'post'
              }
            })

            urls.push(url['attachUrl'])
            if (index === this.docsFiles.length - 1) {
              this.docsFiles = []
              this.showLoading = false
              const activity = res['data']['results'][0]
              if (typeof activity['actor'] === 'string') {
                activity['actor'] = JSON.parse(activity['actor'])
              }

              activity['actor']['data']['name'] = `${this.user.firstName} ${this.user.lastName}`
              activity['actor']['data']['image'] = this.user.profilePic
              activity['files'] = urls

              this.$store.dispatch('GSFeed/updateActivity', activity)
            }
          }
        }

        if (this.imageFiles.length === 0 && this.docsFiles.length === 0) {
          this.showLoading = false
        }
        await this.$store.dispatch('GSFeed/cleanFeed')

        this.reloadFeed()
        this.urlInfo = {}
        this.itemInfo.applicationId = null
        this.itemInfo.recordId = null
        this.itemInfo.panel = null
        this.showSkeletonPost = false
      })
    },
    urlify() {
      const urlRegex = /(https?:\/\/[^\s]+)/g
      const res = []
      this.activityText.replace(urlRegex, function (url) {
        res.push(url)
      })
      return res
    },
    async reloadFeed() {
      await this.$store.dispatch('GSFeed/retrieveFeed')
    },
    removeVideoOrImage(index) {
      this.imageFiles.splice(index, 1)
    },
    removeFile(index) {
      this.docsFiles.splice(index, 1)
    }
  }
}
</script>

<style>
.v-close-btn {
  height: 15px!important;
  width: 15px!important;
}
.v-select__selections {
     min-height: 30px
}
.preview__container {
  flex-wrap: wrap;
}
</style>
