<template>
  <v-container
    class="d-flex dont-show-scroll h-full ma-0 pb-0 pt-5 px-0 vertical-scroll"
    :class="{'w-full': $vuetify.breakpoint.xs , 'w-3__5': $vuetify.breakpoint.md || $vuetify.breakpoint.sm, 'max-w-content w-content': $vuetify.breakpoint.lgAndUp }"
  >
    <!-- General use list component-->
    <template v-if="screenStatus()">
      <record-container
        class="main-content"
        :data="recordFullScreen()"
      />
    </template>
    <template v-else>
      <!-- Social Network -->
      <project-social-media class="main-content px-0" />
      <image-caroussel-overlay
        :images="imageArray"
        :selected="selectedImage"
        :value="overlayActive"
        @restartImageArray="restartImageArray"
      />
    </template>
  </v-container>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import ProjectSocialMedia from './ProjectSocialMedia'
import RecordContainer from '@/components/RecordMode/RecordContainer'
import ImageCarousselOverlay from '@/components/Shared/ImageCarousselOverlay'

export default {
  // eslint-disable-next-line vue/match-component-file-name
  name: 'Home',
  components: {
    ProjectSocialMedia,
    RecordContainer,
    ImageCarousselOverlay
  },
  computed: {
    ...mapGetters({
      screenStatus: 'GeneralListModule/get_screen_status',
      recordFullScreen: 'GeneralListModule/get_record_full_screen',
      imageOverlay: 'get_image_preview_overlay'
    }),
    ...mapState(['layout']),
    imageArray() {
      const images = this.imageOverlay()[0]
      return images
    },
    selectedImage() {
      const selected = this.imageOverlay()[1]
      return selected
    },
    overlayActive() {
      const selected = this.imageOverlay()[0].length > 0
      return selected
    }
  },
  methods: {
    ...mapActions(['reset_image_overlay']),
    restartImageArray() {
      this.reset_image_overlay()
    }
  }
}
</script>

