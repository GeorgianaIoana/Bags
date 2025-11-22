import {
    addProductToCart
} from './main.js';


const PRODUCTS_PER_PAGE = 12;

const productList = document.querySelector('.product-list');
const resultsCount = document.querySelector('.results-count');
const prevBtn = document.getElementById('prevPage');
const nextBtn = document.getElementById('nextPage');
const sortSelect = document.getElementById('sortSelect');
const searchInput = document.getElementById('productSearchInput');
const searchButton = document.getElementById('searchBtnSidebar');
const bestSetsContainer = document.querySelector('.best-sets');

let products = [];
let filteredProducts = [];
let currentPage = 1;

async function loadProducts(sortBy = 'default', page = 1) {
    try {
        const res = await fetch('../assets/data.json');
        const json = await res.json();


        products = json.data;

        filteredProducts = products.filter(
            (p) => (p.category || '').toLowerCase() !== 'luggage sets'
        );

        sortAndRender(sortBy, page);

        renderBestSets();
    } catch (err) {
        console.error('Error loading products:', err);
    }
}

function sortAndRender(sortBy, page) {
    switch (sortBy) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'popularity':
            filteredProducts.sort((a, b) => b.popularity - a.popularity);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        default:
            filteredProducts = [...filteredProducts];;
    }

    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
    const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
    const endIndex = Math.min(startIndex + PRODUCTS_PER_PAGE, totalProducts);
    const pageProducts = filteredProducts.slice(startIndex, endIndex);

    renderProducts(pageProducts);

    window.scrollTo({
        top: 300
    });


    const startDisplay = totalProducts === 0 ? 0 : startIndex + 1;
    resultsCount.textContent = `Showing ${startDisplay}–${endIndex} of ${totalProducts} results`;

    const paginationInfo = document.getElementById('pagination-info');
    paginationInfo.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.classList.add('page-btn');
        if (i === page) pageBtn.classList.add('active');

        pageBtn.onclick = () => sortAndRender(sortBy, i);
        paginationInfo.appendChild(pageBtn);
    }

    prevBtn.style.visibility = page <= 1 ? 'hidden' : 'visible';
    nextBtn.style.visibility = page >= totalPages ? 'hidden' : 'visible';
    prevBtn.onclick = () => sortAndRender(sortBy, page - 1);
    nextBtn.onclick = () => sortAndRender(sortBy, page + 1);
}

