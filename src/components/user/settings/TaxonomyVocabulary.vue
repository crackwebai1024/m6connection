<template>
  <v-card>
    <v-card-title class="d-flex justify-center">
      <div class="blue--text pa-1 subtitle-2">
        Vocabularies |
      </div>
      <v-spacer />
      <div>
        <v-btn
          color="primary"
          @click="newVocabularyDialog"
        >
          New Vocabulary
        </v-btn>
      </div>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="vocabulary"
        :items-per-page="5"
      >
        <template v-slot:body="props">
          <template v-if="props.items.length === 0">
            <tr>
              <td
                class="no-data-td"
                colspan="2"
              >
                No available data.
              </td>
            </tr>
          </template>
          <template v-else>
            <tr
              v-for="(row, index) in props.items"
              :key="index"
            >
              <td
                class="vocabulary-td"
                @click="clickedVocabulary(row)"
              >
                {{ row.title }}
              </td>
              <td class="vocabulary-td">
                <v-icon
                  @click="editVocabulary(row.id)"
                >
                  mdi-pencil
                </v-icon>
                <v-icon @click="deleteV(row.id)">
                  mdi-delete
                </v-icon>
              </td>
            </tr>
          </template>
        </template>
      </v-data-table>
    </v-card-text>
    <m6-loading :loading="loading" />
    <taxonomy-vocabulary-dialog
      :createDialog="createDialog"
      :selectedVocabulary="editingVocabulary"
      :status="editOrCreate"
      @closeDialog="createDialog = false"
    />
    <v-dialog
      v-model="deleteDialog"
      max-width="600px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">Are you sure?</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            Delete vocabulary.
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="deleteDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="red darken-1"
            text
            @click="confirmDeleteV"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import TaxonomyVocabularyDialog from './TaxonomyVocabularyDialog'
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: 'TaxonomyVocabulary',
  components: {
    TaxonomyVocabularyDialog
  },
  data: () => ({
    headers: [
      { text: 'Title', value: 'title' },
      { text: 'Actions', value: 'actions' }
    ],
    loading: true,
    createDialog: false,
    editOrCreate: 'create',
    editingVocabulary: {},
    deleteDialog: false,
    deleteItemId: null
  }),
  computed: {
    vocabulary() {
      return this.getVocabulary()
    }
  },
  async mounted() {
    await this.initVocabulary()
    this.loading = false
  },
  methods: {
    ...mapGetters('Taxonomy', {
      getVocabulary: 'getTaxonomyVocabulary'
    }),
    ...mapActions('Taxonomy', {
      initVocabulary: 'setTaxonomyVocabularies',
      deleteVocabulary: 'deleteVocabulary',
      setSelectedVocabularyId: 'setCurrentVocabularyId'
    }),
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),
    ...mapMutations('UserSettingsControl', {
      pickingComponent: 'setSecondColumnComponent'
    }),
    newVocabularyDialog() {
      this.editOrCreate = 'create'
      this.createDialog = true
    },
    clickedVocabulary(item) {
      this.setSelectedVocabularyId(item.id)
      this.pickingComponent({
        name: 'taxonomy-terms'
      })
    },
    deleteV(id) {
      this.deleteItemId = id
      this.deleteDialog = true
    },
    confirmDeleteV() {
      this.loading = true
      this.deleteVocabulary(this.deleteItemId).then(res => {
        if (res.result) {
          this.initVocabulary()
          this.notifSuccess('Deleted vocabulary.')
        } else {
          this.notifDanger('Error, can not delete vocabulary.')
        }
        this.loading = false
        this.deleteDialog = false
      }).catch(e => {
        this.notifDanger('Error, can not delete vocabulary.')
        this.loading = false
        this.deleteDialog = false
      })
    },
    editVocabulary(id) {
      this.editingVocabulary = this.vocabulary.find(row => row.id === id)
      this.editOrCreate = 'edit'
      this.createDialog = true
    }
  }
}
</script>

<style scoped>
.vocabulary-td {
  text-align: left;
  padding-left: 15px;
  height: 40px;
  border-bottom: 1px solid #f2f2f2;
  cursor: pointer;
}
.no-data-td {
  height: 100px;
  text-align: center;
}
</style>
