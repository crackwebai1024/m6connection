<template>
  <div class="flex-space-between" >
    <template v-if="app.iconLink !== ''">
      <div style="display: flex; align-items: start">
        <v-btn
          color="red darken-2"
          dark
          fab
          x-small
          @click="deleteIconLink"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-img
          max-width="80"
          contain
          class="app-icon-link pr-2"
          :src="app.iconLink"
        />
      </div>
    </template>
    <template v-else>
      <v-avatar
        class="pointer"
        :color="iconData.background"
        size="100"
        @click="iconBuilderModal=true"
      >
        <v-icon
          :color="iconData.iconColor"
          size="60"
        >
          {{ iconData.icon }}
        </v-icon>
      </v-avatar>
      <v-dialog
        v-model="iconBuilderModal"
        width="800"
      >
        <icon-builder-dialog
          @selectIconAction="selectIconAction"
        />
      </v-dialog>
    </template>
    <v-form ref="formApp">
      <v-text-field
        v-model="app.title"
        class="add-field font-weight-regular white lighten-3 mb-1 pt-1 px-4 rounded-xl"
        label="App Title"
        :rules="rules.generic"
      />
      <v-text-field
        v-model="app.prefix"
        class="add-field font-weight-regular white lighten-3 mb-1 pt-1 px-4 rounded-xl"
        label="App Prefix"
        maxlength="5"
        minlength="1"
        :rules="rules.generic"
      />
      <m6-upload
        btn-button="purple"
        @loading="loading = !loading"
        @response="responseAppLogo"
      >
        <v-icon>mdi-cloud-upload</v-icon>
      </m6-upload>

      <v-btn
        class="white--text"
        color="red darken-2"
        @click="showDeleteDialog = true"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-btn
        class="white--text"
        color="green darken-2"
        style="float: right;"
        @click="updatingApp"
      >
        save
      </v-btn>

      <m6-confirm-delete
        message="Are you sure you want to delete this App?"
        :show="showDeleteDialog"
        title="Delete Current App"
        @cancel="cancelDelete"
        @confirm="confirmingDelete"
      />

      <v-dialog
        v-model="iconBuilderModal"
        width="800"
      >
        <icon-builder-dialog
          @selectIconAction="selectIconAction"
        />
      </v-dialog>
    </v-form>

    <m6-loading :loading="loading" />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import IconBuilderDialog from '@/components/Dialogs/IconBuilderDialog'

export default {
  components: {
    IconBuilderDialog,
  },

  data: () => ({
    iconBuilderModal: false,
    rules: {
      generic: [v => !!v || 'This field is required']
    },
    loading: false,
    showDeleteDialog: false,
  }),

  computed: {
    ...mapState('AppBuilder', {
      app: 'app',
      iconData: 'iconData'
    }),
  },

  methods: {
    ...mapActions('File', {
      deleteFileFromS3: 'deleteFileFromS3'
    }),

    ...mapActions('AppBuilder', {
      updateApp: 'updateApp',
      deleteApp: 'deleteApp',
    }),
    
    ...mapMutations('AppBuilder', {
      setIconData: 'setIconData',
    }),

    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),

    selectIconAction(selected, iconInfo) {
      this.iconBuilderModal = !this.iconBuilderModal
      if (selected) {
        this.setIconData(iconInfo)
      }
    },


    async deleteIconLink() {
      try {
        this.loading = true
        if (this.$h.dg(this.app, 'iconLink', '').length) {
          const splitLink = this.app.iconLink.split('com')
          const key = splitLink[1].substr(1)

          await this.deleteFileFromS3({ key })
          this.app.iconLink = ''
          await this.updateApp({ params: this.app })
        }

        this.loading = false
        this.notifSuccess('The image was deleted')
      } catch (e) {
        this.notifDanger('There was an error while deleting App Icon Image')
        this.loading = false
      }
    },

    async responseAppLogo(data) {
      this.loading = true
      if (data.ok) {
        this.app.iconLink = data.data.link
        await this.updateApp({ params: this.app })
        this.notifSuccess('The image was uploaded')
        this.loading = false
      } else {
        this.loading = false
        this.notifDanger('There was an error while uploading')
      }
    },

    async updatingApp() {
      this.loading = true

      if (!this.$refs.formApp.validate()) {
        this.notifDanger('Please fill in all required fields')
        this.loading = false
        return
      }

      try {
        let metadata = JSON.parse(this.app.metadata)
        metadata.appIcon = {
          icon: this.iconData.icon,
          background: this.iconData.background,
          iconColor: this.iconData.iconColor
        }
        const res = await this.updateApp({
          params: {
            ...this.app,
            metadata
          }
        })
        this.loading = false
        this.notifSuccess('Updated!')
      } catch (e) {
        this.loading = false

        let errorMsg = ''
        for (const i in e.response.data) {
          errorMsg += e.response.data[i][0].replace('params.', '') + '<br />'
        }
        this.notifDanger(errorMsg)
      }
    },

    cancelDelete() {
      this.showDeleteDialog = false
    },


    async confirmingDelete() {
      this.showDeleteDialog = false

      try {
        this.loading = true
        await this.deleteApp(this.$route.params.id)
        this.loading = false
        this.notifSuccess('The App Was Deleted')
        this.$router.push('/')
      } catch (e) {
        this.loading = false
        this.notifDanger('There was an error, App was NOT deleted')
      }
    },

  }
}
</script>

<style lang="scss" scoped>
.flex-space-between {
  display: flex;
  justify-content: space-between;
}
</style>
