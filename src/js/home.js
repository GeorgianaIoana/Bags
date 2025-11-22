import {
    addProductToCart,
    renderProductsSection
} from './main.js';

async function init() {
    try {
        const res = await fetch('./assets/data.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        renderProductsSection(json.data, 'Selected Products', '.selected-products-section .products-section', 'Add to Cart', (product) => {
            addProductToCart(product, product.size, product.color);
        });
        renderProductsSection(json.data, 'New Products Arrival', '.arrival .products-section', 'View Product', (product) => {
            window.location.href = `/html/product-details.html?id=${product.id}`;
        });
    } catch (err) {
        console.error("Error loading data:", err);
    }
}

init();


document.addEventListener("DOMContentLoaded", () => {
    const slider = document.querySelector(".suitcase-list");
    const slides = document.querySelectorAll(".suitcase-item");
    const prevBtn = document.querySelector(".arrow-prev");
    const nextBtn = document.querySelector(".arrow-next");

    if (!slider || slides.length === 0) return;

    let index = 0;
    const totalSlides = slides.length;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!isMobile) return;

    function updateSlider() {
        slider.style.transform = `translateX(-${index * 100}%)`;
    }

    nextBtn.addEventListener("click", () => {
        index++;
        if (index > totalSlides - 1) index = 0;
        updateSlider();
    });

    prevBtn.addEventListener("click", () => {
        index--;
        if (index < 0) index = totalSlides - 1;
        updateSlider();
    });

    updateSlider();
});