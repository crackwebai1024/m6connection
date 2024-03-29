<template>
  <component-template>
    <template slot="button">
      <v-btn
        color="primary"
        dark
        fab
        small
        @click="showForm = true"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>

    <v-container class="pt-0">
      <v-checkbox
        v-model="settings.fyProposedSpend20"
        hide-details
        label="Proposed Spend FY 20"
        @change="saveFYApproved"
      />

      <v-data-table
        :headers="headers"
        :items="settings.fyApproved"
      >
        <template v-slot:items="props">
          <td>{{ props.item }}</td>
          <td class="text-right">
            <v-btn
              icon
              small
              text
              @click.prevent="editStatus(props.index, props.item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              small
              text
              @click.prevent="deleteStatus(props.index, props.item)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-container>

    <v-card
      v-if="showForm"
      class="mt-2"
    >
      <v-card-text class="vertical-scroll">
        <v-form ref="form">
          <h6
            v-if="currentFyApproved"
            class="indigo--text"
          >
            Editing:
          </h6>
          <v-text-field
            v-model="fyApproved"
            color="blue"
            label="FY Approved"
          />
          <input
            v-model="currentFyApproved"
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
            @click="saveStatus"
          >
            {{ submitLoading ? 'Saving...' : 'Save' }}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </component-template>
</template>

<script>
import { db } from '@/utils/Firebase.js'
import ComponentTemplate from '../ComponentTemplate'
import { mapState, mapGetters } from 'vuex'
export default {
  components: {
    ComponentTemplate
  },
  data() {
    return {
      fyApproved: '',
      currentFyApproved: '',
      settings: {},
      submitLoading: false,
      showForm: false,
      rules: {
        required: value => !!value || 'Required.'
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
      .collection('planned_settings')
      .doc(this.appLabel.settingsCollection)
      .get()
      .then(settings => {
        if (!settings.exists) {
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('planned_settings')
            .doc(this.appLabel.settingsCollection)
            .set({
              fyApproved: []
            })
        }
      })
  },
  methods: {
    saveFYApproved() {
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc(this.appLabel.settingsCollection)
        .update({
          fyProposedSpend20: this.settings.fyProposedSpend20
        })
        .then(() => {
          if (this.settings.fyProposedSpend20) {
            this.$snotify.success(
              'The FY label for exporting will be change to Proposed spend FY 20',
              'Success'
            )
          } else {
            this.$snotify.success(
              'The FY label for exporting will be change to Proposed spend FY 19',
              'Success'
            )
          }
        })
    },
    saveStatus() {
      if (this.fyApproved === '') {
        this.$snotify.error('Fy Approved name is required', 'Error')
        return
      }
      if (this.currentFyApproved === '') {
        if (!this.settings.fyApproved) {
          this.settings.fyApproved = []
        }
        this.settings.fyApproved.push(this.fyApproved)
      } else {
        this.$set(
          this.settings.fyApproved,
          this.currentFyApproved,
          this.fyApproved
        )
      }
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc(this.appLabel.settingsCollection)
        .update({
          fyApproved: this.settings.fyApproved
        })
      this.$snotify.success(
        `The ${this.appLabel.singular} fyApproved has been saved`,
        'Success'
      )
      this.cancel()
    },
    deleteStatus(id, name) {
      const confirmation = confirm(
        `Do you want to delete this FY Approved: ${name}`
      )
      if (confirmation) {
        this.submitDelete(id)
      }
    },
    submitDelete(id) {
      this.settings.fyApproved.splice(id, 1)
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc(this.appLabel.settingsCollection)
        .update({
          fyApproved: this.settings.fyApproved
        })
      this.$snotify.success(
        `The ${this.appLabel.singular} fyApproved has been deleted`,
        'Success'
      )
    },
    editStatus(id, name) {
      this.fyApproved = name
      this.currentFyApproved = id
      this.showForm = true
    },
    cancel() {
      this.fyApproved = ''
      this.currentFyApproved = ''
      this.showForm = false
    }
  },
  firestore() {
    return {
      settings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc(this.appLabel.settingsCollection)
    }
  }
}
</script>
