export function updateCartCount() {
    const cartCountEl = document.getElementById('cartCount');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

    if (cartCountEl) {
        cartCountEl.textContent = totalItems;
        cartCountEl.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

export function addProductToCart(product, selectedSize, selectedColor, quantity=1) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        size: selectedSize,
        color: selectedColor,
        category: product.category || "General",
        imageUrl: product.imageUrl,
        quantity: 1
    };


    for(let i=0; i<quantity; i++) {
        const existingItem = cart.find(
        item =>
        item.id === cartItem.id &&
        item.size === cartItem.size &&
        item.color === cartItem.color
        );
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(cartItem);
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    alert(`${product.name} added to cart successfully!`);
}

export function renderProductsSection(data, includes, selector, buttonText, buttonOnClick) {
    const container = document.querySelector(selector);
    if (!container) {
        console.warn(`Container "${selector}" not found`);
        return;
    }

    const products = data.filter(product =>
        product.blocks.includes(includes)
    );

    container.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');

        card.innerHTML = `
      <a href="/html/product-details.html?id=${product.id}" class="product-link">
        <div class="product-image">
          ${product.salesStatus ? '<span class="badge-sale">SALE</span>' : ''}
          <img src="${product.imageUrl}" alt="${product.name}">
        </div>
        <div class="product-details">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-price">$${product.price}</p>
        </div>
      </a>

      <button class="btn-product">${buttonText}</button>
    `;

        const button = card.querySelector('.btn-product');
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            buttonOnClick(product)
        });

        container.appendChild(card);
    });

}

document.addEventListener("DOMContentLoaded", () => {

    const loginHTML = `
    <div class="login-modal hidden">
      <div class="login-overlay"></div>

      <div class="login-container">
        <form class="login-form">

          <label>Email address <span>*</span></label>
          <input type="email" id="login-email" autocomplete="email" required />

          <label>Password <span>*</span></label>
          <div class="password-wrapper">
            <input type="password" id="login-password" autocomplete="current-password" required />
            <span class="eye-icon" id="toggle-password"></span>
          </div>

          <div class="options">
            <label class="remember">
              <input type="checkbox" />
              Remember me
            </label>

            <a href="#" class="forgot">Forgot Your Password?</a>
          </div>
          <p class="login-error" id="login-error"></p>
          <button class="login-btn" type="submit">LOG IN</button>
        </form>
      </div>
    </div>
  `;

    document.body.insertAdjacentHTML("beforeend", loginHTML);

    document.body.insertAdjacentHTML("beforeend", `
        <div id="login-success-popup" class="login-success-popup hidden">
        <div class="login-success-box">
            <img src="../assets/images/ribbon.svg" class="success-icon" alt="Success">
            <p class="success-message">Logged in successfully!</p>
        </div>
        </div>
        `);




    const headerContainer = document.getElementById("header");

    if (headerContainer) {
        fetch("../html/header.html")
            .then(res => res.text())
            .then(async data => {
                headerContainer.innerHTML = data;

                updateCartCount();


                const accountIcon = headerContainer.querySelector("#user-icon");
                const loginModal = document.querySelector(".login-modal");
                const loginOverlay = document.querySelector(".login-overlay");
                const togglePassword = document.querySelector("#toggle-password");
                const passwordField = document.querySelector("#login-password");
                const loginForm = document.querySelector(".login-form");
                const emailField = document.querySelector("#login-email");

                if (accountIcon) {
                    accountIcon.addEventListener("click", (e) => {
                        e.preventDefault();
                        loginModal.classList.remove("hidden");
                    });
                }

                loginOverlay.addEventListener("click", () => {
                    loginModal.classList.add("hidden");
                });

             togglePassword.addEventListener("click", () => {
                const isPassword = passwordField.type === "password";
                passwordField.type = isPassword ? "text" : "password";
                togglePassword.classList.toggle("showing", isPassword);
            });



                loginForm.addEventListener("submit", (e) => {
                    e.preventDefault();

                    const emailValue = emailField.value.trim();
                    const passwordValue = passwordField.value.trim();
                    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
                    const errorBox = document.getElementById("login-error");

                    errorBox.textContent = "";

                    if (!emailValid) {
                        errorBox.textContent = "Please enter a valid email address.";
                        return;
                    }

                    if (passwordValue === "") {
                        errorBox.textContent = "Password is required.";
                        return;
                    }

                    showLoginSuccess("Logged in successfully!");

                    loginModal.classList.add("hidden");
                    loginForm.reset();
                });



                const cartIcon = headerContainer.querySelector("#cartIcon");
                if (cartIcon) {
                    cartIcon.addEventListener("click", () => {
                        window.location.href = "../pages/cart.html";
                    });
                }


                const burger = headerContainer.querySelector(".header-burger");
                const nav = headerContainer.querySelector(".header-nav");

                if (burger && nav) {
                    burger.addEventListener("click", () => {
                        burger.classList.toggle("active");
                        nav.classList.toggle("active");
                    });
                }


                const setActiveLink = () => {
                    const currentPath = window.location.pathname.replace(/\/$/, "");
                    const links = headerContainer.querySelectorAll(".header-nav a");

                    links.forEach(link => {
                        const linkPath = link.getAttribute("href").replace(/\/$/, "");

                        if (linkPath === currentPath || (linkPath === "." && currentPath === "/")) {
                            link.classList.add("active");
                        } else {
                            link.classList.remove("active");
                        }
                    });
                };

                setActiveLink();

                if (window.location.pathname.includes("cart.html")) {
                    const cartModule = await import("../js/cart.js");
                    if (cartModule.initCart) {
                        cartModule.initCart();
                    }
                }
            })
            .catch(err => console.error("Error loading header:", err));
    }



    const footerContainer = document.getElementById("footer");

    if (footerContainer) {
        fetch("../html/footer.html")
            .then(res => res.text())
            .then(data => {
                footerContainer.innerHTML = data;
            })
            .catch(err => console.error("Error loading footer:", err));
    }


function showLoginSuccess(message) {
    const popup = document.getElementById("login-success-popup");
    const msg = popup.querySelector(".success-message");

    msg.textContent = message;
    popup.classList.remove("hidden");

    requestAnimationFrame(() => {
        popup.classList.add("show");
    });

    setTimeout(() => {
        popup.classList.remove("show");
        setTimeout(() => popup.classList.add("hidden"), 300);
    }, 4000);
}

});