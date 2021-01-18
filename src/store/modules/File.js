import axios from 'axios'

const state = {
    fileQueue: []
}

const getters = {}

const mutations = {
    addFilesToQueue(state, payload) {
        state.fileQueue.push(payload)
    },
    clearFileQueue(state) {
        state.fileQueue = []
    }
}

const actions = {
    getPresignedUrl(context, params) {
        return new Promise((resolve, reject) => {
            axios.post(`http://${process.env.VUE_APP_ENDPOINT}/api/file/upload`, params)
            .then(resolve)
            .catch(reject)
        })
    },

    deleteFileFromS3(_, params) {
        return new Promise((resolve, reject) => {
            axios.post(`http://${process.env.VUE_APP_ENDPOINT}/api/file/delete`, params)
            .then(resolve)
            .catch(reject)
        })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
  