document.addEventListener("DOMContentLoaded", () => {
    // Formulario de Productos
    const formProducte = document.getElementById("form-producte");
    if (formProducte) {
        formProducte.addEventListener("submit", (e) => {
            let valid = true;
            clearErrors();

            const name = document.getElementById("name");
            const category = document.getElementById("category");
            const price = document.getElementById("price");
            const stock = document.getElementById("stock");

            if (!name.value.trim() || name.value.trim().length < 3) {
                showError(name, "error-name", "El nom és obligatori (mínim 3 caràcters).");
                valid = false;
            }
            if (!category.value.trim()) {
                showError(category, "error-category", "La categoria és obligatòria.");
                valid = false;
            }
            if (!price.value || parseFloat(price.value) <= 0) {
                showError(price, "error-price", "El preu ha de ser superior a 0.");
                valid = false;
            }
            if (stock.value === '' || parseInt(stock.value) < 0) {
                showError(stock, "error-stock", "L'estoc no pot ser negatiu.");
                valid = false;
            }

            if (!valid) e.preventDefault();
        });
    }

    // Formulario de Clientes
    const formClient = document.getElementById("form-client");
    if (formClient) {
        formClient.addEventListener("submit", (e) => {
            let valid = true;
            clearErrors();

            const name = document.getElementById("name");
            const email = document.getElementById("email");
            const phone = document.getElementById("phone");

            if (!name.value.trim()) {
                showError(name, "error-name", "El nom és obligatori.");
                valid = false;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
                showError(email, "error-email", "L'email ha de ser vàlid.");
                valid = false;
            }
            if (phone.value.trim().length < 9) {
                showError(phone, "error-phone", "El telèfon ha de tenir 9 números.");
                valid = false;
            }

            if (!valid) e.preventDefault();
        });
    }

    function showError(input, spanId, msg) {
        input.classList.add("error");
        document.getElementById(spanId).innerText = msg;
    }

    function clearErrors() {
        document.querySelectorAll("input").forEach(i => i.classList.remove("error"));
        document.querySelectorAll(".error-msg").forEach(s => s.innerText = "");
    }
});