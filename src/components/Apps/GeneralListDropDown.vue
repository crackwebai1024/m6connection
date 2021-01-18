<template>
  <v-menu
    offset-y
    open-on-hover
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        color="primary"
        class="text-capitalize"
        text
        v-on="on"
      >
        {{ currentChoice }}
        <v-icon>mdi-chevron-down</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="(choice, index) in choices"
        :key="index"
      >
        <v-list-item-title>
          <v-btn
            text
            @click="pickingView(choice)"
          >
            <v-icon class="black--text">
              {{ choice.icon }}
            </v-icon> {{ choice.text }}
          </v-btn>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>


<script>
export default {
  name: 'GeneralListDropDown',
  props: {
    currentApp: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    currentChoice: 'Card View',
    choicesBase: [
      { icon: 'mdi-table', text: 'Table View', key: 'table' },
      { icon: 'mdi-arrange-bring-forward', text: 'Card View', key: 'card' }
    ]
  }),
  methods: {
    pickingView(choice) {
      this.currentChoice = choice.text
      this.$emit('input', choice)
    }
  },
  computed: {
    choices() {
      let choices = [...this.choicesBase]
      if( this.$h.dg(this.currentApp, 'prefix', '') == 'RAP' ) 
        choices.push({ icon: 'mdi-view-parallel', text: 'Kanban View', key: 'kanban' })

      return choices
    }
  }
}
</script>
