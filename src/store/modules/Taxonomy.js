import axios from 'axios'

const state = {
  taxonomyVocabulary: [],
  taxonomyTerms: [],
  currentVocabularyId: null
}

const getters = {
  getTaxonomyVocabulary(state) {
    return state.taxonomyVocabulary
  },
  getTaxonomyTerms(state) {
    return state.taxonomyTerms
  },
  getCurrentVocabularyId(state) {
    return state.currentVocabularyId
  }
}

const mutations = {
  setTaxonomyVocabulary: (state, payload) => {
    state.taxonomyVocabulary = payload
  },
  setTaxonomyTerms: (state, payload) => {
    state.taxonomyTerms = payload
  },
  setCurrentVocabularyId: (state, id) => {
    state.currentVocabularyId = id
  }
}

const actions = {
  setCurrentVocabularyId({ commit }, id) {
    commit('setCurrentVocabularyId', id)
  },
  setTaxonomyVocabularies({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/taxonomy/vocabulary`).then(({ data }) => {
        commit('setTaxonomyVocabulary', data)
        resolve(data)
      }).catch(e => reject(e))
    })
  },
  setTaxonomyTerms({ commit, state }) {
    return new Promise((resolve, reject) => {
      axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/taxonomy/terms/${state.currentVocabularyId}`).then(({ data }) => {
        commit('setTaxonomyTerms', data)
        resolve(data)
      }).catch(e => reject(e))
    })
  },
  createVocabulary({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/taxonomy/vocabulary`, payload).then(({ data }) => {
        resolve(data)
      }).catch(e => reject(e))
    })
  },
  createTerm({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/taxonomy/terms`, payload).then(({ data }) => {
        resolve(data)
      }).catch(e => reject(e))
    })
  },
  deleteVocabulary({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios.delete(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/taxonomy/vocabulary/${id}`).then(({ data }) => {
        resolve(data)
      }).catch(e => reject(e))
    })
  },
  deleteTerm({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios.delete(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/taxonomy/terms/${id}`).then(({ data }) => {
        resolve(data)
      }).catch(e => reject(e))
    })
  },
  editVocabulary({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.put(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/taxonomy/vocabulary/${payload.id}`, payload).then(({ data }) => {
        resolve(data)
      }).catch(e => reject(e))
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