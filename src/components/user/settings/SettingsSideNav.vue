<template>
  <v-card
    class="mx-auto"
    width="300"
  >
    <v-list>
      <v-list-item>
        <v-list-item-title
          class="text-left"
          @click="pickingComponent({ })"
        >
          My Profile
        </v-list-item-title>
      </v-list-item>

      <v-list-group>
        <template v-slot:activator>
          <v-list-item-title class="text-left">
            My Company
          </v-list-item-title>
        </template>

        <v-list-item
          v-for="(link, index) in companyLinks"
          :key="`company-link-${index}`"
          class="ml-4 text-left"
          @click="pickingComponent({ name: 'company-show', size: 9, tab: link.tab})"
        >
          {{ link.name }}
        </v-list-item>
      </v-list-group>

      <v-list-group>
        <template v-slot:activator>
          <v-list-item-title class="text-left">
            User Mangement
          </v-list-item-title>
        </template>

        <v-list-item
          class="ml-4 text-left"
          @click="pickingComponent({ name: 'user-mangement-table' })"
        >
          All Users
        </v-list-item>
      </v-list-group>

      <v-list-item>
        <v-list-item-title
          class="cursor-pointer text-left"
          @click="pickingComponent({
            name: 'taxonomy-vocabulary'
          })"
        >
          Taxonomies
        </v-list-item-title>
      </v-list-item>

      <div class="px-2">
        <hr>
      </div>

      <v-list-item>
        <v-list-item-title class="text-left">
          IT Applications
        </v-list-item-title>
      </v-list-item>

      <v-list-item>
        <v-list-item-title class="text-left">
          Capital Projects Management
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="$router.push('/cpm/import/tool')">
        <v-list-item-title class="text-left">
          Capital Projects Import Tool
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'SettingsSideNav',

  data: () => ({
    companyLinks: [
      { name: 'General', tab: 0 },
      { name: 'Project Specs', tab: 1 },
      { name: 'Social Media', tab: 2 },
      { name: 'Locations', tab: 3 },
      { name: 'Codes', tab: 4 },
      { name: 'Image', tab: 5 }
    ]
  }),

  methods: {
    ...mapMutations('UserSettingsControl', {
      pickingComponent: 'setSecondColumnComponent'
    })
  }
}
</script>

<style lang="scss" scoped>
.cursor-pointer {
  cursor: pointer;
}
.no-flex {
  display: block;
}
.text-left {
  text-align: left;
}
</style>
