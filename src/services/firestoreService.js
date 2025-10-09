import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function addUser(user) {
   try {
        const docRef = await addDoc(collection(db,"usuario"),{
            ...usuario,
            createdAt: new Date(),
        });
        console.log("usuario registrado con Id: ",docRef.id);
        return docRef;
   } catch (error) {
    console.error("Error al registrar usuario: ",error);
    throw error;
   }
}