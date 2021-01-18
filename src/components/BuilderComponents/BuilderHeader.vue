<template>
  <div>
    <slot name='first-float' />
    <slot name='second-float' />

    <v-card
      class="d-flex justify-center rounded-0 w-full"
      flat
    >
      <v-card
        class="align-center d-flex justify-space-between max-w-lg mx-auto pb-4 pt-6 relative rounded-0 w-full"
        flat
      >
        <slot name='left-half' />

        <div
          class="flex-space-between"
        >
          <slot name='right-half' />
        </div>
      </v-card>
    </v-card>

  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
</style>