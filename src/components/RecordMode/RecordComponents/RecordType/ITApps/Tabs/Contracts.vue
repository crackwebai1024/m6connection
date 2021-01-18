<template>
  <v-container class="px-0 py-0 mt-5">
    <template v-if="items.length === 0">
      <v-container :class="baseColor + ' rounded-lg px-0 py-10 d-flex justify-center align-center flex-column'">
        <p class="white--text text-h5">There are no {{ itemsName }}</p>
        <v-divider class="mt-0 white w-full"></v-divider>
        <a 
          class="w-full pointer d-flex justify-center align-center py-3 white--text text-body-2 border-t-1 border"
          @click="dialog = true, dialogMode = true"
        >
          ADD NEW <v-icon class="white--text">mdi-plus</v-icon>
        </a>
        <v-divider class="mb-3 white w-full"></v-divider>
      </v-container>
    </template>
    <template v-else>
      <v-card>
        <div :class="baseColor + ' card rounded-0 rounded-t-sm px-3 py-4 text-body-1 white--text capitalize'">{{ itemsName }}</div>
        <v-btn 
          :class="baseColor + ' btn-circle-add-item'" 
          fab small dark
          @click="dialog = true, dialogMode = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <div class="contracts-container pa-3">
          <v-data-table
            :headers="headers"
            :items="items"
            :single-select="singleSelect"
            item-key="name"
            class="elevation-0"
          >
            <template 
            v-slot:[`item.status`]="{ item }">
              <div class="d-flex justify-space-between">
                {{ item.status == 1 ?  "Active" : "Inactive"}}
              </div>
            </template>
            <template 
            v-slot:[`item.term_until`]="{ item }">
              <div class="d-flex justify-space-between">
                {{ termUnit[termUnit.findIndex(i => i.id === item.term_until)]['value'] }}
              </div>
            </template>
            <template 
            v-slot:[`item.capped_inflator_value`]="{ item }">
              <div class="d-flex justify-space-between">
                <p>{{ item.capped_inflator_value }}</p>
                <v-icon
                  small
                  class="mr-2"
                  color="blue lighten-1"
                  @click="showUpdateDialog(item)"
                >
                  mdi-pencil
                </v-icon>
              </div>
            </template>
          </v-data-table>
        </div>
      </v-card>
    </template>

    <v-dialog v-model="dialog" persistent max-width="1000px">
      <v-form ref="form" v-model="valid" class="white">
        <v-card-title :class="baseColor + ' white--text d-flex justify-space-between'">
          <span class="headline capitalize white--text">{{ titleDialog }}</span>
          <template v-if="dialogMode">
            <v-btn
              color="purple darken-3"
              class="text-none white--text"
              @click="onButtonClick"
            >
              UPLOAD FILES
            </v-btn>
            <input
              multiple
              ref="uploader"
              class="d-none"
              type="file"
              accept="image/*"
              @change="onFileChanged"
            >
          </template>
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
            <delete-dialog :element="itemInfo.contract_name+' contract'" @closeDeleteModal="beforeDelete" />
          </v-dialog>
        </v-card-title>
        <v-card-text class="px-16 py-10 form-labels">
          <v-container>
            <v-row>
              <v-col cols="6" class="py-0">
                <v-text-field
                  v-model="itemInfo.number"
                  :rules="nameRules"
                  label="Contract Number" 
                  :color="baseColor"
                >
                </v-text-field>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-text-field
                  v-model="itemInfo.contract_name"
                  :rules="nameRules"
                  label="Contract Name" 
                  :color="baseColor"
                >
                </v-text-field>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-select
                  v-model="itemInfo.status"
                  :items="validation"
                  item-value="value"
                  item-text="label"
                  :rules="selectBool"
                  :color="baseColor"
                  label="Status"
                ></v-select>
              </v-col>
              <v-col cols="6" class="py-0">
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
                      v-model="itemInfo.start_contract"
                      :rules="textRules"
                      label="Contract Term Start Date"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="itemInfo.start_contract" @input="menu = false"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-menu
                  v-model="menu1"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="itemInfo.finish_contract"
                      :rules="textRules"
                      label="Contract Termination Date"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="itemInfo.finish_contract" @input="menu1 = false"></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="4" class="py-0">
                <v-text-field 
                  v-model="itemInfo.term_length"
                  :rules="quantityRules"
                  :color="baseColor"
                  type="number"
                  label="Term Length" 
                ></v-text-field>
              </v-col>
              <v-col cols="2" class="py-0">
                <v-select
                  v-model="itemInfo.term_until"
                  :items="termUnit"
                  item-value="id"
                  item-text="value"
                  :rules="selectRules"
                  :color="baseColor"
                  label="Term Unit"
                ></v-select>
              </v-col>

              <v-col cols="6" class="py-0">
                <v-text-field 
                  v-model="itemInfo.term_notice_period"
                  :rules="quantityRules"
                  :color="baseColor"
                  type="number"
                  label="Term Notice Period" 
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="itemInfo.critical_decision_date"
                      :rules="textRules"
                      label="Critical Decision Date"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="itemInfo.critical_decision_date" @input="menu2 = false"></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="6" class="py-0">
                <v-text-field
                  v-model="itemInfo.capped_inflator"
                  :rules="nameRules"
                  label="Capped Inflator" 
                  :color="baseColor"
                >
                </v-text-field>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-text-field
                  v-model="itemInfo.capped_inflator_value"
                  :rules="nameRules"
                  label="Capped Inflator Value" 
                  :color="baseColor"
                >
                </v-text-field>
              </v-col>

              <v-col cols="12" class="py-0">
                <p class="text-center text-h6 mt-8 mb-0">Attachments</p>
                <v-data-table
                  :headers="fileHeaders"
                  :items="itemInfo.files"
                  :single-select="singleSelect"
                  item-key="name"
                  class="elevation-0"
                >
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :color="baseColor" text @click="closeDialog">Cancel</v-btn>
          <v-btn :disabled="!valid" :color="baseColor" text @click="clickAction">{{ titleAction }}</v-btn>
        </v-card-actions>
      </v-form>
    </v-dialog>
  </v-container>
