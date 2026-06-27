document.addEventListener('DOMContentLoaded', () => {
    
    // STATE ENGINE (Cart Array holding objects)
    let cart = [];

    // CORE DOM DOM ELEMENTS
    const cartToggleBtn = document.getElementById('cart-toggle-btn');
    const mobileCartTrigger = document.getElementById('mobile-cart-trigger');
    const cartCloseBtn = document.getElementById('cart-close-btn');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
    
    const cartCountBadges = [document.getElementById('cart-count'), document.getElementById('cart-drawer-count')];
    const cartDrawerItems = document.getElementById('cart-drawer-items');
    const cartSubtotalElement = document.getElementById('cart-subtotal');

    // 1. DRAWER WORKFLOW MANAGEMENT
    const openCart = () => {
        cartDrawer.classList.add('open');
        cartDrawerOverlay.classList.add('open');
    };

    const closeCart = () => {
        cartDrawer.classList.remove('open');
        cartDrawerOverlay.classList.remove('open');
    };

    if(cartToggleBtn) cartToggleBtn.addEventListener('click', openCart);
    if(mobileCartTrigger) mobileCartTrigger.addEventListener('click', openCart);
    if(cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
    if(cartDrawerOverlay) cartDrawerOverlay.addEventListener('click', closeCart);

    // 2. ADD TO CART FUNCTIONAL MATRIX
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const id = card.dataset.id;
            const name = card.dataset.name;
            const price = parseFloat(card.dataset.price);
            const img = card.dataset.img;

            const existingItem = cart.find(item => item.id === id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id, name, price, img, quantity: 1 });
            }

            updateCartUI();
            openCart();
        });
    });

    // 3. REACTIVE UI RENDERING ENGINE
    const updateCartUI = () => {
        // Calculate Quantities
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        cartCountBadges.forEach(badge => {
            if(badge) badge.innerText = totalItems;
        });

        // Calculate Finiancial Metrics
        const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        cartSubtotalElement.innerText = `$${subtotal.toFixed(2)}`;

        // Render Internal Lists
        if (cart.length === 0) {
            cartDrawerItems.innerHTML = '<p class="empty-cart-msg">Your shopping bag is completely empty.</p>';
        } else {
            cartDrawerItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <div class="item-meta">
                            <span>${item.quantity} × $${item.price.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    };

    // 4. INTERACTIVE TAB CONFIGURATION
    const tabTriggers = document.querySelectorAll('.tab-trigger');
    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            tabTriggers.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

            e.target.classList.add('active');
            document.getElementById(e.target.dataset.tab).classList.add('active');
        });
    });

    // 5. FLASH SALE COUNTDOWN SCHEDULER
    const startCountdown = (durationInHours) => {
        let targetTime = Date.now() + (durationInHours * 60 * 60 * 1000);

        const interval = setInterval(() => {
            const remainingTime = targetTime - Date.now();

            if (remainingTime <= 0) {
                clearInterval(interval);
                document.getElementById('countdown').innerHTML = "Sale Ended";
                return;
            }

            const hrs = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((remainingTime % (1000 * 60)) / 1000);

            document.getElementById('hours').innerText = hrs.toString().padStart(2, '0');
            document.getElementById('minutes').innerText = mins.toString().padStart(2, '0');
            document.getElementById('seconds').innerText = secs.toString().padStart(2, '0');

        }, 1000);
    };

    // Run custom 4 hour mock flash sale
    startCountdown(4);
});