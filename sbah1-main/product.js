import { db } from "./firebase/firebaseConfig.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const productContentEl = document.getElementById('product-content');
let currentProduct = null;
let selectedOptions = {};
let quantity = 1;

function renderProduct(product) {
    currentProduct = product;
    document.title = `Sbah – ${product.name}`;

    let optionsHTML = '';
    if (product.options && product.options.length > 0) {
        optionsHTML = product.options.map(group => `
            <div class="option-group" id="group-${group.id}">
                <h4>${group.name}</h4>
                <div class="options-list">
                    ${group.options.map(option => `
                        <label>
                            <div>
                                <input type="${group.type}" name="${group.id}" value="${option.id}">
                                <span class="option-name">${option.name}</span>
                            </div>
                            <span class="option-price">+${option.price} ر.س</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    productContentEl.innerHTML = `
        <div>
            <img id="product-image" src="${product.imageUrl || 'https://via.placeholder.com/400'}" alt="${product.name}">
        </div>
        <div class="product-details">
            <h1 id="product-name">${product.name}</h1>
            <p id="product-description">${product.description || ''}</p>
            <div id="options-container">${optionsHTML}</div>
            <div class="actions">
                <div class="quantity-selector">
                    <button id="decrease-qty">-</button>
                    <span id="quantity-display">1</span>
                    <button id="increase-qty">+</button>
                </div>
                <button id="add-to-cart-btn" class="add-to-cart-btn">
                    أضف إلى السلة (<span id="total-price">${product.price}</span> ر.س)
                </button>
            </div>
        </div>
    `;

    attachEventListeners();
}

function updatePrice() {
    if (!currentProduct) return;

    let optionsPrice = 0;
    Object.values(selectedOptions).forEach(option => {
        if(option) optionsPrice += option.price;
    });

    const totalPrice = (currentProduct.price + optionsPrice) * quantity;
    document.getElementById('total-price').textContent = totalPrice.toFixed(2);
    document.getElementById('quantity-display').textContent = quantity;
}

function attachEventListeners() {
    document.getElementById('increase-qty').addEventListener('click', () => {
        quantity++;
        updatePrice();
    });

    document.getElementById('decrease-qty').addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            updatePrice();
        }
    });

    document.querySelectorAll('.option-group input').forEach(input => {
        input.addEventListener('change', (e) => {
            const groupEl = e.target.closest('.option-group');
            const groupId = groupEl.id.replace('group-', '');
            const groupData = currentProduct.options.find(g => g.id === groupId);
            const optionData = groupData.options.find(o => o.id === e.target.value);
            
            if (e.target.type === 'radio') {
                selectedOptions[groupId] = optionData;
            }
            // Checkbox logic can be added here if needed
            
            updatePrice();
        });
    });

    document.getElementById('add-to-cart-btn').addEventListener('click', addToCart);
}

function addToCart() {
    if (!currentProduct) return;
    
    let cart = JSON.parse(localStorage.getItem('sbah-cart') || '[]');

    const cartItem = {
        productId: currentProduct.id,
        name: currentProduct.name,
        image: currentProduct.imageUrl,
        quantity: quantity,
        price: parseFloat(document.getElementById('total-price').textContent) / quantity,
        selectedOptions: selectedOptions
    };

    cart.push(cartItem);
    localStorage.setItem('sbah-cart', JSON.stringify(cart));

    alert(`"${currentProduct.name}" تمت إضافته إلى سلتك!`);
    window.history.back(); // Go back to the previous page
}


async function loadProduct() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        productContentEl.innerHTML = '<div class="error">لم يتم العثور على المنتج.</div>';
        return;
    }

    try {
        const productRef = doc(db, "products", productId);
        const docSnap = await getDoc(productRef);

        if (!docSnap.exists()) {
            productContentEl.innerHTML = '<div class="error">لم يتم العثور على المنتج.</div>';
            return;
        }
        
        const productData = { id: docSnap.id, ...docSnap.data() };
        renderProduct(productData);

    } catch (error) {
        console.error("Error loading product:", error);
        productContentEl.innerHTML = '<div class="error">حدث خطأ أثناء تحميل المنتج.</div>';
    }
}

document.addEventListener('DOMContentLoaded', loadProduct);