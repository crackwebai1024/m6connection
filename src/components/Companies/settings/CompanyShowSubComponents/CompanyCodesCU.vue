<template>
    <div>
        <v-dialog 
            v-model="dialog" 
            persistent
            :width=" $vuetify.breakpoint.xs ? '95vw' : '70vw' "
        >
            <v-card>
                <v-card-title class="headline blue darken-2 white--text mb-2" >
                    {{ indexToEdit > -1 ? 'Edit' : 'Add' }} a {{ codeCat.name }} Code
                </v-card-title>
                <v-card-text class="card-text-custom" >
                    <v-autocomplete 
                        v-for="(l, i) in levels"
                        :key="`level-${i}`"
                        v-model="l.value"
                        item-value="id"
                        item-text="name"
                        :items="getItems(l.id)"
                        return-object
                        @input=" e => generateMoreLevels(e, i) "
                        :label="`${ 
                            $h.dg(codeCat, 'name', '').charAt(0).toUpperCase() + 
                            $h.dg(codeCat, 'name', '').slice(1) 
                        } Codes`"
                    />
                    <!-- :items="getSpecificUNSPC(l.id)" -->
                    <m6-loading :loading="loading" />
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="red" dark text @click="closing" >
                        close
                    </v-btn>
                    <v-btn color="green" dark @click="saveCode" >
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'

export default {
    name: "CompanyCodesCU",
    props: {
        dialog: {
            type: Boolean, 
            default: false
        },
        indexToEdit: {
            type: Number,
            default: -1 
        },
        codesToEdit: {
            type: Array,
            default: () => []
        },
        codeCat: {
            type: Object,
            default: () => {}
        },
        enumForCodes: {
            type: Object,
            default: () => {}
        }
    },
    data: () => ({
        loading: false,
        items: [],
        levels: [
            { value: {}, id: '0', index: 0 }
        ]
    }),

    methods: {
        ...mapActions('M6Codes', {
            getUnspcCodes: 'getUnspcCodes',
            getUnspcCodesByIds: 'getUnspcCodesByIds',
            
            getCompanyTypes: 'getCompanyTypes',
            getCompanyTypesByIds: 'getCompanyTypesByIds',

            getRegions: 'getRegions',
            getRegionsByIds: 'getRegionsByIds',

            getNaics: 'getNaics',
            getNaicsByIds: 'getNaicsByIds'
        }),
        ...mapActions('Companies', {
            updateCompany: 'updateCompany'
        }),
        ...mapMutations('Companies', {
            setCurrentCompany: 'setCurrentCompany'
        }),
        ...mapMutations('SnackBarNotif', {
            notifDanger: 'notifDanger',
            notifSuccess: 'notifSuccess'
        }),

        async generateMoreLevels({ id }, index) {
            this.loading = true
            try{
                const pathInCompany = this.$h.dg(this.codeCat, 'pathInCompany', '')

                let res = {}
                switch (true) {
                    case this.$h.dg(this.enumForCodes, 'unspsc.pathInCompany', 'none') == pathInCompany:
                        res = await this.getUnspcCodes(id)
                        break;
                    case this.$h.dg( this.enumForCodes, 'regions.pathInCompany', 'none' ) == pathInCompany:
                        res = await this.getRegions(id)
                        break;
                    case this.$h.dg( this.enumForCodes, 'naics.pathInCompany' ) == pathInCompany:
                        res = await this.getNaics(id)
                        break;
                    case this.$h.dg( this.enumForCodes, 'companyTypes.pathInCompany' ) == pathInCompany:
                        res = await this.getCompanyTypes(id)
                        break;
                }
                
                this.loading = false 
                this.levels = this.levels.filter( l => l.index <= index ) 
                index++
                if( res.length ) this.levels.push({ value: { }, id, index })
            } catch(err) {
                this.loading = false 
            }
        },

        findItems(id) {
            return this.unspcItems[id]
        },

        saveCode() {
            const currentCompany = {...this.currentCompany}
            if(!currentCompany[this.codeCat.pathInCompany]) currentCompany[this.codeCat.pathInCompany] = [] 
            
            if( this.indexToEdit > -1 ) {
                currentCompany[this.codeCat.pathInCompany][this.indexToEdit] = JSON.stringify(this.levels)
            } else {
                currentCompany[this.codeCat.pathInCompany].push( JSON.stringify(this.levels)  )
            }

            this.loading = true 
            this.updateCompany(currentCompany)
            .then( res => {
                this.loading = false
                this.setCurrentCompany(currentCompany)
                this.$nextTick( () => {
                    this.closing()
                })
            })
            .catch( err => {
                this.loading = false
            })
        },

        closing() {
            this.levels = [ { value: {}, id: '0', index: 0 } ]
            this.$nextTick( () => {
                this.$emit('close')
            })
        }
    },

    computed: {
        ...mapState('Companies', {
            currentCompany: 'currentCompany'
        }),
        ...mapState('M6Codes', {
            unspcItems: 'unspc',
            companyTypesItems: 'companyTypes',
            regionsItems: 'regions',
            naicsTypes: 'naics'
        }),
        getSpecificUNSPC() {
            return id => {
                return this.unspcItems[id]
            }
        },
        getItems() {
            return id => {
                const pathInCompany = this.$h.dg(this.codeCat, 'pathInCompany', '')

                switch (true) {
                    case this.$h.dg(this.enumForCodes, 'unspsc.pathInCompany', 'none') == pathInCompany:
                        return this.unspcItems[id] || []        
                        break;
                    case this.$h.dg( this.enumForCodes, 'regions.pathInCompany', 'none' ) == pathInCompany:
                        return this.regionsItems[id] || []
                        break;
                    case this.$h.dg( this.enumForCodes, 'naics.pathInCompany', 'none' ) == pathInCompany:
                        return this.naicsTypes[id] || []
                        break;
                    case this.$h.dg( this.enumForCodes, 'companyTypes.pathInCompany', 'none' ) == pathInCompany:
                        return this.companyTypesItems[id] || []
                        break;
                }
            }
        }
    },

    watch: {
        async codesToEdit(val) {
            // if( !val.length ) return 

            this.levels = val

            // this.loading = true 
            // this.getUnspcCodesByIds( val.map( v => v.id ) )
            // .then( res => {
            //     this.loading = false 
            // })
            // .catch( () => {
            //     this.loading = false 
            // })
            try{
                this.loading = true 
                const pathInCompany = this.$h.dg(this.codeCat, 'pathInCompany', '')
                const ids = val.map( v => v.id )
                
                switch (true) {
                    case this.$h.dg(this.enumForCodes, 'unspsc.pathInCompany', 'none') == pathInCompany:
                        await this.getUnspcCodesByIds(ids)
                        break;
                    case this.$h.dg( this.enumForCodes, 'regions.pathInCompany', 'none' ) == pathInCompany:
                        await this.getRegionsByIds(ids)
                        break;
                    case this.$h.dg( this.enumForCodes, 'naics.pathInCompany' ) == pathInCompany:
                        await this.getNaicsByIds(ids)
                        break;
                    case this.$h.dg( this.enumForCodes, 'companyTypes.pathInCompany' ) == pathInCompany:
                        await this.getCompanyTypesByIds(ids)
                        break;
                }
                this.loading = false 
            } catch(e) {
                this.loading = false 
            }

        },
        async dialog(newVal, oldVal) {
            // if(newVal) return 

            const pathInCompany = this.$h.dg(this.codeCat, 'pathInCompany', '')
            this.loading = true 

            try{ 
                switch (true) {
                    case this.$h.dg(this.enumForCodes, 'unspsc.pathInCompany', 'none') == pathInCompany:
                        await this.getUnspcCodes()
                        break;
                    case this.$h.dg( this.enumForCodes, 'regions.pathInCompany', 'none' ) == pathInCompany:
                        await this.getRegions()
                        break;
                    case this.$h.dg( this.enumForCodes, 'naics.pathInCompany' ) == pathInCompany:
                        await this.getNaics()
                        break;
                    case this.$h.dg( this.enumForCodes, 'companyTypes.pathInCompany' ) == pathInCompany:
                        await this.getCompanyTypes()
                        break;
                }
                this.loading = false 

            } catch(e) {
                this.loading = false
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.card-text-custom {
    height: 50vh;
    overflow-y: auto;
}
</style>