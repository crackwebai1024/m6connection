<template>
  <v-footer
    v-if="$vuetify.breakpoint.smAndDown"
    class="blue d-flex darken-3"
    fixed
    padless
  >
    <v-tabs
      active-class="blue darken-4"
      background-color="transparent"
      class="align-center d-flex justify-center mx-auto w-fit"
      color="white"
      height="60"
      :hide-slider="true"
      :value="3"
      width="100%"
    >
      <v-tab
        v-for="(link, i) in quickAccessLinks"
        :key="'link' + i"
        class="mb-0"
        :to="link.url"
      >
        <apps-btn-drop-down v-if="link.text === 'apps'" :icon="link.icon" />
        <v-icon v-else color="white" size="20"> mdi-{{ link.icon }} </v-icon>
      </v-tab>
    </v-tabs>
  </v-footer>
</template>

<script>
import AppsBtnDropDown from "@/components/Home/TopNav/AppsBtnDropDown";
export default {
  name: "FooterNav",
  components: {
    AppsBtnDropDown,
  },
  data: () => ({
    quickAccessLinks: [
      { url: "/", icon: "home" },
      { url: "/companies", icon: "office-building" },
      { url: "/records", icon: "view-comfy", text: "apps" },
      { url: "/store", icon: "storefront" },
      { url: "/user/settings", icon: "cog" },
    ]
  })
}
</script>

<style>
footer div[role="tablist"] {
  width: 100% !important;
}
footer a[role="tab"] button.v-icon {
  font-size: 20px !important;
}
</style>

<style lang="scss" scoped>

.v-tab.v-tab {
  min-width: 20%;
}
</style>

