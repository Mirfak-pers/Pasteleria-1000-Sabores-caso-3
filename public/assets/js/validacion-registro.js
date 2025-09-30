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

        //Todos los datos son correctos
        let nombreUsuario = nombre;
        mensaje.innerText = `Formuario enviado correctamente`;

        //REdireccionamos
        const destino = correo.toLowerCase() === "admin@duoc.cl" ?
        `assets/page/perfilAdmin.html?nombre=${encodeURIComponent(nombreUsuario)}` :
        `assets/page/perfilCliente.html?nombre=${encodeURIComponent(nombreUsuario)}`;

        setTimeout(() =>{
            window.location.href = destino;
        }, 1000);
    });
});