<template>
  <v-dialog
    v-model="show"
    persistent
    :scrollable="!loading"
    :width="loading ? '400px' : '90%'"
  >
    <v-card
      v-if="loading"
      color="primary"
      dark
    >
      <v-card-text>
        Please stand by
        <v-progress-linear
          class="mb-0"
          color="white"
          indeterminate
        />
      </v-card-text>
    </v-card>
    <v-card
      v-else
      class="elevation-0"
    >
      <v-card-title>
        <template v-if="editing">
          Edit Field: {{ field.label }}
        </template>
        <template v-else>
          Create New Field
        </template>
      </v-card-title>
      <v-card-text class="mb-10">
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="field.label"
                    label="Field Name"
                  />
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="field.type"
                    item-text="label"
                    item-value="value"
                    :items="types"
                    label="Field Type"
                    @change="fieldTypeChanged"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="field.metadata.helpText"
                    filled
                    label="Help Text"
                    rows="3"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="field.machine_name"
                    label="Machine Name: Optional"
                  />
                </v-col>
                <v-col cols="12">
                  <v-checkbox
                    v-model="field.metadata.required"
                    color="red"
                    hide-details
                    label="Required"
                    value="red"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-row>
                <v-col
                  v-if="field.type === 'taxonomy'"
                  cols="12"
                >
                  <v-select
                    v-model="field.metadata.vocabulary"
                    item-text="title"
                    item-value="id"
                    :items="vocabularies"
                    label="Vocabulary"
                  />
                </v-col>
                <v-col
                  v-if="field.type === 'timestamp'"
                  cols="12"
                >
                  <v-select
                    v-model="field.metadata.format"
                    :items="dateFormats"
                    label="Format"
                  />
                </v-col>
                <template v-if="field.type === 'autocomplete'">
                  <v-col cols="12">
                    <v-row>
                      <v-col cols="6">
                        <v-text-field
                          v-model="field.metadata.min"
                          label="Min Values"
                          value="1"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          v-model="field.metadata.max"
                          label="Max Values"
                          value="1"
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12">
                    <v-checkbox
                      v-model="field.metadata.multiple"
                      label="Multiple Answers"
                    />
                    <h4 class="mb-2">
                      Options
                    </h4>
                    <template v-for="(option, optIndex) in field.metadata.options">
                      <v-text-field
                        :key="optIndex"
                        v-model="field.metadata.options[optIndex]"
                        append-outer-icon="mdi-delete"
                        label="Option Name"
                        @click:append-outer="removeOption(optIndex, field.metadata.options)"
                      />
                    </template>
                    <v-btn
                      class="pa-0"
                      small
                      text
                      @click="pushOption"
                    >
                      Add Option
                    </v-btn>
                  </v-col>
                </template>
                <v-col
                  v-if="field.type === 'referenced'"
                  cols="12"
                >
                  <treeselect
                    v-model="field.referenced_field"
                    :disable-branch-nodes="true"
                    :load-options="loadOptions"
                    :multiple="false"
                    :options="fieldList"
                    placeholder="Referenced Field"
                    value-format="object"
                  />
                </v-col>

                <!-- calculated field -->
                <v-col
                  v-if="field.type === 'calculated'"
                  class="pa-5"
                  cols="12"
                >
                  <!-- Result -->
                  <v-row class="align-center">
                    <v-col cols="3">
                      <h3>Set Value To:</h3>
                    </v-col>
                    <v-col cols="9">
                      <v-text-field
                        v-model="field.metadata.value"
                        label="Calculated Result"
                      />
                    </v-col>
                  </v-row>

                  <!-- There should be an static IF -->
                  <v-row>
                    <v-col cols="12">
                      <v-row>
                        <v-col cols="6">
                          <h3>IF</h3>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>

                  <!-- List of rows -->
                  <v-row
                    v-for="(item, idx) in field.metadata.formula"
                    :key="idx"
                  >
                    <v-col cols="12">
                      <v-row v-if="item.type === 'field-row'">
                        <v-col cols="4">
                          <v-select
                            v-model="item.operand1"
                            dense
                            item-text="label"
                            item-value="id"
                            :items="fieldsBag"
                            label="Field"
                          />
                        </v-col>

                        <v-col cols="3">
                          <v-select
                            v-if="item.operand1 !== null"
                            v-model="item.operator"
                            dense
                            :items="getOperatorsForField(getFieldById(item.operand1))"
                            label="Operator"
                            outlined
                          />
                        </v-col>

                        <v-col cols="4">
                          <v-select
                            v-if="item.operator !== '' && getFieldById(item.operand1).type === 'autocomplete'"
                            dense
                            :items="getFieldById(item.operand1).metadata.options"
                            label="Value"
                          />

                          <v-text-field
                            v-else-if="item.operator !== ''"
                            dense
                            label="Value"
                            :type="getFieldById(item.operand1).type === 'number' ? 'number' : 'text'"
                          />
                        </v-col>
                      </v-row>

                      <v-row v-else>
                        <v-col cols="3">
                          <v-select
                            v-model="item.operator"
                            dense
                            :items="nonEmptyOperators"
                            label="Operator"
                            solo
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12">
                      <v-btn
                        color="primary"
                        @click="addFormulaItem"
                      >
                        Add
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col
                  v-if="field.type === 'attachment'"
                  cols="12"
                >
                  <v-select
                    v-model="field.metadata.attachmentOption"
                    item-text="text"
                    item-value="value"
                    :items="attachmentOption"
                    label="Attachment Option"
                  />
                  <v-file-input
                    counter
                    multiple
                    show-size
                    truncate-length="1"
                  />
                </v-col>
                <v-col
                  v-if="field.type === 'boolean'"
                  cols="12"
                >
                  <v-select
                    v-model="field.metadata.booleanOption"
                    item-text="text"
                    item-value="value"
                    :items="booleanOption"
                    label="Yes/No Option"
                  />
                </v-col>
                <v-col
                  v-if="field.type === 'text'"
                  cols="12"
                >
                  <v-select
                    v-model="field.metadata.textOption"
                    item-text="text"
                    item-value="value"
                    :items="textOption"
                    label="Text Option"
                  />
                  <template v-if="field.metadata.textOption === 'textarea'">
                    <v-text-field
                      v-model="field.metadata.textOption_rows"
                      label="Number of rows"
                      type="number"
                      value="3"
                    />
                    <v-checkbox
                      v-model="field.metadata.textOption_auto_grow"
                      hide-details
                      label="Auto Grow"
                      value="true"
                    />
                  </template>
                </v-col>
                <v-col
                  v-if="field.type === 'number'"
                  cols="12"
                >
                  <v-select
                    v-model="field.metadata.numberOption"
                    item-text="text"
                    item-value="value"
                    :items="numberOption"
                    label="Number Option"
                  />
                </v-col>
                <v-col
                  v-if="field.type === 'helper-media'"
                  cols="12"
                >
                  <v-text-field
                    v-model="helperMedia.name"
                    prepend-icon="mdi-file-video-outline"
                    @click="() => $refs.fileInput.click()"
                  />
                  <input
                    v-show="false"
                    ref="fileInput"
                    accept="image/*, video/*, video/mp4, video/x-m4v, video/x-matroska"
                    single
                    type="file"
                    @change="onFilesChange"
                  >
                  <v-row v-if="helperMedia.type && helperMedia.url">
                    <v-col cols="12">
                      <template v-if="helperMedia.type.indexOf('image') !== -1">
                        <img
                          class="image-preview"
                          :src="helperMedia.url"
                          style="width: 100%; height: 100%;"
                        >
                        <v-btn
                          class="absolute btn-chat-shadow ml-2 right-0 top-0 v-close-btn"
                          color="grey lighten-2"
                          fab
                          @click="helperMedia = {}"
                        >
                          <v-icon
                            size="12"
                          >
                            mdi-close
                          </v-icon>
                        </v-btn>
                      </template>
                      <template v-else-if="helperMedia.type.indexOf('video') !== -1">
                        <video
                          controls
                          style="height: 100%; width: 100%"
                        >
                          <source
                            :src="helperMedia.url"
                            :type="helperMedia.type"
                          >
                          Your browser does not support the video tag.
                        </video>
                        <v-btn
                          class="absolute btn-chat-shadow ml-2 right-0 top-0 v-close-btn"
                          color="grey lighten-2"
                          fab
                          @click="helperMedia = {}"
                        >
                          <v-icon
                            size="12"
                          >
                            mdi-close
                          </v-icon>
                        </v-btn>
                      </template>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
            <v-col
              v-if="field.type === 'referencedToApp'"
              cols="12"
            >
              <v-autocomplete
                v-model="field.referenced_app"
                item-text="label"
                item-value="appId"
                :items="appList"
                label="Referenced App"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-if="editing"
          color="yellow"
          @click="copyField(field)"
        >
          Copy Field
        </v-btn>
        <v-btn
          color="red"
          text
          @click="closeModal"
        >
          Cancel
        </v-btn>
        <v-btn
          color="blue"
          dark
          @click="saveField(field)"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapGetters,
  mapActions
} from 'vuex'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'

