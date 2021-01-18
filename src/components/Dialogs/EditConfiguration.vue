<template>
  <v-card>
    <v-toolbar
      class="accent-4 blue"
      dark
    >
      <v-menu
        offset-x
        offset-y
        bottom
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="mx-2"
            fab
            dark
            small
            color="red"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon dark>
              mdi-delete-outline
            </v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="deleteMessages">
            <v-list-item-icon>
              <v-icon>mdi-delete</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              Delete messages
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="boolDeleteDiaLog = true">
            <v-list-item-icon>
              <v-icon color="red">
                mdi-delete
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content class="red--text">
              Delete channel
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-spacer />
      <v-icon
        size="30"
        @click="$emit('close-dialog')"
      >
        mdi-close
      </v-icon>
    </v-toolbar>
    <v-card-text
      class="pa-0"
    >
      <settings-channel-dialog
        :channel="channel"
        @closeEditeModal="closeModal"
      />
      <info-users-dialog
        :channel="channel"
        :current-users="channel.state.members"
        @currentUsersChanged="channel.state.members = $event"
        :flat-card="true"
      />
      <v-divider></v-divider>
      <add-user-dialog
        :current-users="channel.state.members"
        :show-card-header="false"
        :bigger-height-messages-container="false"
        :flat-card="true"
        :show-user-auto-select-field="false"
        :show-action-buttons="true"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import DeleteDialog from '@/components/Dialogs/DeleteDialog'
import AddUserDialog from '@/components/Dialogs/AddUserDialog'
import InfoUsersDialog from '@/components/Dialogs/InfoUsersDialog'
import SettingsChannelDialog from '@/components/Dialogs/SettingsChannelDialog'
export default {
  name: 'EditConfigurationDialog',
  components: {
    DeleteDialog,
    AddUserDialog,
    InfoUsersDialog,
    SettingsChannelDialog
  },
  props: {
    channel: {
      type: [Object, Array],
      default: () => []
    }
  },
  data() {
    return {
      tabs: 1,
    }
  },
  methods: {
    height() {
      const viewportSize = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      ) * 0.6
      return `${viewportSize}px`
    },
    deleteMessages() {
    }
  }
}
</script>
