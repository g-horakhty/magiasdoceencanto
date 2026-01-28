/*
 * Copyright (c) 2026 Gabriel Horakhty / SoftIndie.
 * Todos os direitos reservados.
 * * Este código é confidencial e proprietário.
 * A cópia não autorizada deste arquivo, via qualquer meio, é estritamente proibida.
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Efeito Scroll Reveal ---
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Ativa no load

    // --- 2. Menu Mobile ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const isFlex = navLinks.style.display === 'flex';
            if (isFlex) {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.right = '20px';
                navLinks.style.background = '#111';
                navLinks.style.padding = '20px';
                navLinks.style.borderRadius = '10px';
                navLinks.style.border = '1px solid #7b2cbf';
                navLinks.style.zIndex = '999';
            }
        });
    }

    // --- 3. Efeito Mouse Move nos Cards ---
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.08), rgba(255,255,255,0.02))`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.background = 'var(--glass-bg)';
        });
    });

    // --- 5. Popup de Manutenção ---
    const maintenanceModal = document.getElementById('maintenance-modal');
    const closeMaintenanceBtn = document.getElementById('close-maintenance');

    if (closeMaintenanceBtn) {
        closeMaintenanceBtn.addEventListener('click', () => {
            maintenanceModal.classList.add('hidden');
        });
    }

    // --- 4. Sistema de Carrinho ---
    let cart = [];
    const modal = document.getElementById('cart-modal');
    const cartBtn = document.getElementById('cart-btn');
    const closeModal = document.getElementById('close-modal');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.querySelector('.cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Abrir/Fechar Modal
    cartBtn.addEventListener('click', () => modal.classList.add('open'));
    closeModal.addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', (e) => {
        if(e.target === modal) modal.classList.remove('open');
    });

    // Adicionar Item
    const addToCartButtons = document.querySelectorAll('.add-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            
            addItemToCart(name, price);

            // Feedback visual
            const originalText = button.innerText;
            button.innerText = "Adicionado!";
            button.style.background = "var(--purple-primary)";
            setTimeout(() => {
                button.innerText = originalText;
                button.style.background = ""; 
            }, 1000);
        });
    });

    function addItemToCart(name, price) {
        cart.push({ name, price });
        updateCartDisplay();
    }

    // Remover Item (Global para o HTML injetado acessar)
    window.removeItemFromCart = function(index) {
        cart.splice(index, 1);
        updateCartDisplay();
    }

    function updateCartDisplay() {
        cartCountElement.innerText = cart.length;
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-msg">Seu carrinho está vazio.</p>';
        } else {
            cart.forEach((item, index) => {
                total += item.price;
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <span>R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <button class="remove-item" onclick="removeItemFromCart(${index})">
                        <i class="ph-fill ph-trash"></i>
                    </button>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
        }
        cartTotalElement.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    // Checkout
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }

        const clientName = document.getElementById('client-name').value;
        const selectedNumber = document.getElementById('whatsapp-contact').value; // Pega o número escolhido

        if (!clientName) {
            alert("Por favor, digite seu nome.");
            return;
        }

        // Chama a função passando o nome E o número escolhido
        sendToWhatsApp(clientName, selectedNumber);
    });

    function sendToWhatsApp(name, phoneNumber) {
        let message = `*NOVO PEDIDO - MAGIAS DOCE ENCANTO* 🔮\n\n`;
        message += `*Cliente:* ${name}\n`;
        message += `*Itens do Pedido:*\n`;

        let total = 0;
        cart.forEach(item => {
            message += `- ${item.name}: R$ ${item.price.toFixed(2).replace('.', ',')}\n`;
            total += item.price;
        });

        message += `\n*VALOR TOTAL DO CARRINHO: R$ ${total.toFixed(2).replace('.', ',')}*\n`;
        
        // Semântica ajustada conforme solicitado
        message += `\n-----------------------------------\n`;
        message += `*Informação de Pagamento:*\n`;
        message += `Gostaria de combinar a forma de pagamento e entrega para finalizar este pedido.`;

        const encodedMessage = encodeURIComponent(message);
        
        // Usa o phoneNumber que veio do parâmetro (escolhido no select)
        const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        window.open(url, '_blank');
    }
}); // Fim do DOMContentLoaded