import axios from 'axios'

export default {
  name: 'Field',
  props: {
    show: {
      default: false,
      required: true,
      type: Boolean
    },
    editing: {
      default: false,
      required: true,
      type: Boolean
    },
    field: {
      required: true,
      type: Object
    },
    fieldsBag: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      loading: true,
      dateFormats: [
        'mm/dd/YYYY',
        'mm/dd/YYYY H:m:s',
        'dd/mm/YYYY H:m:s'
      ],
      vocabularies: [],
      attachmentOption: [
        { text: 'General', value: 'general' },
        { text: 'Image', value: 'image' }
      ],
      textOption: [
        { text: 'Single Line', value: 'singleLine' },
        { text: 'Textarea', value: 'textarea' }
      ],
      booleanOption: [
        { text: 'Horizontal Alignment', value: 'horizon' },
        { text: 'Vertical Alignment', value: 'vertical' }
      ],
      numberOption: [
        { text: 'Genera', value: 'genera' },
        { text: 'Currency', value: 'currency' }
      ],
      types: [
        { label: 'Text', value: 'text' },
        { label: 'Number', value: 'number' },
        { label: 'Date', value: 'timestamp' },
        { label: 'People', value: 'people' },
        { label: 'Multiple Choice', value: 'autocomplete' },
        { label: 'Attachment', value: 'attachment' },
        { label: 'Yes / No', value: 'boolean' },
        { label: 'Reference Field', value: 'referenced' },
        { label: 'Calculated Field', value: 'calculated' },
        { label: 'Reference App', value: 'referencedToApp' },
        { label: 'Address', value: 'autocomplete-address' },
        { label: 'Helper Media', value: 'helper-media' },
        { label: 'Taxonomy', value: 'taxonomy' }
      ],
      fieldList: [],
      operators: {
        logical: ['AND', 'OR'],
        math: ['+', '-', '/', '*'],
        equal: ['='],
        empty: ['']
      },
      panelFields: [],
      helperMedia: {}
    }
  },
  computed: {
    ...mapState('AppBuilder', {
      currentApp: 'app'
    }),
    appList() {
      return this.fieldList.filter(row => Number(row.appId) !== Number(this.currentApp.id))
    },
    nonEmptyOperators() {
      return [
        ...this.operators.logical,
        ...this.operators.equal,
        ...this.operators.math
      ]
      return [...Object.values(this.operators)].flat()
    }
  },

  watch: {
    'field.type': function (val) {
      if (val === 'autocomplete') {
        this.field.metadata.multiple = true
      }
    }
  },

  mounted() {
    // TODO: The available apps list should be on a global list on the store.
    axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/dynamic_apps/apps`).then(response => {
      response.data.map(app => {
        this.fieldList.push({
          id: app.title + app.id,
          appId: app.id,
          label: app.title,
          children: null
        })
      })
      if (this.editing && this.field.type === 'referenced') {
        // eslint-disable-next-line camelcase
        this.field.referenced_field = this.field.metadata.originalReference
      }
      this.loading = false
    })
    // Get a copy from types to available fields
    if (this.fieldsBag) {
      this.panelFields = this.fieldsBag.map(field => ({
        text: field.label
      }))
    }
    this.initVocabulary().then(res => {
      this.vocabularies = res
    }).catch(e => {
      this.notifDanger('Can not fetch vocabularies')
    })
  },

  methods: {
    ...mapGetters('Taxonomy', {
      getVocabulary: 'getTaxonomyVocabulary'
    }),
    ...mapActions('Taxonomy', {
      initVocabulary: 'setTaxonomyVocabularies'
    }),
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),
    ...mapActions('AppAttachments', {
      setStreamFiles: 'set_stream_attachments'
    }),
    deleteField() {},
    removeOption(index, item) {
      item.splice(index, 1)
    },
    verifyMachineName(txt) {
      const re = new RegExp('^[a-zA-Z0-9_]*$')
      const res = re.test(txt)
      return res
    },
    async saveField(field, copyField = false) {
      try {
        if (field.machine_name && !this.verifyMachineName(this.$h.dg(field, 'machine_name', ''))) {
          this.notifDanger('A Machine Name Should Only Contain: Letters, Numbers or Underscores')
          return
        }

        // eslint-disable-next-line camelcase
        const postData = {
          id: field.id,
          // eslint-disable-next-line camelcase
          app_id: this.currentApp.id,
          // eslint-disable-next-line camelcase
          panel_id: field.panel_id,
          // eslint-disable-next-line camelcase
          table_id: field.table_id,
          weight: field.weight,
          metadata: field.metadata,
          type: field.type,
          label: field.label,
          // eslint-disable-next-line camelcase
          machine_name: field.machine_name
        }

        if (field.type === 'referenced') {
          postData.metadata.originalReference = field.referenced_field
          // eslint-disable-next-line camelcase
          postData.referenced_field = field.referenced_field.id
        } else {
          delete postData.referenced_field
        }
        if (field.type === 'referencedToApp') {
          postData.metadata.originalReference = this.appList.find(row => row.appId === field.referenced_app)
          // eslint-disable-next-line camelcase
          postData.referenced_app = field.referenced_app
        } else {
          delete postData.referenced_app
        }
        if ((field.type !== 'referenced') && (field.type !== 'referencedToApp')) {
          delete postData.metadata.originalReference
        }
        if (field.type === 'helper-media') {
          const url = await this.setStreamFiles({
            files: this.helperMedia.file,
            headers: {
              'Content-Type': this.helperMedia['type'],
              'Content-Name': this.helperMedia['name'],
              'Stream-Id': this.currentApp.id,
              'Stream-type': 'helper-media'
            }
          })
          postData.helperMediaURL = url.attachUrl
        }
        if (this.editing && !copyField) {
          const data = await this.$store.dispatch('AppBuilder/updateField', postData)
          this.notifSuccess('The Field Was Updated')
          this.$emit('result', data, false)
        } else if (!copyField) {
          const data = await this.$store.dispatch('AppBuilder/saveField', postData)
          this.notifSuccess('The Field Was Created')
          this.$emit('result', data, false)
        } else {
          const data = await this.$store.dispatch('AppBuilder/saveField', postData)
          this.notifSuccess('The Field Was Created')
          this.$emit('result', data, true)
        }
      } catch (e) {
        let msg = 'There was an error.'
        if (field.machine_name) msg += ' Remember that the Machine Name Must Be Unique'
        this.notifDanger(msg)
      }
    },

    async copyField(field) {
      const a = {
        label: field.label,
        metadata: field.metadata,
        panel_id: field.panel_id,
        referenced_field: field.referenced_field,
        type: field.type,
        weight: field.weight
      }
      this.saveField(a, true)
    },

    addFormulaItem() {
      this.field.metadata.formula.push({
        type: 'operator-row',
        operator: ''
      })
      this.field.metadata.formula.push({
        type: 'field-row',
        operand1: null,
        operator: '',
        operand2: null
      })
    },

    getOperatorsForField(field) {
      return [
        ...this.operators.empty,
        ...this.operators.equal,
        ...(field.type === 'number' ? this.operators.math : [])
      ]
    },

    fieldTypeChanged(type) {
      if (type === 'calculated' && !this.field.metadata.formula) {
        const formula = [{
          type: 'field-row',
          operand1: null,
          operator: '',
          operand2: null
        }]

        this.$set(this.field.metadata, 'formula', formula)
      }
    },

    getFieldById(id) {
      return this.fieldsBag.find(f => f.id === id)
    },

    confirmDelete(field) {
      this.$store.dispatch('AppBuilder/deleteField', field.id)
    },
    closeModal() {
      this.$emit('close')
    },
    pushOption() {
      if (!this.field.metadata.options) {
        this.field.metadata.options = []
      }
      this.field.metadata.options.push('New Option')
    },

    loadOptions({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/field/list/all`, {
          appId: parseInt(parentNode.appId),
          nested: true
        }).then(response => {
          parentNode.children = this.normalizeNested(response.data)
          callback()
        })
      }
    },

    normalizeNested(tabs) {
      return tabs.map(tab => {
        // TODO: Improve validation for fields without a panel.
        if (!tab.panels && tab.type) {
          tab.label = 'Field: ' + tab.label
          return tab
        }
        tab.label = 'Tab: ' + tab.title
        tab.id = tab.title + tab.id
        tab.children = tab.panels.map(panel => {
          panel.label = 'Panel: ' + panel.title
          panel.id = panel.title + panel.id
          panel.children = panel.fields.filter(field => field.type !== 'referenced').map(field => {
            field.label = 'Field: ' + field.label
            return field
          })
          return panel
        })
        return tab
      })
    },

    cleanMetadata() {
      this.field.metadata = {
        options: [],
        required: false
      }
    },

    onFilesChange(files) {
      const file = files['srcElement']['files'][0]
      if (file) {
        const type = file['type'].substr(0, file['type'].indexOf('/'))
        if (type === 'image' || type === 'video') {
          this.helperMedia = {
            file: file,
            url: URL.createObjectURL(file),
            type: file['type'],
            name: file['name']
          }
        }
      }
    }
  }
}
</script>
