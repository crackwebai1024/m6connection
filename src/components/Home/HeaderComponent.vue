<template>
  <div class="py-3 px-5 white" tile :height="info.height || 'inherit'">
    <v-row no-gutters class="fill-height mb-1 h-auto" align="center" justify="start">
      <!-- <v-icon left>{{info.icon}}</v-icon> -->
      <div class="text-body-2 font-weight-regular grey--text text--darken-4">{{ info.title }}</div>
      <v-spacer></v-spacer>
      <slot v-if="hasslot" align="center" class="mb-0 purple--text text--darken-1 font-weight-bold" name="select"></slot>
    </v-row>
    <div class="d-flex">
      <slot name="input"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "HeaderComponent",
  props: {
    info: Object,
    hasslot: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.header-title {
  font-size: 1.6em;
  line-height: 1;
}
</style>