import {
    updateCartCount
} from "./main.js";

const cartBody = document.getElementById("cart-body");
const summaryBox = document.querySelector(".cart-summary");
const clearCartBtn = document.getElementById("clearCart");

function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    renderCart(cart);
}

function renderCart(cart) {
    cartBody.innerHTML = "";

    if (cart.length === 0) {
        cartBody.innerHTML =
            '<tr><td colspan="6" class="cart-empty-message" style="padding:20px;text-align:center; margin-right:auto;">Your cart has no items at the moment.<br> Please visit the catalog to continue shopping.</td></tr>';
        summaryBox.style.display = "none";
        clearCartBtn.style.display = "none";
        return;
    }

    summaryBox.style.display = "block";
    clearCartBtn.style.display = "inline-block";

    let subtotal = 0;

    cart.forEach((item, index) => {
        const total = item.price * item.quantity;
        subtotal += total;

        cartBody.innerHTML += `
      <tr>
        <td><img src="../${item.imageUrl}"></td>
        <td>${item.name}</td>
        <td>$${item.price}</td>
        <td>
          <div class="qty-controls">
            <button data-index="${index}" class="qty-minus">-</button>
            <span>${item.quantity}</span>
            <button data-index="${index}" class="qty-plus">+</button>
          </div>
        </td>
        <td>$${total}</td>
        <td>
          <span class="delete-btn" data-index="${index}">
            <img src="../assets/images/remove-icon.svg" style="width:18px;height:20px;">
          </span>
        </td>
      </tr>
    `;
    });

    let discount = subtotal >= 3000 ? subtotal * 0.1 : 0;
    const shipping = 30;
    const finalTotal = subtotal - discount + shipping;

    let summaryHtml = "";

    summaryHtml += '<div class="summary-row"><span>Sub Total</span><span>$' + subtotal + '</span></div>';
    summaryHtml += '<hr>';

    if (discount > 0) {
        summaryHtml += '<div class="summary-row"><span>Discount</span><span>-$' + discount.toFixed(2) + '</span></div>';
        summaryHtml += '<hr>';
    }

    summaryHtml += '<div class="summary-row"><span>Shipping</span><span>$' + shipping + '</span></div>';
    summaryHtml += '<hr>';

    summaryHtml += '<div class="summary-row total"><span>Total</span><span>$' + finalTotal.toFixed(2) + '</span></div>';
    summaryHtml += '<button id="checkout" class="btn-cart">Checkout</button>';

    summaryBox.innerHTML = summaryHtml;
}

document.addEventListener("click", e => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (e.target.classList.contains("qty-plus")) {
        const index = e.target.dataset.index;
        cart[index].quantity++;
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        loadCart();
    }

    if (e.target.classList.contains("qty-minus")) {
        const index = e.target.dataset.index;
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
            loadCart();
        }
    }

    if (e.target.classList.contains("delete-btn") || e.target.closest(".delete-btn")) {
        const btn = e.target.closest(".delete-btn");
        const index = Number(btn.dataset.index);

        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        loadCart();
    }

    if (e.target.id === "checkout") {
        localStorage.removeItem("cart");
        updateCartCount();

        summaryBox.style.display = "block";
        summaryBox.innerHTML = `
      <div style="text-align:center; font-size:20px; margin-bottom:20px; @media (max-width: 700px) { font-size:17px !important; };}">
        Thank you for your purchase! :) <br>We will contact you soon!
      </div>
      <span> <img src="../assets/images/ribbon.svg" style="width:50px;height:50px; display:flex; justify-content:center; margin: 0 auto;"></span>
    `;

        cartBody.innerHTML = "";
        clearCartBtn.style.display = "none";
    }

    if (e.target.id === "continueShopping") {
        window.location.href = "/html/catalog.html";
    }
});

clearCartBtn.addEventListener("click", () => {
    localStorage.removeItem("cart");
    updateCartCount();

    cartBody.innerHTML =
        '<tr><td colspan="6" style="padding:20px;text-align:center;">Your cart has no items at the moment. Please visit the catalog to continue shopping.</td></tr>';

    summaryBox.style.display = "none";
    clearCartBtn.style.display = "none";
});

export function initCart() {
    loadCart();
}