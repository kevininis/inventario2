<template>
    <div>
        <div class="sidebar">
            <h3 class="sidebar-title">Productos</h3>
            <br>
            <span class="buscar">
                Buscar:
            </span>

            <input @change="ListarProductos()" v-model="Busqueda.Nombre" class="input-sidebar" type="text" placeholder="Nombre">
            <select @change="ListarProductos()" v-model="Busqueda.Categoria" class="input-sidebar">
                <option value="">--Categoría--</option>
                <option v-for="(data, index) in Categorias" :key="index" :value="data.CP_IdCategoriaProducto">{{data.CP_NombreCategoriaProducto}}</option>
            </select>
            <select @change="ListarProductos()" v-model="Busqueda.Ubicacion" class="input-sidebar">
                <option value="">--Ubicación--</option>
                <option v-for="(data, index) in Ubicaciones" :key="index" :value="data.UP_IdUbicacionProducto">{{data.UP_NombreUbicacionProducto}}</option>
            </select>
            <div class="listado-sidebar">
                <div @dblclick="SeleccionarProducto(data); AsignarProductoSeleccionado(data)" v-for="(data, index) in Productos" :key="index" class="listado-item">
                    <!-- aquí irían los id de los Productos -->
                    {{data.PRO_IdProducto}} {{data.PRO_NombreProducto}}
                </div>
            </div>
        </div> 

        <div class="content">
            <div class="content-content">
                <form @submit.prevent="NuevoProducto()">
                    <span class="item-productos">
                        Nombre
                    </span>
                    <span class="item-productos item-productos--barras">
                        Código de Barras
                    </span>
                    <input v-model="Producto.Nombre" class="input-productos" type="text" :disabled="Disabled ? true : false" autofocus required>
                    <input v-model="Producto.CodigoBarras" class="input-productos input-r" type="number" :disabled="Disabled ? true : false">

                    <span class="item-productos">
                        Descripción
                    </span>
                    <span class="item-productos item-productos--categoria">
                        Categoría
                    </span>
                    <input v-model="Producto.Descripcion" class="input-productos" type="text" :disabled="Disabled ? true : false">
                    <select v-model="Producto.Categoria" class="input-productos input-r" :disabled="Disabled ? true : false" required>
                        <option value="">---Seleccione una categoría---</option>
                        <option v-for="(data, index) in Categorias" :key="index" :value="data.CP_IdCategoriaProducto">{{data.CP_NombreCategoriaProducto}}</option>
                    </select>

                    <span class="item-productos">
                        Ubicación
                    </span>
                    <span class="item-productos item-productos--cantidad">
                        Cantidad
                    </span>
                    <select v-model="Producto.Ubicacion" class="input-productos" :disabled="Disabled ? true : false" required>
                        <option value="">---Seleccione una ubicación---</option>
                        <option v-for="(data, index) in Ubicaciones" :key="index" :value="data.UP_IdUbicacionProducto">{{data.UP_NombreUbicacionProducto}}</option>
                    </select>


                    <button @click="Restar()" class="button-productos menos" type="button" :disabled="Disabled ? true : false">-</button>
                    <input v-model="Producto.Cantidad" class="input-cantidad" type="number" :disabled="Disabled ? true : false" required>
                    <button @click="Sumar()" class="button-productos" type="button" :disabled="Disabled ? true : false">+</button>
                    
                    <br>

                    <span class="item-productos-precio">
                        Precio Normal
                    </span>
                    <input v-model="Producto.PrecioNormal" class="input-precio-normal" type="number" step="any" :disabled="Disabled ? true : false" required>

                    <br>

                    <span class="item-productos-precio">
                        Precio Liquidación
                    </span>
                    <input v-model="Producto.PrecioLiquidacion" class="input-precio-liquidacion" type="number" step="any" :disabled="Disabled ? true : false">

                    <br>

                    <span class="item-productos-precio">
                        Precio Mayorista
                    </span>
                    <input v-model="Producto.PrecioMayorista" class="input-precio-mayorista" type="number" step="any" :disabled="Disabled ? true : false">

                    <br>

                    <span class="item-productos-precio">
                        Precio Oferta
                    </span>
                    <input v-model="Producto.PrecioOferta" class="input-precio-oferta" type="number" step="any" :disabled="Disabled ? true : false">
                   
                    <button v-if="Disabled" @click="CrearNuevoProducto()" class="button new-button-productos">Nuevo</button>
                    <button v-if="!Disabled&&!ModificarProducto" type="submit" class="button save-button-productos">Guardar</button>
                    <button v-if="ModificarProducto" @click="ModificarProductos()" type="button" class="button save-button-productos">Guardar Modificación</button>
                    <button v-if="!ModificarProducto" @click="Modificar()" :disabled="!Disabled ? true : false" type="button" class="button modify-button-productos">Modificar</button>
                    <button v-if="ModificarProducto" @click="Modificar(); Cancelar()" type="button" class="button cancel-button-productos">Cancelar</button>
                    <button v-if="!ModificarProducto" @click="EliminarProducto()" :disabled="!Disabled ? true : false" type="button" class="button delete-button-productos">Eliminar</button>
                </form>
            </div>
        </div>

    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'Productos',
    mounted () {
        this.ListarCategorias();
        this.ListarUbicaciones();
        this.ListarProductos();
    },
    data : () => ({
        Categorias : [],
        Ubicaciones : [],
        Busqueda : {
            Nombre : '',
            Categoria : '',
            Ubicacion : ''
        },
        Disabled : false,
        ModificarProducto : false,
        Producto : {
            Id : '',
            Nombre : '',
            CodigoBarras : '',
            Descripcion : '',
            Categoria : '',
            Ubicacion : '',
            Cantidad : '',
            PrecioNormal : '',
            PrecioLiquidacion : '',
            PrecioMayorista : '',
            PrecioOferta : '',
        },
        Productos : [],
        ProductoSeleccionado : {},
    }),
    methods : {
        ListarCategorias () {
            axios.get('ListarCategorias')
            .then(response => {
                if (response.status == 200) {
                    this.Categorias = response.data.Categorias;
                }
            })
            .catch(err => {
                this.$swal({
                    icon: 'error',
                    title: err.response.data.message,
                });
            })
        },
        ListarUbicaciones () {
            axios.get('ListarUbicaciones')
            .then(response => {
                if (response.status == 200) {
                    this.Ubicaciones = response.data.Ubicaciones;
                    console.log(response.data);
                }
            })
            .catch(err => {
                this.$swal({
                    icon: 'error',
                    title: err.response.data.message,
                });
            })
        },
        Sumar () {
            this.Producto.Cantidad++;
        },
        Restar () {
            if (this.Producto.Cantidad > 0) {
                this.Producto.Cantidad--;
            } else {
                this.$swal({
                    icon: 'error',
                    title: '¡No puedes utilizar un número negativo!',
                });
            }
        },
        NuevoProducto () {
            axios.post('NuevoPoducto', this.Producto)
            .then(response => {
                if (response.status == 201){
                    this.$swal({
                        icon: 'success',
                        title: response.data.message,
                    });
                    this.ListarProductos();
                    this.CrearNuevoProducto();
                }
            })
            .catch(err => {
                this.$swal({
                    icon: 'error',
                    title: err.response.data.message,
                });
            })
        },
        ListarProductos () {
            axios.post('ListarProductos', this.Busqueda)
            .then(response => {
                if (response.status == 200) {
                    this.Productos = response.data.Productos
                }
            })
            .catch(err => {
                this.$swal({
                    icon: 'error',
                    title: err.response.data.message,
                });
            })
        },
        SeleccionarProducto (data) {
            this.Producto = {
                Id : data.PRO_IdProducto,
                Nombre : data.PRO_NombreProducto,
                CodigoBarras : data.PRO_CodigoBarrasProducto,
                Descripcion : data.PRO_DescripcionProducto,
                Categoria : data.PRO_IdCategoriaProducto,
                Ubicacion : data.PRO_IdUbicacionProducto,
                Cantidad : data.PRO_CantidadProducto,
                PrecioNormal : data.PRO_PrecioNormalProducto,
                PrecioLiquidacion : data.PRO_PrecioLiquidacionProducto,
                PrecioMayorista : data.PRO_PrecioMayoristaProducto,
                PrecioOferta : data.PRO_PrecioOfertaProducto,
            }
            this.Disabled = true;
        },
        AsignarProductoSeleccionado (data) {
            this.ProductoSeleccionado = data;
        },
        CrearNuevoProducto () {
            this.Disabled = false;
            this.Producto = {
                Id : '',
                Nombre : '',
                CodigoBarras : '',
                Descripcion : '',
                Categoria : '',
                Ubicacion : '',
                Cantidad : '',
                PrecioNormal : '',
                PrecioLiquidacion : '',
                PrecioMayorista : '',
                PrecioOferta : '',
            }
        },
        Modificar () {
            if (this.ModificarProducto == false) {
                this.ModificarProducto = true;

            } else {
                this.ModificarProducto = false;

            }
            if (this.Disabled == false) {
                this.Disabled = true;
            } else {
                this.Disabled = false;
            }
        },
        ModificarProductos () {
            axios.post('ModificarProducto', this.Producto)
            .then(response => {
                if(response.status == 200) {
                    this.$swal({
                        icon: 'success',
                        title: response.data.message,
                    });
                    this.Modificar();
                    this.ListarProductos();
                }
            })
            .catch(err => {
                this.$swal({
                    icon: 'error',
                    title: err.response.data.message,
                });
            })
        },
        Cancelar () {
            this.SeleccionarProducto(this.ProductoSeleccionado);
        },
        EliminarProducto () {
            this.$swal({
                icon: 'warning',
                title: '¿Está seguro que quieres eliminar este producto?',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si'
            })
            .then((result) => {
                if(result.isConfirmed) {
                    axios.post('EliminarProducto', this.Producto)
                    .then(response => {
                        if (response.status == 200) {
                            this.$swal({
                                icon: 'success',
                                title: response.data.message,
                            });
                            this.ListarProductos();
                            this.Modificar();
                            this.CrearNuevoProducto();
                            this.ModificarProducto = false;
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        this.$swal({
                            icon: 'error',
                            title: err.response.data.message,
                        })
                    })
                }
            })
        }
    }
}
</script>