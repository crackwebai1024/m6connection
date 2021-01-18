<template>
  <v-container v-if="!loadingPage" @mouseenter="isHover = true" @mouseleave="isHover = false">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-form
        ref="form"
        v-model="valid"
        class="white"
      >
        <v-card>
          <v-card-title class="blue darken-3 white--text d-flex justify-space-between">
            <span class="headline white--text">{{ titleDialog }}</span>
            <v-dialog
              v-if="!dialogMode"
              v-model="deleteDialog"
              width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn 
                  v-bind="attrs" v-on="on" icon
                  color="white" >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <delete-dialog :element="'rationalization FTE'" @closeDeleteModal="beforeDelete" />
            </v-dialog>
          </v-card-title>
          <v-card-text class="form-labels px-16">
            <v-container>
              <v-row>
                <v-select 
                  label="FTE Type"
                  v-model="itemInfo.fte_type"
                  :rules="selectRules"
                  :items="types"
                  item-value="id"
                  item-text="value"
                ></v-select>
              </v-row>
              <v-row>
                <v-text-field 
                  type="number"
                  :rules="quantityRules"
                  label="FTE Count"
                  v-model="itemInfo.fte_count"
                ></v-text-field>
              </v-row>
              <v-row>
                <v-input persistent-hint readonly :hint="'$ ' + itemInfo.fte_costs.toString()">FTE Costs</v-input>
              </v-row>
              <v-row>
                <v-textarea v-model="itemInfo.notes" label="Notes"></v-textarea>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="closeDialog">Close</v-btn>
            <v-btn color="primary" :disabled="!valid" @click="clickAction">{{ titleAction }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-subheader class="relative rounded-t primary white--text">
      Rationalization FTE
      <v-btn
        :color="isHover ? 'orange' : 'blue'"
        dark
        small
        absolute
        bottom
        right
        fab
        @click="dialog = true, dialogMode = true">
          <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-subheader>
    <v-card class="pt-5">
      <v-data-table
        :headers="table.headers"
        :items="items"
        item-key="name"
        class="elevation-0"
      >
        <template v-slot:[`item.fte_type`]="{ item }">
          <p>{{types.filter(
            (e) => { return e['id'] === item['fte_type'] }
          )[0]['value']}}</p>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            small
            class="mr-2"
            color="blue lighten-1"
            @click="showUpdateDialog(item)"
          >
            mdi-pencil
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
  <v-container v-else>
    <v-progress-circular
      style="margin-left: 45%;"
      indeterminate
      color="primary"
    ></v-progress-circular>
  </v-container>
</template>

<script>
const fteConvert = require("@/store/models/rationalization/itapp_rationalization_fte");
import DeleteDialog from "@/components/Dialogs/DeleteDialog";

import {validations} from "@/mixins/form-validations"
import {items} from "@/mixins/items"
import {mapActions} from "vuex"

export default {
  name: "FTE",
  mixins: [items, validations],  
  components: {
    DeleteDialog
  },
  data: () => ({
    deleteDialog: false,
    dialogMode: false,
    loadingPage: true,
    types: [],
    isHover: false,
    itemsName: 'FTE',
    itemInfo: {
      fte_type: null,
      fte_count: null,
      fte_costs: 0,
      notes: '',
    },
    table: {
      headers: [
        { text: 'FTE Type',  value: 'fte_type'  },
        { text: 'FTE Count', value: 'fte_count' },
        { text: 'FTE Costs', value: 'fte_costs' },
        { text: 'Notes',     value: 'notes'    },
        { text: 'Actions',   value: 'actions'  }
      ]
    }
  }),
  props: {
    info: {
        type: Object,
        default: () => {}
    }
  },
  methods: {
    ...mapActions('ITAppsModule',{
      delete_fte: 'delete_ratio_fte',
      post_fte:   'post_ratio_fte',
      put_fte:    'put_ratio_fte',
      get_fte:    'get_ratio_fte',
      selects:    'get_selects'
    }),
    post(){
      this.post_fte(this.itemInfo).then(res => {
        this.items[this.items.length - 1]['id'] = res.data.rationalization_fte_id
      });
    },
    put(){
      this.put_fte(this.itemInfo);
    },
    delete(){
      this.deleteDialog = false;
      this.delete_fte(this.itemInfo.id);
    },
    beforeDelete(decision){
      decision ? this.deleteItem() : this.deleteDialog = false;
    },
  },
  mounted(){
    this.itemInfo['app_id'] = this.info.id;

    this.selects('/RationalizationFTEType').then(res => {
      this.types = res.data;
    });

    this.get_fte(this.info.id).then(res => {
      this.items = fteConvert.toRationalizationFte(res.data);
      this.loadingPage = false;
    });
  }
}
</script>

<style>

</style>