import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

// ESTILOS 
import './assets/css/normalize.css'
import './assets/css/style.css'

// IMPORT DE SWEETALERT2
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// AXIOS
axios.defaults.baseURL = "http://127.0.0.1:8000/api/"
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('access_token')

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requireAuth)) {
        if (!store.getters.loggedIn) {
            next ({
                name : 'Login'
            });
        } else {
            next();
        }
    } else {
        next();
    }
});
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requireAuth) == false) {
        if (store.getters.loggedIn) {
            next ({
                name : 'Home'
            });
        } else {
            next();
        }
    } else {
        next();
    }
});

createApp(App)
.use(store)
.use(router)
.use(VueSweetalert2)
.mount('#app')
