<template>
  <div>
    <v-btn
      :color="btnButton"
      icon
      @click="pickFile"
    >
      <slot />
    </v-btn>
    <input
      id="uploadCaptureInputFile"
      ref="obj"
      :accept=" fileMap[acceptedFileType] || '' "
      style="display: none"
      type="file"
      @change="onFilePicked"
    >
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import axios from 'axios'
import Compressor from 'compressorjs'

export default {
  name: 'M6Upload',
  props: {
    btnButton: {
      type: String,
      default: ''
    },
    acceptedFileType: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    fileMap: {
      'image': 'image/*'
    }
  }),
  methods: {
    ...mapActions('File', {
      getPresignedUrl: 'getPresignedUrl'
    }),
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger'
    }),
    pickFile() {
      this.$refs.obj.click()
    },
    async onFilePicked(e) {
      const files = e.target.files

      if (files[0] !== undefined) {
        this.$emit('loading')
        for (let x = 0; x < files.length; x++) {
          switch (true) {
            case this.acceptedFileType === this.$h.dg(this.$h.dg(files, `${x}.type`, '').split('/'), '0', ''):
              await this.prepareUpload(files[x])
              break

            case !this.acceptedFileType.length:
              await this.prepareUpload(files[x])
              break

            default:
              this.notifDanger(`The file must be of type: ${this.acceptedFileType}`)
              this.$emit('loading')
              break
          }
        }
        // this.$emit('loading')
      }
    },
    prepareUpload(obj) {
      return new Promise(async (resolve, reject) => {
        try {
          const fileTypePartial = obj.type.split('/')[0]
          const data = {
            folder: fileTypePartial,
            fileType: obj.type,
            fileName: obj.name
          }

          const response = await axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/file/upload`, data).catch(e => console.log(e.response))
          const url = response.data.url

          let objectUploaded = null

          if (fileTypePartial === 'image') {
            const processedFile = await this.imageProcessing(obj)
            objectUploaded = await this.uploadingFile(url, processedFile)
          } else {
            objectUploaded = await this.uploadingFile(url, obj)
          }

          await this.processFetch(objectUploaded, false)

          const objUrl = this.getUrlForObj(url)

          const resPayload = {
            ok: true,
            data: { link: objUrl, fileType: obj.type }
          }
          resolve(resPayload)
          this.$emit('response', resPayload)
        } catch (e) {
          const err = { ok: false, err: e }
          this.$emit('response', err)
          reject(err)
        }
      })
    },
    uploadingFile(url, obj) {
      return new Promise((resolve, reject) => {
        const newHeaders = new Headers()
        newHeaders.append('x-amz-acl', 'public-read')
        newHeaders.append('Content-Type', obj.type)
        fetch(url, {
          method: 'PUT',
          mode: 'cors',
          body: obj,
          headers: newHeaders
        })
          .then(res => resolve(res))
          .catch(err => {
            reject(err)
          })
      })
    },
    processFetch(responseFetch, returnJson = true) {
      return new Promise((resolve, reject) => {
        if (responseFetch.ok && returnJson) {
          responseFetch.json().then(res => {
            resolve(res)
          })
        } else if (responseFetch.ok) {
          resolve()
        } else {
          responseFetch.json().then(err => {
            reject(err)
          })
        }
      })
    },

    getUrlForObj(url) {
      return url.split('?')[0]
    },

    imageProcessing(file) {
      return new Promise((resolve, reject) => {
        new Compressor(file, {
          quality: 0.6,
          success(result) {
            resolve(result)
          },
          error(err) {
            reject(err)
          }
        })
      })
    }

  }
}
</script>
