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
              <delete-dialog :element="'rationalization user'" @closeDeleteModal="beforeDelete" />
            </v-dialog>
          </v-card-title>
          <v-card-text class="form-labels px-16">
            <v-container>
              <v-row>
                <v-select 
                  label="User Type"
                  v-model="itemInfo.user_type"
                  :rules="selectRules"
                  :items="types"
                  item-value="id"
                  item-text="value"
                ></v-select>
              </v-row>
              <v-row>
                <v-text-field
                  v-model="itemInfo.users"
                  :rules="quantityRules"
                  type="number"
                  label="Users" 
                ></v-text-field>
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
            <v-btn color="primary" class="white--text" :disabled="!valid" @click="clickAction">{{ titleAction }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-subheader class="relative rounded-t primary white--text">
      Rationalization Users
      <v-btn
        :color="isHover ? 'orange' : 'blue'"
        dark
        small
        absolute
        bottom
        right
        fab
        @click="dialog = true, dialogMode = true">
          <v-icon>mdi-account-plus-outline</v-icon>
      </v-btn>
    </v-subheader>
    <v-card class="pt-5">
      <v-data-table
        :headers="table.headers"
        :items="items"
        item-key="name"
        class="elevation-0"
      >
        <template v-slot:[`item.user_type`]="{ item }">
          <p>{{
            types.filter(
              (e) => { return e['id'] === item['user_type'] }
            )[0]['value']
          }}</p>
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
</template>

<script>
const ratioUserConvert = require("@/store/models/rationalization/itapp_rationalization_users");
import DeleteDialog from "@/components/Dialogs/DeleteDialog";

import {mapActions}   from "vuex"
import {validations}  from "@/mixins/form-validations"
import {items}        from "@/mixins/items";

export default {
  name: "Users",
  mixins: [items, validations],
  components: {
    DeleteDialog
  },
  data: () => ({
    deleteDialog: false,
    dialogMode: false,
    isHover: false,
    itemsName: 'users',
    types: [],
    itemInfo: {
      user_type: null,
      users: null,
      notes: ''
    },   
    table: {
      headers: [
        { text: 'User Type', value: 'user_type' },
        { text: 'Users',     value: 'users'     },
        { text: 'Notes',     value: 'notes'     },
        { text: 'Actions',   value: 'actions'   }
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
      delete_usr: 'delete_ratio_usr',
      post_usr:   'post_ratio_usr',
      put_usr:    'put_ratio_usr',
      get_usr:    'get_ratio_usr',
      select:     'get_selects'
    }),
    post(){
      this.post_usr(this.itemInfo).then(res => {
        this.items[this.items.length - 1]['id'] = res['data']['rationalization_user_id'];
      });
    },
    put(){
      this.put_usr(this.itemInfo);
    },
    delete(){
      this.deleteDialog = false;
      this.delete_usr(this.itemInfo.id);
    },
    beforeDelete(decision){
      decision ? this.deleteItem() : this.deleteDialog = false;
    },
  },
  mounted() {
    this.itemInfo['app_id'] = this.info['id'];
    this.select('/RationalizationUserType').then(res => {
      this.types = res.data;
    });
    this.get_usr(this.itemInfo['app_id']).then(usrs => {
      this.items = ratioUserConvert.toRationalizationUser(usrs.data);
    })
  }
}
</script>

<style>

</style>