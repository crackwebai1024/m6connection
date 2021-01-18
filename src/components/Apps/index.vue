<template>
  <v-container
    class="d-flex dont-show-scroll h-full mx-0 pb-0 pt-sm-5 pt-0 px-0 vertical-scroll"
    :class="{'w-full': $vuetify.breakpoint.xs && !tableView , 'w-3__5': ($vuetify.breakpoint.md || $vuetify.breakpoint.sm) && !tableView, 'max-w-content w-content': $vuetify.breakpoint.lgAndUp && !tableView }"
    fluid
    :style="` ${ tableView ? 'width: 100%' : '' } `"
  >
    <!-- General use list component-->
    <template v-if="screenStatus()">
      <record-container
        class="align-content-start main-content"
        :data="recordFullScreen()"
      />
    </template>
    <template v-else>
      <!-- Project List Component -->
      <general-list
        class="align-content-start main-content px-0"
        @tableView=" e => tableView = e "
      />
    </template>
  </v-container>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import GeneralList from '@/views/Home/GeneralList'
import RecordContainer from '@/components/RecordMode/RecordContainer'

export default {
  // eslint-disable-next-line vue/match-component-file-name
  name: 'Records',
  components: {
    RecordContainer,
    GeneralList
  },
  data: () => ({
    tableView: false
  }),
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
