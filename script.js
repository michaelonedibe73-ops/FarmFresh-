// @ts-nocheck

// ---------- Data ----------
const products = [
  { id: 1, name: "Crate of Eggs", category: "eggs", price: 4500, image: "eggs.jpg", unit: "per crate (30 eggs)" },
  { id: 2, name: "Live Broiler", category: "chicken", price: 8500, image: "broiler.jpg", unit: "per bird (approx 2.5kg)" },
  { id: 3, name: "Poultry Feed", category: "feeds", price: 15000, image: "feeds.jpg", unit: "per 25kg bag" },
  { id: 4, name: "Day-Old Chicks", category: "chicken", price: 1200, image: "chicks.jpg", unit: "per chick (min 50)" },
  { id: 5, name: "Live Turkey", category: "chicken", price: 25000, image: "turkey.jpg", unit: "per bird (approx 6kg)" },
  { id: 6, name: "Plastic Egg Trays", category: "supplies", price: 800, image: "trays.jpg", unit: "per tray" }
];

let cart = [];
const productGrid = document.getElementById("product-grid");
const cartItems = document.getElementById("cart-items");
const totalPrice = document.getElementById("total-price");
const cartCount = document.getElementById("cart-count");

// ---------- Render Products ----------
function renderProducts() {
  productGrid.innerHTML = "";
  products.forEach((p) => {
    productGrid.innerHTML += `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}">
        <div class="product-info">
          <div class="product-name">${p.name}</div>
          <div class="product-price">₦${p.price.toLocaleString()}</div>
          <div class="product-unit">${p.unit}</div>
          <button class="add-btn" data-id="${p.id}">Add to Order</button>
        </div>
      </div>
    `;
  });
}

// ---------- Cart Logic ----------
productGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-btn");
  if (btn) {
    const id = Number(btn.dataset.id);
    addToCart(id);
  }
});

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCart();
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  let count = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = `<li class="empty-text">Your cart is empty.</li>`;
  } else {
    cart.forEach((item) => {
      const itemTotal = item.price * item.qty;
      total += itemTotal;
      count += item.qty;
      
      cartItems.innerHTML += `
        <li>
          <span>${item.name} (x${item.qty})</span>
          <div style="display: flex; gap: 10px; align-items: center;">
            <span>₦${itemTotal.toLocaleString()}</span>
            <button class="remove-btn" data-id="${item.id}">❌</button>
          </div>
        </li>
      `;
    });
  }

  totalPrice.textContent = total.toLocaleString();
  cartCount.textContent = count;
}

// ---------- Remove from Cart ----------
cartItems.addEventListener("click", (e) => {
  const btn = e.target.closest(".remove-btn");
  if (btn) {
    const id = Number(btn.dataset.id);
    const itemIndex = cart.findIndex(item => item.id === id);
    
    if (itemIndex > -1) {
      if (cart[itemIndex].qty > 1) {
        cart[itemIndex].qty -= 1;
      } else {
        cart.splice(itemIndex, 1);
      }
      updateCart();
    }
  }
});

// ---------- WhatsApp Checkout ----------
document.getElementById("checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Please add items to your order first!");
    return;
  }

  const address = document.getElementById("delivery-address").value.trim();
  if (!address) {
    alert("Please enter your delivery address!");
    return;
  }

  // ⚠️ CHANGE THIS TO THE FARM OWNER'S WHATSAPP NUMBER
  const whatsappNumber = "2348124713885"; 
  const farmName = "FarmFresh Poultry";

  let message = `Hello ${farmName}! I would like to place a bulk order:%0A%0A`;
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    message += `• ${item.qty}x ${item.name} - ₦${itemTotal.toLocaleString()}%0A`;
  });

  message += `%0ATotal: ₦${total.toLocaleString()}%0A%0A`;
  message += `📍 Delivery Address: ${address}%0A%0A`; 
  message += `Please confirm my order and send payment details. Thank you!`;

  window.location.href = `https://wa.me/${whatsappNumber}?text=${message}`;
});

// ---------- Helpers ----------
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// Initialize
renderProducts();
updateCart();
