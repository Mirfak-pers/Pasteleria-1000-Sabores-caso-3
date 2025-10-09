//Función validar el correo
function validarCorreo(correo) {
    const regex = /^[\w.+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    return regex.test(correo);
}
//Función validar el el run
function validarRun(run) {
    const regex = /^[0-9]{8}[0-9K]$/;
    return regex.test(run);
}
//Función validar el el fecha de nacimiento
function validadMayoriaEdad(fecha) {
    const hoy = new Date();
    const fechaNacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad --;
    }
    return edad >= 18;
}
// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC01DeLX515dsD29to5rHeqaWC8RV98KNg",
    authDomain: "tiendapasteleriamilsabor-a7ac6.firebaseapp.com",
    databaseURL: "https://tiendapasteleriamilsabor-a7ac6-default-rtdb.firebaseio.com", // ← ESTA LÍNEA ES CLAVE
    projectId: "tiendapasteleriamilsabor-a7ac6",
    storageBucket: "tiendapasteleriamilsabor-a7ac6.firebasestorage.app",
    messagingSenderId: "522171765461",
    appId: "1:522171765461:web:6745850bf2a9735682885c",
    measurementId: "G-08JFT3CMHR"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database(); // ← Realtime Database

document.addEventListener("DOMContentLoaded", () => {
    const runInput = document.getElementById("run");
    const nombreInput = document.getElementById("nombre");
    const correoInput = document.getElementById("correo");
    const fechaInput = document.getElementById("fecha");
    const mensaje = document.getElementById("mensaje");

    //Limpiar los mensajes al ingresar datos en los input
    [runInput, nombreInput, correoInput, fechaInput].forEach (input => {
        input.addEventListener("input", () =>{
            input.setCustomValidity("");
            mensaje.innerText = "";
        });
    });
    document.getElementById("formUsuario").addEventListener("submit", function(e) {
        e.preventDefault();

        //Limpar mensaje previos
        mensaje.innerText = "";

        //Validación del modelo del RUN
        runInput.value = runInput.value.trim().toUpperCase();
        const run = runInput.value;
        const nombre = nombreInput.value.trim();
        const correo = correoInput.value.trim();
        const fecha = fechaInput.value;

        if(!validarRun(run)) {
            runInput.setCustomValidity("El RUN es incorrecto. Debe tener 8 dígitos númericos y el verificador es K o un número");
            runInput.reportValidity();
            return;
        }

        if(nombre === "") {
            nombreInput.setCustomValidity("El nombre no debe quedar en blanco");
            nombreInput.reportValidity();
            return;
        }
        if(!validarCorreo(correo)) {
            correoInput.setCustomValidity("El corre debe ser '@duoc.cl', '@profesor.duoc.cl' o 'gmail.com'");
            correoInput.reportValidity();
            return;
        }

        if(!validadMayoriaEdad(fecha)) {
            fechaInput.setCustomValidity("Debe ser mayor de 18 años");
            fechaInput.reportValidity();
            return;
        }

// Todos los datos son válidos
    const usuarioData = {
        rut: run, // Nota: usas "run" en tu código, pero en la BD se llama "rut"
        nombre: nombre,
        correo: correo,
        fechaNacimiento: fecha // será una cadena en formato "YYYY-MM-DD"
    };

    // Guardar en Realtime Database bajo la colección "usuario"
    database.ref('usuario').push(usuarioData)
    .then(() => {
        mensaje.innerText = "Formulario enviado correctamente";
        
        const destino = correo.toLowerCase() === "admin@duoc.cl" ?
            `assets/page/perfilAdmin.html?nombre=${encodeURIComponent(nombre)}` :
            `assets/page/perfilCliente.html?nombre=${encodeURIComponent(nombre)}`;

        setTimeout(() => {
            window.location.href = destino;
        }, 1000);
    })
    .catch((error) => {
        console.error("Error al guardar en Firebase Realtime Database:", error);
        mensaje.innerText = "Error al enviar el formulario. Inténtalo más tarde.";
        mensaje.style.color = "red";
    });

    });
});