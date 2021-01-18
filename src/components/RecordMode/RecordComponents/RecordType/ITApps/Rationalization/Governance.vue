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
            <span class="headline white--text">Create Governance</span>
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
              <delete-dialog :element="'rationalization governance'" @closeDeleteModal="beforeDelete" />
            </v-dialog>
          </v-card-title>
          <v-card-text class="form-labels px-16">
            <v-container>
              <v-row>
                <v-select 
                  v-model="itemInfo.responsible_division" 
                  :rules="selectRules" 
                  label="Responsible Division" 
                  :items="options.resp_division"
                  item-value="id"
                  item-text="value"
                ></v-select>
              </v-row>
              <v-row>
                <v-select 
                  v-model="itemInfo.responsible_committee" 
                  :rules="selectRules" label="Responsible Comitee" 
                  :items="options.resp_comittee"
                  item-value="id"
                  item-text="value"
                ></v-select>
              </v-row>
              <v-row>
                <v-select 
                  v-model="itemInfo.responsible_manager" 
                  :rules="selectRules" label="Responsible Manager" 
                  :items="users"
                  item-value="id"
                  item-text="name"
                ></v-select>
              </v-row>
              <v-row>
                <v-select 
                  v-model="itemInfo.responsible_vp_dir" 
                  :rules="selectRules" label="Responsible VP/Dir" 
                  :items="users"
                  item-value="id"
                  item-text="name"
                ></v-select>
              </v-row>
              <v-row>
                <v-select 
                  v-model="itemInfo.first_contact_group" 
                  :rules="selectRules" label="First Contact Group" 
                  :items="options.contact_group"
                  item-value="id"
                  item-text="value"
                ></v-select>
              </v-row>
              <v-row>
                <v-text-field 
                  v-model="itemInfo.primary_customer_group" 
                  :rules="textRules" label="Primary Customer Group"
                ></v-text-field>
              </v-row>
              <v-row>
                <v-text-field 
                  v-model="itemInfo.estimated_days_to_replace" 
                  :rules="textRules" 
                  label="Estimated Days to Replace"
                ></v-text-field>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="closeDialog">Close</v-btn>
            <v-btn
              :disabled="!valid"
              text
              color="primary" 
              @click="clickAction"
            >{{ titleAction }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-subheader class="relative rounded-t primary white--text">
      Rationalization Governance
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
        <template v-slot:[`item.responsible_division`]="{ item }">
          <p>{{options.resp_division.filter(
            (e) => { return e['id'] === item['responsible_division'] }
          )[0]['value']}}</p>
        </template>
        <template v-slot:[`item.responsible_committee`]="{ item }">
          <p>{{options.resp_comittee.filter(
            (e) => { return e['id'] === item['responsible_committee'] }
          )[0]['value']}}</p>
        </template>
        <template v-slot:[`item.first_contact_group`]="{ item }">
          <p>{{options.contact_group.filter(
            (e) => { return e['id'] === item['first_contact_group'] }
          )[0]['value']}}</p>
        </template>
        <template v-slot:[`item.responsible_manager`]="{ item }">
          <p>{{users.filter(
            (e) => { return e['id'] === item['responsible_manager'] }
          )[0]['name']}}</p>
        </template>
        <template v-slot:[`item.responsible_vp_dir`]="{ item }">
          <p>{{users.filter(
            (e) => { return e['id'] === item['responsible_vp_dir'] }
          )[0]['name']}}</p>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
const goverConvert = require("@/store/models/rationalization/itapp_rationalization_governance");
import DeleteDialog from "@/components/Dialogs/DeleteDialog";

import {items} from "@/mixins/items";
import {validations} from "@/mixins/form-validations";
import {mapActions, mapGetters} from "vuex";

export default {
  name: 'Governance',
  mixins: [items, validations],
  components: {
    DeleteDialog
  },
  data: () => ({
    deleteDialog: false,
    dialogMode: false,
    isHover: false,
    users: [],
    itemInfo: {
      responsible_vp_dir: null,
      first_contact_group: null,
      responsible_manager: null,
      responsible_division: null,
      responsible_committee: null,
      primary_customer_group: null,
      estimated_days_to_replace: null,
    },
    table: {
      headers: [
        { text: 'Responsible Division',       value: 'responsible_division'      },
        { text: 'Responsible Comittee',       value: 'responsible_committee'     },
        { text: 'Responsible Manager',        value: 'responsible_manager'       },
        { text: 'Responsible VP/Dir',         value: 'responsible_vp_dir'        },
        { text: 'First Contact Group',        value: 'first_contact_group'       },
        { text: 'Primary Customer Group',     value: 'primary_customer_group'    },
        { text: 'Estimated days to Replace',  value: 'estimated_days_to_replace' },
        { text: 'Actions',                    value: 'actions'                   }
      ]
    },
    options: {
      resp_division: [],
      resp_comittee: [],
      contact_group: []
    }
  }),
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters('Companies', { companyUsers: 'getCurrentCompanyUsers' }),
  },
  methods:{
    ...mapActions('ITAppsModule',{
      selects:      'get_all_selects',
      put_gov:      'put_ratio_gov',
      get_gov:      'get_ratio_gov',
      post_gov:     'post_ratio_gov',
      delete_gov:   'delete_ratio_gov'
    }),
    post(){
      this.post_gov(this.itemInfo).then(res => {
        this.items[this.items.length - 1]['id'] = res['data']['rationalization_governance_id'];
      });
    },
    put(){
      this.put_gov(this.itemInfo);
    },
    delete(){
      this.deleteDialog = false;
      this.delete_gov(this.itemInfo.id);
    },
    beforeDelete(decision){
      decision ? this.deleteItem() : this.deleteDialog = false;
    }
  },
  mounted() {
    this.itemInfo['app_id'] = this.info.id;

    this.users = this.companyUsers;

    this.selects({params:[
      'RationalizationGovernanceRespDivision',
      'RationalizationGovernanceRespCommittee',
      'RationalizationGovernanceFirstContactGroup'
    ]}).then( res => {
      Object.keys(res.data).forEach(key => {
        switch (key) {
          case 'RationalizationGovernanceRespDivision':
            this.options.resp_division = res.data[key];
            break;
          case 'RationalizationGovernanceRespCommittee':
            this.options.resp_comittee = res.data[key];
            break;
          case 'RationalizationGovernanceFirstContactGroup':
            this.options.contact_group = res.data[key];
            break;
        }
      });
    });

    this.get_gov(this.info.id).then( res => {
      this.items = goverConvert.toRationalizationGovernance(res.data);
    });
  }
}
</script>

<style>

</style>