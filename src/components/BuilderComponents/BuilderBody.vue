<template>
  <div>
    <div
      v-if="appLoaded"
      class="details-content grey h-fit lighten-3 pb-5 pt-2"
      style="height: 59vh; overflow-y: auto;"
    >
      <v-row class="align-start d-flex justify-space-between max-w-lg mx-auto pt-1 w-full">
        <v-col
          class="d-flex flex-column justify-center pa-0 pr-1"
          :cols=" $h.dg(app, `tabs.${activeTab}.full_width`, false) ? 12 : 5"
        >
          <draggable
            v-model="leftPanels"
            group="panel"
            @change="onPanelMove(0, $event)"
          >
            <panel
              v-for="panel in leftPanels"
              :key="panel.id"
              :app-i-d="app.id"
              :panel="panel"
              @copyPanel="copyPanel"
              @deletePanel="deletePanel"
              @updatePanel="updatePanel"
              @updatingTable=" e => updatingTable(panel, e)"
            />
          </draggable>
          <div class="d-flex justify-center">
            <add-panel @addNewPanel="addNewPanel(0)" />
            <copy-panel @copyPanel="copyPanelFromApp(0)" />
          </div>
        </v-col>
        <template v-if="!$h.dg(app, `tabs.${activeTab}.full_width`, false) && showSocial">
          <v-col
            v-if="$h.dg(app, `tabs.${activeTab}`, { title: '' }).title.toLowerCase() !== 'home'"
            class="pa-0 pl-1"
            cols="7"
          >
            <draggable
              v-model="rightPanels"
              group="panel"
              @change="onPanelMove(1, $event)"
            >
              <panel
                v-for="panel in rightPanels"
                :key="panel.id"
                :app-i-d="app.id"
                :panel="panel"
                @copyPanel="copyPanel"
                @deletePanel="deletePanel"
                @updatePanel="updatePanel"
                @updatingTable=" e => updatingTable(panel, e)"
              />
            </draggable>
            <div class="d-flex justify-center">
              <add-panel @addNewPanel="addNewPanel(1)" />
              <copy-panel @copyPanel="copyPanelFromApp(1)" />
            </div>
          </v-col>

          <v-col
            v-else
            class="pa-0 pl-1"
            cols="7"
          >
            <project-social-media
              class="opacity-social-media"
              post-list-show
            />
          </v-col>
        </template>
      </v-row>
    </div>

    <copy-panel-dialog
      v-if="copyPanelDialog"
      :show="copyPanelDialog"
      @copy="copyPanelFromAnotherApp"
      @close="copyPanelDialog = false"
    />

    <m6-loading :loading="loading" />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import Panel from '@/components/AppBuilder/Panel'
import Draggable from 'vuedraggable'
import AddPanel from '@/components/AppBuilder/Buttons/AddPanel'
import ProjectSocialMedia from '@/views/Home/ProjectSocialMedia'
import CopyPanel from '@/components/AppBuilder/Buttons/CopyPanel.vue'
import CopyPanelDialog from '@/components/AppBuilder/Modals/CopyPanel.vue'

