<template>
  <div id='app'>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
    <Navi v-if="Logueado" @Logout="VerifiLogin"></Navi>
    <router-view @Login="VerifiLogin"/>
  </div>
</template>

<script>
import Navi from './views/nav.vue'

export default {
  name: 'app',
  components : {
    Navi
  },
  data : () => ({
    Logueado : false,
    NombreUsuario : null,
    PrimerInicio : 0,
  }),
  mounted () {
    this.VerificarLogin();
  },
  methods : {
    VerificarLogin () {
      if (this.$store.getters.loggedIn) { 
        this.Logueado = true;
      } else {
        this.Logueado = false;
      }
      console.log(this.$store.getters.loggedIn);
    },
    VerifiLogin(newValue) {
      this.Logueado = newValue;
      this.VerificarLogin();
    },
  }
}
</script>


