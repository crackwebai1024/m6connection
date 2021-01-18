import axios from 'axios'
import { dataGet } from '@/utils/helpers'

const state = {
  list: [],
  currentCompany: {},
  companyInsuranceStatus: [
    { label: 'Bondable', val: 'BONDABLE' },
    { label: 'Bonded', val: 'BONDED' },
    { label: 'Insured', val: 'INSURED' }
  ],
  locationTypes: [
    { label: 'Main Location', value: 'main-location' },
    { label: 'Headquarters', value: 'headquarters' },
    { label: 'Branch', value: 'branch' },
    { label: 'Division', value: 'division' },
    { label: 'Remote Location', value: 'remote-location' },
    { label: 'Subsidiary', value: 'subsidiary' },
    { label: 'Region', value: 'region' },
    { label: 'Administrative', value: 'administrative' },
    { label: 'Trailer', value: 'trailer' },
    { label: 'Department', value: 'department' },
    { label: 'Field Office', value: 'field-office' }
  ]
}

const getters = {
  getCurrentCompanyUsers(state) {
    return dataGet(state, 'currentCompany.users.items', [])
  }
}

const mutations = {
  setCompanyList(state, payload) {
    state.list = payload
  },
  setCurrentCompany(state, payload) {
    state.currentCompany = payload
    if (process.env.VUE_APP_COMPANY_ID) {
      state.currentCompany.id = process.env.VUE_APP_COMPANY_ID
    }
  }
}

const actions = {
  getList({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`http://${process.env.VUE_APP_ENDPOINT}/api/companies`)
        .then(res => {
          resolve(res)
          commit('setCompanyList', res.data.items)
        })
        .catch(err => reject(err))
    })
  },
  getCompanyByID({ commit }, companyID) {
    return new Promise((resolve, reject) => {
      axios.get(`http://${process.env.VUE_APP_ENDPOINT}/api/companies/company/${companyID}`)
        .then(res => {
          commit('setCurrentCompany', res.data)
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  updateUserCompany(context, userCompany) {
    return new Promise((resolve, reject) => {
      axios.put(`http://${process.env.VUE_APP_ENDPOINT}/api/companies/userCompany`, {
        userCompany
      })
        .then(res => {
          resolve(res)
        })
        .catch(reject)
    })
  },
  createUserCompany({ rootState }, data) {
    data.userID = rootState.Auth.user.id
    return new Promise((resolve, reject) => {
      axios.post(`http://${process.env.VUE_APP_ENDPOINT}/api/companies/userCompany`, data)
        .then(resolve)
        .catch(reject)
    })
  },
  switchCompanies({ dispatch }, params) {
    return new Promise((resolve, reject) => {
      axios.put(`http://${process.env.VUE_APP_ENDPOINT}/api/companies/switchCompanies`, params)
        .then(res => {
          dispatch('Auth/getUserData', {}, { root: true })
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  updateCompany({ state, commit }, company) {
    return new Promise((resolve, reject) => {
      axios.put(`http://${process.env.VUE_APP_ENDPOINT}/api/companies`, {
        company
      })
        .then(res => {
          let currentCompany = { ...res.data.data.updateCompany, users:  state.currentCompany.users || []}

          commit('setCurrentCompany', currentCompany)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
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
