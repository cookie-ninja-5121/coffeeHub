/* ========================================
   DOM ELEMENTS
   ======================================== */

const searchBtn = document.querySelector('.search-btn');
const searchInput = document.querySelector('input[type="text"]');
const cartPanel = document.getElementById('cart-panel');
const cartItemsDiv = document.getElementById('cart-items');
const cartTotalDiv = document.querySelector('.cart-total');
const cartBtn = document.getElementById('cart-btn');
const closeCart = document.querySelector('.close-cart');
const checkoutBtn = document.getElementById('checkout-btn');
const cartBadge = document.getElementById('cart-badge');


/* ========================================
   STATE MANAGEMENT
   ======================================== */

let cart = [];


/* ========================================
   SEARCH FUNCTIONALITY
   ======================================== */

searchBtn.addEventListener('click', () => {
  alert('You searched for: ' + searchInput.value);
});


/* ========================================
   CART RENDERING & UPDATES
   ======================================== */

function renderCart() {
  // Clear existing cart items
  cartItemsDiv.innerHTML = '';

  // Calculate total and render items
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    // Create cart item element
    const divItem = document.createElement('div');
    divItem.classList.add('cart-item');
    divItem.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-details">
        <div class="name-price">
          <span>${item.name}</span>
          <span>₱${item.price}</span>
        </div>
        <div class="qty-controls">
          <button class="decrease" data-index="${index}">–</button>
          <span class="qty">${item.qty}</span>
          <button class="increase" data-index="${index}">+</button>
          <button class="remove" data-index="${index}" title="Remove item">🗑️</button>
        </div>
      </div>
    `;
    cartItemsDiv.appendChild(divItem);
  });

  // Update total and badge
  cartTotalDiv.textContent = `Total: ₱${total}`;
  cartBadge.textContent = cart.reduce((sum, item) => sum + item.qty, 0);

  // Attach event listeners to quantity control buttons
  attachQuantityListeners();
}

function attachQuantityListeners() {
  // Increase quantity buttons
  cartItemsDiv.querySelectorAll('.increase').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      cart[index].qty += 1;
      renderCart();
    });
  });

  // Decrease quantity buttons
  cartItemsDiv.querySelectorAll('.decrease').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      if (cart[index].qty > 1) {
        cart[index].qty -= 1;
        renderCart();
      }
    });
  });

  // Remove item buttons
  cartItemsDiv.querySelectorAll('.remove').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      renderCart();
    });
  });
}


/* ========================================
   ADD TO CART ANIMATION
   ======================================== */

function animateAddToCart(imgSrc, btn) {
  // Create floating image element
  const img = document.createElement('img');
  img.src = imgSrc;
  img.classList.add('floating');
  document.body.appendChild(img);

  // Set initial position at button location
  const rect = btn.getBoundingClientRect();
  img.style.top = rect.top + 'px';
  img.style.left = rect.left + 'px';

  // Animate to cart
  setTimeout(() => {
    img.style.transform = 'translate(' + window.innerWidth + 'px, 0) scale(0)';
    img.style.opacity = 0;
  }, 10);

  // Remove element after animation
  setTimeout(() => {
    img.remove();
  }, 700);
}


/* ========================================
   ADD TO CART BUTTON HANDLERS
   ======================================== */

document.querySelectorAll('.card-content button, .hero button').forEach((btn) => {
  btn.addEventListener('click', () => {
    // Get product data from button attributes
    const name = btn.dataset.name;
    const price = parseInt(btn.dataset.price);
    const img = btn.dataset.img;

    // Check if item already exists in cart
    const exists = cart.find((item) => item.name === name);

    if (exists) {
      // Item exists: increment quantity
      exists.qty += 1;
    } else {
      // New item: add to cart
      cart.push({ name: name, price: price, qty: 1, img: img });
    }

    // Update cart display
    renderCart();
    animateAddToCart(img, btn);
    cartPanel.classList.add('active');
  });
});


/* ========================================
   CART PANEL CONTROLS
   ======================================== */

// Toggle cart panel visibility
cartBtn.addEventListener('click', () => {
  cartPanel.classList.toggle('active');
});

// Close cart panel
closeCart.addEventListener('click', () => {
  cartPanel.classList.remove('active');
});

// Checkout button
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty!');
  } else {
    // Calculate total
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    // Show success message
    alert('Order placed successfully!\nTotal: ₱' + totalPrice);

    // Clear cart and close panel
    cart = [];
    renderCart();
    cartPanel.classList.remove('active');
  }
});

/* ========================================
   LOGIN & SIGNUP MODAL FUNCTIONALITY
   ======================================== */

const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const loginBtn = document.querySelector('.btn.login');
const signupBtn = document.querySelector('.btn.signup');
const closeModals = document.querySelectorAll('.close-modal');
const switchForms = document.querySelectorAll('.switch-form');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

// Open login modal
loginBtn.addEventListener('click', () => {
  loginModal.classList.add('active');
});

// Open signup modal
signupBtn.addEventListener('click', () => {
  signupModal.classList.add('active');
});

// Close modals
closeModals.forEach((closeBtn) => {
  closeBtn.addEventListener('click', (e) => {
    e.target.closest('.modal').classList.remove('active');
  });
});

// Switch between forms
switchForms.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = e.target.getAttribute('href');
    
    if (target === '#login') {
      signupModal.classList.remove('active');
      loginModal.classList.add('active');
    } else if (target === '#signup') {
      loginModal.classList.remove('active');
      signupModal.classList.add('active');
    }
  });
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === loginModal) {
    loginModal.classList.remove('active');
  }
  if (e.target === signupModal) {
    signupModal.classList.remove('active');
  }
});

// Login form submission
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  // Store user info in localStorage (simple implementation)
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find((u) => u.email === email && u.password === password);
  
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    alert('Login successful! Welcome ' + user.name);
    loginModal.classList.remove('active');
    updateAuthUI();
    loginForm.reset();
  } else {
    alert('Invalid email or password!');
  }
});

// Signup form submission
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('signup-confirm').value;
  
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }
  
  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  if (users.find((u) => u.email === email)) {
    alert('Email already exists!');
    return;
  }
  
  const newUser = { name: name, email: email, password: password };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  alert('Account created successfully! Please login.');
  signupModal.classList.remove('active');
  signupForm.reset();
  loginModal.classList.add('active');
});

// Update UI based on login status
function updateAuthUI() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  if (currentUser) {
    loginBtn.textContent = 'Logout';
    signupBtn.style.display = 'none';
    // Change click handler to logout
    loginBtn.onclick = handleLogout;
  } else {
    loginBtn.textContent = 'Login';
    signupBtn.style.display = 'block';
    // Reset click handler to open login modal
    loginBtn.onclick = () => {
      loginModal.classList.add('active');
    };
  }
}

// Logout function
function handleLogout() {
  localStorage.removeItem('currentUser');
  alert('You have been logged out!');
  updateAuthUI();
}

// Check if user is already logged in on page load
updateAuthUI();