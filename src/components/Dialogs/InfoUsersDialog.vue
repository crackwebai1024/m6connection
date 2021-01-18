<template>
    <v-card :flat="flatCard">
        <v-card-text>
            <div class="flex">
                <span>Members</span>
                <v-menu
                    offset-x
                    :close-on-content-click="false"
                    :max-width="400"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            class="mx-2"
                            fab
                            dark
                            small
                            color="green"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon dark>mdi-plus</v-icon>
                        </v-btn>
                    </template>

                    <add-user-dialog
                        :current-users="currentUsers"
                        :show-card-header="false"
                        :bigger-height-messages-container="false"
                        :flat-card="true"
                        :show-user-auto-select-field="true"
                        :show-action-buttons="false"
                        @currentUsersChanged="channel.state.members = $event"
                    />
                </v-menu>
            </div>
            <v-list class="transparent">
                <div
                    v-for="(userID, index) in Object.keys(currentUsers)" 
                    :key="index + '-user-info'"
                >
                    <v-list-item>
                        <v-list-item-icon size="20">
                            <v-avatar
                                color="blue"
                                dark
                                size="36"
                            >
                                <v-img
                                    v-if="currentUsers[userID]['user']['image']"
                                    :src="currentUsers[userID]['user']['image']"
                                />
                                <template v-else>
                                    <span class="text-uppercase white--text">{{ currentUsers[userID]['user']['name'].charAt(0) }}</span>
                                </template>
                            </v-avatar>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{currentUsers[userID]['user']['name']}}
                            </v-list-item-title>
                            <v-list-item-subtitle v-if="currentUsers[userID]['user']['online']">
                                <p class="font-weight-medium ma-0 pa-0 text-caption green--text text--accent-4" >
                                    online
                                </p>
                            </v-list-item-subtitle>
                            <v-list-item-subtitle v-else>
                                {{new Date(currentUsers[userID]['user']['last_active']).toString().substr(0,15)}}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-icon>
                            <v-btn v-if="role === 'owner' && currentUsers[userID]['role'] !== 'owner'" icon @click="remove(currentUsers[userID])">
                                <v-icon color="red darken-1" >mdi-delete</v-icon>
                            </v-btn>
                        </v-list-item-icon>
                    </v-list-item>
                </div>
            </v-list>
        </v-card-text>
    </v-card>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import AddUserDialog from '@/components/Dialogs/AddUserDialog'
export default {
    name: "InfoUsersDialog",
    components: {
        AddUserDialog,
    },
    data: () => ({
        role: "member"
    }),
    props:{
        currentUsers: {
            type: Object,
            default: () => {}
        },
        channel: {
            type: Object,
            default: () => {}
        },
        flatCard: {
            type: Boolean,
            default: false
        },
    },
    methods: {
        async remove( user ){
            await this.channel.removeMembers([user.user.id]);
        }
    },
    computed: {
        ...mapGetters('Auth', { user: 'getUser' }),
        ...mapGetters('GSChat', { client: 'client' }),
    },
    mounted() {
        this.role = this.currentUsers[this.user.id]['role'];
    },
    watch: {
        currentUsers: {
            handler: function (newVal, oldVal) {
                this.$emit('currentUsersChanged', newVal)
            },
            deep: true
        }
        
    }
}
</script>