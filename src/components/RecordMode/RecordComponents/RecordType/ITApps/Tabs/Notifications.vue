<template>
  <v-container v-if="!isLoading" class="px-0 py-0 mt-5">
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
        <div class="notifications-container pa-3">
          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="items"
            :single-select="singleSelect"
            item-key="id"
            class="elevation-0"
          > 
            <template v-slot:[`item.notification_required`]="{ item }">
                {{ item.notification_required == 1 || item.notification_required == 'Yes' ? 'Yes' : 'No' }}
            </template>
            <template v-slot:[`item.noti_cont`]="{ item }">
              <v-chip color="blue lighten-3 mx-1" dark v-for="(who, index) in item.noti_cont" :key="'who-'+index">
                <span v-if="who.contact_id">
                  {{ companyUsers[companyUsers.findIndex(i => i.id === who.contact_id)]['name'] }}
                </span>
                <span v-if="who.name">
                  {{ companyUsers[companyUsers.findIndex(i => i.id === who.id)]['name'] }}
                </span>
              </v-chip>
            </template>
            <template v-slot:[`item.description`]="{ item }">
              <div class="d-flex justify-space-between">
                <p>{{ item.description }}</p>
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
            <delete-dialog :element="itemInfo.name+' notification'" @closeDeleteModal="beforeDelete" />
          </v-dialog>
        </v-card-title>
        <v-card-text class="px-16 py-10 form-labels">
          <v-text-field
            v-model="itemInfo.name"
            :rules="nameRules"
            :color="baseColor"
            label="Name" 
          >
          </v-text-field>
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
                v-model="itemInfo.notification_date.date"
                :rules="textRules"
                label="Date"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="itemInfo.notification_date.date" @input="menu = false"></v-date-picker>
          </v-menu>
          <v-select
            v-model="itemInfo.notification_required"
            :items="validation"
            :rules="selectBool"
            item-value="value"
            item-text="label"
            :color="baseColor"
            label="Required"
          ></v-select>

          <v-autocomplete
            v-model="itemInfo.noti_cont"
            :items="companyUsers"
            :color="baseColor"
            chips
            label="Who to notify"
            full-width
            :item-value="Object"
            hide-details
            deletable-chips
            hide-no-data
            item-text="name"
            hide-selected
            multiple
            single-line
          ></v-autocomplete>

          <v-textarea
            v-model="itemInfo.description"
            :color="baseColor"
          >
            <template v-slot:label>
              <div>
                Description
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
import {items} from "@/mixins/items";
import {validations} from "@/mixins/form-validations";
import {mapActions, mapGetters} from "vuex";
import DeleteDialog from "@/components/Dialogs/DeleteDialog";

export default {
  name: "Notifications",
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
    isLoading: true,
    baseColor: 'deep-purple darken-3',
    itemsName: 'notifications',
    itemInfo: {
      name: undefined,
      notification_date:{
        id: undefined,
        date: undefined
      },
      notification_required: undefined,
      noti_cont: [],
      description: undefined
    },
    preview_noti_cont: [],
    singleSelect: false,
    selected: [],
    validation:[{
      label: "Yes",
      value: 1
    },{
      label: "No",
      value: 0
    }],
    headers: [
      { text: 'Name', value: 'name' },
      { text: 'Date', value: 'notification_date.date' },
      { text: 'Required', value: 'notification_required' },
      { text: 'Who to notify', value: 'noti_cont' },
      { text: 'Description', value: 'description' },
    ],
  }),
  methods:{
    ...mapActions("ITAppsModule", ["post_notification", "get_notifications", "delete_notification", "put_notification"]),
    getContact( contactId ){
      return this.companyUsers[this.companyUsers.findIndex(i => i.id === contactId.contact_id)]['name'];
    },
    post(){
      this.post_notification({
        noti_date:this.itemInfo.notification_date,
        notification:{
          app_id: this.info.id,
          notification_required: this.itemInfo.notification_required == 1 ? true : false,
          name: this.itemInfo.name,
          description: this.itemInfo.description,
        },
        noti_cont: this.itemInfo.noti_cont
      }).then(res => (
        Object.assign(...[this.items[this.items.length-1], res])
      ));
    },
    put(){
      this.put_notification({
        noti_date:this.itemInfo.notification_date,
        notification:{
          notification_required: this.itemInfo.notification_required == 1 ? true : false,
          description: this.itemInfo.description,
          name: this.itemInfo.name,
          id: this.itemInfo.id,
          app_id: this.info.id
        },
        noti_cont: this.itemInfo.noti_cont,
        preview_noti_cont: this.preview_noti_cont
      });
    },
    beforeDelete(decision){
      decision ? this.deleteItem() : this.deleteDialog = false;
    },
    delete(){
      this.delete_notification(this.itemInfo.id);
    }
  },
  computed:{
    ...mapGetters('Companies', { companyUsers: 'getCurrentCompanyUsers' }),
  },
  watch:{
      dialog:function(val){
        if( val ){
          this.dialogMode ? this.itemInfo.noti_cont = [] : null;
          this.itemInfo.noti_cont.forEach((item, ind) => {
            if(item.contact_id !== undefined){
              this.itemInfo.noti_cont[ind] = this.companyUsers[this.companyUsers.findIndex(i => i.id === item.contact_id)]
            }
          });
          this.preview_noti_cont = this.itemInfo.noti_cont;
        }
      }
  },
  mounted(){
    this.companyUsers.forEach(company => {
      company.name = `${company.user.firstName} ${company.user.lastName}`
    });
    this.get_notifications(this.info.id).then(
      res => (this.items = res),
      this.isLoading = false
    );
  }
};
</script>
<style lang="scss">
.notifications-container {
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