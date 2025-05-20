// Firebase configuration and initialization
const firebaseConfig = {
  apiKey: "AIzaSyAV2DXCE7XuG_iXb1vCW8xxROof5xQ0fY4",
  authDomain: "gamehub-774ac.firebaseapp.com",
  projectId: "gamehub-774ac",
  storageBucket: "gamehub-774ac.appspot.com",
  messagingSenderId: "56312893637",
  appId: "1:56312893637:web:b4cd71b1b5050efd2520ac",
  measurementId: "G-TYTM1NE7VR"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Global variables
let cart = [];
let currentUser = null;

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
  // Setup navigation
  setupNavigation();

  // Initialize auth state listener
  initAuth();

  // Search functionality
  const searchBtn = document.querySelector(".search-btn");
  const searchOverlay = document.querySelector(".search-overlay");
  const closeSearch = document.querySelector(".close-search");

  if (searchBtn && searchOverlay && closeSearch) {
      searchBtn.addEventListener("click", function () {
          searchOverlay.classList.add("active");
          document.querySelector(".search-container input").focus();
      });

      closeSearch.addEventListener("click", function () {
          searchOverlay.classList.remove("active");
      });
  }

  // Hero slider
  const slides = document.querySelectorAll(".slide");
  const indicators = document.querySelectorAll(".indicator");
  const prevSlideBtn = document.querySelector(".prev-slide");
  const nextSlideBtn = document.querySelector(".next-slide");

  if (slides.length > 0 && indicators.length > 0) {
      let currentSlide = 0;

      function showSlide(index) {
          slides.forEach((slide) => slide.classList.remove("active"));
          indicators.forEach((indicator) => indicator.classList.remove("active"));

          slides[index].classList.add("active");
          indicators[index].classList.add("active");
          currentSlide = index;
      }

      function nextSlide() {
          let nextIndex = (currentSlide + 1) % slides.length;
          showSlide(nextIndex);
      }

      function prevSlide() {
          let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
          showSlide(prevIndex);
      }

      if (nextSlideBtn) nextSlideBtn.addEventListener("click", nextSlide);
      if (prevSlideBtn) prevSlideBtn.addEventListener("click", prevSlide);

      indicators.forEach((indicator, index) => {
          indicator.addEventListener("click", () => showSlide(index));
      });

      // Auto slide change every 5 seconds
      setInterval(nextSlide, 5000);
  }

  // Cart functionality
  const cartBtn = document.querySelector(".cart-btn");
  const cartSidebar = document.querySelector(".cart-sidebar");
  const closeCart = document.querySelector(".close-cart");
  const cartItemsContainer = document.querySelector(".cart-items");
  const cartTotal = document.querySelector(".cart-total span");
  const cartCount = document.querySelector(".cart-count");

  if (cartBtn && cartSidebar && closeCart) {
      cartBtn.addEventListener("click", function () {
          cartSidebar.classList.toggle("active");
      });

      closeCart.addEventListener("click", function () {
          cartSidebar.classList.remove("active");
      });
  }

  // Sample product data
  const products = [
      {
          id: 1,
          title: "Men's Casual T-Shirt",
          price: 29.99,
          originalPrice: 39.99,
          image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
          badge: "Sale",
      },
      {
          id: 2,
          title: "Women's Summer Dress",
          price: 49.99,
          originalPrice: 59.99,
          image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80",
          badge: "Popular",
      },
      {
          id: 3,
          title: "Men's Slim Fit Jeans",
          price: 59.99,
          originalPrice: 69.99,
          image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
          badge: "New",
      },
      {
          id: 4,
          title: "Women's Denim Jacket",
          price: 79.99,
          originalPrice: 89.99,
          image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1936&q=80",
          badge: "Sale",
      },
      {
          id: 5,
          title: "Unisex Sneakers",
          price: 89.99,
          originalPrice: 99.99,
          image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80",
          badge: "Trending",
      },
      {
          id: 6,
          title: "Women's Handbag",
          price: 69.99,
          originalPrice: 79.99,
          image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2078&q=80",
          badge: "New",
      },
      {
          id: 7,
          title: "Men's Formal Shirt",
          price: 39.99,
          originalPrice: 49.99,
          image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1925&q=80",
          badge: "Sale",
      },
      {
          id: 8,
          title: "Women's Blouse",
          price: 34.99,
          originalPrice: 44.99,
          image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          badge: "Popular",
      },
  ];

  // Load products for home page
  const productGrid = document.querySelector(".product-grid");
  const trendingGrid = document.querySelector(".trending-grid");

  function loadProducts() {
      if (!productGrid) return;

      productGrid.innerHTML = "";

      if (trendingGrid) {
          trendingGrid.innerHTML = "";
      }

      // Shuffle products for variety
      const shuffledProducts = [...products].sort(() => 0.5 - Math.random());

      // Load featured products (first 4)
      shuffledProducts.slice(0, 4).forEach((product) => {
          productGrid.appendChild(createProductCard(product));
      });

      // Load trending products (next 4) if trending grid exists
      if (trendingGrid) {
          shuffledProducts.slice(4, 8).forEach((product) => {
              trendingGrid.appendChild(createProductCard(product));
          });
      }
  }

  function createProductCard(product) {
      const productCard = document.createElement("div");
      productCard.className = "product-card";

      let badgeHTML = "";
      if (product.badge) {
          badgeHTML = `<div class="product-badge">${product.badge}</div>`;
      }

      let originalPriceHTML = "";
      if (product.originalPrice) {
          originalPriceHTML = `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>`;
      }

      productCard.innerHTML = `
          ${badgeHTML}
          <img src="${product.image}" alt="${product.title}" class="product-image">
          <div class="product-info">
              <h3 class="product-title">${product.title}</h3>
              <div class="product-price">
                  <span class="current-price">$${product.price.toFixed(2)}</span>
                  ${originalPriceHTML}
              </div>
              <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
          </div>
      `;

      return productCard;
  }

  // Function to load category-specific products
  function loadCategoryProducts(products) {
      const productGrid = document.querySelector(".product-grid");
      if (!productGrid) return;

      productGrid.innerHTML = "";

      products.forEach((product) => {
          const productCard = document.createElement("div");
          productCard.className = "product-card";

          let badgeHTML = "";
          if (product.badge) {
              badgeHTML = `<div class="product-badge">${product.badge}</div>`;
          }

          // Add age group badge for kids' products
          let ageBadgeHTML = "";
          if (product.ageGroup) {
              ageBadgeHTML = `<div class="age-badge">${product.ageGroup}</div>`;
          }

          let originalPriceHTML = "";
          if (product.originalPrice) {
              originalPriceHTML = `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>`;
          }

          productCard.innerHTML = `
              ${badgeHTML}
              ${ageBadgeHTML}
              <img src="${product.image}" alt="${product.title}" class="product-image">
              <div class="product-info">
                  <h3 class="product-title">${product.title}</h3>
                  <div class="product-price">
                      <span class="current-price">$${product.price.toFixed(2)}</span>
                      ${originalPriceHTML}
                  </div>
                  <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
              </div>
          `;

          productGrid.appendChild(productCard);
      });
  }

  // Add to cart functionality
  document.addEventListener("click", function (e) {
      if (e.target.classList.contains("add-to-cart")) {
          const productId = parseInt(e.target.getAttribute("data-id"));
          let product;

          // Find the product in the main products array or in category-specific arrays
          if (window.mensProducts && window.mensProducts.find((p) => p.id === productId)) {
              product = window.mensProducts.find((p) => p.id === productId);
          } else if (window.womensProducts && window.womensProducts.find((p) => p.id === productId)) {
              product = window.womensProducts.find((p) => p.id === productId);
          } else if (window.kidsProducts && window.kidsProducts.find((p) => p.id === productId)) {
              product = window.kidsProducts.find((p) => p.id === productId);
          } else if (window.saleProducts && window.saleProducts.find((p) => p.id === productId)) {
              product = window.saleProducts.find((p) => p.id === productId);
          } else if (window.collectionProducts && window.collectionProducts.find((p) => p.id === productId)) {
              product = window.collectionProducts.find((p) => p.id === productId);
          } else {
              product = products.find((p) => p.id === productId);
          }

          if (product) {
              addToCart(product);
          }
      }

      // Quantity controls
      if (e.target.classList.contains("quantity-btn")) {
          const itemId = parseInt(e.target.closest(".cart-item").getAttribute("data-id"));
          const isIncrease = e.target.classList.contains("increase");
          updateQuantity(itemId, isIncrease);
      }

      // Remove item
      if (e.target.classList.contains("remove-item")) {
          const itemId = parseInt(e.target.closest(".cart-item").getAttribute("data-id"));
          removeFromCart(itemId);
      }
  });

  function addToCart(product) {
      const existingItem = cart.find((item) => item.id === product.id);

      if (existingItem) {
          existingItem.quantity += 1;
      } else {
          cart.push({
              ...product,
              quantity: 1,
          });
      }

      updateCart();
      showAddedToCartMessage(product.title);
  }

  function updateQuantity(itemId, isIncrease) {
      const item = cart.find((item) => item.id === itemId);

      if (item) {
          if (isIncrease) {
              item.quantity += 1;
          } else {
              if (item.quantity > 1) {
                  item.quantity -= 1;
              } else {
                  removeFromCart(itemId);
                  return;
              }
          }

          updateCart();
      }
  }

  function removeFromCart(itemId) {
      cart = cart.filter((item) => item.id !== itemId);
      updateCart();
  }

  function updateCart() {
      if (!cartItemsContainer || !cartTotal || !cartCount) return;

      cartItemsContainer.innerHTML = "";

      if (cart.length === 0) {
          cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
          cartTotal.textContent = "$0.00";
          cartCount.textContent = "0";
          return;
      }

      let total = 0;

      cart.forEach((item) => {
          const itemTotal = item.price * item.quantity;
          total += itemTotal;

          const cartItem = document.createElement("div");
          cartItem.className = "cart-item";
          cartItem.setAttribute("data-id", item.id);

          cartItem.innerHTML = `
              <img src="${item.image}" alt="${item.title}" class="cart-item-img">
              <div class="cart-item-details">
                  <h4 class="cart-item-title">${item.title}</h4>
                  <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                  <div class="cart-item-quantity">
                      <button class="quantity-btn decrease">-</button>
                      <span class="quantity-value">${item.quantity}</span>
                      <button class="quantity-btn increase">+</button>
                  </div>
                  <p class="remove-item">Remove</p>
              </div>
          `;

          cartItemsContainer.appendChild(cartItem);
      });

      cartTotal.textContent = `$${total.toFixed(2)}`;
      cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function showAddedToCartMessage(productTitle) {
      const message = document.createElement("div");
      message.className = "cart-message";
      message.innerHTML = `
          <p>${productTitle} has been added to your cart!</p>
      `;

      document.body.appendChild(message);

      setTimeout(() => {
          message.classList.add("show");
      }, 10);

      setTimeout(() => {
          message.classList.remove("show");
          setTimeout(() => {
              message.remove();
          }, 300);
      }, 3000);
  }

  // Initialize
  loadProducts();
  updateCart();
});

