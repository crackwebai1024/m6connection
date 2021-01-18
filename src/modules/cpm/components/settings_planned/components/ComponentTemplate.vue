<template>
  <v-card class="selected-setting">
    <v-card-title>
      <v-spacer />
      <slot name="button" />
    </v-card-title>
    <slot />
    <v-card-text class="vertical-scroll" />
  </v-card>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
  .selected-setting {
    height: 100%;
  }
</style>
