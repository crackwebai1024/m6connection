<template>
  <v-container>
    <v-subheader class="primary rounded-t white--text">Rationalization Attributes</v-subheader>
    <v-card class="px-3">
      <v-form v-model="valid">
      <v-row>
        <v-col cols="6">
          <v-select 
            v-model="itemInfo.is_needs" 
            label="Meeting customer needs" 
            item-text="label"
            item-value="value"
            :rules="selectBool" 
            :items="object.valid"
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-select v-if="itemInfo.is_needs === true"
            v-model="itemInfo.rationalization_kind"
            :rules="selectRules"
            label="Rationalization"
            :items="object.atributesKind"
            item-value="id"
            item-text="value"
          ></v-select>
          <v-text-field 
            v-model="itemInfo.if_no_need"
            v-else
            :rules="textRules" 
            label="If no please describe"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-input :hint="'$ ' + this.itemInfo.total_annual_cost" persistent-hint>Total Annual Cost</v-input>
        </v-col>
        <v-col cols="6">
          <v-input :hint="this.itemInfo.estimated_users.toString()" persistent-hint>Estimated Users</v-input>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-input :hint="'$ ' + this.itemInfo.total_annual_cost/this.itemInfo.ratio_of_cost_to_user" persistent-hint>Ratio of Cost to User</v-input>
        </v-col>
        <v-col cols="6">
          <v-select v-model="itemInfo.capabilities" label="Capabilities"></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-select 
            v-model="itemInfo.application_value" 
            label="Application Value" 
            multiple 
            chips 
            :items="object.appValue"
            item-value="id"
            item-text="value"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="itemInfo.retirement_date"
                :rules="textRules"
                label="Retire"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="itemInfo.retirement_date" @input="menu = false"></v-date-picker>
          </v-menu>
          <v-spacer></v-spacer>
          <v-btn :disabled="!valid" color="primary" @click="updateItemDescription">Save Changes</v-btn>
        </v-col>
      </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
const attributesConvert = require("@/store/models/rationalization/itapp_rationalization_attributes");

import {items} from "@/mixins/items";
import {mapActions} from "vuex";
import {validations} from "@/mixins/form-validations";

export default {
  mixins: [items, validations],
  data: () => ({
    menu: false,
    object:{
      atributesKind: [],
      appValue: [],
      valid:[
        {value: true,  label: "Yes"},
        {value: false, label: "No"}  
      ]
    },
    application_value: [],
    itemInfo: {
      estimated_users: 1,
      total_annual_cost: 0,
      ratio_of_cost_to_user: 0,
      application_value: [],
      first_state: [],
      rationalization_kind: null,
      retirement_date: null,
      capabilities: null,
      if_no_need: null,
      is_needs: false
    }
  }),
  props: {
    info: {
      type: Object,
      default:() => {}
    }
  },
  methods: {
    ...mapActions('ITAppsModule',{
      selects: 'get_all_selects',
      get_att: 'get_ratio_att',
      put_att: 'put_ratio_att'
    }),
    updateItemDescription(){
      this.itemInfo['is_needs'] === true ?
        this.itemInfo['if_no_need'] = null : this.itemInfo['rationalization_kind'] = null;

      this.put_att(this.itemInfo);
    }
  },
  mounted() {
    this.itemInfo['app_id'] = this.info.id;

    this.selects({params:[
      'RationalizationAttributesKind',
      'RationalizationAttributesAppValue'
    ]}).then(select => { 
      Object.keys(select.data).forEach(key => {
        if (key === 'RationalizationAttributesKind' ) {
          this.object.atributesKind = select['data'][key];
        }else if (key === 'RationalizationAttributesAppValue' ) {
          this.object.appValue = select['data'][key];
        }
      });
    });

    this.get_att(this.info.id).then( res => {
      if( Object.keys(res.data).length !== 0 ) {
        this.itemInfo = attributesConvert.toRationalizationAttributes(res.data);
        this.itemInfo['is_needs'] = this.itemInfo['is_needs'] === 1 ? true : false;
        this.itemInfo['first_state'] = res['data']['application_value']; 
      }
    });
  }
}
</script>
