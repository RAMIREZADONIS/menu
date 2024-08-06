document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const cartIcon = document.getElementById('cart-icon');
    const cartModalBody = document.querySelector('#cartModal .modal-body');
    const cartCount = document.getElementById('cart-count');
    const companyLogo = document.getElementById('company-logo');
    const cartTotalElement = document.getElementById('cart-total');
    
    function loadProducts() {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const categories = [...new Set(products.map(p => p.category))];
        const categoryNav = document.getElementById('category-nav');
        
        categoryNav.innerHTML = categories.map(category => 
            `<li class="nav-item">
                <a class="nav-link" href="#" data-category="${category}">${category}</a>
            </li>`
        ).join('');
        
        productList.innerHTML = products.map(product =>
            `<div class="col-md-4 mb-4" data-category="${product.category}">
                <div class="card">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">RD$${product.price}</p>
                        <button class="btn btn-primary" data-toggle="modal" data-target="#productModal" data-product='${JSON.stringify(product)}'>Ver Detalles</button>
                    </div>
                </div>
            </div>`
        ).join('');
        
        // Cargar logo de la empresa
        const logoUrl = localStorage.getItem('company-logo');
        if (logoUrl) {
            companyLogo.src = logoUrl;
        }
    }
    
    loadProducts();
    
    // Filtrar productos por categoría
    document.getElementById('category-nav').addEventListener('click', (event) => {
        if (event.target.matches('a.nav-link')) {
            const category = event.target.getAttribute('data-category');
            document.querySelectorAll('#product-list .col-md-4').forEach(item => {
                item.style.display = item.getAttribute('data-category') === category ? '' : 'none';
            });
        }
    });
    
    // Mostrar detalles del producto
    $('#productModal').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget);
        const product = JSON.parse(button.attr('data-product'));
        
        $('#productModalLabel').text(product.name);
        $('#product-image').attr('src', product.image);
        $('#product-description').text(product.description);
        $('#product-price').text(product.price);
        $('#add-to-cart').data('product', product);
    });
    
    // Añadir al carrito
    $('#add-to-cart').on('click', function () {
        const product = $(this).data('product');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProductIndex = cart.findIndex(item => item.name === product.name);
        
        if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        Swal.fire({
            icon: 'success',
            title: 'Producto agregado',
            text: `${product.name} ha sido agregado al carrito.`,
            timer: 1000
        });
        
        updateCart();
        $('#productModal').modal('hide');
    });
    
    // Actualizar el carrito
    function updateCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        let total = 0;
        
        cartModalBody.innerHTML = cart.map(item => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            return `
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h5>${item.name}</h5>
                        <p>$${item.price} x ${item.quantity} = $${subtotal.toFixed(2)}</p>
                    </div>
                    <div>
                        <button class="btn btn-secondary btn-sm" data-product='${JSON.stringify(item)}' data-action="decrease">-</button>
                        <button class="btn btn-primary btn-sm" data-product='${JSON.stringify(item)}' data-action="increase">+</button>
                        <button class="btn btn-danger btn-sm" data-product='${JSON.stringify(item)}' data-action="remove">Eliminar</button>
                    </div>
                </div>`;
        }).join('');
        
        cartTotalElement.textContent = total.toFixed(2);
        cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
    }
    
    // Modificar cantidad de producto en el carrito
    cartModalBody.addEventListener('click', (event) => {
        const target = event.target;
        if (target.matches('button.btn-sm')) {
            const product = JSON.parse(target.getAttribute('data-product'));
            const action = target.getAttribute('data-action');
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            if (action === 'remove') {
                const updatedCart = cart.filter(item => item.name !== product.name);
                localStorage.setItem('cart', JSON.stringify(updatedCart));
            } else {
                const updatedCart = cart.map(item => {
                    if (item.name === product.name) {
                        if (action === 'increase') {
                            item.quantity++;
                        } else if (action === 'decrease' && item.quantity > 1) {
                            item.quantity--;
                        }
                    }
                    return item;
                });
                localStorage.setItem('cart', JSON.stringify(updatedCart));
            }
            
            updateCart();
        }
    });
    
    // Mostrar carrito al cargar
    updateCart();
    
    // Finalizar compra
    document.getElementById('checkout').addEventListener('click', () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Tu carrito está vacío',
                timer: 1000
            });
            return;
        }
        
        const cartDetails = cart.map(item => `${item.name} - ${item.quantity} x $${item.price}`).join('\n');
        window.open(`https://api.whatsapp.com/send?phone=8294713861&text=Pedido:%0A${encodeURIComponent(cartDetails)}`, '_blank');
        localStorage.removeItem('cart');
        updateCart();
    });
});
