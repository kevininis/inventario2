import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from './../views/login.vue'
import NuevoUsuario from './../views/NuevoUsuario.vue'
import Clientes from './../views/Clientes.vue'
import Proveedores from './../views/Proveedores.vue'
import Compras from './../views/Compras.vue'
import Ventas from './../views/Ventas.vue'
import Productos from './../views/Productos.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta : {
      requireAuth : true
    }
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login
  },
  {
    path: '/NuevoUsuario',
    name: 'NuevoUsuario',
    component: NuevoUsuario,
    meta : {
      requireAuth : false
    }
  },
  {
    path: '/Clientes',
    name: 'Clientes',
    component: Clientes,
    meta : {
      requireAuth : true
    }
  },
  {
    path: '/Proveedores',
    name: 'Proveedores',
    component: Proveedores,
    meta : {
      requireAuth : true
    }
  },
  {
    path: '/Compras',
    name: 'Compras',
    component: Compras,
    meta : {
      requireAuth : true
    }
  },
  {
    path: '/Ventas',
    name: 'Ventas',
    component: Ventas,
    meta : {
      requireAuth : true
    }
  },
  {
    path: '/Productos',
    name: 'Productos',
    component: Productos,
    meta : {
      requireAuth : true
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
