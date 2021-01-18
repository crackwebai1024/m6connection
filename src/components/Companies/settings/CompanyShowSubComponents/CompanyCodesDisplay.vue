<template>
    <div>
        <v-container class="pa-0" >
            <v-tabs vertical>
                <v-tab  >
                    Unspc
                </v-tab>
                <v-tab>
                    Regions
                </v-tab>
                <v-tab>
                    Naics
                </v-tab>
                <v-tab>
                    Company Types
                </v-tab>

                <v-tab-item class="text-right" >
                    <v-btn dark fab x-small color="green" @click="( addingNewCode( enumForCodes.unspsc ) )" >
                       <v-icon>mdi-plus</v-icon> 
                    </v-btn>
                    <div 
                        v-for="( u, index ) in $h.dg(currentCompany, 'unspcs', [])" 
                        :key="`unspsc-${index}`"
                    >
                        <v-chip 
                            color="blue darken-2" 
                            v-for="( item, i ) in JSON.parse(u)" :key="`u-item-${i}`" 
                            @click=" addingNewCode( enumForCodes.unspsc, u, i ) " 
                        >
                            <span class="white--text" >{{ item.value.name }}</span>
                        </v-chip>
                    </div>
                </v-tab-item>

                <v-tab-item class="text-right" >
                    <v-btn dark fab x-small color="green" @click="( addingNewCode( enumForCodes.regions ) )" >
                       <v-icon>mdi-plus</v-icon> 
                    </v-btn>
                    <div 
                        v-for="( r, index ) in $h.dg(currentCompany, 'regions', [])" 
                        :key="`regions-${index}`"
                    >
                        <v-chip 
                            color="blue darken-2" 
                            v-for="( item, i ) in JSON.parse(r)" :key="`r-item-${i}`" 
                            @click=" addingNewCode( enumForCodes.regions, r, i ) " 
                        >
                            <span class="white--text" >{{ item.value.name }}</span>
                        </v-chip>
                    </div>
                </v-tab-item>


                <v-tab-item class="text-right" >
                    <v-btn dark fab x-small color="green" @click="( addingNewCode( enumForCodes.naics ) )" >
                       <v-icon>mdi-plus</v-icon> 
                    </v-btn>
                    <div 
                        v-for="( n, index ) in $h.dg(currentCompany, 'naics', [])" 
                        :key="`naics-${index}`"
                    >
                        <v-chip 
                            color="blue darken-2" 
                            v-for="( item, i ) in JSON.parse(n)" :key="`n-item-${i}`" 
                            @click=" addingNewCode( enumForCodes.naics, n, i ) " 
                        >
                            <span class="white--text" >{{ item.value.name }}</span>
                        </v-chip>
                    </div>
                </v-tab-item>


                <v-tab-item class="text-right" >
                    <v-btn dark fab x-small color="green" @click="( addingNewCode( enumForCodes.companyTypes ) )" >
                       <v-icon>mdi-plus</v-icon> 
                    </v-btn>
                    <div 
                        v-for="( t, index ) in $h.dg(currentCompany, 'types', [])" 
                        :key="`types-${index}`"
                    >
                        <v-chip 
                            color="blue darken-2" 
                            v-for="( item, i ) in JSON.parse(t)" :key="`t-item-${i}`" 
                            @click=" addingNewCode( enumForCodes.companyTypes, t, i ) " 
                        >
                            <span class="white--text" >{{ item.value.name }}</span>
                        </v-chip>
                    </div>
                </v-tab-item>
            </v-tabs>
        </v-container>

        <CompanyCodesCU 
            :dialog="dialogShow" 
            :index-to-edit="indexToEdit" 
            :codes-to-edit="codesToEdit" 
            :code-cat="codeCat"
            :enum-for-codes="enumForCodes"
            @close="closing" 
        />

    </div>
</template>

<script>

import CompanyCodesCU from './CompanyCodesCU'
import { mapState } from 'vuex'
export default {

    components: {
        CompanyCodesCU
    },

    data: () => ({
        enumForCodes: {
           unspsc: { name: "Unspc", pathInCompany: "unspcs" },
           regions: { name: "regions", pathInCompany: "regions" },
           naics: { name: "Naics", pathInCompany: "naics" },
           companyTypes: { name: 'companyTypes', pathInCompany: "types" }
        },
        dialogShow: false,
        codesToEdit: [],
        indexToEdit: -1,
        codeCat: {}
    }),
    
    methods: {
        closing() {
            this.dialogShow = false
            this.codesToEdit = [ { value: {}, id: '0', index: 0 } ]  
            this.indexToEdit = -1
            this.codeCat = {}
        },
        addingNewCode(code, items = null, index = null) {
            if(items && index > -1) {
                this.codesToEdit = JSON.parse(items)
                this.indexToEdit = index
            }

            this.codeCat = code

            this.$nextTick( () => {
                this.dialogShow = true
            })
       }
    },

    computed: {
        ...mapState('Companies', {
            currentCompany: 'currentCompany'
        })
    }

}
</script>

<style lang="scss" scoped>
</style>