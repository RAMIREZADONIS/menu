document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('admin-product-list');
    const logoForm = document.getElementById('logo-form');
    const productForm = document.getElementById('product-form');
    
    // Cargar productos desde localStorage
    function loadProducts() {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        productList.innerHTML = products.map((product, index) =>
            `<div class="list-group-item">
                <h5>${product.name}</h5>
                <img src="${product.image}" alt="${product.name}" style="max-width: 100px;">
                <p>${product.description}</p>
                <p>Precio: $${product.price}</p>
                <p>Categoría: ${product.category}</p>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${index})">Eliminar</button>
            </div>`
        ).join('');
    }
    
    loadProducts();
    
    // Guardar producto
    productForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('product-name').value;
        const image = document.getElementById('product-image').value;
        const description = document.getElementById('product-description').value;
        const price = parseFloat(document.getElementById('product-price').value);
        const category = document.getElementById('product-category').value;
        
        if (!name || !image || !description || isNaN(price) || !category) {
            alert('Por favor, complete todos los campos.');
            return;
        }
        
        const products = JSON.parse(localStorage.getItem('products')) || [];
        products.push({ name, image, description, price, category });
        localStorage.setItem('products', JSON.stringify(products));
        loadProducts();
        productForm.reset();
        alert('Producto agregado');
    });
    
    // Eliminar producto
    window.deleteProduct = (index) => {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        products.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(products));
        loadProducts();
    };
    
    // Actualizar logo
    logoForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const logoUrl = document.getElementById('company-logo-url').value;
        localStorage.setItem('company-logo', logoUrl);
        alert('Logo actualizado');
    });
});
