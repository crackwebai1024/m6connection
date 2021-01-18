<template>
  <v-btn
    class="capitalize green lighten-2 px-8 py-6 white--text"
    text
    @click="copyPanel"
  >
    Copy Panel
  </v-btn>
</template>

<script>
export default {
  name: 'CopyPanel',
  methods: {
    copyPanel() {
      this.$emit('copyPanel')
    }
  }
}
</script>
