<template>
  <v-container
    class="d-flex dont-show-scroll h-full ma-0 pb-0 pt-5 px-0 vertical-scroll"
    :class="{'w-full': $vuetify.breakpoint.xs , 'w-3__5': $vuetify.breakpoint.md || $vuetify.breakpoint.sm, 'max-w-lg w-content': $vuetify.breakpoint.lgAndUp }"
  >
    <marketplace-list></marketplace-list>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import MarketplaceList from "./MarketplaceList";

export default {
  name: "Marketplace",
  components: {
    MarketplaceList,
  },
  data: () => ({}),
  computed: {
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>
