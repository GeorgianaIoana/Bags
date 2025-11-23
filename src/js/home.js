import { addProductToCart, renderProductsSection } from './main.js';

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


function initMobileSlider() {
    const slider = document.querySelector(".suitcase-list");
    const slides = document.querySelectorAll(".suitcase-item");
    const prevBtn = document.querySelector(".arrow-prev");
    const nextBtn = document.querySelector(".arrow-next");

    if (!slider || slides.length === 0 || !prevBtn || !nextBtn) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!isMobile) return;

    if (slider.dataset.initialized === "true") return;
    slider.dataset.initialized = "true";

    let index = 0;
    const totalSlides = slides.length;

    function updateSlider() {
        slider.style.transform = `translateX(-${index * 100}%)`;
    }

    nextBtn.addEventListener("click", () => {
        index = (index + 1) % totalSlides;
        updateSlider();
    });

    prevBtn.addEventListener("click", () => {
        index = (index - 1 + totalSlides) % totalSlides;
        updateSlider();
    });

    updateSlider();
}

document.addEventListener("DOMContentLoaded", initMobileSlider);
window.addEventListener("resize", initMobileSlider);