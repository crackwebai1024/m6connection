<template>
  <v-card
    class="relative"
    tile
  >
    <builder-header class="top-60" >
      <template v-slot:first-float >
        <app-activities-modal />
      </template>

      <template v-slot:second-float >
        <header-background-picker />
      </template>

      <template v-slot:left-half >
        <placeholders />
      </template> 

      <template v-slot:right-half >
        <tabs />
      </template> 
    </builder-header>

    <v-divider class="blue-grey lighten-5 max-w-lg mx-auto w-full" />

    <builder-body :showSocial="false" />
  </v-card>
</template>

<script>
import BuilderHeader from '@/components/BuilderComponents/BuilderHeader'
import Tabs from '@/components/BuilderComponents/Tabs'
import BuilderBody from '@/components/BuilderComponents/BuilderBody'
import AppActivitiesModal from '@/components/BuilderComponents/Modals/AppActivitiesModal'
import HeaderBackgroundPicker from '@/components/BuilderComponents/Modals/HeaderBackgroundPicker'
import Placeholders from '@/components/BuilderComponents/Placeholders'
import DefaultFields from '@/components/BuilderComponents/DefaultFields'

export default {

  components: {
    BuilderHeader,
    Tabs,
    BuilderBody,
    AppActivitiesModal,
    HeaderBackgroundPicker,
    Placeholders,
    DefaultFields
  },

  data: () => ({
  }),

  
}
</script>