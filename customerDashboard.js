

import { getFirestore, collection, getDocs, orderBy, query, doc, setDoc, Timestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { db } from "./firebase/firebaseConfig.js";

const homeCategoriesContainer = document.getElementById("home-categories-grid");
const menuCategoriesContainer = document.getElementById("menu-categories-grid");

/**
 * Populates a given container element with category cards.
 * @param {HTMLElement} container The container to populate.
 * @param {Array<Object>} categories An array of category data objects.
 */
function populateContainer(container, categories) {
    if (!container) return;
    container.innerHTML = ""; // Clear existing content

    if (categories.length === 0) {
        container.innerHTML = `<p style="grid-column: 1 / -1; text-align: center;">لم يتم العثور على فئات حاليًا.</p>`;
        return;
    }

    categories.forEach(data => {
        if (!data.name || !data.image) return; // Skip items with missing data

        const card = document.createElement("div");
        card.className = "glovo-category-card";
        card.style.cursor = "pointer";

        card.innerHTML = `
            <img src="${data.image}" alt="${data.name}" />
            <h4>${data.name}</h4>
        `;
        
        card.addEventListener("click", () => {
         window.location.href = `category.html?name=${encodeURIComponent(data.name)}`;
       });


        container.appendChild(card);
    });
}

/**
 * Fetches categories from Firestore and populates the relevant sections on the page.
 */
async function loadCategories() {
    const loadingHTML = `<p style="grid-column: 1 / -1; text-align: center;">جاري تحميل الفئات...</p>`;
    if (homeCategoriesContainer) homeCategoriesContainer.innerHTML = loadingHTML;
    if (menuCategoriesContainer) menuCategoriesContainer.innerHTML = loadingHTML;

    try {
        const categoriesQuery = query(collection(db, "categories"), orderBy("name"));
        const querySnapshot = await getDocs(categoriesQuery);
        const categoriesData = querySnapshot.docs.map(doc => doc.data());

        // Populate home container with the first 4 categories
        populateContainer(homeCategoriesContainer, categoriesData.slice(0, 4));
        
        // Populate menu container with all categories
        populateContainer(menuCategoriesContainer, categoriesData);
        
    } catch (error) {
        console.error("Error loading categories from Firestore:", error);
        const errorMessage = `<p style="grid-column: 1 / -1; text-align: center; color: red;">حدث خطأ أثناء تحميل الفئات.</p>`;
        if (homeCategoriesContainer) homeCategoriesContainer.innerHTML = errorMessage;
        if (menuCategoriesContainer) menuCategoriesContainer.innerHTML = errorMessage;
    }
}

// --- New Location Modal Logic ---

const locationBtn = document.getElementById('location-selector-btn');
const locationModal = document.getElementById('locationModal');
const cancelBtn = document.getElementById('cancelLocation');
const confirmBtn = document.getElementById('confirmLocation');
const locationTextEl = document.getElementById('location-text');

let map = null;
let marker = null;
let selectedCoords = null;

function openModal() {
    locationModal.style.display = 'flex';
    if (!map) {
        initializeMap();
    }
    setTimeout(() => map.invalidateSize(), 10);
}

function closeModal() {
    locationModal.style.display = 'none';
}

function initializeMap() {
    map = L.map('map').setView([33.9716, -6.8498], 13); // Default to Rabat

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri'
    }).addTo(map);
    
    marker = L.marker(map.getCenter(), { draggable: true }).addTo(map);
    selectedCoords = map.getCenter();

    marker.on('dragend', (e) => {
        selectedCoords = e.target.getLatLng();
    });

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLatLng = { lat: position.coords.latitude, lng: position.coords.longitude };
            map.setView(userLatLng, 16);
            marker.setLatLng(userLatLng);
            selectedCoords = userLatLng;
        },
        (error) => {
            console.warn("Could not get user location:", error.message);
        }
    );
}

async function handleConfirmLocation() {
    if (!selectedCoords) {
        alert("Please select a location on the map.");
        return;
    }
    
    locationTextEl.textContent = 'جاري حفظ الموقع...';
    closeModal();

    try {
        const userId = 'mock_customer_id_vanilla';
        const userDocRef = doc(db, 'users', userId);
        const locationData = {
            lastKnownLocation: {
                latitude: selectedCoords.lat,
                longitude: selectedCoords.lng,
                timestamp: Timestamp.now(),
            }
        };
        await setDoc(userDocRef, locationData, { merge: true });
        
        locationTextEl.textContent = 'تم تحديد الموقع بنجاح!';
        locationTextEl.style.color = 'green';

    } catch (error) {
        console.error("Error saving location to Firestore:", error);
        locationTextEl.textContent = 'فشل حفظ الموقع';
        locationTextEl.style.color = 'red';
    }
}

// Attach Event Listeners
if(locationBtn) locationBtn.addEventListener('click', openModal);
if(cancelBtn) cancelBtn.addEventListener('click', closeModal);
if(confirmBtn) confirmBtn.addEventListener('click', handleConfirmLocation);

if(locationModal) {
    locationModal.addEventListener('click', (event) => {
        if (event.target === locationModal) {
            closeModal();
        }
    });
}


// Load categories when the script is executed
loadCategories();