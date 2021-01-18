<template>
  <v-card class="rounded-lg">
    <v-card-title class="headline">
      Change Background and Text Color
    </v-card-title>
    <v-row>
      <v-col
        class="px-0"
        cols="12"
      >
        <v-tabs
          v-model="tabsPicker"
          centered
        >
          <v-tab>
            Background
          </v-tab>
          <v-tab>
            Text
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tabsPicker">
          <v-tab-item>
            <v-card flat>
              <v-card-text class="d-flex justify-center">
                <sketch-picker v-model="headerBackgroundColor" />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text class="d-flex justify-center">
                <sketch-picker v-model="headerTextColor" />
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>

        <div
          class="align-center d-flex justify-center py-4 w-full"
        >
          <v-card
            class="mx-auto w-full"
            max-width="500"
          >
            <v-toolbar
              :color="headerBackgroundColor.hex"
            >
              <v-toolbar-title :color="headerTextColor.hex">
                <span :style="'color: ' + headerTextColor.hex + ';'">Title</span>
              </v-toolbar-title>
              <v-spacer />
            </v-toolbar>

            <v-container fluid>
              <v-row dense>
                <v-col
                  v-for="i in 3"
                  :key="i"
                  :cols="12"
                />
              </v-row>
            </v-container>
          </v-card>
        </div>
      </v-col>
    </v-row>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="green darken-1"
        outlined
        @click="btnClick(false)"
      >
        Cancel
      </v-btn>
      <v-btn
        color="green darken-1"
        outlined
        @click="btnClick(true)"
      >
        Select
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { Sketch } from 'vue-color'
import icons from '@/utils/iconList'

export default {
  name: 'HeaderBuilderDialog',
  components: {
    'sketch-picker': Sketch
  },
  data: () => ({
    headerBackgroundColor: {
      hex: '#000'
    },
    headerTextColor: {
      hex: '#fff'
    },
    tabsPicker: 0
  }),
  methods: {
    btnClick(selected) {
      this.$emit('selectHeaderAction', selected, {
        headerBackgroundColor: this.headerBackgroundColor.hex ? this.headerBackgroundColor.hex : '#AAA',
        headerTextColor: this.headerTextColor.hex ? this.headerTextColor.hex : '#fff'
      })
    }
  }
}
</script>
