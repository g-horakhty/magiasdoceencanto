/*
 * Copyright (c) 2026 Gabriel Horakhty / SoftIndie.
 * Todos os direitos reservados.
 */

document.addEventListener("DOMContentLoaded", () => {
    
    /* --- 1. Lógica do Modal de "Agenda Aberta" (Splash Screen) --- */
    const maintenanceModal = document.getElementById("maintenance-modal");
    
    // Procura qualquer botão dentro do modal para fechar (seja classe ou ID)
    const closeMaintBtn = maintenanceModal ? maintenanceModal.querySelector(".btn, button") : null;

    if (maintenanceModal && closeMaintBtn) {
        closeMaintBtn.addEventListener("click", (e) => {
            e.preventDefault(); // Evita recarregar a página se for um link
            maintenanceModal.classList.add("hidden");
            
            // Opcional: Remove o modal do HTML após o efeito de sumir (0.5s)
            setTimeout(() => {
                maintenanceModal.style.display = "none";
            }, 500);
        });
    }

    /* --- 2. Lógica do Carrinho de Compras --- */
    const cartBtn = document.querySelector(".cart-float");
    const cartModal = document.getElementById("cart-modal");
    const closeCartBtn = document.getElementById("close-modal");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalElement = document.getElementById("cart-total");
    const whatsappBtn = document.getElementById("checkout-btn");
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

    // Adicionar itens ao carrinho
    const addButtons = document.querySelectorAll(".btn-card");
    addButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            const card = button.closest(".glass-card");
            const nome = card.querySelector("h3").innerText;
            const precoTexto = card.querySelector(".price").innerText;
            const preco = parseFloat(precoTexto.replace("R$", "").replace(",", ".").trim());

            addToCart(nome, preco);
            
            // Feedback visual rápido
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
                    <button class="remove-item" onclick="removeHandler('${item.nome}')">&times;</button>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
        }

        if(cartTotalElement) cartTotalElement.innerText = `R$ ${total.toFixed(2).replace(".", ",")}`;
    }

    // Tornar a função global para ser usada no onclick do HTML gerado dinamicamente
    window.removeHandler = function(nome) {
        removeFromCart(nome);
    };

    // Finalizar no WhatsApp
    if(whatsappBtn) {
        whatsappBtn.addEventListener("click", () => {
            if (cart.length === 0) {
                alert("Seu carrinho está vazio!");
                return;
            }

            const nomeCliente = document.getElementById("client-name")?.value || "Cliente";
            const dataNasc = document.getElementById("client-birth")?.value || "Não informado";
            
            let message = `*Novo Pedido - Magias Doce Encanto*\n\n`;
            message += `*Cliente:* ${nomeCliente}\n`;
            message += `*Nascimento:* ${dataNasc}\n\n`;
            message += `*Itens:*\n`;

            let total = 0;
            cart.forEach(item => {
                const subtotal = item.preco * item.quantidade;
                total += subtotal;
                message += `- ${item.quantidade}x ${item.nome} (R$ ${subtotal.toFixed(2)})\n`;
            });

            message += `\n*Total: R$ ${total.toFixed(2).replace(".", ",")}*`;
            message += `\n\n_Aguardo instruções para pagamento._`;

            const encodedMessage = encodeURIComponent(message);
            // Substitua pelo seu número real abaixo
            const phone = "5514999999999"; 
            window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");
        });
    }

    /* --- Animação de Scroll (Reveal) --- */
    window.addEventListener("scroll", () => {
        const reveals = document.querySelectorAll(".reveal");
        reveals.forEach(reveal => {
            const windowHeight = window.innerHeight;
            const elementTop = reveal.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add("active");
            }
        });
    });
});
