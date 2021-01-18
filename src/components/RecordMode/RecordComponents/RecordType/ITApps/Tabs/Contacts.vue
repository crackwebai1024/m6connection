<template>
  <v-container class="px-0 py-0 mt-5">
    <template v-if="items.length === 0">
      <v-container :class="baseColor + ' rounded-lg px-0 py-10 d-flex justify-center align-center flex-column'">
        <p class="white--text text-h5">There are no {{ itemsName }}</p>
        <v-divider class="mt-0 white w-full"></v-divider>
        <a 
          class="pointer w-full d-flex justify-center align-center py-3 white--text text-body-2 border-t-1 border"
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
        <div class="items-container pa-3">
          <!-- here is going to render all the items - another slot -->
          <div v-for="(item, index) in items" :key="'item-'+index">
            <div class="d-flex">
              <img alt="" class="mr-2 rounded-xl" width="50" height="50" src="@/assets/default_user.png">
              <div>
                <p class="mb-0">{{ item.name }}</p>
                <p>{{ item.email }}</p>
              </div>
              <div class="d-flex align-center ml-auto mr-0">
                <v-tooltip right small v-for="(tag, index) in item.tags" :key="'tooltip-'+index">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      small
                      class="rounded-xl text-caption mr-2"
                      :color="baseColor"
                      dark
                      v-bind="attrs"
                      v-on="on"
                    >{{ tag }}</v-btn>
                  </template>
                  <span>{{ tag }}</span>
                </v-tooltip>
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
      <v-form
        ref="form"
        v-model="valid"
        class="white"
      >
        <v-card-title :class="baseColor + ' white--text d-flex justify-space-between'">
          <span class="headline capitalize white--text">{{ titleDialog }}</span>
          <v-btn icon color="white" @click="deleteItem" v-if="!dialogMode">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="px-16 py-10 form-labels">
          <v-autocomplete
            v-model="itemInfo.name"
            @change="changeCurrentItemInfo" 
            :items="dataPeople"
            :filter="customFilter"
            :rules="nameRules"
            :color="baseColor"
            item-text="name"
            return-object
            label="Name"
          ></v-autocomplete>
          <v-text-field
            v-model="itemInfo.email"
            :color="baseColor"
            label="E-mail"
          ></v-text-field>
          <v-text-field
            v-model="itemInfo.phone"
            :color="baseColor"
            label="Phone"
          ></v-text-field>
          <v-autocomplete
            v-model="itemInfo.tags"
            :items="tagItems"
            :rules="tagRules"
            :color="baseColor"
            label="Tags*"
            multiple
          ></v-autocomplete>
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
</template>
<script>
import {items} from "@/mixins/items";
import {validations} from "@/mixins/form-validations"

export default {
  name: "Contacts",
  mixins: [items, validations],
  data: () => ({
    baseColor: 'blue lighten-1',
    itemsName: 'contacts',
    itemInfo: {
      name: '',
      email: '',
      phone: '',
      tags: []
    },
    tagItems: ['App','ITApps','Project']
  }),
  methods: {
    changeCurrentItemInfo(item) {
      this.itemInfo.name = item.name
      this.itemInfo.email = item.email
      this.itemInfo.phone = item.phone
    }
  }
};
</script>
<style lang="scss">
.items-container {
  height: 180px;
  overflow-x: auto;
  overflow-y: auto;
}
.btn-circle-add-item {
  position: absolute;
  top: 35px;
  right: 15px;
}
</style>