// Setup navigation
function setupNavigation() {
  // Get current page URL
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  // Remove active class from all nav items
  document.querySelectorAll(".main-nav a").forEach((link) => {
      link.classList.remove("active");

      // Add active class to current page
      if (link.getAttribute("href") === currentPage) {
          link.classList.add("active");
      }
  });
}

// Auth functions
function initAuth() {
  const signupForm = document.getElementById("signup-form");
  const loginLink = document.getElementById("login-link");
  const authMessage = document.getElementById("auth-message");
  const accountBtn = document.querySelector(".account-btn");

  if (signupForm) {
      signupForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          
          const name = signupForm.querySelector("#name").value;
          const email = signupForm.querySelector("#email").value;
          const password = signupForm.querySelector("#password").value;
          
          try {
              // Create user with email and password
              const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
              const user = userCredential.user;
              
              // Save additional user data to Firestore
              await firebase.firestore().collection("users").doc(user.uid).set({
                  name: name,
                  email: email,
                  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                  cart: []
              });
              
              showAuthMessage("Account created successfully! You're now logged in.", "success");
              signupForm.reset();
              
          } catch (error) {
              showAuthMessage(error.message, "error");
              console.error("Signup error:", error);
          }
      });
  }
  
  if (loginLink) {
      loginLink.addEventListener("click", (e) => {
          e.preventDefault();
          const email = prompt("Enter your email:");
          const password = prompt("Enter your password:");
          
          if (email && password) {
              firebase.auth().signInWithEmailAndPassword(email, password)
                  .then((userCredential) => {
                      const user = userCredential.user;
                      showAuthMessage("Logged in successfully!", "success");
                  })
                  .catch((error) => {
                      showAuthMessage(error.message, "error");
                  });
          }
      });
  }
  
  // Auth state observer
  firebase.auth().onAuthStateChanged((user) => {
      if (user) {
          // User is signed in
          currentUser = user;
          updateAuthUI(user);
          
          // Load user's cart from Firestore
          firebase.firestore().collection("users").doc(user.uid).get()
              .then((doc) => {
                  if (doc.exists && doc.data().cart) {
                      cart = doc.data().cart;
                      updateCart();
                  }
              });
      } else {
          // User is signed out
          currentUser = null;
          updateAuthUI(null);
      }
  });
}

