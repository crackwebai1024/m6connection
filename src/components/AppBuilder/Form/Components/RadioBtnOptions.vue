<template>
  <div>
    <label>
      {{ label }}
    </label>
    <v-radio-group v-model="radio">
      <v-row>
        <v-col
          :cols="metadata.booleanOption === 'vertical' ? 12 : 6"
        >
          <v-radio
            label="Yes"
            :value="true"
          />
        </v-col>
        <v-col
          :cols="metadata.booleanOption === 'vertical' ? 12 : 6"
        >
          <v-radio
            label="No"
            :value="false"
          />
        </v-col>
      </v-row>
    </v-radio-group>
  </div>
</template>

<script>
export default {
  name: 'RadioBtnOptions',
  props: {
    value: {
      type: [Boolean, Number],
      default: 0
    },
    label: {
      type: String,
      default: ''
    },
    metadata: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    radio: {
      get() {
        return this.value ? true : false
      },
      set(data) {
        this.$emit('input', data)
      }
    }
  },
  mounted() {
    this.$emit('input', this.radio)
  }
}
</script>
