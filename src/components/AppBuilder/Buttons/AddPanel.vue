<template>
  <v-btn
    class="capitalize green lighten-2 mr-2 px-8 py-6 white--text"
    text
    @click="addNewPanel"
  >
    Add Panel
  </v-btn>
</template>

<script>
export default {
  name: 'AddPanel',
  methods: {
    addNewPanel() {
      this.$emit('addNewPanel')
    }
  }
}
</script>
