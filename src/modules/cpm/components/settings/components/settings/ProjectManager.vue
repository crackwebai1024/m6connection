<template>
  <div>
    <v-card>
      <v-card-title class="relative">
        <portal
          v-if="included"
          to="assignment-0"
        >
          <v-btn
            absolute
            color="white"
            dark
            fab
            right
            small
            @click="showForm = true"
          >
            <v-icon color="blue">
              mdi-plus
            </v-icon>
          </v-btn>
        </portal>
        <v-btn
          v-else
          absolute
          color="blue"
          dark
          fab
          right
          small
          @click="showForm = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="vertical-scroll">
        <div class="form-group">
          <label v-if="!included">Current Status</label>
          <v-data-table
            :headers="headers"
            :items="settings.projectManager"
            :options.sync="pagination"
          >
            <template v-slot:item="props">
              <tr>
                <td>{{ props.item.label }}</td>
                <td class="text-right">
                  <!--<v-btn-->
                  <!--  small-->
                  <!--  icon-->
                  <!--  @click.prevent="editElement(props.index, props.item)" >-->

                  <!--  <v-icon>mdi-pencil</v-icon>-->
                  <!--</v-btn>-->
                  <v-icon
                    class="ml-0 mr-0 pointer"
                    color="#f44336"
                    size="20"
                    @click.prevent="deleteElement(props.index, props.item.label)"
                  >
                    mdi-delete
                  </v-icon>
                </td>
              </tr>
            </template>
          </v-data-table>
        </div>
      </v-card-text>
    </v-card>
    <v-dialog
      v-if="showForm"
      v-model="showForm"
      max-width="800px"
      persistent
    >
      <v-card class="mt-2">
        <v-card-title class="headline px-6 py-4 white">
          <span class="grey--text text--darken-1">
            {{ currentElement !== '' ? `Edit ${appLabel.singular} Manager` : `Add New ${appLabel.singular} Manager` }}
          </span>
        </v-card-title>
        <v-divider class="grey lighten-3" />
        <v-card-text class="vertical-scroll">
          <v-form ref="form">
            <label v-if="currentElement !== ''">
              Edit {{ appLabel.singular }} Manager
            </label>
            <label v-else>Add New {{ appLabel.singular }} Manager</label>
            <vue-select
              v-model="element"
              :filterable="false"
              item-value="currentElement"
              :options="users"
              @input="userAssign"
              @search="getUsers"
            >
              <template slot="no-options">
                type to search Users..
              </template>
              <template
                slot="option"
                slot-scope="option"
              >
                {{ option.label }}
              </template>
            </vue-select>
            <input
              v-model="currentElement"
              type="hidden"
            >
            <v-btn
              color="blue"
              outline
              @click="cancel"
            >
              Cancel
            </v-btn>
            <v-btn
              color="blue"
              dark
              type="submit"
              @click="save"
            >
              {{ submitLoading ? 'Saving...' : 'Save' }}
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <m6-confirm-delete
      :message="
        `Are you sure you want to permanently delete this Project Manager: ${deleteInfo.name} ?`
      "
      :show="showDeleteModal"
      title="Delete Project Manager"
      @cancel="cancelDelete"
      @confirm="submitDelete"
    />
  </div>
</template>

<script>
import { db } from '@/utils/Firebase.js'
import { mapState, mapGetters } from 'vuex'
import vSelect from 'vue-select'
export default {
  components: {
    'vue-select': vSelect
  },
  props: {
    included: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      deleteInfo: {},
      showDeleteModal: false,
      element: '',
      currentElement: '',
      settings: {},
      submitLoading: false,
      showForm: false,
      users: [],
      rules: {
        required: value => !!value || 'Required.'
      },
      pagination: {
        rowsPerPage: -1
      },
      headers: [
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Action',
          value: 'action'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['appLabel']),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    })
  },
  mounted() {
    db.collection('settings')
      .doc(this.currentCompany.id)
      .collection('settings')
      .doc(this.appLabel.usersCollection)
      .get()
      .then(settings => {
        if (!settings.exists) {
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('settings')
            .doc(this.appLabel.usersCollection)
            .set({
              projectManager: []
            })
        }
      })
  },
  methods: {
    getUsers(search, loading) {
      loading(true)
      if (search !== '') {
        this.searchUsers(loading, search, this)
      } else {
        loading(false)
      }
    },
    searchUsers: _.debounce((loading, search, vm) => {
      fetch(`/fm-dev/users/search/${escape(search)}`)
        .then(res => res.json())
        .then(json => {
          vm.users = json
          loading(false)
        })
    }, 350),
    userAssign() {},
    save() {
      if (this.element == '' || !this.element.label) {
        this.$snotify.error(
          `${this.appLabel.singular} Manager name is required`,
          'Error'
        )
        return
      }
      if (this.currentElement === '') {
        if (!this.settings.projectManager) {
          this.settings.projectManager = []
        }
        this.settings.projectManager.push(this.element)
      } else {
        this.$set(
          this.settings.projectManager,
          this.currentElement,
          this.element
        )
      }
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc(this.appLabel.usersCollection)
        .update({
          projectManager: this.settings.projectManager
        })
      this.$snotify.success(
        `The ${this.appLabel.singular} Manager has been saved`,
        'Success'
      )
      this.cancel()
    },
    deleteElement(id, name) {
      this.deleteInfo = { id, name }
      this.showDeleteModal = true
    },
    cancelDelete() {
      this.showDeleteModal = false
      this.deleteInfo = {}
    },
    submitDelete() {
      const id = this.deleteInfo.id
      this.settings.projectManager.splice(id, 1)
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc(this.appLabel.usersCollection)
        .update({
          projectManager: this.settings.projectManager
        })
      this.$snotify.success(
        `The ${this.appLabel.singular} Manager has been deleted`,
        'Success'
      )
      this.cancelDelete()
    },
    editElement(id, name) {
      this.element = name
      this.currentElement = id
      this.showForm = true
    },
    cancel() {
      this.element = ''
      this.currentElement = ''
      this.showForm = false
    }
  },
  firestore() {
    return {
      settings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc(this.appLabel.usersCollection)
    }
  }
}
</script>
