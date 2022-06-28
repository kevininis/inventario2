<template>
    <div>
        <div class="sidebar">
            <h3 class="sidebar-title">Clientes</h3>
            <br>
            <span class="buscar">
                Buscar:
            </span>

            <input @change="ListarClientes()" v-model="Busqueda.Nombre" class="input-sidebar" type="text" placeholder="Nombre">
            <input @change="ListarClientes()" v-model="Busqueda.NIT" class="input-sidebar" type="text" placeholder="NIT">
            <input @change="ListarClientes()" v-model="Busqueda.Telefono" class="input-sidebar" type="number" placeholder="Telefono">
            <input @change="ListarClientes()" v-model="Busqueda.Correo" class="input-sidebar" type="text" placeholder="Correo">
            
            <div class="listado-sidebar">
                <div v-for="(data, index) in Clientes" :key="index" @dblclick="SeleccionarCliente(data); AsignarClienteSeleccionado(data)" class="listado-item">
                    <!-- aquí irían los id de los clientes -->
                    {{data.CL_IdCliente}} {{data.CL_NombreCliente}}
                </div>
            </div>
        </div>  

        <div class="content">
            <div class="content-content">
                <form @submit.prevent="NuevoCliente()">
                    <span class="item-content inline">
                        Nombres
                    </span>
                    <span class="item-content inline inline-r">
                        Apellidos
                    </span>
                    <input v-model="Cliente.Nombres" class="input-content medio" type="text" :disabled="Disabled ? true : false" autofocus required>
                    <input v-model="Cliente.Apellidos" class="input-content medio medio-r" type="text" :disabled="Disabled ? true : false" required>

                    <span class="item-content inline">
                        Telélefono
                    </span>
                    <span class="item-content inline -ml">
                        Correo&nbsp;&nbsp;&nbsp;
                    </span>
                    <input v-model="Cliente.Telefono" class="input-content medio" type="number" :disabled="Disabled ? true : false" required>
                    <input v-model="Cliente.Correo" class="input-content medio medio-r" type="text" :disabled="Disabled ? true : false" required>

                    <span class="item-content inline">
                        Dirección
                    </span>
                    <span class="item-content inline inline-r">
                        NIT
                    </span>
                    <textarea v-model="Cliente.Direccion" class="textarea-content-medio" :disabled="Disabled ? true : false"></textarea>
                    <input v-model="Cliente.NIT" class="input-content medio medio-r up" type="number" :disabled="Disabled ? true : false" required>
                    
                    <br>

                    <span class="item-content inline">
                        Ciudad
                    </span>
                    <span class="item-content inline inline-r ml">
                        País
                    </span>
                    <input v-model="Cliente.Ciudad" class="input-content medio" type="text" :disabled="Disabled ? true : false" required>
                    <input v-model="Cliente.Pais" class="input-content medio medio-r" type="text" :disabled="Disabled ? true : false" required>

                    <button v-if="Disabled" @click="CrearNuevoCliente()" class="button new-button">Nuevo</button>
                    <button v-if="!Disabled&&!ModificarCli" type="submit" class="button save-button">Guardar</button>
                    <button v-if="ModificarCli" @click="ModificarCliente()" type="button" class="button save-button">Guardar Modificación</button>
                    <button v-if="!ModificarCli" @click="Modificar()" :disabled="!Disabled ? true : false" type="button" class="button modify-button">Modificar</button>
                    <button v-if="ModificarCli" @click="Modificar(); Cancelar()" type="button" class="button delete-button">Cancelar</button>
                    <button v-if="!ModificarCli" @click="EliminarCliente()" :disabled="!Disabled ? true : false" type="button" class="button delete-button">Eliminar</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'Clientes',
    mounted () {
        this.ListarClientes();
    },
    data : () => ({
        Cliente : {
            Id : '',
            Nombres : '',
            Apellidos : '',
            Telefono : '',
            Correo : '',
            Direccion : '',
            NIT : '',
            Ciudad : '',
            Pais : ''
        },
        Busqueda : {
            Nombre : '',
            NIT : '',
            Telefono : '',
            Correo : ''
        },
        Clientes : [],
        Disabled : false,
        ModificarCli : false,
        ClienteSeleccionado : {}
    }),
    methods : {
        NuevoCliente () {
            axios.post('NuevoCliente', this.Cliente)
            .then(response => {
                if (response.status == 201) {
                    this.$swal({
                        icon: 'success',
                        title: response.data.message,
                    });
                    this.Cliente = {
                        Id : '',
                        Nombres : '',
                        Apellidos : '',
                        Telefono : '',
                        Correo : '',
                        Direccion : '',
                        NIT : '',
                        Ciudad : '',
                        Pais : ''
                    }
                    this.ListarClientes();
                }
            })
            .catch (err => {
                this.$swal({
                    icon: 'error',
                    title: err.response.data.message,
                });
                console.log(err.response);
            });
        },
        ListarClientes () {  
            axios.post('ListarClientes', this.Busqueda)
            .then(response => {
                if (response.status == 200) {
                    this.Clientes = response.data.Clientes
                    console.log(response.data);
                }
            })
            .catch(err => {
                this.$swal({
                    icon: 'error',
                    title: 'Error al listar los clientes',
                });
                console.log(err);
            })
        },
        CrearNuevoCliente () {
            this.Disabled = false;
            this.Cliente = {
                Id : '',
                Nombres : '',
                Apellidos : '',
                Telefono : '',
                Correo : '',
                Direccion : '',
                NIT : '',
                Ciudad : '',
                Pais : ''
            }
        },
        SeleccionarCliente (data) {
            this.Cliente = {
                Id : data.CL_IdCliente,
                Nombres : data.CL_NombreCliente,
                Apellidos : data.CL_ApellidosCliente,
                Telefono : data.CL_TelefonoCliente,
                Correo : data.CL_CorreoCliente,
                Direccion : data.CL_DireccionCliente,
                NIT : data.CL_NITCliente,
                Ciudad : data.CL_CiudadCliente,
                Pais : data.CL_PaisCliente
            }
            this.Disabled = true;
        },
        AsignarClienteSeleccionado (data) {
            this.ClienteSeleccionado = data
        },
        Modificar () {
            if (this.ModificarCli == false) {
                this.ModificarCli = true;

            } else {
                this.ModificarCli = false;

            }
            if (this.Disabled == false) {
                this.Disabled = true;
            } else {
                this.Disabled = false;
            }
        },
        Cancelar () {
            this.SeleccionarCliente(this.ClienteSeleccionado);
        },
        ModificarCliente () {
            axios.post('ModificarCliente', this.Cliente)
            .then(response => {
                if(response.status == 200) {
                    this.$swal({
                        icon: 'success',
                        title: response.data.message,
                    });
                    this.Modificar();
                    this.ListarClientes();
                }
            })
            .catch(err => {
                this.$swal({
                    icon: 'error',
                    title: err.response.data.message,
                });
            })
        },
        EliminarCliente () {
            this.$swal({
                icon: 'warning',
                title: '¿Está seguro que quieres eliminar este Cliente',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si'
            })
            .then((result) => {
                if(result.isConfirmed) {
                    axios.post('EliminarCliente', this.Cliente)
                    .then(response => {
                        if (response.status == 200) {
                            this.$swal({
                                icon: 'success',
                                title: response.data.message,
                            });
                            this.ListarClientes();
                            this.Modificar();
                            this.CrearNuevoCliente();
                            this.ModificarCli = false;
                        }
                    })
                    .catch(err => {
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