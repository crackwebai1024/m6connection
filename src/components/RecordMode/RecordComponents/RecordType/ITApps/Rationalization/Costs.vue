<template>
  <v-container @mouseenter="isHover = true" @mouseleave="isHover = false">
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
              <delete-dialog :element="'rationalization cost'" @closeDeleteModal="beforeDelete" />
            </v-dialog>
          </v-card-title>
          <v-card-text class="form-labels px-16">
            <v-container>
              <v-row>
                <v-select 
                  label="Cost Category" 
                  :items="options.cost_category"
                  v-model="itemInfo.cost_category"
                  :rules="selectRules"
                  item-value="id"
                  item-text="value"
                ></v-select>
              </v-row>
              <v-row>
                <v-select 
                  label="Cost Type" 
                  :items="options.cost_type"
                  v-model="itemInfo.cost_type"
                  :rules="selectRules"
                  item-value="id"
                  item-text="value"
                ></v-select>
              </v-row>
              <v-row>
                <v-select 
                  label="Cost Owner" 
                  :items="options.cost_owner"
                  v-model="itemInfo.cost_owner"
                  :rules="selectRules"
                  item-value="id"
                  item-text="value"
                ></v-select>
              </v-row>
              <v-row>
                <v-select 
                  label="Period" 
                  :items="options.period"
                  v-model="itemInfo.period"
                  :rules="selectRules"
                  item-value="id"
                  item-text="value"
                ></v-select>
              </v-row>
              <v-row>
                <v-input persistent-hint readonly :hint="'$ ' + itemInfo.cost.toString()">FTE Costs</v-input>
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
      Rationalization Costs
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
        <template v-slot:[`item.cost_category`]="{ item }">
          <p>{{
              options['cost_category'].filter(
                  (e) => { return e['id'] === item['cost_category'] }
              )[0]['value']
          }}</p>
        </template>
        <template v-slot:[`item.cost_type`]="{ item }">
          <p>{{
              options['cost_type'].filter(
                  (e) => { return e['id'] === item['cost_type'] }
              )[0]['value']
          }}</p>
        </template>
        <template v-slot:[`item.cost_owner`]="{ item }">
          <p>{{
              options['cost_owner'].filter(
                  (e) => { return e['id'] === item['cost_owner'] }
              )[0]['value']
          }}</p>
        </template>
        <template v-slot:[`item.period`]="{ item }">
          <p>{{
              options['period'].filter(
                  (e) => { return e['id'] === item['period'] }
              )[0]['value']
          }}</p>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
const app_settings = require("@/store/models/apps_settings");
const cost_convert = require("@/store/models/rationalization/itapp_rationalization_cost");

import {items} from "@/mixins/items"
import {validations} from "@/mixins/form-validations"
import {mapActions} from "vuex"
import DeleteDialog from "@/components/Dialogs/DeleteDialog";

export default {
  name: "Costs",
  mixins: [items, validations],
  components: {
    DeleteDialog
  },
  props: {
      info: {
          type: Object,
          default: () => {}
      }
  },
  data: () => ({
    deleteDialog: false,
    dialogMode: false,
    isHover: false,
    itemsName: 'Costs',

    itemInfo: {
      cost_category: null,
      cost_type: null,
      cost_owner: null,
      period: null,
      cost: 0,
      notes: ''
    },
    table: {
      headers: [
        { text: 'Cost Category',  value: 'cost_category' },
        { text: 'Cost Type',      value: 'cost_type'     },
        { text: 'Cost Owner',     value: 'cost_owner'    },
        { text: 'Period',         value: 'period'       },
        { text: 'Cost',           value: 'cost'         },
        { text: 'Notes',          value: 'notes'        },
        { text: 'Actions',        value: 'actions'      }
      ]
    },
    options: {
      cost_category: [],
      cost_owner:    [],
      cost_type:     [],
      period:        []
    }
  }),
  methods: {
    ...mapActions('ITAppsModule',{
      delete_ratio:   'delete_ratio_cost',
      get_selects:    'get_all_selects',
      post_ratio:     'post_ratio_cost',
      put_ratio:      'put_ratio_cost',
      get_ratio:      'get_ratio_cost'
    }),
    post(){
      this.post_ratio(this.itemInfo).then(res => {
        this.items[this.items.length - 1]['id'] = res['data']['rationalization_costs_id'];
      });
    },
    put(){
      this.put_ratio(this.itemInfo);
    },
    delete(){
      this.deleteDialog = false;
      this.delete_ratio(this.itemInfo.id);
    },
    beforeDelete(decision){
      decision ? this.deleteItem() : this.deleteDialog = false;
    },
  },
  mounted() {
    this.itemInfo['app_id'] = this.info.id;

    this.get_selects({params:[
      'RationalizationCostsCategory',
      'RationalizationCostsPeriod',
      'RationalizationCostsOwner',
      'RationalizationCostsType'
    ]}).then(res => (Object.keys(res.data).forEach(key => {
      let arraySettings = app_settings.toAppsSettings(res.data[key]);
      switch (key) {
        case 'RationalizationCostsCategory':
          this.options.cost_category = arraySettings;   break;
        case 'RationalizationCostsPeriod':
          this.options.period = arraySettings;          break;
        case 'RationalizationCostsOwner':
          this.options.cost_owner = arraySettings;      break;
        case 'RationalizationCostsType':
          this.options.cost_type = arraySettings;       break;
      }
    })))
    this.get_ratio(this.itemInfo['app_id']).then( res => {
      this.items = cost_convert.toRationalizationCost(res.data);
    });
  }
}
</script>
