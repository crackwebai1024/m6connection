<template>
  <v-container class="px-0 py-0 mt-5" v-if="!loading">
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
        <div :class="baseColor + ' card rounded-0 rounded-t-sm px-3 py-4 text-body-1 white--text capitalize'">{{ itemsName}}</div>
        <v-btn 
          :class="baseColor + ' btn-circle-add-item'" 
          fab small dark
          @click="dialog = true, dialogMode = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <div class="licenses-container pa-3">
          <div v-for="(item, index) in items" :key="'item-'+index">
            <div class="d-flex">
              <div>
                <p class="mb-0">{{ item.type.value }}</p>
                <p class="text-caption mb-0">Version {{ item.version }}</p>
                <p v-if="item.appBuild && item.appBuild.value" class="text-caption mb-0">App Build {{ item.appBuild.value }}</p>
              </div>
              <div class="d-flex align-center ml-auto mr-0">
                <v-btn
                  small
                  class="rounded-xl text-caption mr-2 white--text"
                  :color="item.status == 'Active' || item.status == 1 ? 'green':'blue-grey lighten-1'"
                >{{item.status == 1 ? 'Active': item.status == 0 ? 'Inactive': item.status}}</v-btn>
                <v-btn @click="showUpdateDialog(item)" small elevation="0" class="transparent rounded-xl"><v-icon>mdi-pencil</v-icon></v-btn>
              </div>
            </div>
            <div v-if="index !== items.length - 1">
              <v-divider class="my-3 grey lighten-2"></v-divider>
            </div>
          </div>
        </div>
      </v-card>
    </template>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-form ref="form" v-model="valid" class="white">
        <v-card-title :class="baseColor + ' white--text d-flex justify-space-between'">
          <span class="headline capitalize white--text">{{ titleDialog }}</span>
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
            <delete-dialog :element="'dependency'" @closeDeleteModal="beforeDelete" />
          </v-dialog>
        </v-card-title>
        <v-card-text class="px-16 py-10 form-labels">
          <v-select
            v-model="itemInfo.type"
            :items="dependencyTypes"
            :rules="selectRules"
            :item-value="Object"
            item-text="value"
            label="Type"
          ></v-select>
          <v-text-field 
            v-model="itemInfo.version"
            :rules="nameRules"
            label="Version" 
          ></v-text-field>
          <v-select
            v-model="itemInfo.status"
            :items="statusOptions"
            :rules="selectBool"
            item-value="value"
            item-text="label"
            label="Status"
          ></v-select>
          <v-select
            v-model="itemInfo.appBuild"
            :items="appBuildOptions"
            :item-value="Object"
            item-text="value"
            label="App Build"
          ></v-select>
          <v-select
            v-model="itemInfo.edaPackage"
            :items="edaPackageBuild"
            :item-value="Object"
            item-text="value"
            label="EDA Package Build"
          ></v-select>
          <v-select
            v-model="itemInfo.execPath"
            :items="updatedExecPath"
            :item-value="Object"
            item-text="value"
            label="Updated Exec Path"
          ></v-select>
          <v-select
            v-model="itemInfo.installNotes"
            :items="updatedinstallNotes"
            :item-value="Object"
            item-text="value"
            label="Updated Install Notes"
          ></v-select>
          <v-select
            v-model="itemInfo.dctStatus"
            :items="dctStatus"
            :item-value="Object"
            item-text="value"
            label="DCT Status"
          ></v-select>
          <v-select
            v-model="itemInfo.appCompliant"
            :items="appCompliant"
            :item-value="Object"
            item-text="value"
            label="App Compliant"
          ></v-select>
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
                v-model="itemInfo.remDate"
                label="Remeditation Date"
                readonly
                :rules="textRules"
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="itemInfo.remDate" @input="menu = false"></v-date-picker>
          </v-menu>
          <v-textarea
            v-model="itemInfo.notes"
          >
            <template v-slot:label>
              <div>
                Notes <small>(optional)</small>
              </div>
            </template>
          </v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :color="baseColor" text @click="closeDialog">Cancel</v-btn>
          <v-btn :disabled="!valid" :color="baseColor" text @click="clickAction">{{ titleAction }}</v-btn>
        </v-card-actions>
      </v-form>
    </v-dialog>
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
const ItAppDependencies = require("@/store/models/itapp_dependencies");
const app_settings = require("@/store/models/apps_settings");
import DeleteDialog from "@/components/Dialogs/DeleteDialog";
import {items} from "@/mixins/items";
import {validations} from "@/mixins/form-validations";
import {mapActions} from "vuex";

export default {
  name: "Dependencies",
  mixins: [items, validations],
  props:{
    info: Object
  },
  components: {
    DeleteDialog
  },
  data: () => ({
    menu: false,
    deleteDialog: false,
    loading: true,
    baseColor: 'red darken-2',
    itemsName: 'dependencies',
    itemInfo: {
      type: null, //Type
      version: null, //Version
      status: null, //Status
      appBuild: null, //App Build
      edaPackage: null, //EDA Package Build
      execPath: null, //Updated Exec Path
      installNotes: null, //Updated install Notes
      dctStatus: null, //DCT Status
      appCompliant: null, //App Compliant
      remDate: null, //Remediation Date
      notes: '' //Notes
    },
    statusOptions: [
      {label:'Active', value: 1}, {label:'Inactive', value: 0}
    ],
    updatedinstallNotes:[],
    dependencyTypes: [],
    appBuildOptions: [],
    edaPackageBuild: [],
    updatedExecPath: [],
    appCompliant:[],
    dctStatus:[]
  }),
  methods: {
    ...mapActions("ITAppsModule", 
      ["get_all_selects", "post_dependency", "get_dependencies", "put_dependencies", "delete_dependency"]
    ),
    post(){
      let data = ItAppDependencies.dependenciesToJson(this.itemInfo);
      data['app_id'] = this.info.id;
      this.post_dependency( data ).then(res => (
        this.items[this.items.length - 1]['id'] = res.data.dependency_id
      ));
    },
    put(){
      this.put_dependencies(this.itemInfo);
    },
    beforeDelete(decision){
      decision ? this.deleteItem() : this.deleteDialog = false;
    },
    delete(){
      this.delete_dependency(this.itemInfo.id);
    }
  },
  mounted(){
    this.get_dependencies(this.info.id).then(
      res => (
        this.items = ItAppDependencies.fromAPI(res.data),
        this.loading = false)
    );
    this.get_all_selects({params:[
      'DependencyType',
      'DependencyAppBuild',
      'DependencyEDAPackageBuild',
      'DependencyUpdatedExecPath',
      'DependencyUpdatedinstallNotes',
      'DependencyDCTStatus',
      'DependencyAppCompliant'
    ]}).then( response => (Object.keys(response.data).forEach(key => {
      let arraySettings = app_settings.toAppsSettings(response.data[key]);
      switch (key) {
        case 'DependencyUpdatedinstallNotes':
          this.updatedinstallNotes = arraySettings;   break;
        case 'DependencyUpdatedExecPath':
          this.updatedExecPath = arraySettings;       break;
        case 'DependencyEDAPackageBuild':
          this.edaPackageBuild = arraySettings;       break;
        case 'DependencyAppBuild':
          this.appBuildOptions = arraySettings;       break;
        case 'DependencyType':
          this.dependencyTypes = arraySettings;       break;
        case 'DependencyAppCompliant':
          this.appCompliant = arraySettings;          break;
        case 'DependencyDCTStatus':
          this.dctStatus = arraySettings;             break;
      }
    })));
  }
};
</script>
<style lang="scss">
.licenses-container {
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