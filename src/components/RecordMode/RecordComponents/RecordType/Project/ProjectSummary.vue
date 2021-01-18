<template>
    <v-container class="px-0 py-0 white">
        <v-img class="white--text align-end" height="100px" :src="info['record_image_url']">
            <div class="px-3 py-1 absolute top-0 right-0">{{ info['phase'] }}</div>
        </v-img>
        <v-card-text class="text--primary py-1">
            <div class="d-flex flex-row flex-nowrap align-baseline">
            <div class="subtitle-1 font-weight-black">{{ info['record_name'] }}</div>
            <v-spacer></v-spacer>
            <div class="caption">
                <span class="font-weight-black">ID:</span>
                {{ info['uid'] }}
            </div>
            </div>
            <div class="caption custom-line-height">
            <div>
                <span class="font-weight-black">Company:</span>
                {{ info['company'] }}
            </div>
            <div>
                <span class="font-weight-black">Department:</span>
                {{ info['department'] }}
            </div>
            <div>
                <span class="font-weight-black">record Leader:</span>
                {{ info['record_leader'] || 'Not assigned' }}
            </div>
            </div>
        </v-card-text>
    </v-container>
</template>

<script>

export default {
  name: "ProjectSummary",
  props: {
    info: Object,
  },
  methods: {
  }
};
</script>