function renderProducts(products) {
    productList.innerHTML = '';
    if (!products.length) {
        productList.innerHTML = '<p class="no-results">No products found.</p>';
        return;
    }

    products.forEach((product) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
    <a href="/html/product-details.html?id=${product.id}" class="product-link">
      <div class="product-image">
        ${product.salesStatus ? '<span class="badge-sale">SALE</span>' : ''}
        <img src="${product.imageUrl}" alt="${product.name}">
      </div>
      <div class="product-details">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">$${product.price}</p>
        <button class="btn-product">Add To Cart</button>
      </div>
    </a>
  `;

        const addBtn = productCard.querySelector('.btn-product');
        addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            addProductToCart(product, product.size, product.color);
        });

        productList.appendChild(productCard);
    });

}

function applyFilters(sortBy = 'default') {
    const sizeSelect = document.getElementById('filter-size');
    const colorSelect = document.getElementById('filter-color');
    const categorySelect = document.getElementById('filter-category');
    const salesToggleButton = document.getElementById('salesToggleButton');

    const selectedSize = sizeSelect.value;
    const selectedColor = colorSelect.value;
    const selectedCategory = categorySelect.value;

    const isSalesPressed = salesToggleButton ?
        salesToggleButton.getAttribute('aria-pressed') === 'true' :
        false;

    let tempProducts = products.filter(
        (p) => (p.category || '').toLowerCase() !== 'luggage sets'
    );


    if (selectedSize) {
        tempProducts = tempProducts.filter(p => p.size === selectedSize);
    }

    if (selectedColor) {
        tempProducts = tempProducts.filter(p => (p.color || '').toLowerCase() === selectedColor.toLowerCase());
    }

    if (selectedCategory) {
        tempProducts = tempProducts.filter(p => (p.category || '').toLowerCase() === selectedCategory.toLowerCase());
    }

    if (isSalesPressed) {
        tempProducts = tempProducts.filter(p => p.salesStatus === true);
    }

    filteredProducts = tempProducts;

    sortAndRender(sortBy, 1);
}

function renderBestSets() {
    if (!bestSetsContainer) return;

    const luggageSets = products.filter(
        (p) => (p.category || '').toLowerCase() === 'luggage sets'
    );

    if (!luggageSets.length) {
        bestSetsContainer.innerHTML = '<p>No luggage sets available.</p>';
        return;
    }

    const randomSets = luggageSets
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);

    bestSetsContainer.innerHTML = randomSets
        .map(
            (p) => `
        <article class="best-item">
          <a href="/html/product-details.html?id=${p.id}" class="product-link">
            <img src="${p.imageUrl}" alt="${p.name}">
            <div class="info">
              <p class="name">${p.name}</p>
              <div class="stars">
                ${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5 - Math.round(p.rating))}
              </div>
              <div class="price">$${p.price}</div>
            </div>
          </a>
        </article>
      `
        )
        .join('');
}

function performSearch(query) {
    if (!query.trim()) return;

    const product = products.find(p =>
        p.name.toLowerCase().includes(query.toLowerCase())
    );

    if (product) {
        window.location.href = `/html/product-details.html?id=${product.id}`;
    } else {
        alert('No product found with that name.');
    }
}

searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        performSearch(searchInput.value);
    }
})

searchButton.addEventListener('click', () => {
    performSearch(searchInput.value);
});

sortSelect.addEventListener('change', (e) => {
    currentPage = 1;
    sortAndRender(e.target.value, currentPage);
});

document.addEventListener('DOMContentLoaded', () => {
    const filterButton = document.getElementById('filterButton');
    const filterBar = document.querySelector('.filter-bar');
    const hideFiltersButton = document.querySelector('.hide-filters');

    const toggleFilterBar = () => {
        filterBar.classList.toggle('active');

        if (filterBar.classList.contains('active')) {
            filterButton.textContent = 'Hide Filters';
        } else {
            filterButton.textContent = 'Filter';
        }
    };

    if (filterButton) {
        filterButton.addEventListener('click', toggleFilterBar);
    }

    if (hideFiltersButton) {
        hideFiltersButton.addEventListener('click', toggleFilterBar);
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const sizeSelect = document.getElementById('filter-size');
    const colorSelect = document.getElementById('filter-color');
    const categorySelect = document.getElementById('filter-category');
    const salesToggleButton = document.getElementById('salesToggleButton');
    const clearFiltersButton = document.querySelector('.clear-filters');
    const sortSelect = document.getElementById('sortSelect');

    const getCurrentSort = () => sortSelect ? sortSelect.value : 'default';

    const handleFilterChange = () => {
        applyFilters(getCurrentSort());
    };
    if (sizeSelect) sizeSelect.addEventListener('change', handleFilterChange);
    if (colorSelect) colorSelect.addEventListener('change', handleFilterChange);
    if (categorySelect) categorySelect.addEventListener('change', handleFilterChange);

    if (salesToggleButton) {
        salesToggleButton.addEventListener('click', (event) => {
            const isCurrentlyPressed = event.currentTarget.getAttribute('aria-pressed') === 'true';
            event.currentTarget.setAttribute('aria-pressed', !isCurrentlyPressed);

            applyFilters(getCurrentSort());
        });
    }

    if (clearFiltersButton) {
        clearFiltersButton.addEventListener('click', () => {
            if (sizeSelect) sizeSelect.value = '';
            if (colorSelect) colorSelect.value = '';
            if (categorySelect) categorySelect.value = '';

            if (salesToggleButton) salesToggleButton.setAttribute('aria-pressed', 'false');

            applyFilters(getCurrentSort());
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            sortAndRender(getCurrentSort(), 1);
        });
    }

    loadProducts();
});

loadProducts('default', 1);