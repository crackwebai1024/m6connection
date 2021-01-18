<template>
  <div class="mb-5 relative">
    <div class="actions-container">
      <v-dialog
        v-model="addUserDialog"
        width="50%"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            color="grey darken-4"
            icon
            v-on="on"
          >
            <v-icon :class=" !lightMode ? 'grey--text text--darken-2' : 'white--text' ">
              mdi-account-multiple-plus-outline
            </v-icon>
          </v-btn>
        </template>
        <add-user-dialog
          :current-users="user.id"
          @closeModal="addUser($event)"
        />
      </v-dialog>
      <v-btn
        color="grey darken-4"
        icon
      >
        <v-icon :class=" !lightMode ? 'grey--text text--darken-2' : 'white--text' ">
          mdi-filter
        </v-icon>
      </v-btn>
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
    <div>
      <h4 :class=" !lightMode ? 'grey--text text--darken-2 mb-3 ml-1' : 'white--text mb-3 ml-1' ">
        {{ department.name }}
      </h4>
      <input
        v-show="showSearchInput"
        ref="searchInput"
        v-model="searchInput"
        class="search-input"
        placeholder="Start Typing to Search"
        type="text"
      >
      <v-btn
        v-for="(channel, ind) in filteredChannels"
        :key="'channel-' + channel.id"
        class="capitalize d-flex justify-start my-0 pointer px-2 py-6 w-full"
        color="transparent"
        dense
        elevation="0"
        @click="startChat(channel)"
      >
        <v-avatar
          v-if="channel.id.substr(14, 5) === 'group'"
          class="mr-3"
          :color="channel.data.image ? 'transparent' : 'blue'"
          dark
          size="36"
        >
          <v-img
            v-if="channel.data.image"
            :src="channel.data.image"
          />
          <template v-else>
            <span class="text-uppercase white--text"> <v-icon>mdi-account-group-outline</v-icon></span>
          </template>
        </v-avatar>
        <v-badge
          v-else
          bottom
          class="mr-3"
          :color="channel.membersInChannel.user.online ? 'green accent-3' : 'red accent-3'"
          dot
          offset-x="10"
          offset-y="10"
        >
          <v-avatar
            :color="channel.membersInChannel.user.image ? 'transparent' : 'blue'"
            dark
            size="36"
          >
            <v-img
              v-if="channel.membersInChannel.user.image"
              :src="channel.membersInChannel.user.image"
            />
            <template v-else>
              <span class="text-uppercase white--text">{{ channel.membersInChannel.user.name.charAt(0) }}</span>
            </template>
          </v-avatar>
        </v-badge>
        <div v-if="channel.id.substr(14, 5) === 'group'">
          <div class="align-start d-flex flex-column">
            <v-badge
              :content="unread_count[ind]['unread']"
              offset-x="-5"
              offset-y="15"
              :value="unread_count[ind]['unread'] > 0 ? unread_count[ind]['unread'] : 0"
            >
              <div class="d-flex flex-row">
                <p :class="(!lightMode ? 'grey--text text--darken-4' : 'white--text') + ' mb-0 text-left'">
                  {{ channel.data.name }}
                </p>
              </div>
            </v-badge>
            <p :class="(!lightMode ? 'grey--text text--darken-1' : 'text--darken-4') + ' mb-0 text-left'"
              style="font-size: 0.75rem; padding-top: 5.5px"
            >
              {{ channel.last_message ? channel.last_message : "" }}
            </p>
            <span :class="'text-caption ' + departmentColor(user.type)">{{ user.departmentName }}</span>
          </div>
        </div>
        <div v-else>
          <div class="align-start d-flex flex-column">
            <v-badge
              :content="unread_count[ind]['unread']"
              offset-x="-5"
              offset-y="15"
              :value="unread_count[ind]['unread'] > 0 ? unread_count[ind]['unread'] : 0"
            >
              <div class="d-flex flex-row">
                <p :class="(!lightMode ? 'grey--text text--darken-4 mb-0' : 'white--text mb-0') + ' text-left'">
                  {{ channel.membersInChannel.user.name }}
                </p>
              </div>
            </v-badge>
            <p :class="(!lightMode ? 'grey--text text--darken-1' : 'text--darken-4') + ' mb-0 text-left'"
              style="font-size: 0.75rem; padding-top: 5.5px"
            >
              {{ channel.last_message ? channel.last_message : "" }}
            </p>
            <span :class="'text-caption ' + departmentColor(user.type)">{{ user.departmentName }}</span>
          </div>
        </div>
      </v-btn>
      <div v-if="filteredChannels.length === 0">
        No results found
      </div>
    </div>
    <div v-if="lastDepartment">
      <v-divider class="blue-grey lighten-4 mt-4" />
      <v-divider class="blue-grey lighten-4" />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import AddUserDialog from '@/components/Dialogs/AddUserDialog'

