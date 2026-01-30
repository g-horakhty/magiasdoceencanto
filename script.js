/*
 * Copyright (c) 2026 Gabriel Horakhty / SoftIndie.
 * Todos os direitos reservados.
 */

document.addEventListener("DOMContentLoaded", () => {
    
    /* --- 1. Lógica do Modal de "Agenda Aberta" (Splash Screen) --- */
    const maintenanceModal = document.getElementById("maintenance-modal");
    const closeMaintBtn = document.getElementById("close-maintenance");

    if (maintenanceModal && closeMaintBtn) {
        closeMaintBtn.addEventListener("click", (e) => {
            e.preventDefault(); 
            maintenanceModal.classList.add("hidden");
            
            // Remove do fluxo da página após a animação
            setTimeout(() => {
                maintenanceModal.style.display = "none";
            }, 500);
        });
    }

    /* --- 2. Menu Mobile (Hambúrguer) --- */
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
                navLinks.style.border = '1px solid #7b2cbf';
                navLinks.style.zIndex = '1000';
            }
        });
    }

    /* --- 3. Lógica do Carrinho de Compras --- */
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

    // Fechar Carrinho (Botão X)
    if(closeCartBtn && cartModal) {
        closeCartBtn.addEventListener("click", () => {
            cartModal.classList.remove("open");
        });
    }

    // Fechar Carrinho (Clicar fora)
    if(cartModal) {
        cartModal.addEventListener("click", (e) => {
            if (e.target === cartModal) {
                cartModal.classList.remove("open");
            }
        });
    }

    // Adicionar itens ao carrinho (Botões dos Cards)
    const addButtons = document.querySelectorAll(".add-cart");
    addButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            
            // Pega os dados direto dos atributos data- que já estão no HTML
            const nome = button.getAttribute('data-name');
            const preco = parseFloat(button.getAttribute('data-price'));

            addToCart(nome, preco);
            
            // Feedback visual rápido no botão
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

    // Função global para o botão de remover funcionar no HTML gerado
    window.removeHandler = function(nome) {
        removeFromCart(nome);
    };

    /* --- 4. Finalização (WhatsApp com Seleção de Número) --- */
    if(checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            if (cart.length === 0) {
                alert("Seu carrinho está vazio!");
                return;
            }

            const nomeCliente = document.getElementById("client-name")?.value;
            
            // AQUI ESTÁ A CORREÇÃO: Pegando o número escolhido no <select> do HTML
            const selectElement = document.getElementById("whatsapp-contact");
            const whatsappNumber = selectElement ? selectElement.value : "5514997143768"; // Fallback se der erro

            if (!nomeCliente) {
                alert("Por favor, digite seu nome.");
                return;
            }
            
            let message = `*NOVO PEDIDO - MAGIAS DOCE ENCANTO* 🔮\n\n`;
            message += `*Cliente:* ${nomeCliente}\n`;
            message += `*Itens do Pedido:*\n`;

            let total = 0;
            cart.forEach(item => {
                const subtotal = item.preco * item.quantidade;
                total += subtotal;
                message += `- ${item.quantidade}x ${item.nome} (R$ ${subtotal.toFixed(2).replace('.', ',')})\n`;
            });

            message += `\n*TOTAL: R$ ${total.toFixed(2).replace(".", ",")}*`;
            message += `\n\n_Aguardo instruções para pagamento._`;

            const encodedMessage = encodeURIComponent(message);
            
            // Abre o WhatsApp com o número que o usuário selecionou
            window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
        });
    }

    /* --- 5. Animação de Scroll (Reveal) --- */
    const revealOnScroll = () => {
        const reveals = document.querySelectorAll('.reveal');
        const windowHeight = window.innerHeight;
        const elementVisible = 100; // Ajustado para aparecer mais fácil

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Roda uma vez ao carregar
});