export default {
  props: {
    showSocial: {
      type: Boolean,
      default: true
    }
  },

  components: {
    Panel,
    Draggable,
    AddPanel,
    ProjectSocialMedia,
    CopyPanel,
    CopyPanelDialog
  },

  data: () => ({
    loading: false,
    leftPanels: [],
    rightPanels: [],
    copySide: 0,
    copyPanelDialog: false
  }),

  computed: {
    ...mapState('AppBuilder', {
      app: 'app'
    }),

    ...mapState('Builder', {
      activeTab: 'activeTab'
    }),

    appLoaded() {
      return Boolean(this.app.id)
    }
  }, 

  methods: {
    ...mapActions('AppBuilder', {
      movePanel: 'movePanel'
    }),

    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),

    updateTabPanels() {
      this.rightPanels = this.$h.dg(this.app, `tabs.${this.activeTab}`, { panels: [] }).panels.filter(item => item.column === 1)
      this.leftPanels = this.$h.dg(this.app, `tabs.${this.activeTab}`, { panels: [] }).panels.filter(item => item.column === 0)
    },

    async onPanelMove(column, evt) {
      let ctx
      if (evt.added) {
        ctx = evt.added

        // Fix state
        this.app.tabs[this.activeTab].panels
          .filter(item => item.column === column && item.weight > evt.newIndex)
          .forEach(item => item.weight++)

        ctx.element.column = column
        ctx.element.weight = evt.newIndex
      } else if (evt.removed) {
        this.app.tabs[this.activeTab].panels
          .filter(item => item.column === column && item.weight > evt.oldIndex)
          .forEach(item => item.weight--)
      } else {
        ctx = evt.moved

        // Movement direction
        const dir = Math.sign(evt.newIndex - ctx.element.weight)

        // Move items with weight between start and end to appropriate place
        this.app.tabs[this.activeTab].panels
          .filter(item => item.column === column
            && inRange(item.weight, ctx.element.weight, evt.newIndex + dir))
          .forEach(item => item.weight = item.weight - dir)

        ctx.element.weight = evt.newIndex;
      }

      if (evt.moved || evt.added) {
        // Save data
        this.loading = true;
        try {
          await this.movePanel({
            id: ctx.element.id,
            newWeight: ctx.newIndex,
            newColumn: column
          })

          this.notifSuccess('Movement successfully saved')
        } catch (e) {
          this.notifDanger('An error occurred while saving movement')
        } finally {
          this.loading = false;
        }
      }
    },

    
    async copyPanel(panelId) {
      this.loading = true

      try {
        const newPanel = await this.$store.dispatch('AppBuilder/copyPanel', panelId)
        const copiedIdx = this.app.tabs[this.activeTab].panels.findIndex(p => p.id === panelId)
        this.app.tabs[this.activeTab].panels.splice(copiedIdx + 1, 0, newPanel)
        this.notifSuccess('Panel copied successfully')
      } catch (e) {
        this.notifDanger('There was an error when copying panel')
      } finally {
        this.loading = false
      }
    },


    deletePanel(id) {
      const index = this.app.tabs[this.activeTab].panels.map(item => item.id).indexOf(id)
      this.app.tabs[this.activeTab].panels.splice(index, 1)

      this.updateTabPanels()
    },

    updatePanel(data) {
      this.app.tabs[this.activeTab].panels = this.app.tabs[this.activeTab].panels.map(p => p.id === data.id ? data : p)
    },

    updatingTable(panel, table) {
      const index = panel.tables?.map(t => t.id).indexOf(table.id)
      if (index > -1) {
        panel.tables[index] = table
      } else {
        if (panel.tables)
        {
          panel.tables.push(table)
        }
        else
        {
          const tables = []
          tables.push(table)
          panel['tables'] = tables
        }

      }

      panel.tables = [...panel.tables]
    },

    addNewPanel(side) {
      const newPanel = {
        tabID: this.app.tabs[this.activeTab].id,
        weight: 0,
        column: side,
        title: 'New Panel',
        description: ''
      }
      this.$store.dispatch('AppBuilder/savePanel', newPanel).then(result => {
        this.app.tabs[this.activeTab].panels.push(result)
        this.updateTabPanels()
      })

    },

        copyPanelFromApp(side) {
      this.copySide = side
      this.copyPanelDialog = true
    },

    async copyPanelFromAnotherApp(panel) {
      this.loading = true

      try {
        const params = {
          panelId: panel.panel_id,
          column: this.copySide,
          tabId: this.app.tabs[this.activeTab].id,
        }

        const newPanel = await this.$store.dispatch('AppBuilder/copyPanelFromApp', params)
        this.app.tabs[this.activeTab].panels.push(newPanel)
        this.updateTabPanels()
        this.copyPanelDialog = false
        this.notifSuccess('Panel copied successfully')
      } catch (e) {
        console.log(e);
        this.notifDanger('There was an error when copying panel')
      } finally {
        this.loading = false
      }
    }
  },

  watch: {
    app: {
      immediate: true,
      handler: function(val) {
        if(!val.id) return 

        this.updateTabPanels()
      },
      deep: true
    },

    activeTab: {
      immediate: true,
      handler: function(val) {
        if(val > -1) this.updateTabPanels()
      }
    }
  }

}
</script>