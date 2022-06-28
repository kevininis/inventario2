<template>
    <div>
        <form @submit.prevent="RegistrarUsuario()">
            <div class="new-user">
                <span class="new-user--title">
                    Nuevo Usuario
                </span>
                <input v-model="NuevoUsuario.Nombres" class="new-user--input" type="text" placeholder="Nombres">
                <input v-model="NuevoUsuario.Apellidos" class="new-user--input" type="text" placeholder="Apellidos">
                <select v-model="NuevoUsuario.Rol" class="new-user--select">
                    <option value="">--Seleccione una opción--</option>
                    <option v-for="(data, index) in Roles" :key="index" :value="data.ROL_IdRoles">{{data.ROL_NombreRoles}}</option>
                </select>
                <input v-model="NuevoUsuario.Correo" class="new-user--input" type="text" placeholder="Correo">
                <input v-model="NuevoUsuario.Contrasenia" class="new-user--input" type="password" placeholder="Contrasenia">
                <button class="new-user--button">Registrar</button>
            </div>
            <br>
        </form>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'Registro',
    mounted () {
        this.TraerRoles();
    },
    data : () => ({
        NuevoUsuario : {
            Nombres : '',
            Apellidos : '',
            Rol : '',
            Correo : '',
            Contrasenia : '',
        },
        Roles : [] 
    }),
    methods : {
        TraerRoles () {
            axios.get('ListarRoles')
            .then(response => {
                if(response.status == 200) {
                    this.Roles = response.data.Roles
                }
                console.log(response.data.Roles);
            })
            .catch(err => {
                this.$swal({
                    icon: 'error',
                    title: err.data.message,
                });
                console.log('error');
            })
        },
        RegistrarUsuario () {
            axios.post('NuevoUsuario', this.NuevoUsuario)
            .then(response => {
                if(response.status == 201) {
                    this.$swal({
                        icon: 'success',
                        title: response.data.message,
                    });
                }
            })
            .catch(err => {
                this.$swal({
                    icon: 'error',
                    title: err.response.data.message,
                });
            })
        }
    }
}
</script>