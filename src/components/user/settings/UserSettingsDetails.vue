<template>
    <v-card>
        <v-card-text>
            <div class="d-flex justify-end">
                <v-btn icon @click="showUserData = true" >
                    <v-icon>mdi-lead-pencil</v-icon>
                </v-btn>
            </div>
            
            <div class="d-flex flex-column justify-center align-center">
                <img v-if="$h.dg(userData, 'user.profilePic')" :src="$h.dg(userData, 'user.profilePic')" class="round-img" alt="user profile image">
                <v-icon v-else size="10rem" class="placeholder-img">mdi-account-circle</v-icon>
                <v-chip v-if="$h.dg(userData, 'joinStatus', '')" class="text-capitalize" small :color=" statusColors[$h.dg(userData, 'joinStatus', '')] " text-color="white">
                    <span class="white--text">{{ $h.dg(userData, 'joinStatus', '').toLowerCase() }}</span>
                </v-chip>
                <span class="text-h6">
                    {{ $h.dg(userData, 'user.firstName', '') }} {{ $h.dg(userData, 'user.lastName', '') }}
                </span>
                <span class="text-subtitle-1 font-weight-light">{{ userData.user.email }}</span>
            </div>
            <div class="d-flex flex-column align-start pa-2">
                <div class="d-flex flex-row align-start pa-1 mb-2">
                    <v-icon>mdi-clock-time-four-outline</v-icon>
                    <div class="d-flex flex-column align-start ml-2">
                        <span>Last Time Visited:</span>
                        <span>
                            {{ 
                                $h.dg(userData, 'user.lastVisit', '') ? 
                                    new Date(userData.user.lastVisit).toLocaleDateString("en-US", this.dateOptions) + " " + new Date(userData.user.lastVisit).toLocaleTimeString("en-US", this.timeOptions)
                                    : null 
                            }}
                        </span>
                    </div>
                </div>

                <div class="d-flex flex-row flex-start pa-1 mb-2">
                    <v-icon>mdi-account-lock</v-icon>
                    <div class="d-flex flex-column flex-start ml-2">
                        <span>User Roles:</span>
                        <div >
                            <v-chip 
                                v-for="(role, index) in $h.dg(userData, 'roles', [])" 
                                :key="index" 
                                :color="role.color"
                                small
                                class="text-capitalize"
                            >
                                <span class="white--text">{{ role.name }}</span>
                            </v-chip>
                        </div>
                    </div>
                </div>

                <div class="d-flex flex-row flex-start pa-1 mb-2">
                    <v-icon>mdi-account-multiple</v-icon>
                    <div class="d-flex flex-column flex-start ml-2">
                        <span class="pb-2">User Departments:</span>
                        <div>
                            <v-chip 
                                v-for="(dep, index) in $h.dg(userData, 'departments', [])" 
                                :key="index" 
                                :color="dep.color" 
                                small
                                class="text-capitalize"
                            >
                                <span class="white--text">{{ dep.name }}</span>
                            </v-chip>
                        </div>
                    </div>
                </div>
            </div>
        </v-card-text>

        <user-profile-update 
            :v-show="showUserData"
            :show="showUserData"
            @close="showUserData = false"
        />
        
    </v-card>
</template>

<script>
import { mapState } from 'vuex'
import UserProfileUpdate from '@/components/user/settings/UserProfileUpdate'

export default {
    name: "UserSettingsDetails",
    components: {
        UserProfileUpdate
    },
    data: () => ({
        dateOptions: { year: 'numeric', month: 'long', day: 'numeric' },
        timeOptions: { hour: '2-digit', minute: '2-digit' },
        showUserData: false
    }),
    computed: {
        ...mapState('UserSettingsControl', {
            userData: "userToShow"
        }),
        ...mapState('Auth', {
            statusColors: "statusColors"
        })
    },
}
</script>

<style lang="scss" scoped >
.round-img, .placeholder-img {
    width: 8.5rem;
    height: 8.5rem;
    margin-bottom: -1rem;
}
.round-img {
    object-fit: cover;
    border-radius: 50%;
}
</style>