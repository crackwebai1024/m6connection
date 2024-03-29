<template>
  <component-template>
    <template slot="button">
      <v-btn
        color="primary"
        fab
        light
        small
        @click="showForm = true"
      >
        <v-icon>
          mdi-plus
        </v-icon>
      </v-btn>
    </template>

    <v-container class="pt-0">
      <v-card>
        <v-card-text class="vertical-scroll">
          <v-form ref="form">
            <h6
              v-if="currentCapitalType"
              class="indigo--text"
            >
              Editing:
            </h6>
            <v-text-field
              v-model="capitalType"
              color="blue"
              :label="`Type of Request`"
            />
            <input
              v-model="currentCapitalType"
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
              @click="saveCapitalType"
            >
              {{ submitLoading ? 'Saving...' : 'Save' }}
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>

      <v-card>
        <v-card-text class="vertical-scroll">
          <label>Current Type of Request</label>
          <v-list
            class="mainList"
            dense
          >
            <v-list-tile class="myListHeader">
              <v-list-tile-content>Name</v-list-tile-content>
              <v-list-tile-action>Action</v-list-tile-action>
            </v-list-tile>
            <draggable
              v-model="settings.capitalType"
              :options="{ group: 'capitalType' }"
              @end="drag = false"
              @start="drag = true"
              @update="saveOrder"
            >
              <v-list-tile
                v-for="(name, key) in settings.capitalType"
                :key="key"
                class="myList"
              >
                <v-list-tile-avatar>
                  <v-icon
                    color="blue"
                    small
                  >
                    mdi-drag-variant
                  </v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>{{ name }}</v-list-tile-content>
                <v-list-tile-action
                  style="flex-direction:row; justify-content: flex-end;"
                >
                  <v-btn
                    class="xs-btn"
                    fab
                    icon
                    @click.prevent="editCapitalType(key, name)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    class="xs-btn"
                    fab
                    icon
                    @click.prevent="deleteCapitalType(key, name)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </draggable>
          </v-list>
        </v-card-text>
      </v-card>
    </v-container>
  </component-template>
</template>

<script>
import { db } from '@/utils/Firebase.js'
import { mapState, mapGetters } from 'vuex'
import draggable from 'vuedraggable'
import ComponentTemplate from '../ComponentTemplate'
export default {
  components: {
    draggable,
    ComponentTemplate
  },
  data() {
    return {
      capitalType: '',
      currentCapitalType: '',
      settings: {},
      submitLoading: false,
      rules: {
        required: value => !!value || 'Required.'
      }
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
              capitalType: []
            })
        }
      })
  },
  methods: {
    saveOrder() {
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc(this.appLabel.settingsCollection)
        .update({
          capitalType: this.settings.capitalType
        })
    },
    saveCapitalType() {
      if (this.capitalType === '') {
        this.$snotify.error('Type of Request is required', 'Error')
        return
      }
      if (this.currentCapitalType === '') {
        if (!this.settings.capitalType) {
          this.settings.capitalType = []
        }
        this.settings.capitalType.push(this.capitalType)
      } else {
        this.$set(
          this.settings.capitalType,
          this.currentCapitalType,
          this.capitalType
        )
      }
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc(this.appLabel.settingsCollection)
        .update({
          capitalType: this.settings.capitalType
        })
      this.$snotify.success('The Type of Request has been saved', 'Success')
      this.capitalType = ''
      this.currentCapitalType = ''
    },
    deleteCapitalType(id, name) {
      const confirmation = confirm(
        `Do you want to delete this Type of Request: ${name}`
      )
      if (confirmation) {
        this.submitDelete(id)
      }
    },
    submitDelete(id) {
      this.settings.capitalType.splice(id, 1)
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc(this.appLabel.settingsCollection)
        .update({
          capitalType: this.settings.capitalType
        })
      this.$snotify.success('The Type of Request has been deleted', 'Success')
    },
    editCapitalType(id, name) {
      this.capitalType = name
      this.currentCapitalType = id
    },
    cancel() {
      this.capitalType = ''
      this.currentCapitalType = ''
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

<style lang="scss">
.v-list__tile__action .v-list__tile__action--stack {
  background: red;
}
.mainList {
  border: 1px solid #ccc;
  .v-list__tile__action {
    width: 20%;

    button {
      z-index: 1;
    }
  }
  .myListHeader {
    .v-list__tile__action {
      padding-right: 10px;
    }
  }
  .myList {
    border-bottom: 1px solid #ccc;

    &:first-child {
      border-top: 1px solid #ccc;
    }
    &:nth-child(odd) {
      background: #f9f9f9;
    }
    &:last-child {
      border-bottom: none;
    }
  }
  .v-list__tile__content {
    font-size: 13px;
  }
}
</style>
