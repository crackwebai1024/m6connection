<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="items"
            :items-per-page="5"
            class="elevation-0"
        > 
            <template #item.socialMedia="{ item }" >
                <v-autocomplete
                    v-model="item.icon"
                    :items="socialMediaOptions"
                    item-text="text"
                    item-value="val"
                    @input="e => inputEvent(e, item)"
                />
            </template>
            <template #item.link="{ item }" >
                <v-text-field 
                    v-model="item.link" 
                    :label="`${item.name} Link`" 
                    :rules="websiteRules" 
                />
            </template>
            <template #item.actions="{ item }" >
                <v-btn icon color="red" @click="deletingItem(item)" >
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>
        </v-data-table>
    </div>
</template>

<script>
export default {
    name: "SocialMediaCU",
    props: {
        items: {
            type: Array,
            default: () => []
        }
    },
    data: () => ({
        websiteRules: [
            v => !!v || 'Website is required',
            v => /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(v) || "Website must be valid"
        ],
        headers: [
            { text: "Social Media", value: "socialMedia" },
            { text: "Link", value: "link", sortable: false },
            { text: "Actions", value: "actions", sortable: false }
        ],
        socialMediaOptions: [
            { id: 'facebook',  text: 'Facebook', val: 'mdi-facebook' },
            { id: 'twitter',   text: 'Twitter', val: 'mdi-twitter' },
            { id: 'linkedin',  text: 'LinkedIn', val: 'mdi-linkedin' },
            { id: 'instagram', text: 'Instagram', val: 'mdi-instagram' }
        ]
    }),
    methods: {
        inputEvent(val, item) {
            const social = this.socialMediaOptions.find( s => s.val === val )
            item.name = social.text
        },
        deletingItem(item) {
            this.$emit('change', this.items.filter( i => i.link !== item.link ) )
        }
    }
}
</script>