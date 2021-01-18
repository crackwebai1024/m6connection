<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      persistent
      width="500"
    >
      <v-card>
        <v-card-title class="headline blue darken-2 white--text">
            Edit A Tab
        </v-card-title>

        <v-card-text>
            <v-container fluid >
                <v-row>
                    <v-col cols="12" >
                        <v-text-field 
                            label="Tab Name"
                            v-model="tab.title"
                            outlined
                        />
                    </v-col>
                </v-row>
            </v-container>            
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-2" text @click="closing">
              Close
          </v-btn>
          <v-btn
            color="green darken-2"
            class="white--text"
            @click="updating"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <m6-loading :loading="loading" />          
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

export default {
    props: {
        dialog:{
            default: false,
            type: Boolean
        },
        tabToEdit: {
            type: Object,
            defaule: () => {}
        }
    },

    data: () => ({
        tab: {},
        loading: false
    }),

    methods: {
        ...mapActions('AppBuilder', {
            updateTab: 'updateTab'
        }),

        ...mapMutations('SnackBarNotif', {
            notifDanger: 'notifDanger',
            notifSuccess: 'notifSuccess' 
        }),

        closing() {
            this.tab = {}
            this.$emit('closing')
        },
        
        async updating() {
            this.loading = true 
            try {
                await this.updateTab({ tabToEdit: this.tab, id: this.tabToEdit.id })
                this.loading = false
                this.notifSuccess('The Tab Was Updated')
                this.$emit('updateTab', { id: this.tabToEdit.id, tab: this.tab })
                this.closing()
            } catch(e) {
                this.notifDanger('There Was An Was Error, While Updating')
                this.loading = false 
            }
        }
    },

    watch: {
        tabToEdit(val){
            this.tab = {...val}
            delete this.tab["created_at"]
            delete this.tab["updated_at"]
            delete this.tab["id"]
            delete this.tab["panels"]
        }
    }
}
</script>