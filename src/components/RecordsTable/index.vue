<template>
  <div class="w-full overflow-x-scroll">
    <v-data-table
      :headers="tableHeaders"
      :items="items"
      :items-per-page="5"
      :class="{'full-width-table': $vuetify.breakpoint.mdAndDown, 'w-full': $vuetify.breakpoint.lgAndUp }"
      mobile-breakpoint="0"
    >
      <template #item="{ item }">
        <tr>
          <td>
            <img
              :alt="item.title"
              class="standard-image"
              :src="item.image"
            >
          </td>
          <td>
            <router-link
              class="router-link"
              :to="{ name: 'record.show', params: { id: item.id } }"
            >
              {{ item.record_number }}
            </router-link>
          </td>
          <td>
            {{ item.app_prefix }}
          </td>
          <td>
            <p>
              <router-link
                class="router-link"
                :to="{ name: 'record.show', params: { id: item.id } }"
              >
                {{ item.title }}
              </router-link>
            </p>
          </td>
          <td>
            <p>
              {{
                item.description
              }}
            </p>
          </td>
          <td>
            {{ getAuthor(item.author) }}
          </td>
          <td>
            {{ new Date(item.created_at).getMonth() + '/' + new Date(item.created_at).getDate() + '/' + new Date(item.created_at).getFullYear() }}
          </td>
          <td>
            {{ item.class }}
          </td>
          <td>
            {{ item.category }}
          </td>
          <td>
            {{ item.state }}
          </td>
          <td>
            {{ item.status }}
          </td>
          <td v-for="(valueItem, index) in tableHeaders.slice(11, tableHeaders.length - 1)" :key="index">
            <component
              :is="valueComponentName(valueItem.type)"
              :appValue="item[valueItem.value]"
            />
          </td>
          <td>
            <v-btn
              color="green"
              fab
              icon
              x-small
            >
              <v-icon>mdi-lead-pencil</v-icon>
            </v-btn>
            <v-btn
              color="red"
              fab
              icon
              x-small
            >
              <v-icon>mdi-trash-can-outline</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppFieldValueAttachment from '@/components/Shared/RecordTypes/ViewMode/AppFieldValueAttachment'
import AppFieldValueAutocomplete from '@/components/Shared/RecordTypes/ViewMode/AppFieldValueAutocomplete'
import AppFieldValueAutocompleteAddress from '@/components/Shared/RecordTypes/ViewMode/AppFieldValueAutocompleteAddress'
import AppFieldValueBoolean from '@/components/Shared/RecordTypes/ViewMode/AppFieldValueBoolean'
import AppFieldValueNumber from '@/components/Shared/RecordTypes/ViewMode/AppFieldValueNumber'
import AppFieldValuePeople from '@/components/Shared/RecordTypes/ViewMode/AppFieldValuePeople'
import AppFieldValueReferenced from '@/components/Shared/RecordTypes/ViewMode/AppFieldValueReferenced'
import AppFieldValueReferencedApp from '@/components/Shared/RecordTypes/ViewMode/AppFieldValueReferencedApp'
import AppFieldValueText from '@/components/Shared/RecordTypes/ViewMode/AppFieldValueText'
import AppFieldValueTimestamp from '@/components/Shared/RecordTypes/ViewMode/AppFieldValueTimestamp'

export default {
  // eslint-disable-next-line vue/match-component-file-name
  name: 'RecordsTableIndex',
  components: {
    AppFieldValueAttachment,
    AppFieldValueAutocomplete,
    AppFieldValueAutocompleteAddress,
    AppFieldValueBoolean,
    AppFieldValueNumber,
    AppFieldValuePeople,
    AppFieldValueReferenced,
    AppFieldValueReferencedApp,
    AppFieldValueText,
    AppFieldValueTimestamp
  },
  props: {
    items: {
      type: Array,
      default: () => ([])
    },
    tableHeaders: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    headers: [
      { text: 'Image', value: 'image' },
      { text: 'Record #', value: 'record_number' },
      { text: 'App', value: 'app_prefix' },
      { text: 'Title', value: 'title' },
      { text: 'Description', value: 'description' },
      { text: 'Creator', value: 'author' },
      { text: 'Created On', value: 'created_at' },
      { text: 'Class', value: 'class' },
      { text: 'Category', value: 'category' },
      { text: 'Type', value: 'type' },
      { text: 'State', value: 'state' },
      { text: 'Status', value: 'status' },
      { text: 'Action', value: 'action', sortable: false }
    ]
  }),

  computed: {
    ...mapGetters('Companies', {
      currentCompanyUsers: 'getCurrentCompanyUsers'
    })
  },

  methods: {
    getAuthor(id) {
      const res = this.currentCompanyUsers.find(u => this.$h.dg(u, 'user.id', '') === id)
      return this.$h.dg(res, 'user.firstName', '') + ' ' + this.$h.dg(res, 'user.lastName', '')
    },
    valueComponentName(type) {
      switch (type) {
        case 'timestamp':
          return 'app-field-value-timestamp'
        case 'people':
          return 'app-field-value-people'
        case 'autocomplete':
          return 'app-field-value-autocomplete'
        case 'attachment':
          return 'app-field-value-attachment'
        case 'boolean':
          return 'app-field-value-boolean'
        case 'number':
          return 'app-field-value-number'
        case 'text':
          return 'app-field-value-text'
        case 'autocomplete-address':
          return 'app-field-value-autocomplete-address'
        case 'referencedToApp':
          return 'app-field-value-referenced-app'
        case 'referenced':
          return 'app-field-value-referenced'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.standard-image {
  height: 3rem;
  width: auto;
}
.router-link {
  text-decoration: none;
}
.full-width-table {
  min-width: 1200px;
  max-width: none;
}
.overflow-x-scroll {
  overflow-x: scroll;
}
</style>
<style lang="scss">
.full-width-table .v-data-footer {
  justify-content: flex-start;
}
</style>