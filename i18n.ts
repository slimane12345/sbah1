

export const translations: Record<string, Record<string, string>> = {
  ar: {
    // ======== GLOBAL ========
    currency: 'د.م.',
    // ======== CONTEXTS & APP SHELL ========
    addedToCartNotification: 'تمت إضافة "{{productName}}" إلى سلتك!',

    // ======== GENERAL COMPONENTS ========
    loading: 'جاري التحميل...',
    all: 'الكل',
    back: 'العودة',
    backToMenu: 'العودة إلى القائمة',
    viewAll: 'عرض الكل',

    // ======== HEADER & CART DROPDOWN ========
    searchPlaceholder: 'ابحث عن مطاعم، منتجات...',
    returnToDashboard: 'العودة للوحة التحكم',
    yourCart: 'سلّتك',
    emptyCart: 'إفراغ السلة',
    emptyCartConfirm: 'هل أنت متأكد من رغبتك في إفراغ السلة؟',
    yourCartIsEmpty: 'سلّتك فارغة ☀️',
    startShopping: 'ابدأ التسوق',
    total: 'الإجمالي',
    checkout: 'إتمام الطلب',
    continueShopping: 'متابعة التسوق',

    // ======== FLOATING CART ========
    goToCheckout: 'اذهب للدفع',

    // ======== CUSTOMER HOME PAGE ========
    // Location Selector
    selectDeliveryLocation: 'حدد موقع التوصيل',
    fastAndAccurateDelivery: 'احصل على توصيل سريع ودقيق',
    // Categories
    exploreCategories: 'استكشف فئاتنا 🍳',
    chooseYourMorning: 'اختر ما تحب هذا الصباح ☀️',
    noCategoriesAvailable: 'لا توجد فئات متاحة حاليًا.',
    // Reviews
    ratings: 'التقييمات',
    ratingUnit: 'تقييم',
    
    // ======== PRODUCT & CUSTOMIZATION ========
    addToCart: 'أضف إلى السلة',
    addToCartWithPrice: 'أضف إلى السلة ({{price}} د.م.)',
    addOneForPrice: 'أضف 1 مقابل {{price}} د.م.',
    close: 'إغلاق',
    chooseOne: 'اختر 1',
    required: 'إجباري',

    // ======== CHECKOUT PROCESS ========
    confirmOrder: 'تأكيد الطلب',
    // Customer Info
    customerInfo: 'معلومات العميل',
    fullName: 'الاسم الكامل',
    fullNamePlaceholder: 'مثال: نورة خالد',
    // Address Selection
    deliveryAddress: 'عنوان التوصيل',
    change: 'تغيير',
    pleaseSelectAddress: 'الرجاء تحديد عنوان التوصيل.',
    // Payment Methods
    paymentMethod: 'طريقة الدفع',
    cod: 'الدفع عند الاستلام',
    codDescription: 'ادفع نقدًا لمندوب التوصيل عند وصول طلبك.',
    card: 'البطاقة الائتمانية / مدى',
    cardDescription: 'آمن ومضمون. نقبل فيزا، ماستركارد ومدى.',
    noPaymentMethodsAvailable: 'لا توجد طرق دفع متاحة حاليًا. يرجى التواصل مع الدعم.',
    // Order Summary
    orderSummary: 'ملخص الطلب',
    subtotal: 'المجموع الفرعي',
    deliveryFee: 'رسوم التوصيل',
    placingOrder: 'جاري تأكيد الطلب...',
    // Errors
    emptyCartError: 'سلة التسوق فارغة.',
    noAddressError: 'الرجاء تحديد عنوان التوصيل.',
    customerInfoError: 'الرجاء إدخال الاسم ورقم الهاتف.',
    paymentMethodError: 'الرجاء اختيار طريقة الدفع.',
    placeOrderFailedError: 'فشل إتمام الطلب. يرجى المحاولة مرة أخرى.',
    // Order Tracker
    orderConfirmedSuccess: 'تم تأكيد طلبك بنجاح!',
    orderNumberInfo: 'رقم الطلب: {{orderNumber}}. يمكنك متابعة حالة طلبك أدناه.',
    step1: 'تم استلام الطلب',
    step2: 'المطعم يجهز الطلب',
    step3: 'المندوب في الطريق للمطعم',
    step4: 'المندوب في طريقه إليك',
    step5: 'تم التوصيل',
    eta: 'الوقت المتوقع للتوصيل',
    etaValue: '{{start}}-{{end}} دقائق',
    deliveryDestination: 'سيتم توصيل طلبك إلى',

    // ======== CATEGORY PRODUCTS PAGE ========
    noProductsInCategory: 'لا توجد منتجات متاحة في هذه الفئة حاليًا.',
    
    // ======== LOCATION MODAL ========
    selectLocationTitle: 'حدد موقع التوصيل',
    manualAddressPlaceholder: 'اكتب موقعك (اختياري)',
    confirmLocation: 'تأكيد الموقع',
    confirmingLocation: 'جاري التأكيد...',

    // ======== CUSTOMER ORDER TRACKING MODAL ========
    trackOrderTitle: 'تتبع الطلب',
    deliveryDetails: 'تفاصيل التوصيل',
    currentOrderStatus: 'حالة الطلب الحالية',
    etaCustomer: 'الوقت المتوقع للوصول',
    etaCustomerValue: '~{{start}}-{{end}} دقائق',
    restaurant: 'المطعم',
    noLocationDataForTracking: "لا توجد بيانات موقع متاحة لتتبع هذا الطلب.",

    // ======== PROFILE PAGE (EXISTING & NEW) ========
    profileSettings: 'الملف الشخصي',
    orderHistory: 'سجل الطلبات',
    savedAddresses: 'العناوين المحفوظة',
    rewardsAndPoints: 'النقاط والمكافآت',
    // ProfileSettings Component
    profile: 'الملف الشخصي',
    profileInfoMessage: 'هذه المعلومات لن تكون ظاهرة بشكل عام.',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    save: 'حفظ',
    saving: 'جاري الحفظ...',
    saveSuccess: 'تم حفظ التغييرات بنجاح!',
    saveFail: 'فشل حفظ التغييرات.',
    languageSettings: 'إعدادات اللغة',
    languageDescription: 'اختر لغة العرض المفضلة لديك.',
    arabic: 'العربية',
    french: 'Français',
    // OrderHistory Component
    reorder: 'إعادة الطلب',
    trackOrder: 'تتبع الطلب',
    trackOrderDisabledTooltip: 'لا يمكن تتبع هذا الطلب حاليًا',
    noPastOrders: 'لا يوجد طلبات سابقة.',
    // SavedAddresses Component
    addNewAddress: '+ إضافة عنوان جديد',
    edit: 'تعديل',
    delete: 'حذف',
    confirmDeleteAddress: 'هل أنت متأكد من رغبتك في حذف هذا العنوان؟',
    default: 'الافتراضي',
    // AddressModal Component
    editAddress: 'تعديل العنوان',
    addAddress: 'إضافة عنوان جديد',
    addressNameLabel: 'اسم العنوان (مثال: المنزل)',
    addressDetailsLabel: 'تفاصيل العنوان',
    additionalAddressDetails: "تفاصيل العنوان الإضافية (اختياري)",
    additionalAddressPlaceholder: "مثال: شقة 5، عمارة الياسمين، بجانب المسجد",
    addressDetailsPlaceholder: 'الشارع، الحي، المدينة',
    setDefaultAddress: 'تعيين كعنوان افتراضي',
    cancel: 'إلغاء',
    
    // ======== DRIVER DASHBOARD ========
    driverInterface: 'واجهة الموزع',
    driverDashboard: 'لوحة تحكم الموزع',
    youAreOffline: 'أنت غير متصل',
    youAreOnline: 'أنت متصل',
    goOnline: 'اتصل بالإنترنت',
    goOffline: 'قطع الاتصال',
    newOrders: 'طلبات جديدة',
    noNewOrders: 'لا توجد طلبات جديدة متاحة حالياً.',
    activeOrder: 'طلبي الحالي',
    noActiveOrder: 'ليس لديك طلب نشط. قم بقبول طلب جديد للبدء.',
    acceptOrder: 'قبول الطلب',
    pickupFrom: 'استلام من',
    deliverTo: 'توصيل إلى',
    orderPickedUp: 'تم استلام الطلب',
    orderDelivered: 'اكتمال الطلب',
    distance: 'المسافة',
    earnings: 'الأرباح',
    km: 'كم',
    driverLoginTitle: 'تسجيل دخول الموزع',
    driverLoginSubtitle: 'أدخل اسمك ورقم هاتفك للبدء.',
    login: 'تسجيل الدخول',
    loggingIn: 'جاري تسجيل الدخول...',
    loginFailed: 'فشل تسجيل الدخول. الرجاء التحقق من بياناتك والمحاولة مرة أخرى.',
    logout: 'تسجيل الخروج',
    driverRegisterTitle: 'تسجيل موزع جديد',
    driverRegisterSubtitle: 'املأ بياناتك لإنشاء حساب جديد.',
    vehicle: 'المركبة',
    licensePlate: 'رقم لوحة المركبة',
    register: 'تسجيل',
    registering: 'جاري التسجيل...',
    registrationSuccess: 'تم التسجيل بنجاح! جاري تسجيل دخولك...',
    registrationFailed: 'فشل التسجيل. الرجاء المحاولة مرة أخرى.',
    phoneExistsError: 'يوجد سائق مسجل بهذا الرقم بالفعل.',
    switchToRegister: 'ليس لديك حساب؟ سجل الآن',
    switchToLogin: 'لديك حساب بالفعل؟ سجل الدخول',
    totalDeliveries: 'مجموع التوصيل',
    totalEarningsValue: 'مجموع الطلبيات بالدرهم',
    confirmAcceptanceTitle: 'تأكيد قبول الطلب',
    from: 'من',
    to: 'إلى',
    products: 'المنتجات',
    payment: 'الدفع',
    codWithAmount: 'نقداً عند الاستلام ({{amount}} {{currency}})',
    paidElectronically: 'تم الدفع إلكترونياً',
    confirmAcceptance: 'تأكيد القبول',
  },
  fr: {
    // ======== GLOBAL ========
    currency: 'D.M.',
    // ======== CONTEXTS & APP SHELL ========
    addedToCartNotification: '"{{productName}}" a été ajouté à votre panier !',

    // ======== GENERAL COMPONENTS ========
    loading: 'Chargement...',
    all: 'Tout',
    back: 'Retour',
    backToMenu: 'Retour au menu',
    viewAll: 'Voir tout',

    // ======== HEADER & CART DROPDOWN ========
    searchPlaceholder: 'Rechercher des restaurants, produits...',
    returnToDashboard: 'Retour au tableau de bord',
    yourCart: 'Votre Panier',
    emptyCart: 'Vider le panier',
    emptyCartConfirm: 'Êtes-vous sûr de vouloir vider le panier ?',
    yourCartIsEmpty: 'Votre panier est vide ☀️',
    startShopping: 'Commencer les achats',
    total: 'Total',
    checkout: 'Passer la commande',
    continueShopping: 'Continuer les achats',

    // ======== FLOATING CART ========
    goToCheckout: 'Aller au paiement',

    // ======== CUSTOMER HOME PAGE ========
    // Location Selector
    selectDeliveryLocation: 'Définir le lieu de livraison',
    fastAndAccurateDelivery: 'Obtenez une livraison rapide et précise',
    // Categories
    exploreCategories: 'Explorez nos catégories 🍳',
    chooseYourMorning: 'Choisissez ce que vous aimez ce matin ☀️',
    noCategoriesAvailable: 'Aucune catégorie disponible pour le moment.',
    // Reviews
    ratings: 'Avis',
    ratingUnit: 'avis',
    
    // ======== PRODUCT & CUSTOMIZATION ========
    addToCart: 'Ajouter au panier',
    addToCartWithPrice: 'Ajouter au panier ({{price}} D.M.)',
    addOneForPrice: 'Ajouter 1 pour {{price}} D.M.',
    close: 'Fermer',
    chooseOne: 'Choisissez 1',
    required: 'Obligatoire',
    
    // ======== CHECKOUT PROCESS ========
    confirmOrder: 'Confirmer la Commande',
    // Customer Info
    customerInfo: 'Informations client',
    fullName: 'Nom complet',
    fullNamePlaceholder: 'Ex: Fatima Alami',
    // Address Selection
    deliveryAddress: 'Adresse de livraison',
    change: 'Changer',
    pleaseSelectAddress: "Veuillez sélectionner une adresse de livraison.",
    // Payment Methods
    paymentMethod: 'Méthode de paiement',
    cod: 'Paiement à la livraison',
    codDescription: 'Payez en espèces au livreur à l\'arrivée de votre commande.',
    card: 'Carte de crédit / CMI',
    cardDescription: 'Sûr et sécurisé. Nous acceptons Visa, Mastercard et CMI.',
    noPaymentMethodsAvailable: "Aucune méthode de paiement n'est disponible pour le moment. Veuillez contacter le support.",
    // Order Summary
    orderSummary: 'Résumé de la commande',
    subtotal: 'Sous-total',
    deliveryFee: 'Frais de livraison',
    placingOrder: 'Confirmation en cours...',
    // Errors
    emptyCartError: 'Le panier est vide.',
    noAddressError: "Veuillez sélectionner une adresse de livraison.",
    customerInfoError: 'Veuillez entrer votre nom et numéro de téléphone.',
    paymentMethodError: 'Veuillez sélectionner une méthode de paiement.',
    placeOrderFailedError: 'Échec de la commande. Veuillez réessayer.',
    // Order Tracker
    orderConfirmedSuccess: 'Votre commande est confirmée !',
    orderNumberInfo: 'Numéro de commande : {{orderNumber}}. Vous pouvez suivre son statut ci-dessous.',
    step1: 'Commande reçue',
    step2: 'Préparation en cuisine',
    step3: 'Livreur en route',
    step4: 'Livreur en chemin vers vous',
    step5: 'Livré',
    eta: 'Heure de livraison estimée',
    etaValue: '{{start}}-{{end}} minutes',
    deliveryDestination: 'Votre commande sera livrée à',

    // ======== CATEGORY PRODUCTS PAGE ========
    noProductsInCategory: 'Aucun produit disponible dans cette catégorie pour le moment.',

    // ======== LOCATION MODAL ========
    selectLocationTitle: 'Définir le lieu de livraison',
    manualAddressPlaceholder: 'Entrez votre adresse (optionnel)',
    confirmLocation: 'Confirmer le lieu',
    confirmingLocation: 'Confirmation...',

    // ======== CUSTOMER ORDER TRACKING MODAL ========
    trackOrderTitle: 'Suivi de commande',
    deliveryDetails: 'Détails de la livraison',
    currentOrderStatus: 'Statut actuel de la commande',
    etaCustomer: 'Heure d\'arrivée estimée',
    etaCustomerValue: '~{{start}}-{{end}} minutes',
    restaurant: 'Restaurant',
    noLocationDataForTracking: "Aucune donnée de localisation disponible pour suivre cette commande.",

    // ======== PROFILE PAGE (EXISTING & NEW) ========
    profileSettings: 'Profil',
    orderHistory: 'Historique des commandes',
    savedAddresses: 'Adresses enregistrées',
    rewardsAndPoints: 'Points et récompenses',
    // ProfileSettings Component
    profile: 'Profil',
    profileInfoMessage: "Ces informations ne seront pas visibles publiquiquement.",
    name: 'Nom',
    email: 'E-mail',
    phone: 'Téléphone',
    save: 'Enregistrer',
    saving: 'Enregistrement...',
    saveSuccess: 'Changements enregistrés avec succès !',
    saveFail: "Échec de l'enregistrement des modifications.",
    languageSettings: 'Paramètres de langue',
    languageDescription: "Choisissez votre langue d'affichage préférée.",
    arabic: 'العربية',
    french: 'Français',
    // OrderHistory Component
    reorder: 'Recommander',
    trackOrder: 'Suivre',
    trackOrderDisabledTooltip: 'Le suivi n\'est pas disponible pour cette commande',
    noPastOrders: 'Aucune commande précédente.',
    // SavedAddresses Component
    addNewAddress: '+ Ajouter une nouvelle adresse',
    edit: 'Modifier',
    delete: 'Supprimer',
    confirmDeleteAddress: 'Êtes-vous sûr de vouloir supprimer cette adresse ?',
    default: 'Défaut',
    // AddressModal Component
    editAddress: "Modifier l'adresse",
    addAddress: 'Ajouter une nouvelle adresse',
    addressNameLabel: "Nom de l'adresse (ex: Maison)",
    addressDetailsLabel: "Détails de l'adresse",
    additionalAddressDetails: "Détails d'adresse supplémentaires (facultatif)",
    additionalAddressPlaceholder: "Ex : Appt 5, Immeuble Yassmine, à côté de la mosquée",
    addressDetailsPlaceholder: 'Rue, quartier, ville',
    setDefaultAddress: 'Définir comme adresse par défaut',
    cancel: 'Annuler',
    
    // ======== DRIVER DASHBOARD ========
    driverInterface: 'Interface Livreur',
    driverDashboard: 'Tableau de bord livreur',
    youAreOffline: 'Vous êtes hors ligne',
    youAreOnline: 'Vous êtes en ligne',
    goOnline: 'Se connecter',
    goOffline: 'Se déconnecter',
    newOrders: 'Nouvelles commandes',
    noNewOrders: 'Aucune nouvelle commande disponible pour le moment.',
    activeOrder: 'Ma commande active',
    noActiveOrder: 'Vous n’avez pas de commande active. Acceptez une nouvelle commande pour commencer.',
    acceptOrder: 'Accepter la commande',
    pickupFrom: 'Récupérer chez',
    deliverTo: 'Livrer à',
    orderPickedUp: 'Commande récupérée',
    orderDelivered: 'Terminer la livraison',
    distance: 'Distance',
    earnings: 'Gains',
    km: 'km',
    driverLoginTitle: 'Connexion livreur',
    driverLoginSubtitle: 'Entrez votre nom et votre numéro de téléphone pour commencer.',
    login: 'Se connecter',
    loggingIn: 'Connexion en cours...',
    loginFailed: 'Échec de la connexion. Veuillez vérifier vos informations et réessayer.',
    logout: 'Se déconnecter',
    driverRegisterTitle: 'Inscription nouveau livreur',
    driverRegisterSubtitle: 'Remplissez vos informations pour créer un nouveau compte.',
    vehicle: 'Véhicule',
    licensePlate: 'Plaque d\'immatriculation',
    register: 'S\'inscrire',
    registering: 'Inscription en cours...',
    registrationSuccess: 'Inscription réussie ! Connexion en cours...',
    registrationFailed: 'L\'inscription a échoué. Veuillez réessayer.',
    phoneExistsError: 'Un livreur avec ce numéro de téléphone existe déjà.',
    switchToRegister: 'Pas de compte ? S\'inscrire',
    switchToLogin: 'Vous avez déjà un compte ? Se connecter',
    totalDeliveries: 'Total livraisons',
    totalEarningsValue: 'Gains totaux (D.M.)',
    confirmAcceptanceTitle: 'Confirmer l\'acceptation de la commande',
    from: 'De',
    to: 'À',
    products: 'Produits',
    payment: 'Paiement',
    codWithAmount: 'Paiement à la livraison ({{amount}} {{currency}})',
    paidElectronically: 'Payé électroniquement',
    confirmAcceptance: 'Confirmer l\'acceptation',
  }
};