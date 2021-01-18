<template>
    <div class="align-center d-flex text-center">
        <v-menu
            open-on-hover
            top
            offset-x
        >
            <template v-slot:activator="{ on }">
                <img
                    v-show="Boolean($h.dg(currentUser, 'profilePic', '').length)"
                    v-on="on" 
                    :alt="currentUser.firstName"
                    width="40"
                    height="40"
                    class="mr-3 rounded-circle"
                    :src="$h.dg(currentUser, 'profilePic', '')"
                >
                <v-icon 
                    v-show="!Boolean($h.dg(currentUser, 'profilePic', '').length)"
                    x-large 
                    v-on="on" 
                    :alt="currentUser.firstName" 
                >
                    mdi-account-circle
                </v-icon>
            </template>

            <v-list>
                <v-list-item>
                    <v-list-item-title>
                        <div>{{ $h.dg(currentUser, 'firstName', '') }} {{ $h.dg(currentUser, 'lastName', '') }}</div>
                        {{ currentCompany.name }}
                    </v-list-item-title>
                </v-list-item>
                <v-divider />
                <v-list-item>
                    <v-list-item-title >
                        <v-btn 
                            @click="showCompanies = true" 
                            color="primary" 
                            small 
                        >
                            Switch Companies
                        </v-btn>
                    </v-list-item-title>
                </v-list-item>
                <v-divider />
                <v-list-item class="pa-2" >
                    <v-list-item-avatar >
                        <v-btn color="green darken-2" icon @click="showUserData = true" >
                            <v-icon>mdi-lead-pencil</v-icon>
                        </v-btn>
                    </v-list-item-avatar>
                    <v-list-item-content />
                    <v-list-item-action>
                        <v-btn color="red" @click="logout" >
                            <v-icon class="white--text" >mdi-account-cancel</v-icon>
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
            </v-list>
        </v-menu>

        <user-companies-options
            v-if="showCompanies" 
            :show="showCompanies"
            @OpenJoinCompanies="openJoinCompanies"
            @close="showCompanies = false"
        />

        <join-companies  
            v-if="showJoinCompanies"
            :show="showJoinCompanies"
            @close="showJoinCompanies = false"
        />

        <user-profile-update 
            :v-show="showUserData"
            is-current-user
            :show="showUserData"
            @close="showUserData = false"
        />
    </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import UserCompaniesOptions from '@/components/Home/TopNav/UserCompaniesOptions'
import JoinCompanies from '@/components/Home/TopNav/JoinCompanies'
import UserProfileUpdate from '@/components/user/settings/UserProfileUpdate'

export default {
    components: {
        UserCompaniesOptions,
        JoinCompanies,
        UserProfileUpdate
    },
    data: () => ({
        showCompanies: false,
        showJoinCompanies: false,
        showUserData: false
    }),
    computed: {
        ...mapState('Companies', {
            currentCompany: 'currentCompany' 
        }),
        ...mapState('Auth', {
            currentUser: 'user'
        })
    },
    methods: {
        ...mapMutations('Auth', {
            logoutUser: 'logoutUser'
        }),
        ...mapActions('GSChat', ['removeClient']),
        openJoinCompanies() {
            this.showJoinCompanies = true
            
            this.$nextTick( () => {
                this.showCompanies = false    
            })
        },
        logout(){
            this.logoutUser()
            this.removeClient()
            this.$router.push({ name: 'auth.SignIn' })
        }
    }
}
</script>
