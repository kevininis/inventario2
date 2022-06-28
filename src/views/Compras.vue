<template>
    <div>
        <div class="sidebar">
            <h3 class="sidebar-title">Compras</h3>
            <br>
            <span class="buscar">
                Buscar:
            </span>

            <input class="input-sidebar" type="text" placeholder="# de compra">
            <input class="input-sidebar" type="date">
            <select class="input-sidebar">
                <option value="">--Seleccione un proveedor--</option>
                <option v-for="(data, index) in Proveedores" :key="index" :value="data.PR_IdProveedor">{{data.PR_NombreProveedor}}</option>
            </select>
            <select class="input-sidebar">
                <option value="">--Seleccione un estado---</option>
                <option v-for="(data, index) in Estados" :key="index" :value="data.EST_IdEstado">{{data.EST_NombreEstado}}</option>
            </select>
            
            <div class="listado-sidebar">
                <div class="listado-item">
                    <!-- aquí irían los id de las ordenes -->
                    
                </div>
            </div>
        </div>

        <div class="content">
            <form>
                <span class="item-compras">
                    Proveedor
                </span>
                <span class="item-compras item-compras-fecha">
                    Fecha
                </span>
                <select v-model="OrdenCompra.Proveedor" class="input-productos">
                    <option value="">--Seleccione un proveedor--</option>
                    <option v-for="(data, index) in Proveedores" :key="index" :value="data.PR_IdProveedor">{{data.PR_NombreProveedor}}</option>
                </select>
                <input v-model="OrdenCompra.Fecha" class="input-productos input-r" type="date">

                <span class="item-compras">
                    Tipo de pago
                </span>
                <span class="item-compras item-compras-comentario">
                    Comentario
                </span>
                <select v-model="OrdenCompra.TipoPago" class="input-productos">
                    <option value="">--Seleccione un tipo de pago--</option>
                    <option v-for="(data, index) in TipoPago" :key="index" :value="data.TP_IdTipoPago">{{data.TP_NombreTipoPago}}</option>
                </select>
                <input v-model="OrdenCompra.Comentario" class="input-productos input-r" type="text">

                <button @click="Modal=true" class="add-producto" type="button">Añadir producto</button>
                <button @click="Modal=false" v-show="Modal" class="cancel-producto" type="button">Cancelar</button>
                
                <table v-show="!Modal" class="table-compras">
                    <thead>
                        <tr>
                            <td>#</td>
                            <td>Nombre</td>
                            <td>cantidad</td>
                            <td>Precio</td>
                            <td>SubTotal</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(data, index) in ProductosSeleccionados" :key="index">
                            <td>{{index+1}}</td>
                            <td>{{data.PRO_NombreProducto}}</td>
                            <td>
                                <button @click="Restar(index)" class="RestarCompra" type="button">-</button>
                                {{data.Cantidad}}
                                <button @click="Sumar(index, data)" class="SumarCompra" type="button">+</button>    
                            </td>
                            <td>{{data.PRO_PrecioNormalProducto}}</td>
                            <td>{{parseFloat(data.SubTotal).toFixed(2)}}</td>
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
                <button class="button-compra-save" type="button">Terminar</button>
                <button class="button-compra-cancelar" type="button">Cancelar</button>
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
        this.ListarTipoPago()
    },
    data : () => ({
        OrdenCompra : {
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
        Total : 0.00,

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
            if(data.PRO_CantidadProducto != 0) {
                if(indice == -1) {
                    data['Cantidad'] = 1;
                    data['SubTotal'] = data.PRO_PrecioNormalProducto;
                    this.ProductosSeleccionados.push(data);
                }
                // if(indice != -1) {

                //     data['index2'] = indice;
                //     this.ProductosSeleccionados[indice].Cantidad++;
                //     this.CalcularSubTotal(indice);
                // }
            }
        },
        CalcularSubTotal (Indice) {
            this.ProductosSeleccionados[Indice].SubTotal = this.ProductosSeleccionados[Indice].PRO_PrecioNormalProducto * this.ProductosSeleccionados[Indice].Cantidad
            this.CalcularTotal();
        },
        Sumar (Indice, data) {
            let Cantidad = this.Productos[this.Productos.findIndex(resp => resp.PRO_IdProducto == data.PRO_IdProducto)].PRO_CantidadProducto;
            if (this.ProductosSeleccionados[Indice].Cantidad < this.Productos[this.Productos.findIndex(resp => resp.PRO_IdProducto == data.PRO_IdProducto)].PRO_CantidadProducto) {
                this.ProductosSeleccionados[Indice].Cantidad++; 
            } else {
                this.$swal({
                    icon: 'error',
                    title: 'Solo tienes ' + Cantidad,
                });
            }
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
        CalcularTotal() {
            this.Total = 0.00;
            this.ProductosSeleccionados.forEach((Producto, Indice) => {
                Producto.index = Indice;
                this.Total = parseFloat(this.Total) + parseFloat(Producto.SubTotal);
            })
        },
        NuevaCompra () {
            
        }
    }

}
</script>