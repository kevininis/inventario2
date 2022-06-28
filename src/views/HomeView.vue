<template>
  <div class="home">
    <router-link to="/Proveedores">
      <span class="material-symbols-outlined storefront home-over">
        storefront
      </span>
      <span class="home-proveedores">
        Proveedores
      </span>
    </router-link>
    <router-link to="/Compras">
      <span class="material-symbols-outlined shopping_cart home-over">
        shopping_cart
      </span>
      <span class="home-compras">
        Compras
      </span>
    </router-link>
    <router-link to="/Productos">
      <span class="material-symbols-outlined apps home-over">
        apps
      </span>
      <span class="home-inventario">
        Inventario
      </span>
    </router-link>
    <router-link to="/Ventas">
      <span class="material-symbols-outlined shopping_bag home-over">
        shopping_bag
      </span>
      <span class="home-ventas">
        Ventas
      </span>
    </router-link>
    <router-link to="/Clientes">
      <span class="material-symbols-outlined person home-over">
        person
      </span>
      <span class="home-clientes">
        Clientes
      </span>
    </router-link>
  </div>
</template>

<script>


export default {
  name: 'Home',
  components: {

  }
}
</script>
