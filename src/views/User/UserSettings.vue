<template>
  <v-container fluid>
    <v-row class="text-center">
      <v-col cols="3">
        <settings-side-nav />
      </v-col>
      <v-col :cols="secondColumnComponent.size || 6">
        <component :is="secondColumnComponent.name" />
      </v-col>
      <template v-if="!secondColumnComponent.size">
        <v-col :cols="3">
          <component :is="thirdColumnComponent.name" />
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import SettingsSideNav from '@/components/user/settings/SettingsSideNav'
import UserMangementTable from '@/components/user/settings/UserMangementTable'
import UserSettingsDetails from '@/components/user/settings/UserSettingsDetails'
import CompanyShow from '@/components/Companies/settings/CompanyShow'
import TaxonomyVocabulary from '@/components/user/settings/TaxonomyVocabulary'
import TaxonomyTerms from '@/components/user/settings/TaxonomyTerms'

export default {
  name: 'UserSettings',
  components: {
    SettingsSideNav,
    UserMangementTable,
    UserSettingsDetails,
    CompanyShow,
    TaxonomyVocabulary,
    TaxonomyTerms
  },
  methods: {
    ...mapMutations('PageControl', {
      setShowSidePanels: 'setShowSidePanels'
    })
  },
  computed: {
    ...mapState('UserSettingsControl', {
      secondColumnComponent: 'secondColumnComponent',
      thirdColumnComponent: 'thirdColumnComponent'
    })
  },
  mounted() {
    this.setShowSidePanels(false)
  },
  beforeDestroy() {
    this.setShowSidePanels(true)
  }
}
</script>
