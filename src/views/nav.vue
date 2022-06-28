<template>
    <div>
        <nav class="navbar">
            <span v-if="this.$route.path != '/'" @click="toggle()" class="material-symbols-outlined navbar-title">
                menu
            </span>
            <router-link v-if="this.$route.path != '/'" to="/">
                <span class="material-symbols-outlined navbar-title">
                    home
                </span>
            </router-link>

            <ul @click="toggle()" :class="menu ? 'items active' : 'items'">
                <li>
                    <router-link class="nav-link" to="/">Inicio</router-link>
                </li>
                <li>
                    <router-link class="nav-link" to="/Proveedores">Proveedores</router-link>
                </li>
                <li>
                    <router-link class="nav-link" to="/Compras">Compras</router-link>
                </li>
                <li>
                    <router-link class="nav-link" to="/Productos">Productos</router-link>
                </li>
                <li>
                    <router-link class="nav-link" to="/Ventas">Ventas</router-link>
                </li>
                <li>
                    <router-link class="nav-link" to="/Clientes">Clientes</router-link>
                </li>
            </ul>

            <div @click="Logout()">
                <span  class="material-symbols-outlined img-logout">
                        logout
                </span>
                </div>
        </nav>
    </div>
</template>

<script>
export default {
    name: 'nav',
    data : () => ({
        menu : 'false',
        home : false
    }),
    mounted () {
        
    },
    methods: {
        toggle () {
            if (this.menu == false) {
                this.menu = true
            } else {
                this.menu = false
            }
        },
        Logout () {
            this.$store.dispatch('destroyToken')
            .then(() => {
                this.$router.push('/Login');
                this.$emit('Logout', false);
            })
            .catch(err => {
                this.$swal({
                    icon : 'error',
                    text : err,
                    title : 'Error al cerrar sesión'
                })
            })
        }
    }
}
</script>