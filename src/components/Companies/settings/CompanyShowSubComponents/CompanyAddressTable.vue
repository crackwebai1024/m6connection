<template>
    <div class="text-right" >
        <v-btn fab dark x-small color="primary" @click="showCU = true" >
            <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-data-table
            :headers="headers"
            :items="items"
            :items-per-page="5"
            class="elevation-0"
        > 
            <template #item.locationType="{ item }" >
                {{ getLocationTypeLabel(item.locationType) }}
            </template>
            <template #item.actions="{ item }" >
                <v-btn fab dark x-small color="orange lighten-2" @click="whichToUpdate(item)" >
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn 
                    fab 
                    dark 
                    x-small 
                    color="red lighten-1" 
                    @click="$emit( 'deletingAddress', items.filter( c => c.id !== item.id ) )" 
                >
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template> 
        </v-data-table>

        <company-address-c-u 
            v-if="showCU"
            :show="showCU"
            :addressToUpdate="addressToUpdate"
            @appendAddress="appendAddress"
            @updateAddress="updateAddress"
            @close="cancelCU"
        />
    </div>
</template>

<script>
import { mapState } from 'vuex'
import CompanyAddressCU from './Cruds/CompanyAddressCU'

export default {
    name: "CompanyAddressTable",
    components: {
        CompanyAddressCU
    },
    props: {
        items: {
            type: Array,
            default: () => []
        }
    },
    data: () => ({
        showCU: false, 
        addressToUpdate: {},
        headers: [
            { text: "Name", value: "name" },
            { text: "Location Type", value: "locationType" },
            { text: "City", value: "city"},
            { text: "State", value: "stateFull" },
            { text: "Country", value: "country" },
            { text: "Actions", value: "actions" }
        ] 
    }),
    methods: {
        updateAddress(val) {
            const index = this.items.map(i => i.id).indexOf(val.id)
            this.items[index]  = val
            this.cancelCU()
        },
        appendAddress(val) {
            val.id = + new Date()
            this.items.push(val)
            this.cancelCU()
        },
        whichToUpdate(item) {
            this.showCU = true
            this.$nextTick( () => {
                this.addressToUpdate = item
            })
        },
        cancelCU() {
            this.showCU = false 
            this.$nextTick( () => {
                this.addressToUpdate = {}
            })
        },
        getLocationTypeLabel(key) {
            return this.$h.dg( this.locationTypes.find( l => l.value === key ), 'label', 'None' )
        }
    },
    computed: {
        ...mapState('Companies', {
            locationTypes: 'locationTypes'
        }),
    }
}
</script>
