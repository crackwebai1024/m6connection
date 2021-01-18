<template>
    <div class="pa-0" >
        <v-btn 
            color="teal darken-2" 
            block 
            dark 
            @click="executeHtml2Canvas"
        >
            Add Rapid
        </v-btn>
        
        <SnapShotDialog 
            :showDialog="showDialog"
            :imageTest="imageTest"
            @closing="showDialog = false"
        />

        <m6-loading :loading="loading" />
    </div>
</template>

<script>
import html2canvas from 'html2canvas'
import SnapShotDialog from '@/components/Home/TopNav/SnapShotDialog'

export default {
    name: "SnapShotNav",

    components: {
        SnapShotDialog
    },

    data: () => ({
        imageTest: "",
        showDialog: false,
        loading: false,
        expandOptions: false,
    }),

    methods: {
        executeHtml2Canvas(ratingChosen){
            this.loading = true 
            this.$nextTick( () => {
                html2canvas(document.body).then((canvas) => {
                    this.imageTest = canvas.toDataURL()
                    this.showDialog = true 
                    this.loading = false 
                })
            })
        }
    },
}
</script>

<style lang="scss" scoped>
.r-btn {
    font-size: 1.4rem;
}
</style>