<template>
  <v-container
    class="mb-8 px-0 py-0 w-full"
  >
    <post-item
      v-if="Object.keys(actionPost).length > 0"
      :action-record="true"
      :data="actionPost"
      :record-i-d="$h.dg(actionPost, 'props.record.id' , '')"
    >
      <template v-slot:record>
        <p
          v-if="actionPost.props.record"
          :class="actionPost.props.colorTag + '--text ' + 'text-body-2 pointer ml-1 mb-0 d-flex align-center my-5'"
          @click="setRecord(actionPost.props.record)"
        >
          <v-icon :class="actionPost.props.colorTag + '--text ' + 'mr-1'">
            mdi-file-document-outline
          </v-icon>
          {{ actionPost.props.record.title }}
        </p>
      </template>
      <template v-slot:assignments>
        <div class="my-5" />
        <v-badge
          v-for="(follower, index) in actionPost.props.wo_assignments"
          :key="index + 'follower'"
          :bordered="!(follower.status === 'Complete' || follower.status === 'Declined')"
          :color="follower.status === 'Complete' ? 'green accent-3' : follower.status === 'Declined' ? 'red' :'white black--text'"
          :dark="!(follower.status === 'Complete' || follower.status === 'Declined')"
          :icon="follower.status === 'Complete' ? 'mdi-check' : follower.status === 'Declined' ? 'mdi-close-circle' : 'mdi-help'"
          offset-x="12"
          offset-y="12"
          top
        >
          <v-avatar size="28">
            <v-img
              v-if="follower.profilePic !== ''"
              :src="follower.profilePic"
            />
            <v-icon
              v-else
              color="light-blue lighten-3"
            >
              mdi-account
            </v-icon>
          </v-avatar>
        </v-badge>
      </template>
    </post-item>
    <post-item
      v-for="(item, index) of timeline.filter((e, i) => i < currentIndex)"
      :key="index"
      :data="item"
    />
    <infinite-loading
      :identifier="timeline"
      infinite-scroll-disabled="busy"
      @infinite="infiniteHandler"
    >
      <div slot="spinner" />
      <div slot="no-more" />
      <div slot="no-results" />
    </infinite-loading>
  </v-container>
</template>

<script>
import PostItem from './PostItem'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PostsList',
  components: {
    PostItem
  },
  props: {
    external: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    busy: false,
    currentIndex: 0
  }),
  computed: {
    ...mapGetters('SocialNetworkModule', ['get_filter_data']),
    ...mapGetters('GSFeed', {
      actionPost: 'getActionPost',
      feedNotification: 'getFeedNotification',
      timeline: 'getTimeline',
      feed: 'getFeed'
    }),
    ...mapGetters('Auth', { user: 'getUser' })
  },
  async mounted() {
    if (!this.external) {
      this.set_user_data()
      this.set_posts_data()
      await this.$store.dispatch('GSFeed/cleanFeed')
      await this.$store.dispatch('GSFeed/retrieveFeed')

      this.feed.subscribe(async data => {
        if (data.new) {
          await this.$store.dispatch('GSFeed/retrieveFeed')
        }
      })
    }

    this.feedNotification.get().then(() => {})
    this.feedNotification.subscribe(data => {
      if (data.new.length > 0) {
        const newReaction = data.new[0]['object']
        const objectIndex = this.timeline.indexOf(this.timeline.filter(e => e.id === newReaction['id'])[0])

        if (this.timeline[objectIndex].reaction_counts.like === 0) {
          this.timeline[objectIndex]['own_reactions']['like'] = []
        }
        this.timeline[objectIndex]['own_reactions']['like'].push(newReaction)
        this.timeline[objectIndex].reaction_counts.like++
      }
      if (data.deleted.length > 0) {
        // Empty
      }
    })
  },
  methods: {
    ...mapActions('SocialNetworkModule', ['set_posts_data']),
    ...mapActions(['set_user_data']),
    ...mapActions('GeneralListModule', {
      recordData: 'push_data_to_active'
    }),
    ...mapActions('InfoModule', {
      changeDrawer: 'change_preview_navigation_drawer'
    }),
    infiniteHandler($state) {
      this.busy = true
      setTimeout(() => {
        if (this.currentIndex < this.timeline.length) {
          this.currentIndex++
          $state.loaded()
        } else {
          $state.complete()
        }
        this.busy = false
      }, 100)
    },
    successCallback: () => true,
    failCallback: () => false,
    setRecord(record) {
      record.app_prefix = record.app.prefix
      record.app_type = record.app.app_type
      this.recordData(record)
      this.changeDrawer(true)
    }
  }
}
</script>

<style>
</style>
