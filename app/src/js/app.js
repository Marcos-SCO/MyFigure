import { scrollTo } from "./helpers";

// Variables
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');

// Cart
let cart = [];

// Getting products
function Products() {
    this.getCart = async function getCart() {
        try {
            let result = await fetch('./data/products.json');
            let data = await result.json();
            let products = data.items;
            products = products.map(product => {
                const { title, series, price } = product.fields;
                const { id } = product.sys;
                const img = product.fields.img.fields.file.url;

                return { title, series, price, id, img };
            })
            return products;
        } catch (error) {
            console.log(error);
        }
    }
}

// Display Products
const UI = {
    updateUI() {
        UI.setTotalCart();
        UI.updateGridProducts();
        UI.toggleCartDisplay();
    },
    displayProducts(product) {
        product.map(({ title, series, img, id, price }) => {
            let productDiv = document.createElement('div');
            productDiv.classList.add('product');
            productDiv.setAttribute('data-product-id', id);
            // <span class='qty-display'>0</span>
            productDiv.innerHTML = `
                <div class="img-container">
                    <img src="${img}" alt="product" class="product-img">
                    <button class="bag-btn" data-id="${id}"><i class="fas fa-shopping-cart"></i><span class='button-text'>Add Cart</span></button>
                </div>
                <div class='title-container'><h3 class='title'>${title}</h3>
                </div>
                <h5 class='series'>${series}</h5>
                <h4 class='price-container'>R$ <span class='price'>${price.toFixed(2)}</span></h4>`;
            productsDOM.appendChild(productDiv);
        });
    },
    updateGridProducts() {
        let productItemIds = document.querySelectorAll(`[data-product-id]`);
        Array.from(productItemIds).forEach(productItem => {
            let itemId = productItem.getAttribute('data-product-id');
            let filteredItem = Storages.getCart().filter(item => item.id === itemId);
            let itemLength = filteredItem.length > 0 ? filteredItem[0].qty : 0;

            let product = document.querySelector(`[data-product-id='${itemId}'] .img-container`);
            product.setAttribute('data-qty', itemLength);

            let buttonText = document.querySelector(`[data-product-id='${itemId}'] .button-text`);
            buttonText.innerHTML = filteredItem.length > 0 ? 'Adicionar Mais' : 'Add Cart';;
        });
    },
    getBagButtons() {
        UI.updateGridProducts();

        let productItemIds = Array.from(document.querySelectorAll(`[data-product-id]`));

        productItemIds.map(product => {
            let id = product.dataset.productId;

            product.addEventListener('click', e => {
                // e.target.disabled = true;
                let product = document.querySelector(`[data-product-id="${id}"]`);
                let img = document.querySelector(`[data-product-id="${id}"] img`).src;
                let title = document.querySelector(`[data-product-id="${id}"] .title`).innerText;
                let price = document.querySelector(`[data-product-id="${id}"] .price`).innerText;

                Storages.saveProducts({ id, img, title, price });

                // Search for product qty
                let qty = Storages.getCart()
                    .find(item => item.id == id).qty;

                let findQtdProduct = Storages.getCart()
                    .find(item => item.id == id).qty;

                // Add to cart
                let isProductNotInCart = findQtdProduct === 1;
                if (isProductNotInCart) {
                    UI.addCartItem({ id, img, title, price, qty });
                }

                if (!isProductNotInCart) {
                    let dataId = document.querySelector(`.price-item-${id}`);
                    if (dataId) dataId.innerText = +dataId.textContent + 1;
                }

                UI.updateSingleItemPrices(id);
                UI.updateUI();
                scrollTo(`[data-cart-id='${id}']`, { top: '3.8rem', block: "center", });
            })

        });
    },
    updateSingleItemPrices(cartItemId) {
        let currItem = Storages.getCart().find(item => item.id === cartItemId);
        let priceDisplay = document.querySelector(`[data-cart-id='${cartItemId}'] .price-display`);
        let priceElement = document.querySelector(`[data-cart-id='${cartItemId}'] .price`);
        let priceQtd = document.querySelector(`[data-cart-id='${cartItemId}'] .price-qty`);
        priceQtd.innerText = currItem.qty;
        priceElement.innerText = UI.multiplySingleItemPrice(currItem.price, currItem.qty)
    },
    setTotalCart() {
        let products = Storages.getCart();
        clearCartBtn.innerText = 'Limpar Cart';

        // return the quantity of products in cart
        if (products) {
            let tempTotal = products.reduce((acc, item) =>
                acc += item.price * item.qty, 0);

            let itemsTotal = products.map(item => item.qty)
                .reduce((acc, crr) => acc += crr, 0);

            cartTotal.innerText = tempTotal.toFixed(2);
            cartItems.innerText = itemsTotal;
        }

        if (products.length === 0) clearCartBtn.innerText = 'Add Cart';
    },
    addCartItem({ id, img, title, price, qty }) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <div class="cart-item" data-cart-id="${id}">
            <img src="${img}" alt="${title}">
            <div class='price-display'>
                <h4>${title}</h4>
                <h5>$<span class='price'>${price}<span></h5>
                <small>$${price} X <span class="price-qty">${qty}</span></small>
                <span class="remove-item" data-id="${id}">remover</span>
            </div>
            <div>
                <i class="arrow-btn fas fa-chevron-up" data-id="${id}"></i>
                <p class="item-amount price-item-${id}">${qty}</p>
                <i class="arrow-btn fas fa-chevron-down" data-id="${id}"></i>
            </div>
            </div>`;

        cartContent.appendChild(div);
    },
    toggleCartDisplay() {
        cartOverlay.classList.toggle('active');
        cartDOM.classList.toggle('showCart');
    },
    setupApp() {
        let cart = Storages.getCart();
        UI.setTotalCart();
        UI.populateCart(cart);
        // Toggle the cart display
        [cartBtn, closeCartBtn, cartOverlay].forEach(item =>
            item.addEventListener('click', UI.toggleCartDisplay));

        cartBtn.addEventListener('click', () => scrollTo('.cart-header'));

        cart.forEach(cartCurrItem => UI.updateSingleItemPrices(cartCurrItem.id));
    },
    populateCart(cart) {
        cart.map(item => UI.addCartItem(item))
    },
    multiplySingleItemPrice(price, multiplyTo) {
        return (price * multiplyTo).toFixed(2);
    },
    cartLogic() {
        clearCartBtn.addEventListener('click', () => UI.clearCart());

        cartContent.addEventListener('click', e => {
            if (e.target.classList.contains('remove-item')) {
                let removeItem = e.target;
                let id = removeItem.dataset.id;

                cartContent.removeChild(removeItem.parentElement.parentElement.parentElement);

                UI.removeCartItem(id);
            }

            if (e.target.classList.contains('fa-chevron-up')) {
                cart = Storages.getCart();
                let addAmount = e.target;
                let id = addAmount.dataset.id;
                let currUpItem = cart.find(item => item.id === id);
                currUpItem.qty++;

                Storages.saveToStorage(cart);

                addAmount.nextElementSibling.innerText = currUpItem.qty;
                UI.updateSingleItemPrices(id);
            }

            if (e.target.classList.contains('fa-chevron-down')) {
                cart = Storages.getCart();

                let lowerAmount = e.target;
                let id = lowerAmount.dataset.id;
                let currDownItem = cart.find(item => item.id === id);

                Storages.saveToStorage(cart);
                let isQtyGreaterThanZero = currDownItem.qty > 0;

                if (isQtyGreaterThanZero) {
                    currDownItem.qty--;
                    Storages.saveToStorage(cart);
                    lowerAmount.previousElementSibling.innerText = currDownItem.qty;
                    UI.updateSingleItemPrices(id);
                }

                if (currDownItem.qty == 0) {
                    cartContent.removeChild(lowerAmount.parentElement.parentElement.parentElement);
                    UI.removeCartItem(id);
                }
            }

            if (Storages.getCart() <= 0) UI.clearCart();

            UI.setTotalCart();
            UI.updateGridProducts();
        });
    },
    clearCart() {
        let cartItemsId = Storages.getCart().map(item => item.id);
        cartItemsId.map(id => UI.removeCartItem(id));

        while (cartContent.children.length > 0)
            cartContent.removeChild(cartContent.children[0]);

        UI.updateUI();
    },
    removeCartItem(id) {
        cart = Storages.getCart().filter(item => item.id !== id);
        UI.setTotalCart();
        Storages.saveToStorage(cart);
    },
}

// Local Storage
const Storages = {
    saveToStorage(obj) {
        return localStorage.setItem('products', JSON.stringify(obj));
    },
    getCart() {
        // Get items or empty array with products key
        return localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
    },
    saveProducts(product) {
        let storageItems = Storages.getCart();

        const idProductAlreadyExists = storageItems
            .find(item => item.id == product.id);

        if (!idProductAlreadyExists) {
            product.qty = 1;
            storageItems.push(product);
        }

        if (idProductAlreadyExists) {
            storageItems.map(item => {
                if (item.id == product.id) item.qty++;
            });
        }

        cart = storageItems;

        // Save to localStorage
        Storages.saveToStorage(cart);
    },
}

document.addEventListener('DOMContentLoaded', () => {
    const ui = Object.create(UI);
    const products = new Products;

    ui.setupApp();

    products.getCart()
        .then(product => {
            ui.displayProducts(product);
            ui.setTotalCart();
        })
        .then(() => {
            ui.getBagButtons();
            ui.cartLogic();
        });
});

document.querySelector('.buy-now').addEventListener('click', () => scrollTo('.products', { behavior: 'smooth' }));