</template>
<script>
import {items} from "@/mixins/items";
import {validations} from "@/mixins/form-validations";
import {mapActions} from "vuex";
import DeleteDialog from "@/components/Dialogs/DeleteDialog";

export default {
  name: "Contracts",
  components: {
    DeleteDialog
  },
  mixins: [items, validations],
  props:{
    info: Object
  },
  data: () => ({
    deleteDialog: false,
    menu: false,
    menu1: false,
    menu2: false,
    baseColor: 'purple darken-1',
    itemsName: 'contracts',
    itemInfo: {
      critical_decision_date: undefined, //Critical Decision Date
      capped_inflator_value: undefined, //Capped Inflator Value
      term_notice_period: undefined, // Term Notice Period
      capped_inflator: undefined, // Capped Inflator
      finish_contract: undefined, // Contrac Termination Date
      start_contract: undefined, // Contract Term Start Date
      contract_name: undefined, // Contract Name
      term_length: undefined, // Term Length
      term_until: undefined, // Term Unit
      status: undefined, // Status
      number: undefined, // Contract Number
      id: undefined, // Contract ID
      files: [],
    },
    singleSelect: false,
    termUnit:[],
    headers: [
      { text: 'Contract Number', value: 'number' },
      { text: 'Contract Name', value: 'contract_name' },
      { text: 'Status', value: 'status' },
      { text: 'Contract Term Start Date', value: 'start_contract' },
      { text: 'Contrac Termination Date', value: 'finish_contract' },
      { text: 'Term Length', value: 'term_length' },
      { text: 'Term Unit', value: 'term_until' },
      { text: 'Term Notice Period', value: 'term_notice_period' },
      { text: 'Critical Decision Date', value: 'critical_decision_date' },
      { text: 'Capped Inflator', value: 'capped_inflator' },
      { text: 'Capped Inflator Value', value: 'capped_inflator_value' },
    ],
    validation:[
      { label: "Active", value: 1 },
      { label: "Inactive", value: 0 }
    ],
  }),
  methods: {
    ...mapActions("ITAppsModule", 
      ["get_contracts", "get_selects", "post_contract", "put_contract", "delete_contract"]
    ),
    post(){
      this.itemInfo['app_id'] = this.info.id;
      this.post_contract(this.itemInfo).then(res => (
        this.items[this.items.length - 1].id = res.contract_id
      ));
    },
    put(){
      this.put_contract(this.itemInfo);
    },
    beforeDelete(decision){
      decision ? this.deleteItem() : this.deleteDialog = false;
    },
    delete(){
      this.delete_contract(this.itemInfo.id);
    }
  },
  mounted() {
    this.get_selects('/ContractTermUnit').then(res=>(this.termUnit = res.data))
    this.get_contracts(this.info.id).then(res => (
      this.items = res.data
    ));
  }
};
</script>
<style lang="scss">
.contracts-container {
  min-height: 180px;
  overflow-x: auto;
  overflow-y: auto;
}
.btn-circle-add-item {
  position: absolute;
  top: 35px;
  right: 15px;
}
.edit-license {
  position: absolute;
  top: 65px;
  right: 20px;
}
</style>