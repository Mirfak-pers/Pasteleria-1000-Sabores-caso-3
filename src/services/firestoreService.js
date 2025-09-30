import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function addUser(user) {
    return await addDoc(collection(db, "usuario"), {...user, createdAt: new Date()});
}