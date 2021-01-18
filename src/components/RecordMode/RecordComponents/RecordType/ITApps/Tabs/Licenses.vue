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
        <div class="licenses-container pa-3">
          <!-- here is going to render all the items - another slot -->
          <div v-for="(item, index) in items" :key="'item-'+index">
            <v-row class="d-flex justify-center" v-for="(keyName, index)  in Object.keys(item)" :key="'key-'+ keyName">
              <template v-if="keyName !== 'id'">
                <v-col cols="12" class="pl-4 pr-16 py-1">
                  <div class="d-flex justify-space-between">
                    <p class="font-weight-medium mb-0">{{keyName}}</p>
                    <p v-if="keyName == 'licenseType'" class="mb-0" :class="{ 'blue lighten-1 white--text rounded-xl px-3': keyName == 'licenseType' }">{{item[keyName]['value']}}</p>
                    <p v-else class="mb-0" :class="{ 'blue lighten-1 white--text rounded-xl px-3': keyName == 'licenseType' }">{{item[keyName]}}</p>
                  </div>
                  <v-divider class="mt-1 grey lighten-2"></v-divider>
                </v-col>
                <template cols="1" class="pa-0" v-if="index === 1">
                  <v-btn @click="showUpdateDialog(item)" small elevation="0" class="edit-license transparent rounded-xl"><v-icon>mdi-pencil</v-icon></v-btn>
                </template>
              </template>
            </v-row>
          </div>
        </div>
      </v-card>
    </template>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-form
        ref="form"
        v-model="valid"
        class="white"
      >
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
            <delete-dialog :element="'lisense'" @closeDeleteModal="beforeDelete" />
          </v-dialog>
        </v-card-title>
        <v-card-text class="px-16 py-10 form-labels">
          <v-select
            v-model="itemInfo.licenseType"
            :items="licenseTypes"
            :rules="selectRules"
            :color="baseColor"
            :item-value="Object"
            item-text="value"
            label="Type"
          ></v-select>

          <v-text-field 
            v-model="itemInfo.users"
            :rules="quantityRules"
            :color="baseColor"
            type="number"
            label="Estimated Users" 
          ></v-text-field>

          <v-text-field 
            v-model="itemInfo.concurrentUsers"
            :rules="quantityRules"
            :color="baseColor"
            type="number"
            label="Estimated Concurrent Users" 
          ></v-text-field>

          <v-text-field 
            v-model="itemInfo.licenses"
            :rules="quantityRules"
            :color="baseColor"
            type="number"
            label="Number of Licenses"
          ></v-text-field>

          <v-textarea
            v-model="itemInfo.details"
            :color="baseColor"
          >
            <template v-slot:label>
              <div>
                Details <small>(optional)</small>
              </div>
            </template>
          </v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :color="baseColor" text @click="closeDialog">Cancel</v-btn>
          <v-btn
            :disabled="!valid"
            text
            :color="baseColor"
            class="mr-4"
            @click="clickAction"
          >
            {{ titleAction }}
          </v-btn>
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
import {items} from "@/mixins/items";
import {validations} from "@/mixins/form-validations";
import {mapActions} from "vuex";
import DeleteDialog from "@/components/Dialogs/DeleteDialog";

export default {
  name: "Licenses",
  components: {
    DeleteDialog
  },
  mixins: [items, validations],
  data: () => ({
    deleteDialog: false,
    baseColor: 'teal lighten-1',
    itemsName: 'licenses',
    itemInfo: {
      licenseType: null,
      users: null,
      concurrentUsers: null,
      licenses: null,
      details: ''
    },
    licenseTypes: [],
    loading: true
  }),
  props:{
    info: Object,
  },
  methods: {
    ...mapActions('ITAppsModule',[
      'get_selects', 'get_licensing', 'post_licensing', 'put_licensing', 'delete_licensing'
    ]),
    post(){
      this.post_licensing({
        estimated_current_users: this.items[0]['concurrentUsers'],
        number_of_licenses: this.items[0]['licenses'],
        licensing_type: this.items[0]['licenseType']['id'],
        estimated_users: this.items[0]['users'],
        details: this.items[0]['details'],
        app_id: this.info.id
      }).then(res =>(
        this.items[0]['id'] = res.data.licensing_id
      ));
    },
    put(){
      this.put_licensing({
        estimated_current_users: this.items[0]['concurrentUsers'],
        number_of_licenses: this.items[0]['licenses'],
        licensing_type: this.items[0]['licenseType']['id'],
        estimated_users: this.items[0]['users'],
        details: this.items[0]['details'],
        id: this.items[0]['id']
      });
    },
    beforeDelete(decision){
      decision ? this.deleteItem() : this.deleteDialog = false;
    },
    delete(){
      this.delete_licensing(this.itemInfo.id);
    }
  },
  created(){
    this.get_selects('/LicensingType').then(
      response => (response.data.forEach(item =>{
        this.licenseTypes.push({id:item.id, value:item.value, field:item.field});
      }))
    );
    this.get_licensing(this.info.id).then(
      response => (
        Object.keys(response).length != 0 ? this.items.push(response) : null,
        this.loading = false
      )
    );
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