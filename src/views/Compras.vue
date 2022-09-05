<template>
    <div>
        <div class="sidebar">
            <h3 class="sidebar-title">Compras</h3>
            <br>
            <span class="buscar">
                Buscar:
            </span>

            <input @change="ListarCompras()" v-model="Buscar.NumeroOrden" class="input-sidebar" type="text" placeholder="# de compra">
            <input @change="ListarCompras()" v-model="Buscar.FechaOrden" class="input-sidebar" type="date">
            <select @change="ListarCompras()" v-model="Buscar.ProveedorOrden" class="input-sidebar">
                <option value="">--Seleccione un proveedor--</option>
                <option v-for="(data, index) in Proveedores" :key="index" :value="data.PR_IdProveedor">{{data.PR_NombreProveedor}}</option>
            </select>
            <select @change="ListarCompras()" v-model="Buscar.EstadoOrden" class="input-sidebar">
                <option value="">--Seleccione un estado---</option>
                <option v-for="(data, index) in Estados" :key="index" :value="data.EST_IdEstado">{{data.EST_NombreEstado}}</option>
            </select>
            
            <div class="listado-sidebar">
                <div @dblclick="SeleccionarCompra(data)" v-for="(data, index) in Compras" :key="index" class="listado-item">
                    <!-- aquí irían los id de las ordenes -->
                    # {{data.OC_IdOrdenCompra}}
                </div>
            </div>
        </div>

        <div class="content">
            <form>
                <span class="item-compras">
                    Proveedor<b style="color: red">*</b>
                </span>
                <span class="item-compras item-compras-fecha">
                    Fecha<b style="color: red">*</b>
                </span>
                <select v-model="OrdenCompra.Proveedor" class="input-productos" :disabled="!Disabled ? true : false">
                    <option value="">--Seleccione un proveedor--</option>
                    <option v-for="(data, index) in Proveedores" :key="index" :value="data.PR_IdProveedor">{{data.PR_NombreProveedor}}</option>
                </select>
                <input v-model="OrdenCompra.Fecha" class="input-productos input-r" type="date" :disabled="!Disabled ? true : false">

                <span class="item-compras">
                    Tipo de pago<b style="color: red">*</b>
                </span>
                <span class="item-compras item-compras-comentario">
                    Comentario
                </span>
                <select v-model="OrdenCompra.TipoPago" class="input-productos" :disabled="!Disabled ? true : false">
                    <option value="">--Seleccione un tipo de pago--</option>
                    <option v-for="(data, index) in TipoPago" :key="index" :value="data.TP_IdTipoPago">{{data.TP_NombreTipoPago}}</option>
                </select>
                <input v-model="OrdenCompra.Comentario" class="input-productos input-r" type="text" :disabled="!Disabled ? true : false">

                <button v-show="!Modal" @click="Modal=true" class="add-producto" type="button" :disabled="!Disabled ? true : false">Añadir producto</button>
                <button @click="Modal=false" v-show="Modal" class="cancel-producto" type="button">Cancelar</button>
                
                <table v-show="!Modal" class="table-compras">
                    <thead>
                        <tr>
                            <td>#</td>
                            <td>Nombre</td>
                            <td>cantidad</td>
                            <td>Precio</td>
                            <td>SubTotal</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(data, index) in ProductosSeleccionados" :key="index">
                            <td>{{index+1}}</td>
                            <td>{{data.PRO_NombreProducto}}</td>
                            <td>
                                <button @click="Restar(index)" class="RestarCompra" type="button" :disabled="!Disabled ? true : false">-</button>
                                {{data.Cantidad}}
                                <button @click="Sumar(index, data)" class="SumarCompra" type="button" :disabled="!Disabled ? true : false">+</button>    
                            </td>
                            <td>{{data.PRO_PrecioNormalProducto}}</td>
                            <td>{{parseFloat(data.SubTotal).toFixed(2)}}</td>
                            <td>
                                <Button @click="BorrarProducto(data.PRO_IdProducto)" type="button" class="cancel-producto" :disabled="!Disabled ? true : false">Borrar</Button>
                            </td>
                        </tr>
                        <tr> 
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>Total:</td>
                            <td>{{parseFloat(Total).toFixed(2)}}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="tablaCompras">
                <table v-show="Modal" class="table-compras">
                    <thead>
                        <tr>
                            <td>#</td>
                            <td>Nombre</td>
                            <td>Disponible</td>
                            <td>Precio</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr @dblclick="SeleccionarProducto(data); Modal = false" v-for="(data, index) in Productos" :key="index" class="item-producto-compra">
                            <td>{{index+1}}</td>
                            <td>{{data.PRO_NombreProducto}}</td>
                            <td>{{data.PRO_CantidadProducto}}</td>
                            <td>{{data.PRO_PrecioNormalProducto}}</td>
                            
                        </tr>
                    </tbody>
                </table>
                <button v-show="Nuevo" @click="NuevaCompra()" class="button-compra-save" type="button">Terminar</button>
                <button v-show="Modificar" @click="GuardarModificacion()" class="button-compra-save" type="button">Guardar Modificación</button>
                <button v-show="!Nuevo&&!Modificar" @click="NuevoRegistro(); Nuevo = true; Disabled = true" class="button-compra-save" type="button">Nuevo</button>
                <button v-show="!Modificar" @click="Disabled = true; ModificarCompra()" class="button-compra-modificar" type="button" :disabled="Disabled ? true : false">MODIFICAR</button>
                <button v-show="Modificar" @click="Modificar = false; nuevo = false" class="button-compra-cancelar" type="button">Cancelar</button>
                <button v-show="!Modificar" @click="BorrarDatos(); Modificar = false" class="button-compra-cancelar" type="button">Cancelar</button>
                <button v-show="Modificar" @click="EliminarCompra()" class="button-compra-cancelar" type="button">Eliminar Venta</button>

                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'Compras',
    mounted () {
        this.printDate();
        this.ListarProductos();
        this.ListarProveedores();
        this.ListarEstados();
        this.ListarTipoPago();
        this.ListarCompras();
    },
    data : () => ({
        OrdenCompra : {
            Id : '',
            Proveedor : '',
            Fecha : '',
            TipoPago : '',
            Comentario : ''
        },
        Productos : [],
        Busqueda : {
            Nombre : '',
        },
        Modal : false,
        Proveedores : [],
        Estados : [],
        TipoPago : [],
        ProductosSeleccionados : [],
        ProductosBorrados : [],
        Total : 0.00,
        Buscar : {
            NumeroOrden : '',
            FechaOrden : '',
            ProveedorOrden : '',
            EstadoOrden : ''
        },
        Compras : [],
        DetalleCompra : '',
        Nuevo : true,
        Disabled : true,
        Modificar : false,
        ProductosNuevos : []
    }),
    methods : {
        printDate () {
            this.OrdenCompra.Fecha = new Date().toISOString().split('T')[0];
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
        ListarProveedores () {  
            axios.post('ListarProveedores')
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
        ListarEstados () {  
            axios.get('ListarEstados')
            .then(response => {
                if (response.status == 200) {
                    this.Estados = response.data.Estados

                }
            })
            .catch(err => {
                this.$swal({
                    icon: 'error',
                    title: 'Error al listar los estados',
                });
                console.log(err);
            })
        },
        ListarTipoPago () {  
            axios.get('ListarTipoPago')
            .then(response => {
                if (response.status == 200) {
                    this.TipoPago = response.data.TipoPago
                }
            })
            .catch(err => {
                this.$swal({
                    icon: 'error',
                    title: 'Error al listar los tipos de pago',
                });
            })
        },
        SeleccionarProducto (data) {
            let codProducto = data.PRO_IdProducto;
            let indice = this.ProductosSeleccionados.findIndex(resp => resp.PRO_IdProducto == codProducto);
                if(indice == -1) {
                    data['Cantidad'] = 1;
                    data['SubTotal'] = data.PRO_PrecioNormalProducto;
                    this.ProductosSeleccionados.push(data);
                    data['Id'] = null;
                    this.ProductosNuevos.push(data);
                }
                if(indice != -1) {
                    data['index2'] = indice;
                    this.ProductosSeleccionados[indice].Cantidad++;
                    this.CalcularSubTotal(indice);
                    this.ProductosNuevos[indice].Cantidad++;
                }
        },
        CalcularSubTotal (Indice) {
            this.ProductosSeleccionados[Indice].SubTotal = this.ProductosSeleccionados[Indice].PRO_PrecioNormalProducto * this.ProductosSeleccionados[Indice].Cantidad
            this.CalcularTotal();
        },
        Sumar (Indice) {
            this.ProductosSeleccionados[Indice].Cantidad++; 
            this.CalcularSubTotal(Indice);
        },
        Restar (Indice) {
            if (this.ProductosSeleccionados[Indice].Cantidad > 1) {
                this.ProductosSeleccionados[Indice].Cantidad--;
            } else {
                this.$swal({
                    icon: 'error',
                    title: '¡No puedes pedir cero!',
                });
            }
            this.CalcularSubTotal(Indice);
        },
        BorrarProducto (id) {
            let Producto = this.ProductosSeleccionados.findIndex(resp => resp.PRO_IdProducto == id);
            let ProductoBorrado = this.ProductosSeleccionados[Producto];
            this.ProductosSeleccionados.splice(Producto, 1);
            this.ProductosBorrados.push(ProductoBorrado);
        },
        CalcularTotal() {
            this.Total = 0.00;
            this.ProductosSeleccionados.forEach((Producto, Indice) => {
                Producto.index = Indice;
                this.Total = parseFloat(this.Total) + parseFloat(Producto.SubTotal);
            })
        },
        BorrarDatos () {
            this.$swal({
                icon: 'warning',
                title: '¿Quieres borrar los datos?',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si'
            })
            .then((result) => {
                if(result.isConfirmed) {
                    this.OrdenCompra = {
                        Id : '',
                        Proveedor : '',
                        Fecha : '',
                        TipoPago : '',
                        Comentario : ''
                    },
                    this.ProductosSeleccionados = []
                    this.printDate();
                    this.Modal = false;
                    this.Nuevo = true;
                    this.Disabled = true;
                }
            })
        },
        NuevaCompra () {
            this.$swal({
                icon: 'warning',
                title: '¿Quieres confirmar la Compra?',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si'
            })
            .then((result) => {
                if(result.isConfirmed) {
                    if (this.OrdenCompra.Proveedor == '') {
                        this.$swal({
                            icon: 'error',
                            title: 'Debes seleccionar un proveedor',
                        });
                    }
                    else if (this.OrdenCompra.TipoPago == '') {
                        this.$swal({
                            icon: 'error',
                            title: 'Debes seleccionar un tipo de pago',
                        });
                    }
                    else if (this.ProductosSeleccionados == '') {
                        this.$swal({
                            icon: 'error',
                            title: 'Debes seleccionar al menos un producto',
                        });
                    }
                    else {
                        let data = {
                                OrdenCompra : this.OrdenCompra,
                                Detalle : this.ProductosSeleccionados
                                }

                        axios.post('NuevaCompra', data)
                        .then(response => {
                            if (response.status == 201) {
                                this.$swal({
                                    icon: 'success',
                                    title: 'Compra exitosa',
                                });
                            }
                        })
                        .catch(err => {
                            this.$swal({
                                icon: 'error',
                                title: 'Error en la Compra',
                            });
                            console.log(err);
                        })
                        this.OrdenCompra = {
                                Id : '',
                                Proveedor : '',
                                TipoPago : '',
                                Comentario : ''
                            }
                        this.ProductosSeleccionados = []
                        this.printDate();
                        this.ListarCompras();
                    }
                }
            })
        },
        BorrarDatos () {
            this.$swal({
                icon: 'warning',
                title: '¿Quieres borrar los datos?',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si'
            })
            .then((result) => {
                if(result.isConfirmed) {
                    this.OrdenCompra = {
                        Proveedor : '',
                        TipoPago : '',
                        Comentario : ''
                    }
                    this.ProductosSeleccionados = []
                    this.printDate();
                    this.Disabled = true;
                }
            })
        },
        ListarCompras () {
            axios.post('ListarCompras', this.Buscar)
            .then(response => {
                if (response.status == 200) {
                    this.Compras = response.data.Compras
                }
            })
            .catch(err => {
                this.$swal({
                    icon: 'error',
                    title: 'Error en al listar las compras',
                });
            })
        },
        SeleccionarCompra (data) {
            this.ProductosBorrados = [];
            this.ProductosNuevos = [];
            this.Nuevo = false;
            this.OrdenCompra = {
                Id : '',
                Proveedor : '',
                TipoPago : '',
                Comentario : ''
            }
            this.ProductosSeleccionados = []
            this.printDate();
            this.Disabled = false;
            this.Modificar = false;


            this.OrdenCompra.Id = data.OC_IdOrdenCompra;
            this.OrdenCompra.Proveedor = data.OC_IdProveedor;
            this.OrdenCompra.Fecha = data.OC_Fecha;
            this.OrdenCompra.TipoPago = data.OC_IdTipoPago;
            this.OrdenCompra.Comentario = data.OC_Comentario;

            let id = {id : data.OC_IdOrdenCompra}
            axios.post('DetalleCompra', id)
            .then(response => {
                if (response.status == 200) {
                    response.data.Detalle.forEach(resp => {
                        let data = {
                            Id : resp.DC_IdDetalleCompra,   
                            PRO_IdProducto : resp.producto.PRO_IdProducto,
                            PRO_NombreProducto : resp.producto.PRO_NombreProducto,
                            PRO_PrecioNormalProducto : resp.producto.PRO_PrecioNormalProducto,
                            Cantidad : resp.DC_Cantidad 
                        }
                        this.ProductosSeleccionados.push(data);
                        let indice = this.ProductosSeleccionados.findIndex(resp => resp.PRO_IdProducto == resp.PRO_IdProducto);
                        this.CalcularSubTotal(indice);
                        this.CalcularTotal();
                    })
                    
                }
            })
            .catch(err => {
                this.$swal({
                    icon: 'error',
                    title: 'Error en al seleccionar compra',
                    text : err
                });
                console.log(err);
            })
        },
        NuevoRegistro() {
            this.Nuevo = true;
            this.OrdenCompra = {
                Id: '',
                Proveedor : '',
                TipoPago : '',
                Comentario : ''
            }
            this.ProductosSeleccionados = []
            this.printDate();
        },
        ModificarCompra () {
            if (this.Modificar == false) {
                this.Modificar = true;

            } else {
                this.Modificar = false;

            }
        },
        GuardarModificacion() {
            let data = {
                OrdenCompra : this.OrdenCompra,
                Detalle : this.ProductosSeleccionados,
                Borrados : this.ProductosBorrados,
                Nuevos : this.ProductosNuevos
            }
            axios.post('ModificarCompra', data)
            .then(response => {
                if (response.status == 200) {
                    this.$swal({
                        icon: 'success',
                        title: response.data.message,
                    });
                }
                this.ListarCompras();
                this.ListarProductos();
                this.ProductosBorrados = [];
                this.ProductosNuevos = [];
                this.Modificar = false;
                this.Disabled = false;
                
                axios.post('DetalleCompra', {Id : this.OrdenCompra.Id})
                .then(response => {
                    if (response.status == 200) {
                        let detalles = [];
                        response.data.Detalle.forEach(resp => {
                            let data = {
                                Id : resp.DV_DetalleVenta,
                                PRO_IdProducto : resp.producto.PRO_IdProducto,
                                PRO_NombreProducto : resp.producto.PRO_NombreProducto,
                                PRO_PrecioNormalProducto : resp.producto.PRO_PrecioNormalProducto,
                                Cantidad : resp.DV_Cantidad 
                            }
                            detalles.push(data);
                            this.ProductosSeleccionados = detalles;
                            let indice = this.ProductosSeleccionados.findIndex(res => res.PRO_IdProducto ==resp.PRO_IdProducto);
                            this.CalcularSubTotal(indice);
                        })
                        this.Disabled = false; 
                        this.ProductosBorrados = [];
                        this.ProductosNuevos = [];
                        this.ListarProductos();
                    }
                })
                .catch(err => {
                    this.$swal({
                        icon: 'error',
                        title: err.response.data.message,
                    });
                })
            })
            .catch(err => {
                this.$swal({
                    icon: 'error',
                    title: 'error',
                    text: err.response.data.message,
                });
            })
        },
        EliminarCompra() {
            this.$swal({
                icon: 'warning',
                title: '¿Quieres eliminar la compra?',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si'
            })
            .then((result) => {
                if(result.isConfirmed) {

                    let data = {
                        IdVenta : this.OrdenCompra.Id,
                        DetalleCompra : this.ProductosSeleccionados,

                    }
                    axios.post('EliminarCompra', data)
                    .then(response => {
                        if (response.status == 200) {
                            this.$swal({
                                icon: 'success',
                                title: 'Venta eliminada correctamente',
                            });
                            this.ListarCompras();
                            this.ListarProductos();
                            this.ProductosBorrados = [];
                            this.ProductosNuevos = [];
                            this.Modificar = false;
                            this.Disabled = true;
                            this.Nuevo = true;
                            this.OrdenCompra = {
                                Id : '',
                                Proveedor : '',
                                TipoPago : '',
                                Comentario : ''
                            }
                            this.ProductosSeleccionados = []
                            this.printDate();
                        }
                    })
                    .catch(err => {
                        this.$swal({
                            icon: 'error',
                            title: 'Error en al eliminar la venta',
                            text : err
                        });
                        console.log(err);
                    })
                }
            })
        }
    }

}
</script>