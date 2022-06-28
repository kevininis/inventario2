import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    Token : localStorage.getItem('access_token') || null,
    type : localStorage.getItem('type_token')
  },
  getters: {
    loggedIn(stateVue) {
      return stateVue.Token !== null
    }
  },
  mutations: {
    retriveToken(stateVue, token) {
      stateVue.Token = token;
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    },
    destroyToken(stateVue) {
      stateVue.Token = null;
    }
  },
  actions: {
    retriveToken(context, credentials) {
      return new Promise((resolve, reject) => {
        axios.post('Login', credentials)
        .then(response => {
          console.log(response);
          const tokenAccess = response.data.access_token;
          const typeToken = response.data.token_type;
          
          localStorage.setItem('type_token', typeToken);
          localStorage.setItem('access_token', tokenAccess);
          context.commit('retriveToken', tokenAccess);
          resolve(response.data);
        })
        .catch(err => {
          reject(err);
          console.log(err);
        })
      });
    },
    destroyToken(context) {
      if (context.getters.loggedIn) {
        return new Promise((resolve, reject) => {
          axios.post('Logout')
          .then(response => {
            localStorage.removeItem('type_token');
            localStorage.removeItem('access_token');
            context.commit('destroyToken');
            resolve(response.data);
          })
          .catch(err => {
            reject(err);
          })
        });
      }
    }
  },
  modules: {
  }
})
