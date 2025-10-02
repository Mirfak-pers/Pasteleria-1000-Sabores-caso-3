import React, {useState} from "react";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { validarRut, validarCorreo, validarMatoriaEdad} from "../../utils/validaciones";
import { addUser} from "../../services/firestoreService";
import {userHistory} from "react-router-dom";

const UserForm= () => {
    const [from, setForm] = useState({run:"",nombre:"",correo:"",clave:"",fecha:""});
    const [msg, setMsg] = useState("");
    const history = useHistory();

    const handleChange = e => setForm({ ...form, [e.target.id]: e.target.value });


    const handleSubmit = async e => {
        e.preventDefault();
        const {run , nombre,correo,clave,fecha} = form;
        if (!validarRut(run)) return setMsg("RUN Incorrecto");
        if (!nombre) return setMsg("Nombre en blanco");
        if (!validarCorreo(correo)) return("Correo incorrecto");
        if (!validarMatoriaEdad(fecha)) return("Debe ser mayor de 18 años");

        await addUser(form);
        setMsg("Formulario enviado correctamente");
        setTimeout(() => {
            history.push(correo === "admin@duoc.cl" ? "/perfil-admin?nombre="+nombre : "/perfil-cliente?nombre="+nombre);
        }, 2000);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input id="run" label="RUN" value={form.run} onChange={handleChange} required />
            <Input id="nombre" label="Nombre" value={form.nombre} onChange={handleChange} required />
            <Input id="correo" label="Correo" type="email" value={form.correo} onChange={handleChange} required />
            <Input id="clave" label="Clave" type="password" value={form.clave} onChange={handleChange} required />
            <Input id="fecha" label="Fecha de Nacimiento" type="date" value={form.fecha} onChange={handleChange} required />
            <Button type="sumit">Enviar</Button>
            <p style={{color:"crimson"}}>{msg}</p>
        </form>
    );
};

export default UserForm;