<template>
  <v-card class="rounded-false" :flat="flatCard">
    <v-card-subtitle
      v-if="showCardHeader"
      class="accent-4 blue pa-5 rounded-false"
    >
      <h2 class="accent-4 blue text-heading-6 white--text">
        Invite Colleagues, Customers and Vendors
      </h2>
    </v-card-subtitle>
    <v-card-text
      v-if="showUserAutoSelectField || typeof currentUsers === 'string'"
      class="pt-5"
    >
      <v-text-field
        v-if="typeof currentUsers === 'string'"
        v-model="roomName"
        dense
        label="Chat Name"
        outlined
      />
      <template
        v-if="showUserAutoSelectField"
      >
        <div
          v-if="element=='company'"
          class="messages-container white"
          :class="biggerHeightMessagesContainer?'long-height':''"
        >
          <v-autocomplete
            v-model="selectedUsers"
            chips
            class="mt-4"
            color="lighten-2"
            filled
            item-text="user.firstName"
            :items="companies"
            label="Select"
            multiple
            return-object
          >
            <template v-slot:selection="data">
              <v-chip
                close
                @click="data.select"
                @click:close="removeSelectedUser(data.item)"
              >
                <v-avatar left>
                  <v-img
                    v-if="data.item.user.profilePic"
                    :src="data.item.user.profilePic"
                  />
                  <v-icon v-else>
                    mdi-account
                  </v-icon>
                </v-avatar>
                {{ data.item.user.firstName }} {{ data.item.user.lastName }}
              </v-chip>
            </template>
            <template v-slot:item="data">
              <template v-if="typeof data.item !== 'object'">
                <v-list-item-content v-text="data.item" />
              </template>
              <template v-else>
                <v-list-item-avatar>
                  <v-img
                    v-if="data.item.user.profilePic"
                    :src="data.item.user.profilePic"
                  />
                  <v-icon v-else>
                    mdi-account
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-html="data.item.user.firstName + &quot; &quot; + data.item.user.lastName" />
                  <v-list-item-subtitle v-html="data.item.user.email" />
                </v-list-item-content>
              </template>
            </template>
          </v-autocomplete>
          <h2
            v-if="companies.length === 0"
            class="font-weight-black mt-2 text-center"
          >
            No users found
          </h2>
        </div>
        <div v-else>
          <h2
            class="font-weight-black text-center"
          >
            No users found
          </h2>
        </div>
      </template>
    </v-card-text>
    <v-card-actions 
      v-if="showActionButtons"
    >
      <v-spacer />
      <v-btn
        class="mt-2"
        color="primary"
        outlined
        width="30%"
        @click="res(false)"
      >
        Cancel
      </v-btn>
      <v-btn
        class="mt-2"
        color="success"
        width="30%"
        @click="res(true)"
      >
        Add
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AddUserDialog',
  props: {
    currentUsers: {
      type: [String, Object],
      default: () => {}
    },
    showCardHeader: {
      type: Boolean,
      default: true
    },
    biggerHeightMessagesContainer: {
      type: Boolean,
      default: true
    },
    flatCard: {
      type: Boolean,
      default: false
    },
    showUserAutoSelectField: {
      type: Boolean,
      default: true
    },
    showActionButtons: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    hoverUser: false,
    roomName: '',
    companies: [],
    resList: [],
    selectedUsers: [],
    element: 'company'
  }),
  computed: {
    ...mapGetters('Companies', { companyUsers: 'getCurrentCompanyUsers' })
  },
  mounted() {
    if (typeof this.currentUsers === 'string') {
      const cUser = this.companyUsers.filter(e => e.user.id === this.currentUsers)[0]
      this.companyUsers.splice(this.companyUsers.indexOf(
        cUser
      ), 1)
      this.companies = this.companyUsers
      if (cUser) {
        this.resList.push(cUser.user.id)
      }
    } else {
      this.companyUsers.forEach(item => {
        if (Object.keys(this.currentUsers).filter(e => e === item.user.id).length === 0) {
          item['selected'] = false
          this.companies.push(item)
        } else {
          this.resList.push(item.user.id)
        }
      })
    }
  },
  methods: {
    res(a) {
      if (a) {
        const res = this.resList.slice()
        this.companies.forEach(item => {
          if (item.selected) {
            res.push(item['user']['id'])
            item['selected'] = false
          }
        })
        this.$emit('closeModal', {
          name: this.roomName,
          image: '',
          users: res
        })
      } else {
        this.$emit('closeModal', {
          name: this.roomName,
          image: '',
          users: []
        })
      }
      this.roomName = ''
    },
    removeSelectedUser(item) {
      const index = this.selectedUsers.indexOf(item)
      if (index >= 0) this.selectedUsers.splice(index, 1)
    }
  }
}
</script>

<style>
  .v-sheet.v-card {
    border-radius: 0 !important
  }
  .messages-container{
    overflow-y: auto;
    overflow-x: hidden;
  }
  .messages-container.long-height{
    height: 400px
  }
</style>
