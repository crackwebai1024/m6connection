<template>
  <div>
    <v-dialog
      v-model="showHeaderColor"
      width="800"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          absolute
          color="primary"
          dark
          fab
          left
          small
          style="top: 120px"
          top
          v-on="on"
          @click="showHeaderColor = !showHeaderColor"
        >
          <v-icon>mdi-format-color-fill</v-icon>
        </v-btn>
      </template>
      <header-builder-dialog
        @selectHeaderAction="selectHeaderAction"
      />
    </v-dialog>

    <m6-loading :loading="loading" />
  </div>
</template>

<script>
import HeaderBuilderDialog from '@/components/Dialogs/HeaderBuilderDialog'
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  name: "HeaderBackgroundPicker",

  components: {
    HeaderBuilderDialog
  },

  data: () => ({
    showHeaderColor: false,
    loading: false,
    headerBackgroundColor: '',
    headerTextColor: ''
  }),

  computed: {
    ...mapState('AppBuilder', {
      app: 'app'
    })
  },

  methods: {
    ...mapActions('AppBuilder', {
      updateApp: 'updateApp'
    }),

    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),

    async selectHeaderAction(selected, headerInfo) {
      this.showHeaderColor = !this.showHeaderColor
      if (selected) {
        this.headerBackgroundColor = headerInfo.headerBackgroundColor
        this.headerTextColor = headerInfo.headerTextColor
        this.loading = true

        try {
          const res = await this.updateApp({
            params: {
              ...this.app,
              metadata: {
                ...this.app.metadata,
                appHeader: {
                  headerBackgroundColor: this.headerBackgroundColor,
                  headerTextColor: this.headerTextColor
                }
              }
            }
          })
          this.loading = false
          this.notifSuccess('Updated!')
        } catch (e) {
          this.loading = false
          this.notifDanger('There was an error while updating')
          return e
        }
      }
    }
  }
}
</script>
