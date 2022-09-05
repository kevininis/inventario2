<template>
    <div>
        <div class="sidebar">
            <h3 class="sidebar-title">Proveedores</h3>
            <br>
            <span class="buscar">
                Buscar:
            </span>

            <input @change="ListarProveedores()" v-model="Busqueda.Nombre" class="input-sidebar" type="text" placeholder="Nombre">
            <input @change="ListarProveedores()" v-model="Busqueda.Telefono" class="input-sidebar" type="number" placeholder="Telefono">
            <input @change="ListarProveedores()" v-model="Busqueda.Correo" class="input-sidebar" type="text" placeholder="Correo">
            
            <div class="listado-sidebar">
                <div v-for="(data, index) in Proveedores" :key="index" @dblclick="SeleccionarProveedor(data); AsignarProveedorSeleccionado(data)" class="listado-item">
                    <!-- aquí irían los id de los proveedores -->
                    {{data.PR_NombreProveedor}}
                </div>
            </div>
        </div>

        <div class="content">
                <div class="content-content">
                    <form @submit.prevent="NuevoProveedor()">
                        <span class="item-content">
                            Nombre
                        </span>
                        <input v-model="Proveedor.Nombre" class="input-content lleno" type="text" :disabled="Disabled ? true : false" autofocus required>

                        <span  class="item-content inline">
                            Teléfono
                        </span>

                        <span class="item-content inline inline-r">
                            Correo
                        </span>
                        <input v-model="Proveedor.Telefono" class="input-content medio" type="number" :disabled="Disabled ? true : false" required>
                        <input v-model="Proveedor.Correo" class="input-content medio medio-r" type="email" :disabled="Disabled ? true : false" required>

                        <span class="item-content inline">
                            Dirección
                        </span>
                        <textarea v-model="Proveedor.Direccion" class="textarea-content" :disabled="Disabled ? true : false" required></textarea>

                        <span class="item-content inline">
                            Ciudad&nbsp;&nbsp;&nbsp; <!-- el &nbsp; es un espacio en blanco -->
                        </span>

                        <span class="item-content inline inline-r">
                            &nbsp;&nbsp;País
                        </span>
                        <input v-model="Proveedor.Ciudad" class="input-content medio" type="text" :disabled="Disabled ? true : false" required>
                        <input v-model="Proveedor.Pais" class="input-content medio medio-r" type="text" :disabled="Disabled ? true : false" required>

                        <button v-if="Disabled" @click="CrearNuevoProveedor()" class="button new-button">Nuevo</button>
                        <button v-if="!Disabled&&!ModificarPro" type="submit" class="button save-button">Guardar</button>
                        <button v-if="ModificarPro" @click="ModificarProveedor()" type="button" class="button save-button">Guardar Modificación</button>
                        <button v-if="!ModificarPro" @click="Modificar()" :disabled="!Disabled ? true : false" type="button" class="button modify-button">Modificar</button>
                        <button v-if="ModificarPro" @click="Modificar(); Cancelar()" type="button" class="button delete-button">Cancelar</button>
                        <button v-if="!ModificarPro" @click="EliminarProveedor()" :disabled="!Disabled ? true : false" type="button" class="button delete-button">Eliminar</button>
                    </form>
                </div>
            </div>

    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'Proveedores',
    mounted () {
        this.ListarProveedores()
    },
    data : () => ({
        Proveedor : {
            Id : '',
            Nombre : '',
            Telefono : '',
            Correo : '',
            Direccion : '',
            Ciudad : '',
            Pais : ''
        },
        Proveedores : [],
        Disabled : false,
        Busqueda : {
            Nombre : '',
            Telefono : '',
            Correo : ''
        },
        ProveedorSeleccionado : {},
        ModificarPro : false,
    }),
    methods : {
        NuevoProveedor () {
            axios.post('NuevoProveedor', this.Proveedor)
            .then(response => {
                if (response.status == 201) {
                    this.$swal({
                        icon: 'success',
                        title: response.data.message,
                    });
                    this.Proveedor =  {
                        Id : '',
                        Nombre : '',
                        Telefono : '',
                        Correo : '',
                        Direccion : '',
                        Ciudad : '',
                        Pais : ''
                    }
                }
                this.ListarProveedores();
            })
            .catch(err => {
                this.$swal({
                    icon: 'error',
                    title: err.response.data.message,
                });
            })
        },
        ListarProveedores () {  
            axios.post('ListarProveedores', this.Busqueda)
            .then(response => {
                if (response.status == 200) {
                    this.Proveedores = response.data.Proveedores
                }
            })
            .catch(err => {
                this.$swal({
                    icon: 'error',
                    title: 'Error al listar los proveedores',
                });
                console.log(err);
            })
        },
        SeleccionarProveedor (data) {
            this.Proveedor =  {
                Id : data.PR_IdProveedor,
                Nombre : data.PR_NombreProveedor,
                Telefono : data.PR_TelefonoProveedor,
                Correo : data.PR_CorreoProveedor,
                Direccion : data.PR_DireccionProveedor,
                Ciudad : data.PR_CiudadProveedor,
                Pais : data.PR_PaisProveedor
            };
            this.Disabled = true;
            
        },
        AsignarProveedorSeleccionado (data) {
            this.ProveedorSeleccionado = data;
        }
        ,
        CrearNuevoProveedor () {
            this.Disabled = false;
            this.Proveedor =  {
                Id : '',
                Nombre : '',
                Telefono : '',
                Correo : '',
                Direccion : '',
                Ciudad : '',
                Pais : ''
            }
        },
        Modificar () {
            if (this.ModificarPro == false) {
                this.ModificarPro = true;

            } else {
                this.ModificarPro = false;

            }
            if (this.Disabled == false) {
                this.Disabled = true;
            } else {
                this.Disabled = false;
            }
        },
        ModificarProveedor () {
            axios.post('ModificarProveedor', this.Proveedor)
            .then(response => {
                if(response.status == 200) {
                    this.$swal({
                        icon: 'success',
                        title: response.data.message,
                    });
                    this.Modificar();
                    this.ListarProveedores();
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
            this.SeleccionarProveedor(this.ProveedorSeleccionado);
        },
        EliminarProveedor () {
            this.$swal({
                icon: 'warning',
                title: '¿Está seguro que quieres eliminar este proveedor',
                text : 'Si borras este proveedor también se borrarán los registros de ventas en los que aparezca',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si'
            })
            .then((result) => {
                if(result.isConfirmed) {
                    axios.post('EliminarProveedor', this.Proveedor)
                    .then(response => {
                        if (response.status == 200) {
                            this.$swal({
                                icon: 'success',
                                title: response.data.message,
                            });
                            this.ListarProveedores();
                            this.Modificar();
                            this.CrearNuevoProveedor();
                            this.ModificarPro = false;
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