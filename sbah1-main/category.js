import { db } from "./firebase/firebaseConfig.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const categoryTitleEl = document.getElementById('category-title');
const productsGridEl = document.getElementById('products-grid');

async function loadProducts() {
    const params = new URLSearchParams(window.location.search);
    const categoryName = params.get('name');

    if (!categoryName) {
        categoryTitleEl.textContent = 'الفئة غير موجودة';
        productsGridEl.innerHTML = '<p>الرجاء تحديد فئة لعرض المنتجات.</p>';
        return;
    }

    const decodedCategoryName = decodeURIComponent(categoryName);
    categoryTitleEl.textContent = decodedCategoryName;
    document.title = `Sbah – ${decodedCategoryName}`;
    productsGridEl.innerHTML = '<p>جاري تحميل المنتجات...</p>';

    try {
        const productsQuery = query(collection(db, "products"), where("category", "==", decodedCategoryName));
        const querySnapshot = await getDocs(productsQuery);

        if (querySnapshot.empty) {
            productsGridEl.innerHTML = '<p>لا توجد منتجات في هذه الفئة حاليًا.</p>';
            return;
        }

        productsGridEl.innerHTML = ''; // Clear loading message

        querySnapshot.forEach(doc => {
            const product = doc.data();
            const card = document.createElement('div');
            card.className = 'product-card';
            card.style.cursor = 'pointer';
            card.innerHTML = `
                <img src="${product.imageUrl || 'https://via.placeholder.com/300'}" alt="${product.name}">
                <div class="product-card-content">
                    <h3>${product.name}</h3>
                    <p>${product.description || ''}</p>
                    <div class="price">${product.price} ر.س</div>
                </div>
            `;
            
            card.addEventListener('click', () => {
                window.location.href = `product.html?id=${doc.id}`;
            });

            productsGridEl.appendChild(card);
        });

    } catch (error) {
        console.error("Error loading products:", error);
        productsGridEl.innerHTML = '<p style="color: red;">حدث خطأ أثناء تحميل المنتجات.</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadProducts);