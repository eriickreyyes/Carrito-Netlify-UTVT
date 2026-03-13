// 1. Variables Globales
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const listaCursos = document.getElementById('lista-cursos');

// Inicializar carrito desde LocalStorage o vacío si no hay nada
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// 2. Funciones de Interfaz
function toggleCart() {
    // Si está invisible, lo muestra. Si está visible, lo oculta.
    cartModal.style.display = (cartModal.style.display === 'block') ? 'none' : 'block';
}

// 3. Lógica del Carrito
function agregarCurso(e) {
    // Verificamos si el clic fue en el botón de agregar
    if (e.target.classList.contains('add-btn')) {
        const card = e.target.parentElement;
        
        // Creamos un objeto con la info del curso
        const cursoInfo = {
            id: e.target.getAttribute('data-id'),
            titulo: card.querySelector('h3').textContent,
            precio: 15, // Precio fijo según la práctica
            imagen: card.querySelector('img').src,
            cantidad: 1
        };

        // Verificar si ya existe en el carrito
        const existe = carrito.some(item => item.id === cursoInfo.id);
        
        if (existe) {
            // Si ya está, aumentamos la cantidad
            carrito = carrito.map(item => {
                if (item.id === cursoInfo.id) {
                    item.cantidad++;
                    return item;
                } else {
                    return item;
                }
            });
        } else {
            // Si es nuevo, lo agregamos al array
            carrito.push(cursoInfo);
        }

        actualizarCarritoHTML();
    }
}

function eliminarCurso(id) {
    carrito = carrito.filter(item => item.id !== id);
    actualizarCarritoHTML();
}

function vaciarCarrito() {
    carrito = [];
    actualizarCarritoHTML();
}

// 4. Renderizado y Almacenamiento
function actualizarCarritoHTML() {
    // Limpiar el contenedor
    cartItemsContainer.innerHTML = '';

    // Dibujar cada producto en el modal
    carrito.forEach(item => {
        const row = document.createElement('div');
        row.classList.add('cart-item');
        row.innerHTML = `
            <img src="${item.imagen}" width="50">
            <p>${item.titulo}</p>
            <p>$${item.precio}</p>
            <p>Cant: ${item.cantidad}</p>
            <button onclick="eliminarCurso('${item.id}')" style="color:red; border:none; background:none; cursor:pointer;">X</button>
        `;
        cartItemsContainer.appendChild(row);
    });

    // Actualizar contador y total
    const totalCantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    const totalPrecio = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    
    cartCount.textContent = totalCantidad;
    cartTotal.textContent = totalPrecio;

    // GUARDAR EN LOCALSTORAGE
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// 5. Event Listeners
listaCursos.addEventListener('click', agregarCurso);

// Cargar el carrito al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarCarritoHTML();
    
    // Simulación de usuario logueado (puedes cambiarlo manualmente para probar)
    const usuarioActivo = localStorage.getItem('usuarioLogueado');
    if(usuarioActivo) {
        document.getElementById('user-name').textContent = `Hola, ${usuarioActivo}`;
        document.getElementById('auth-btn').textContent = 'Cerrar Sesión';
    }
});
document.getElementById('auth-btn').addEventListener('click', () => {
    if (localStorage.getItem('usuarioLogueado')) {
        localStorage.removeItem('usuarioLogueado');
        window.location.reload(); // Recarga la página para volver a estado "Invitado"
    } else {
        window.location.href = 'login.html';
    }
});
