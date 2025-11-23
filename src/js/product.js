import {
    addProductToCart,
    renderProductsSection
} from './main.js';


const mainImageDiv = document.getElementById('main-image');
const productTitle = document.getElementById('product-title');
const productStars = document.getElementById('product-stars');
const productPrice = document.getElementById('product-price');
const decreaseBtn = document.getElementById('decrease');
const increaseBtn = document.getElementById('increase');
const quantityValue = document.getElementById('quantityValue');
const addToCartBtn = document.getElementById('addToCartBtn');
const sizeSelect = document.getElementById('size');
const colorSelect = document.getElementById('color');
const categorySelect = document.getElementById('category');
const reviewProductTitle = document.getElementById('reviewTitle');

let product = null;

async function init() {

    try {
        const res = await fetch('../assets/data.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        renderProductsSection(json.data, 'You May Also Like', '.products-section', 'Add to Cart', (product) => {
            addProductToCart(product, product.size, product.color);
        });
    } catch (err) {
        console.error("Error loading data:", err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".product-tabs .tab");
    const tabContents = document.querySelectorAll(".product-tabs .tab-content");

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((t) => t.classList.remove("active"));
            tabContents.forEach((c) => c.classList.remove("active"));

            tab.classList.add("active");
            const target = tab.getAttribute("data-tab");
            document.getElementById(target)?.classList.add("active");
        });
    });
});

document.addEventListener('DOMContentLoaded', async () => {

    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    try {

        const res = await fetch('../assets/data.json');
        const json = await res.json();
        const products = json.data;


        product = products.find(p => String(p.id) === String(productId));

        mainImageDiv.innerHTML = `<img src="../${product.imageUrl}" alt="${product.name}">`;
        productTitle.innerHTML = `<h1 class="product-title">
          ${product.name}
        </h1>
        `;

        let rating = product.rating;

        for (let i = 1; i <= 5; i++) {
            const starSpan = document.createElement('span');
            starSpan.classList.add('star');

            if (i <= Math.round(rating)) {
                starSpan.classList.add('full');
            } else {
                starSpan.classList.add('empty');
            }

            starSpan.textContent = '★';
            productStars.appendChild(starSpan);
        }
        productPrice.textContent = `$${product.price}`;
        reviewProductTitle.textContent = '1 review for ' + product.name;


    } catch (err) {
        console.error('Error loading product details:', err);
    }
});

let quantity = 1;

increaseBtn.addEventListener('click', () => {
    quantity++;
    quantityValue.textContent = quantity;
});

decreaseBtn.addEventListener('click', () => {
    if (quantity > 1) {
        quantity--;
        quantityValue.textContent = quantity;
    }
});

addToCartBtn.addEventListener('click', () => {
    const selectedSize = sizeSelect.value;
    const selectedColor = colorSelect.value;
    const selectedCategory = categorySelect.value;
    
    if (
        selectedSize === 'Choose option' ||
        selectedColor === 'Choose option' ||
        selectedCategory === 'Choose option'
    ) {
        alert('Please select size, color, and category.');
        return;
    }
    addProductToCart(product, selectedSize, selectedColor, quantity);
});


init();

const stars = document.querySelectorAll('.review-form .star');
let currentRating = 0;

stars.forEach((star, index) => {

    star.addEventListener('mouseover', () => {
        stars.forEach((s, i) => {
            s.classList.toggle('filled', i <= index);
        });
    });

    star.parentElement.addEventListener('mouseleave', () => {
        stars.forEach((s, i) => {
            s.classList.toggle('filled', i < currentRating);
        });
    });

    star.addEventListener('click', () => {
        currentRating = index + 1;
        stars.forEach((s, i) => {
            s.classList.toggle('filled', i < currentRating);
        });
    });

});


const form = document.querySelector('.review-form');
const reviewInput = document.querySelector('.review-form textarea');
const nameInput = document.querySelector('.review-form input[type="text"]');
const emailInput = document.querySelector('.review-form input[type="email"]');
const submitBtn = document.querySelector('.btn-submit');
const popup = document.getElementById('popup');

form.setAttribute("novalidate", true);

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const review = reviewInput.value.trim();

    const atLeastOneStar = document.querySelector('.star.filled');
    if (!atLeastOneStar) {
        alert("Please select at least one star rating.");
        return;
    }

    if (!name || !email || !review) {
        alert("Please complete Name, Email and Review before submitting.");
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        alert("Please enter a valid email.");
        return;
    }

    popup.classList.add("show");

    setTimeout(() => {
        popup.classList.remove("show");
    }, 3000);

    form.reset();
});

