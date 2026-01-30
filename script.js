/*
 * Copyright (c) 2026 Gabriel Horakhty / SoftIndie.
 * Todos os direitos reservados.
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Lógica do Modal de "Agenda Aberta" ---
    const maintenanceModal = document.getElementById("maintenance-modal");
    const closeMaintBtn = document.getElementById("close-maintenance");

    if (maintenanceModal && closeMaintBtn) {
        closeMaintBtn.addEventListener("click", (e) => {
            e.preventDefault(); 
            maintenanceModal.classList.add("hidden");
            
            setTimeout(() => {
                maintenanceModal.style.display = "none";
            }, 500);
        });
    }

    // --- 2. Menu Mobile ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.right = '20px';
                navLinks.style.background = 'rgba(5, 5, 5, 0.95)';
                navLinks.style.padding = '20px';
                navLinks.style.borderRadius = '10px';
                navLinks.style.border = '1px solid var(--purple-primary)';
                navLinks.style.zIndex = '1000';
            }
        });
    }

    // --- 3. Carrinho de Compras ---
    const cartBtn = document.getElementById("cart-btn");
    const cartModal = document.getElementById("cart-modal");
    const closeCartBtn = document.getElementById("close-modal");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalElement = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn");
    const cartCount = document.querySelector(".cart-count");

    let cart = [];

    // Abrir Carrinho
    if(cartBtn && cartModal) {
        cartBtn.addEventListener("click", () => {
            cartModal.classList.add("open");
            renderCart();
        });
    }

    // Fechar Carrinho
    if(closeCartBtn && cartModal) {
        closeCartBtn.addEventListener("click", () => {
            cartModal.classList.remove("open");
        });
    }

    if(cartModal) {
        cartModal.addEventListener("click", (e) => {
            if (e.target === cartModal) {
                cartModal.classList.remove("open");
            }
        });
    }

    // Adicionar Item
    const addButtons = document.querySelectorAll(".add-cart");
    addButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            const nome = button.getAttribute('data-name');
            const preco = parseFloat(button.getAttribute('data-price'));

            addToCart(nome, preco);
            
            // Efeito visual no botão
            const originalText = button.innerText;
            button.innerText = "Adicionado!";
            button.style.background = "#7b2cbf";
            setTimeout(() => {
                button.innerText = originalText;
                button.style.background = "";
            }, 1000);
        });
    });

    function addToCart(nome, preco) {
        const existingItem = cart.find(item => item.nome === nome);
        if (existingItem) {
            existingItem.quantidade += 1;
        } else {
            // AQUI ESTÁ O SEGREDO: salvamos como 'preco'
            cart.push({ nome, preco, quantidade: 1 });
        }
        updateCartCount();
    }

    function removeFromCart(nome) {
        cart = cart.filter(item => item.nome !== nome);
        renderCart();
        updateCartCount();
    }

    function updateCartCount() {
        const totalItems = cart.reduce((acc, item) => acc + item.quantidade, 0);
        if(cartCount) cartCount.innerText = totalItems;
    }

    function renderCart() {
        if(!cartItemsContainer) return;
        
        cartItemsContainer.innerHTML = "";
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<p style='color:#ccc; text-align:center;'>Seu carrinho está vazio.</p>";
        } else {
            cart.forEach(item => {
                // Aqui usamos 'item.preco' corretamente
                const itemTotal = item.preco * item.quantidade;
                total += itemTotal;
                
                const itemElement = document.createElement("div");
                itemElement.classList.add("cart-item");
                itemElement.innerHTML = `
                    <div class="item-info">
                        <h4>${item.nome} (${item.quantidade}x)</h4>
                        <span>R$ ${itemTotal.toFixed(2).replace(".", ",")}</span>
                    </div>
                    <button class="remove-item" onclick="removeHandler('${item.nome}')">
                        <i class="ph-fill ph-trash"></i>
                    </button>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
        }

        if(cartTotalElement) cartTotalElement.innerText = `R$ ${total.toFixed(2).replace(".", ",")}`;
    }

    // Função Global para o botão de remover funcionar
    window.removeHandler = function(nome) {
        removeFromCart(nome);
    };

    // --- 4. Checkout e Envio para WhatsApp (CORRIGIDO) ---
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();

            if (cart.length === 0) {
                alert("Seu carrinho está vazio!");
                return;
            }

            const clientNameInput = document.getElementById('client-name');
            const clientName = clientNameInput ? clientNameInput.value : "";
            
            const contactSelect = document.getElementById('whatsapp-contact');
            let selectedNumber = "";

            if (contactSelect && contactSelect.value) {
                selectedNumber = contactSelect.value.replace(/\D/g, '');
            } else {
                selectedNumber = "5514997143768"; 
            }

            if (!clientName) {
                alert("Por favor, digite seu nome.");
                return;
            }

            sendToWhatsApp(clientName, selectedNumber);
        });
    }

    function sendToWhatsApp(name, phoneNumber) {
        let message = `*NOVO PEDIDO - MAGIAS DOCE ENCANTO* 🔮\n\n`;
        message += `*Cliente:* ${name}\n`;
        message += `*Itens do Pedido:*\n`;

        let total = 0;
        cart.forEach(item => {
            const quantidade = item.quantidade || 1;
            
            // CORREÇÃO: Mudado de item.price para item.preco
            const subtotal = item.preco * quantidade;
            
            message += `- ${quantidade}x ${item.nome}: R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
            total += subtotal;
        });

        message += `\n*VALOR TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*\n`;
        message += `\n-----------------------------------\n`;
        message += `*Informação de Pagamento:*\n`;
        message += `Gostaria de combinar a forma de pagamento e entrega.`;

        const encodedMessage = encodeURIComponent(message);
        
        const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

        window.open(url, '_blank');
    }

    // --- 5. Animação de Scroll (Reveal) ---
    const revealOnScroll = () => {
        const reveals = document.querySelectorAll('.reveal');
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
});
