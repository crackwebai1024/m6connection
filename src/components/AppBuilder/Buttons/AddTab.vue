<template>
  <v-menu
    v-model="menu"
    absolute
    offset-y
    style="max-width: 600px"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        class="green lighten-2 ml-6 pa-0 white--text"
        icon
        v-on="on"
      >
        <v-icon size="23">
          mdi-plus
        </v-icon>
      </v-btn>
    </template>

    <v-list>
      <v-list-item v-if="layoutType.toUpperCase() == 'PROFILE'">
        <v-list-item-title>
          <v-btn text @click="addNewTab(false)">
            2 Columns
          </v-btn>
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>
          <v-btn text @click="addNewTab(true)" >
            Full Width
          </v-btn>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'AddTab',
  props: {
    layoutType: {
      type: String,
      required: true
    }
  },
  data: () => ({
    menu: false
  }),
  methods: {
    addNewTab(tabOption) {// false is two panels, true is one full width
      this.$emit('addNewTab', tabOption)
    }
  }
}
</script>
