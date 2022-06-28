<template>
    <div>
        <div class="login">
            <span class="login-title">
                Login
            </span>
            <form @submit.prevent="login()">
                <input v-model="Login.Correo" type="text" class="input-correo" placeholder="CORREO">
                <input v-model="Login.Contrasenia" type="password" class="input-contrasenia" placeholder="CONTRASEÑA">
                <button type="submit" class="login-button">Iniciar sesión</button>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'login',
    data : () => ({
        Login : {
            Correo : '',
            Contrasenia : ''
        }
    }),
    methods : {
        login () {
            this.$store.dispatch('retriveToken', this.Login)
            .then(() => {
                this.$router.push('/');
                this.$emit('Login', true);
            })
            .catch(err => {
                this.$swal({
                    icon : 'error',
                    title : err.response.data.message || 'Usuario o correo incorrecto'
                })
            })
        }

    }

}
</script>