import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

interface Producto {
  nombre: string;
  precio: number;
  stock: number;
}

export const crearProducto = async (producto: Producto) => {
  const docRef = await addDoc(collection(db, "productos"), {
    nombre: producto.nombre,
    precio: producto.precio,
    stock: producto.stock,
  });

  return docRef.id;
};