<template>
  <v-container class="d-flex dont-show-scroll h-full w-content ma-0 pb-0 pt-5 px-0 vertical-scroll w-full">
    <!-- General use list component-->
    <template>
      <!-- Project List Component -->
      <apps-list class="align-content-start main-content" />
    </template>
  </v-container>
</template>

<script>
import AppsList from '@/components/RecordMode/RecordComponents/RecordType/DynamicApp/AppsList'

export default {
  name: 'AppBuilder',
  components: {
    AppsList
  }
}
</script>
