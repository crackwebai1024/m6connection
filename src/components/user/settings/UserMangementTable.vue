<template>
  <v-card>
    <v-card-text>
      <v-data-table
        class="elevation-0"
        :headers="headers"
        :items="users"
        :items-per-page="5"
        :custom-sort="sortUsers"
        @click:row="clickedUser"
      >
        <template #item.fullName="{ item }">
          <div class="horizontal-center">
            <img
              v-if="$h.dg(item, 'user.profilePic', '')"
              class="round-img"
              :src="$h.dg(item, 'user.profilePic', '')"
            >
            <v-icon
              v-else
              x-large
            >
              mdi-account-circle
            </v-icon>

            <span class="pl-2">{{ item.user.firstName }} {{ item.user.lastName }}</span>
          </div>
        </template>

        <template #item.email="{ item }">
          {{ item.user.email }}
        </template>

        <template #item.status="{ item }">
          <v-chip
            v-if="$h.dg(item, 'joinStatus', '')"
            :color=" statusColors[$h.dg(item, 'joinStatus', '')] "
          >
            <b class="white--text">{{ $h.dg(item, 'joinStatus', '').toLowerCase() }}</b>
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <v-select
            v-model="item.joinStatus"
            item-text="label"
            item-value="val"
            :items="selectItems"
            label="User Status"
            single-line
            @input="selectInput(item)"
          />
        </template>
      </v-data-table>
    </v-card-text>
    <m6-loading :loading="loading" />
  </v-card>
</template>

<script>
import {
  mapMutations,
  mapGetters,
  mapState,
  mapActions
} from 'vuex'

export default {
  name: 'UserMangementTable',
  data: () => ({
    loading: false,
  }),
  methods: {
    ...mapMutations('UserSettingsControl', {
      setUserToShow: 'setUserToShow',
      setThirdColumnComponent: 'setThirdColumnComponent'
    }),
    ...mapActions('Companies', {
      updateUserCompany: 'updateUserCompany'
    }),
    clickedUser(user) {
      this.setUserToShow(user)
      this.setThirdColumnComponent({ name: 'user-settings-details' })
    },
    async selectInput(item) {
      try {
        this.loading = true
        await this.updateUserCompany(item)
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    sortUsers(items, index, isDescending) {
      index = JSON.parse(JSON.stringify(index))
      isDescending = JSON.parse(JSON.stringify(isDescending))
      
      if (index.length == 0 || isDescending.length == 0)
        return items

      index = index[0]
      isDescending = isDescending[0]
      
      items.sort((a, b) => {
        if (index == "status") {
          if (isDescending) {
            return a.joinStatus < b.joinStatus ? 1 : -1
          } else {
            return a.joinStatus > b.joinStatus ? 1 : -1
          }
        } else if (index == "fullName") {
          if (isDescending) {
            return a.user.firstName + a.user.lastName < b.user.firstName + b.user.lastName ? 1 : -1
          } else {
            return a.user.firstName + a.user.lastName > b.user.firstName + b.user.lastName ? 1 : -1
          }
        } else if (index == "email") {
          if (isDescending) {
            return a.user.email < b.user.email ? 1 : -1
          } else {
            return a.user.email > b.user.email ? 1 : -1
          }
        }
      })
      return items
    }
  },
  computed: {
    ...mapGetters('Companies', {
      users: 'getCurrentCompanyUsers'
    }),
    ...mapState('Auth', {
      statusColors: 'statusColors'
    }),
    ...mapState('UserSettingsControl', {
      secondColumnComponent: 'secondColumnComponent'
    }),
    selectItems() {
      return Object.keys(this.statusColors).map(s => ({
        val: s,
        label: s.toLowerCase()
      }))
    },
    headers() {
      const headers = [
        { text: 'Full Name', value: 'fullName' },
        { text: 'Status', value: 'status' },
        { text: 'Email', value: 'email' }
      ]

      headers.push({
        text: 'Actions',
        value: 'actions',
        sortable: false
      })

      return headers
    }
  }
}
</script>

<style lang="scss" scoped >
    .round-img {
        border-radius: 50%;
        width: 3rem;
    }
    .horizontal-center {
        display: flex;
        display: -webkit-flex;
        display: -ms-flexbox;
        flex-direction: row;
        align-items: center;
    }
</style>
