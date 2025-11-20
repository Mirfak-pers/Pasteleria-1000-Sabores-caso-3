// authState.js (Firebase 8 global)
firebase.auth().onAuthStateChanged(user => {
    const contenedorAuth = document.querySelector(".auth-buttons");

    if (!contenedorAuth) return;

    if (user) {
        contenedorAuth.innerHTML = `
            <span class="user-email me-2">${user.email}</span>
            <button id="btnCerrarSesion" class="btn btn-danger btn-sm">Cerrar sesión</button>
        `;

        document
            .getElementById("btnCerrarSesion")
            .addEventListener("click", async () => {
                await firebase.auth().signOut();
                window.location.reload();
            });

    } else {
        contenedorAuth.innerHTML = `
            <a href="assets/Page/login.html" class="btn btn-primary btn-sm me-2">Iniciar Sesión</a>
            <a href="assets/Page/registro.html" class="btn btn-secondary btn-sm">Crear Cuenta</a>
        `;
    }
});
