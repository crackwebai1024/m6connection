<template>
  <div>
    <div class="align-center d-flex">
      <div class="grey lighten-3 pa-16">
        <v-icon
          class="grey--text text--lighten-1"
          size="38"
        >
          mdi-image-filter-hdr
        </v-icon>
      </div>
      <div class="ml-8">
        <p class="add-field font-weight-regular grey lighten-3 mb-1 pt-1 px-4 rounded-xl">
          Record Title
        </p><p />

        <v-list>
          <v-list-item
            v-for="field in appFieldsFiltered"
            :key="field.id"
            class="my-0 py-0"
          >
            <v-list-item-content>
              <v-list-item-title>{{ field.label }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action class="my-0 py-0">
              <v-btn
                icon
              >
                <v-icon color="red lighten-3">
                  mdi-delete
                </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {

  data: () => ({
    showDeleteModal: false,
    message: '',
    fieldToDelete: 0
  }),

  computed: {
    ...mapState('AppBuilder', {
      app: 'app'
    }),

    appFieldsFiltered() {
      return this.$h.dg(this.app, 'fields', []).filter(f => !f.table_id)
    }
  }
}
</script>
