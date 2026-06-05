const productsContainer = document.getElementById("products");
const paginationContainer = document.getElementById("pagination");

const searchInput = document.getElementById("search");
const brandSelect = document.getElementById("brand");

let currentPage = 1;
const limit = 9;

let currentCategory = "";
let currentBrand = "";
let currentSearch = "";
let isPopular = false;
let isUnder20 = false;

// لود کردن پروداکت 

async function loadProducts() {

    let url =
        `http://localhost:3000/products?_page=${currentPage}&_limit=${limit}`;

    if (currentBrand) {
        url += `&brand=${currentBrand}`;
    }

    if (currentCategory === "popular") {

        url += "&popular=true";

    }
    else if (currentCategory === "under20") {

        url += "&price_lte=20";

    }
    else if (currentCategory) {

        url += `&category=${currentCategory}`;

    }

    if (currentSearch) {
        url += `&title_like=${currentSearch}`;
    }

    try {

        const response = await fetch(url);
        const products = await response.json();

        const totalCount =
            Number(response.headers.get("X-Total-Count")) || products.length;

        const totalPages =
            Math.ceil(totalCount / limit);

        renderProducts(products);
        renderPagination(totalPages);

    } catch (error) {

        console.error(error);

        productsContainer.innerHTML = `
            <p class="text-red-500">
                Error loading products
            </p>
        `;
    }
}

// رندر کردن پروداکت 
function renderProducts(products) {

    productsContainer.innerHTML = "";

    if (!products.length) {

        productsContainer.innerHTML = `
            <h2 class="text-center col-span-3 text-gray-500 text-xl">
                No Products Found
            </h2>
        `;

        return;
    }

    products.forEach(product => {

        productsContainer.innerHTML += `
            <a
                href="product-details.html?id=${product.id}"
                class="bg-white rounded-3xl overflow-hidden shadow hover:shadow-lg transition"
            >
                <img
                    src="${product.image}"
                    alt="${product.title}"
                    class="w-full h-44 object-cover"
                >

                <div class="p-4">
                    <h3 class="font-semibold">
                        ${product.title}
                    </h3>
                </div>
            </a>
        `;
    });
}

// رندر کردن پگینیشن

function renderPagination(totalPages) {

    paginationContainer.innerHTML = "";

    if (currentPage > 1) {

        paginationContainer.innerHTML += `
            <button
                onclick="changePage(${currentPage - 1})"
                class="px-4 py-2 bg-white rounded-lg shadow"
            >
                Prev
            </button>
        `;
    }

    for (let i = 1; i <= totalPages; i++) {

        paginationContainer.innerHTML += `
            <button
                onclick="changePage(${i})"
                class="
                    w-10 h-10 rounded-lg shadow
                    ${i === currentPage
                ? "bg-green-600 text-white"
                : "bg-white"}
                "
            >
                ${i}
            </button>
        `;
    }

    if (currentPage < totalPages) {

        paginationContainer.innerHTML += `
            <button
                onclick="changePage(${currentPage + 1})"
                class="px-4 py-2 bg-white rounded-lg shadow"
            >
                Next →
            </button>
        `;
    }
}

// عوض کردن پیج

function changePage(page) {

    currentPage = page;
    loadProducts();
}

// سرچ زنده

searchInput.addEventListener("input", () => {

    currentSearch = searchInput.value.trim();
    currentPage = 1;
    loadProducts();
});

// فیلتر زنده 

brandSelect.addEventListener("change", () => {

    currentBrand = brandSelect.value;
    currentPage = 1;
    loadProducts();
});

// رنگ انتخوابل شده رو عوض میکنه  دسته بندی رو زخیره میکنه  و ...

document.querySelectorAll(".category").forEach(btn => {

    btn.addEventListener("click", () => {

        document.querySelectorAll(".category").forEach(item => {
            item.classList.remove("bg-green-600", "text-white");
        });

        btn.classList.add("bg-green-600", "text-white");

        currentCategory = btn.dataset.category;
        currentPage = 1;
        loadProducts();
    });
});

loadProducts();