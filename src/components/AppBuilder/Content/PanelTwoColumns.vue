<template>
  <v-row class="d-flex justify-center ma-0 mb-2 pa-0 w-full">
    <v-col
      class="d-flex flex-column pa-0 pr-2"
      :cols="leftColumn"
    >
      <slot name="leftPanel" />
    </v-col>
    <v-col
      class="pa-0 pl-2"
      :cols="rightColumn"
    >
      <slot name="rightPanel" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'PanelTwoColumns',
  components: {
  },
  props: {
    rightColumn: {
      type: [Number, String],
      default: 6
    },
    leftColumn: {
      type: [Number, String],
      default: 6
    }
  },
  data: () => ({
  }),
  computed: {
  },
  methods: {
  }
}
</script>
