<template>
  <v-card class="elevation-0 rounded-false">
    <v-toolbar
      class="rounded-false"
      color="blue accent-4 elevation-0"
    >
      <v-toolbar-title class="rounded-false  white--text" />
      <template v-slot:extension>
        <v-row class="d-flex justify-center">
          <v-avatar
            class="align-self-center grey lighten-2 mr-2 text-center"
            size="130"
            @mouseenter="isProfilePicHover = true"
            @mouseleave="isProfilePicHover = false"
          >
            <v-overlay
              absolute
              opacity="0.7"
              :value="isProfilePicHover"
            >
              <m6-upload
                btn-button="purple"
                @loading="loading = !loading"
                @response="reponseProfileImg"
              >
                <v-icon
                  color="white"
                  size="50"
                >
                  mdi-pencil
                </v-icon>
              </m6-upload>
            </v-overlay>
            <img
              v-if="channelImage !== ''"
              :alt="channelImage"
              :src="channelImage"
            >
            <v-icon
              v-else
              size="50"
            >
              mdi-account-group-outline
            </v-icon>
          </v-avatar>
        </v-row>
      </template>
      <v-spacer />

      <v-dialog
        v-model="boolDeleteDiaLog"
        max-width="350"
        persistent
      >
        <delete-dialog
          :element="itemToDelete"
          @closeDeleteModal="$event ? deleteGroup() : boolDeleteDiaLog = false"
        />
      </v-dialog>
    </v-toolbar>
    <v-card-text class="mt-10">
      <v-form ref="form">
        <v-text-field
          v-model="channelName"
          class="custom mt-0 text-center text-h4"
          :readonly="!editMode"
        >
          <template v-slot:append-outer>
            <v-btn
              v-if="!editMode"
              icon
              large
              @click="editMode = true"
            >
              <v-icon size="40">
                mdi-pencil-outline
              </v-icon>
            </v-btn>
            <template v-else>
              <v-btn
                icon
                large
                @click="updateChannel(true)"
              >
                <v-icon
                  color="green"
                  size="40"
                >
                  mdi-check
                </v-icon>
              </v-btn>
              <v-btn
                icon
                large
                @click="updateChannel(false)"
              >
                <v-icon size="40">
                  mdi-close
                </v-icon>
              </v-btn>
            </template>
          </template>
        </v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapMutations } from 'vuex'
import DeleteDialog from '@/components/Dialogs/DeleteDialog'
export default {
  name: 'SettingsChannelDialog',
  components: {
    DeleteDialog
  },
  props: {
    channel: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    itemToDelete: '',
    isProfilePicHover: false,
    boolDeleteDiaLog: false,
    editMode: false,
    loading: false,
    channelName: '',
    channelImage: ''
  }),
  methods: {
    ...mapMutations('SnackBarNotif',
      { notifDanger: 'notifDanger' }
    ),
    deleteMessages() {
      this.itemToDelete = `'${this.channel.data.name}' group chat messages.`
      this.boolDeleteDiaLog = true
    },
    deleteGroup() {
      this.channel.delete().then(() => {
        this.updateChannel(false)
      }).catch(() => {
        this.notifDanger('There was an error since deleting.')
      })
      this.boolDeleteDiaLog = false
    },
    async updateChannel(res) {
      if (res) {
        const res = await this.channel.update({
          name: this.channelName,
          image: this.channelImage
        })
        this.$emit('closeEditeModal')
      } else {
        this.channelName = this.channel.data.name
        this.channelImage = this.channel.data.image
        this.editMode = false
        this.$emit('closeEditeModal')
      }
    },
    reponseProfileImg(res) {
      if (res.ok) {
        this.channelImage = res.data.link
      } else {
        this.notifDanger('There was an error while saving the file')
      }
    }
  },
  mounted() {
    this.channelName = this.channel.data.name
    this.channelImage = this.channel.data.image
  }
}
</script>

<style>
  .v-input.custom input {
    text-align: center;
  }
  header.v-toolbar, .v-toolbar__content {
    border-radius: 0 !important
  }
</style>
