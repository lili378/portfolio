let cart = JSON.parse(localStorage.getItem("cart")) || [];
let products = [];
let currentPage = 1;
const itemsPerPage = 5;

// Load products
fetch("products.json")
    .then(res => res.json())
    .then(data => {
        products = data;
        updateCartCount();
        renderProducts(products); // ✅ Show all products immediately
        setupPagination(products.length); // ✅ Setup pagination for full list
    });

// Add to cart with quantity
function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();

    // 🔁 Live update if cart is open
    const cartPanel = document.getElementById("cart-panel");
    if (cartPanel && cartPanel.classList.contains("open")) {
        renderCart();
    }
}

// Cart display
function renderCart() {
    const container = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    const cartView = document.getElementById("cart-panel");
    if (!container || !totalEl || !cartView) return;

    cartView.classList.add("open");
    container.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const qty = parseInt(item.quantity) || 1;
        total += item.price * qty;
        container.innerHTML += `
      <div class="cart-item">
        <img src="${item.images[0]}" alt="${item.title}" class="cart-thumb" />
        <div>
          <h4>${item.title}</h4>
          <p>$${item.price.toFixed(2)}</p>
          <div class="quantity-controls">
            <button onclick="changeQuantity(${index}, -1)">−</button>
            <span>${qty}</span>
            <button onclick="changeQuantity(${index}, 1)">+</button>
          </div>
          <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
        </div>
      </div>
    `;
    });

    totalEl.innerHTML = `
    <h3>Total: $${total.toFixed(2)}</h3>
    <button class="clear-btn" onclick="clearCart()">Clear Cart</button>
  `;
}

function changeQuantity(index, delta) {
    const current = cart[index];
    current.quantity = Math.max(1, (parseInt(current.quantity) || 1) + delta);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function clearCart() {
    cart = [];
    localStorage.removeItem("cart");
    updateCartCount();
    renderCart();
}

function updateCartCount() {
    const countEl = document.getElementById("cart-count");
    if (countEl) {
        const totalQty = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0);
        countEl.textContent = totalQty;
    }
}

// Product rendering
function renderProducts(list) {
    const grid = document.getElementById("product-grid");
    if (!grid) return;
    grid.innerHTML = "";
    const start = (currentPage - 1) * itemsPerPage;
    const paginated = list.slice(start, start + itemsPerPage);

    paginated.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";

        const imageSection = p.images.length > 1
            ? `
        <div class="carousel" id="carousel-${p.id}">
          <button id="prev-${p.id}">←</button>
          <div class="carousel-image"></div>
          <button id="next-${p.id}">→</button>
        </div>
      `
            : `<img src="${p.images[0]}" alt="${p.title}" class="product-image" />`;

        card.innerHTML = `
      ${imageSection}
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <p>$${p.price.toFixed(2)}</p>
      <button onclick='addToCart(${JSON.stringify(p)})'>Add to Cart</button>
    `;
        grid.appendChild(card);

        if (p.images.length > 1) {
            setupCarousel(p.id, p.images);
        }
    });
}

// Carousel logic
function setupCarousel(productId, images) {
    let index = 0;
    const container = document.querySelector(`#carousel-${productId} .carousel-image`);

    function render() {
        container.innerHTML = `<img src="${images[index]}" alt="Product Image">`;
    }

    document.getElementById(`next-${productId}`).onclick = () => {
        index = (index + 1) % images.length;
        render();
    };

    document.getElementById(`prev-${productId}`).onclick = () => {
        index = (index - 1 + images.length) % images.length;
        render();
    };

    render();
}

// Filtering and sorting
function applyFilters() {
    let filtered = [...products];
    const category = document.getElementById("category-filter")?.value;
    const sort = document.getElementById("sort-price")?.value;
    const query = document.getElementById("search-input")?.value.toLowerCase();

    if (category && category !== "all") {
        filtered = filtered.filter(p => p.category === category);
    }
    if (query) {
        filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
        );
    }

    if (sort === "low") filtered.sort((a, b) => a.price - b.price);
    if (sort === "high") filtered.sort((a, b) => b.price - a.price);
    if (sort === "az") filtered.sort((a, b) => a.title.localeCompare(b.title));

    renderProducts(filtered);
    setupPagination(filtered.length);
}

// Pagination
function setupPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const container = document.getElementById("pagination");
    if (!container) return;

    container.innerHTML = `
    <button ${currentPage === 1 ? "disabled" : ""} onclick="changePage(-1)">Previous</button>
    <span>Page ${currentPage} of ${totalPages}</span>
    <button ${currentPage === totalPages ? "disabled" : ""} onclick="changePage(1)">Next</button>
  `;
}

function changePage(delta) {
    currentPage += delta;
    applyFilters();
}

// Event listeners
document.getElementById("category-filter")?.addEventListener("change", applyFilters);
document.getElementById("sort-price")?.addEventListener("change", applyFilters);
document.getElementById("search-input")?.addEventListener("input", applyFilters);
document.getElementById("cart-link")?.addEventListener("click", () => renderCart());
document.getElementById("close-cart")?.addEventListener("click", () => {
    document.getElementById("cart-panel")?.classList.remove("open");
});
document.getElementById("menu-toggle")?.addEventListener("click", () => {
    document.getElementById("nav-links")?.classList.toggle("show");
});