export default {
  name: 'Connections',
  components: {
    AddUserDialog
  },
  props: {
    department: {
      type: Object,
      default: () => {}
    },
    lightMode: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    addUserDialog: false,
    showSearchInput: false,
    lastDepartment: false,
    hover: false,
    searchInput: '',
    unread_count: []
  }),
  computed: {
    ...mapState(['layout', 'chats']),
    ...mapGetters('Auth', { user: 'getUser' }),
    ...mapGetters('GSChat', { client: 'client' }),
    ...mapGetters('GSFeed', { feed: 'getFeed' }),
    filteredChannels() {
      const result = []
      this.unread_count = []
      this.department.channels.forEach(channel => {
        if (Object.keys(channel.state.members).length == 2) {
          Object.keys(channel.state.members).forEach(member => {
            if (member !== this.user.id) {
              const user = channel.state.members[member]
              if (user.user.name.toLowerCase().trim().indexOf(this.searchInput.toLowerCase().trim()) !== -1) {
                // If there are more than one user, we need to add an array of users and modify the template
                channel.membersInChannel = user
                result.push(channel)
                this.unread_count.push({
                  isOpen: false,
                  cid: channel['cid'],
                  unread: channel['state']['read'][this.user.id]['unread_messages']
                })
              }
            }
          })
        } else {
          result.push(channel)
          this.unread_count.push({
            isOpen: false,
            cid: channel['cid'],
            unread: channel['state']['read'][this.user.id]['unread_messages']
          })
        }
      })
      return result
    }
  },
  async mounted() {
    this.client.on('notification.message_new', r => {
      this.pushUnreadCount(r.channel)
    })
    this.client.on('channel.visible', r => {
      this.unread_count.forEach((item, ind) => {
        if (item.cid == r.cid) {
          this.unread_count[ind]['isOpen'] = !this.unread_count[ind]['isOpen']
          this.unread_count[ind]['unread'] = 0
        }
      })
    })
    this.client.on('channel.deleted', r => {
      this.department.channels.splice(this.department.channels.indexOf(
        this.department.channels.filter(e => e.id === r.channel_id)[0]
      ), 1)
      this.$store.dispatch('GSChat/deleteChat', r.channel_id)
    })
    this.client.on('member.removed', r => {
      if (this.user.id === r.user.id) {
        this.department.channels.splice(this.department.channels.indexOf(
          this.department.channels.filter(e => e.id === r.channel_id)[0]
        ), 1)
        this.$store.dispatch('GSChat/removeChat', r.channel_id)
      }
    })
    this.client.on('notification.removed_from_channel', r => {
      this.department.channels.splice(this.department.channels.indexOf(
        this.department.channels.filter(e => e.id === r.channel_id)[0]
      ), 1)
      this.$store.dispatch('GSChat/removeChat', r.channel_id)
    })
    this.client.on('channel.hidden', r => {
      if (this.user.id === r.user.id) {
        this.$store.dispatch('GSChat/removeChat', r.channel_id)
      }
    })
    this.client.on('notification.added_to_channel', r => {
      this.$store.dispatch('GSChat/retrieveChats', this.user.id)
    })

    Promise.all(
      this.filteredChannels.map(async channel => {
        const channel_state = await channel.watch()
        
        if (channel_state.messages.length == 0)
          channel.last_message = ''
        else {
          let last_index = channel_state.messages.length - 1

          if (channel_state.messages[last_index].images) {
            const images = channel_state.messages[last_index].images
            last_index = images.length - 1
            if (images[last_index]) {
              const splitedUrl = images[last_index].split('/')
              channel.last_message = splitedUrl[splitedUrl.length - 1]
            } else {
              channel.last_message = ''
            }
          } else {
            channel.last_message = channel_state.messages[last_index].text
          }
        }

        channel.last_message = channel.last_message.substring(0, 30)
      })
    ).catch(err => {})
  },
  methods: {
    ...mapActions('GSChat', ['makeGroupChat']),
    addUser(event) {
      this.addUserDialog = false
      if (event.users.length > 1) {
        // We make the new conversation
        this.makeGroupChat({
          name: event.name,
          image: event.image,
          members: event.users
        })
      }
    },
    pushUnreadCount(channel) {
      this.unread_count.forEach((item, ind) => {
        if (item.cid == channel.cid && item.isOpen === false) {
          this.unread_count[ind]['unread'] += 1
        }
      })
    },
    addNewMessage(event) {},
    async startChat(channel) {
      await this.$store.dispatch('GSChat/pushChat', channel)
      await channel.markRead()
    },
    showSearchInputFunction() {
      this.showSearchInput = !this.showSearchInput
      this.$nextTick(() => this.$refs.searchInput.focus())
    },
    departmentColor(type) {
      return type === 'internal' ? 'grey--text text--darken-1' : 'blue--text text--darken-1'
    }
  }
}
</script>

<style lang="scss" scoped>
.actions-container {
    position: absolute;
    right: 0;
    z-index: 1;
    margin-top: -5px;
}
.mdi-chevron-right::before {
    background: #ddd;
    border-radius: 100%;
    margin: 6px 6px 6px 10px;
}
.v-expansion-panel-content__wrap {
    padding: 0;
}
</style>
