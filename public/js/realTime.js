const socketClient = io()
socketClient.emit('con', 'conectado')

let form = document.getElementById("formulario")
let btnDelete = document.getElementById("btn_delete")
let tableB = document.getElementById("table-body")

let product = {}

function deleteProduct(id) {
    return console.log(id)
}

function resetForm(obj) {
    obj.reset()
}
function showProducts(list) {
    list.forEach(prd => {

        let tableB = document.getElementById("table-body")
        let fila = document.createElement("tr")
        fila.innerHTML = `
            
            <td>${prd.title}</td>
            <td>${prd.description}</td>
            <td>$ ${prd.price}</td>
            <td>${prd.category}</td>
            <td>${prd.stock}</td>
            <td><btn class="btn btn-danger btn_delete" onClick="deleteProduct(${prd.id})">Eliminar</btn>
            </td>
            `

        tableB.append(fila)
    })
}
function productAdded() {
    Swal.fire({
        title: `Producto agregado!!`,
        text: "Se agregó el producto correctamente",
        icon: "success"
    })
}
function emptyTable() {
    tableB.innerHTML = " "
}


// Escucha al servidor, donde se envió la lista de productos guardada, e inserta los productos en una tabla mediante una funcion.
socketClient.on('products', data => {
    showProducts(data)

})

// Agregar un producto con los datos obtenidos en el formulario
form.addEventListener("submit", (ev) => {
    ev.preventDefault()

    product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        code: document.getElementById("code").value,
        category: document.getElementById("category").value,
        stock: document.getElementById("stock").value,
        thumbnail: document.getElementById("thumbnail").value
    }

    productAdded()
    emptyTable()
    resetForm(form)
    socketClient.emit('add', product)
    return (false);
})