function updateAuthUI(user) {
  const accountBtn = document.querySelector(".account-btn");
  const authSection = document.querySelector(".newsletter-content");
  
  if (user) {
      // User is logged in
      if (accountBtn) {
          accountBtn.innerHTML = `<i class="fas fa-user-check"></i>`;
          accountBtn.title = "My Account";
      }
      
      if (authSection) {
          authSection.innerHTML = `
              <h2>Welcome back!</h2>
              <p>You're logged in and ready to shop.</p>
              <button id="logout-btn" class="shop-now">Log Out</button>
          `;
          
          document.getElementById("logout-btn").addEventListener("click", () => {
              firebase.auth().signOut().then(() => {
                  showAuthMessage("Logged out successfully", "success");
              });
          });
      }
  } else {
      // User is not logged in
      if (accountBtn) {
          accountBtn.innerHTML = `<i class="fas fa-user"></i>`;
          accountBtn.title = "Account";
      }
      
      if (authSection) {
          authSection.innerHTML = `
              <h2>Create an Account</h2>
              <p>Get access to exclusive offers and faster checkout</p>
              <form class="newsletter-form" id="signup-form">
                  <input type="text" id="name" placeholder="Full Name" required>
                  <input type="email" id="email" placeholder="Your email address" required>
                  <input type="password" id="password" placeholder="Password (min 6 characters)" required>
                  <button type="submit">Sign Up</button>
              </form>
              <p>Already have an account? <a href="#" id="login-link">Log in</a></p>
              <div id="auth-message" style="display:none; margin-top:15px;"></div>
          `;
          
          // Reinitialize auth listeners for the new elements
          initAuth();
      }
  }
}

function showAuthMessage(message, type) {
  const authMessage = document.getElementById("auth-message");
  if (!authMessage) return;
  
  authMessage.textContent = message;
  authMessage.style.display = "block";
  authMessage.style.color = type === "success" ? "green" : "red";
  
  setTimeout(() => {
      authMessage.style.display = "none";
  }, 5000);
}

// Make loadCategoryProducts available globally
window.loadCategoryProducts = loadCategoryProducts;