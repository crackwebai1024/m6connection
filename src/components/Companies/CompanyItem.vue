<template>
  <v-hover v-slot:default="{ hover }">
    <v-card elevation="0" class="mx-auto transparent" tile :class="{ 'on-hover': !hover }" @click="updateInfo()">
      <component v-bind:is="compData" :companyData="companyData" ></component>
    </v-card>
  </v-hover>
</template>
<script>
import { mapActions } from "vuex";
import globalDataApp from "../../store/data"

export default {
  name: 'CompanyItem',
  props: {
    companyData: Object,
  },
  data: () => ({
    compData: {},
  }),
  computed: {
    tagColor() {
      return this.companyData['type'] === 'Vendor' ? 'indigo ' : 'teal accent-3 ';
    }
  },
  methods: {
    ...mapActions("InfoModule", [
      "set_info_data",
      "change_preview_navigation_drawer",
    ]),
    ...mapActions("GeneralListModule", ["push_data_to_active"]),
    updateInfo() {
      this.push_data_to_active(this.companyData);
      this.change_preview_navigation_drawer(true);
    }
  },
  created(){
    this.compData = globalDataApp.companies_widgets['company'][0].component;
  }
};
</script>
