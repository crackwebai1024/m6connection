import axios from 'axios'
import { dataGet } from '@/utils/helpers'

const state = {
  AccessToken: '',
  IdToken: '',
  exp: '',
  user: {},
  statusColors: {
    PENDING: '#e3aa27',
    ACTIVE: '#59cf51',
    INACTIVE: '#bf2121'
  }
}

const getters = {
  loggedIn(state) {
    return (state.exp * 1000) >= +new Date()
  },
  getUser(state) {
    return state.user
  },
  getCurrentUserCompanies(state) {
    return dataGet(state, 'user.companies.items', [])
  },
  getAccessToken(state) {
    return state.AccessToken
  }
}

const mutations = {
  setTokens(state, payload) {
    state.AccessToken = payload.AccessToken
    state.IdToken = payload.IdToken
    state.exp = payload.exp
    window.localStorage.setItem('m6Token', JSON.stringify(payload))
  },
  setUser(state, payload) {
    state.user = payload
  },
  logoutUser(state) {
    state.AccessToken = ''
    state.IdToken = ''
    state.exp = ''
    state.user = {}
    window.localStorage.removeItem('m6Token')
  }
}

const actions = {
  getUserData({ state, commit, dispatch }) {
    return new Promise((resolve, reject) => {
      const { IdToken } = state
      axios.post(`http://${process.env.VUE_APP_ENDPOINT}/api/user`, {
        IdToken
      })
        .then(res => {
          const activeCompanies = res.data.companies.items.filter(c => c.joinStatus === 'ACTIVE')

          // if empty as in they have not been acepted by any company, send back to signin with error
          if (!activeCompanies.length) {
            dispatch('SnackBarNotif/notifDanger', 'Please wait to be accepted by your company to start', {
              root: true
            })
            commit('logoutUser')
            reject('Please wait to be accepted by your company to start')
          } else {
            const companyRel = res.data.companies.items.find(c => c.active)
            dispatch('Companies/getCompanyByID', companyRel.company.id, {
              root: true
            })
            commit('setUser', res.data)
          }

          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  searchForToken({ commit }) {
    const str = window.localStorage.getItem('m6Token')
    if (str) {
      const m6token = JSON.parse(str)
      commit('setTokens', m6token)
    }
  },
  signUp(context, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`http://${process.env.VUE_APP_ENDPOINT}/api/auth/signup`, payload)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  confirmCode(context, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`http://${process.env.VUE_APP_ENDPOINT}/api/auth/confirmSignup`, payload)
        .then(res => {
          resolve(res)
        })
        .catch(reject)
    })
  },
  signin({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`http://${process.env.VUE_APP_ENDPOINT}/api/auth/signin`, payload)
        .then(res => {
          commit('setTokens', res.data)
          resolve(res.data)
        })
        .catch(err => {
          reject(dataGet(err, 'response.data'))
        })
    })
  },
  confirmPasswordReset(context, params) {
    return new Promise((resolve, reject) => {
      axios.post(`http://${process.env.VUE_APP_ENDPOINT}/api/auth/confirmPasswordReset`, params)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(dataGet(err, 'response.data'))
        })
    })
  },
  startPasswordReset(context, email) {
    return new Promise((resolve, reject) => {
      axios.post(`http://${process.env.VUE_APP_ENDPOINT}/api/auth/startPasswordReset`, {
        email
      })
        .then(resolve)
        .catch(err => {
          reject(dataGet(err, 'response.data'))
        })
    })
  },
  updateUserData({ commit, state, dispatch }, user) { // update user in dynamo
    return new Promise((resolve, reject) => {
      axios.put(`http://${process.env.VUE_APP_ENDPOINT}/api/user`, { user })
        .then(res => {
          const data = res.data

          if (state.user.id === data.id) {
            data.companies = state.user.companies
            commit('setUser', data)
          } else {
            const companyRel = state.user.companies.items.find(c => c.active)
            dispatch('Companies/getCompanyByID', companyRel.company.id, {
              root: true
            })
          }
          resolve(res)
        })
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
