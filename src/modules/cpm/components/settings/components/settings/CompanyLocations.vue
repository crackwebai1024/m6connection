<template>
  <div>
    <v-card>
      <v-card-title class="relative">
        <v-btn
          absolute
          color="blue"
          dark
          fab
          right
          small
          @click="showForm = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="vertical-scroll">
        <div class="form-group">
          <label>Current Items</label>
          <v-data-table
            :headers="headers"
            :items="settings.companyLocations"
            :items-per-page="5"
          >
            <template v-slot:item.action="{ item }">
              <td class="text-right">
                <v-btn icon small @click.prevent="editLocation(item)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon small @click.prevent="deleteLocation(item)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </template>
          </v-data-table>
        </div>
      </v-card-text>
    </v-card>

    <v-card v-if="showForm" class="mt-2">
      <v-card-title class="headline px-6 py-4 white">
        <span class="grey--text text--darken-1">
          {{ currentLocationIdx === -1 ? "Creating" : "Editing" }}
        </span>
      </v-card-title>
      <v-divider class="grey lighten-3" />

      <v-card-text class="vertical-scroll">
        <v-form ref="form">
          <v-text-field
            v-model="location.name"
            color="blue"
            :label="`${$t('general.location').split('|')[0]} ${$t(
              'general.name'
            )}`"
          />
          <v-text-field
            v-model="location.code"
            color="blue"
            :label="`${$t('general.location').split('|')[0]} Code`"
          />
          <input v-model="currentLocationIdx" type="hidden" />
          <v-btn color="blue" outlined @click="cancel"> Cancel </v-btn>
          <v-btn color="blue" dark type="submit" @click.prevent="saveLocation">
            {{ submitLoading ? "Saving..." : "Save" }}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { db } from "@/utils/Firebase";
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      pagination: {
        rowsPerPage: -1,
      },
      headers: [
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Code",
          value: "code",
        },
        {
          text: "Action",
          value: "action",
        },
      ],
      showForm: false,
      // show: "companyLocations",
      location: {},
      currentLocationIdx: -1,
      // companyLocations: [],
      settings: {},
      submitLoading: false,
      rules: {
        required: (value) => !!value || "Required.",
      },
    };
  },
  computed: {
    ...mapGetters(["appLabel"]),
    ...mapState("Companies", {
      currentCompany: "currentCompany",
    }),
  },
  mounted() {
    db.collection("settings")
      .doc(this.currentCompany.id)
      .collection("settings")
      .doc(this.appLabel.settingsCollection)
      .get()
      .then((settings) => {
        console.log(settings);
        if (!settings.exists) {
          db.collection("settings")
            .doc(this.currentCompany.id)
            .collection("settings")
            .doc(this.appLabel.settingsCollection)
            .set({
              companyLocations: [],
            });
        }
      });
  },
  methods: {
    saveLocation() {
      if (this.location.name == "") {
        this.$snotify.error("Location name is required", "Error");
        return;
      }
      if (this.location.code == "") {
        this.$snotify.error("Location code is required", "Error");
        return;
      }
      if (this.currentLocationIdx === -1) {
        if (!this.settings.companyLocations) {
          this.settings.companyLocations = [];
        }
        const locationData = {
          name: this.location.name,
          code: this.location.code,
          createdAt: new Date(),
        };
        this.settings.companyLocations.push(locationData);
      } else {
        this.location.updateAt = new Date();
        this.$set(
          this.settings.companyLocations,
          this.currentLocationIdx,
          this.location
        );
      }

      db.collection("settings")
        .doc(this.currentCompany.id)
        .collection("settings")
        .doc(this.appLabel.settingsCollection)
        .update({
          companyLocations: this.settings.companyLocations,
        });

      this.$snotify.success(
        `The ${this.appLabel.profile.location} has been saved`,
        "Success"
      );
      this.location = {};
      this.currentLocationIdx = -1;
      this.showForm = true;
    },
    deleteLocation(location) {
      const selectedIndex = this.settings.companyLocations.findIndex(
        (item) => item.name == location.name && item.code == location.code
      );
      if ((selectedIndex) => 0) {
        const confirmation = confirm(
          `Do you want to delete this category: ${location.name}`
        );
        if (confirmation) {
          this.submitDelete(selectedIndex);
        }
      }
    },
    submitDelete(id) {
      this.settings.companyLocations.splice(id, 1);
      db.collection("settings")
        .doc(this.currentCompany.id)
        .collection("settings")
        .doc(this.appLabel.settingsCollection)
        .update({
          companyLocations: this.settings.companyLocations,
        });
      this.$snotify.success(
        `The ${this.appLabel.profile.location} has been deleted`,
        "Success"
      );
    },
    editLocation(location) {
      const selectedIndex = this.settings.companyLocations.findIndex(
        (item) => item.name == location.name && item.code == location.code
      );
      this.showForm = true;
      this.location = location;
      this.currentLocationIdx = selectedIndex;
    },
    cancel() {
      this.location = {};
      this.currentLocationIdx = -1;
      this.showForm = false;
    },
  },
  firestore() {
    return {
      settings: db
        .collection("settings")
        .doc(this.currentCompany.id)
        .collection("settings")
        .doc(this.appLabel.settingsCollection),
    };
  },
};
</script>
