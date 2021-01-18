<template>
  <div class="align-center d-flex justify-space-between max-w-lg mx-auto relative w-full">
    <div class="align-center d-flex">
      <v-tabs
        v-model="activeTab"
        active-class="font-weight-black blue--text active-tab-company"
        @change="updateTabPanels"
      >
        <v-tab
          v-for="(tab, index) in app.tabs"
          :key="index"
          class="blue--text capitalize"
        >
          <template v-if="activeTab === index && !tab.readOnly">
            <v-btn
              color="green darken-2"
              dark
              icon
              @click="editingTab(tab)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              color="red darken-2"
              dark
              icon
              @click="deleteTab"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>

          <span>{{ tab.title }}</span>

        </v-tab>
      </v-tabs>
      <add-tab
        v-if="appLoaded"
        :layout-type="app.layout_type"
        @addNewTab="addNewTab"
      />
    </div>

    <tab-updates
      :dialog="showTabEditDialog"
      :tab-to-edit="tabToEdit"
      @closing="closingTabUpdates"
      @updateTab="updatingTab"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import TabUpdates from '@/components/AppBuilder/Modals/TabUpdates'
import AddTab from '@/components/AppBuilder/Buttons/AddTab'

export default {

  components: {
    TabUpdates,
    AddTab
  },

  data: () => ({
    showTabEditDialog: false,
    tabToEdit: {},
  }),

  computed: {
    ...mapState('AppBuilder', {
      app: 'app'
    }),

    appLoaded() {
      return Boolean(this.app.id)
    },

    ...mapState('Builder', {
      activeTabRef: 'activeTab'
    }),

    activeTab: {
      get() {
        return this.activeTabRef
      },
      set(activeTab) {
        this.setActiveTab(activeTab)
      }
    }
  },

  methods: {
    ...mapMutations('Builder', {
      setActiveTab: 'setActiveTab'
    }),
    
    editingTab(tab) {
      this.showTabEditDialog = true
      this.$nextTick(() => {
        this.tabToEdit = tab
      })
    },

    updatingTab(payload) {
      this.app.tabs[this.activeTab] = {
        ...this.app.tabs[this.activeTab],
        ...payload.tab
      }
    },

    closingTabUpdates() {
      this.showTabEditDialog = false
      this.$nextTick(() => {
        this.tabToDelete = {}
      })
    },

    deleteTab() {
      this.message = `Tab '${this.app.tabs[this.activeTab]['title']}'`
      this.showDeleteModal = true
      this.tabToDelete = this.app.tabs[this.activeTab].id
    },

    addNewTab(tabNumOption) {
      const newTab = {
        appID: this.app.id,
        weight: 0,
        title: 'New Tab',
        fullWidth: tabNumOption
      }
      this.$store.dispatch('AppBuilder/saveTab', newTab).then(result => {
        this.app.tabs.push(result)

        const activeTab = this.app.tabs.map(item => item.id).indexOf(result.id)
        this.setActiveTab(activeTab)
      })
    },

    updateTabPanels() {
      this.rightPanels = this.app.tabs[this.activeTab].panels.filter(item => item.column === 1)
      this.leftPanels = this.app.tabs[this.activeTab].panels.filter(item => item.column === 0)
    },

  }
}
</script>