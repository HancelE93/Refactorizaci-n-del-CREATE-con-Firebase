
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";

export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
}

export const crearProducto = async (
  nombre: string,
  precio: number,
  stock: number,
  categoria: string
) => {
  const docRef = await addDoc(collection(db, "productos"), {
    nombre,
    precio,
    stock,
    categoria,
  });

  return docRef.id;
};

export const obtenerProductos = async (): Promise<Producto[]> => {
  const querySnapshot = await getDocs(collection(db, "productos"));

  const productos = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Producto[];

  return productos;
};

// Escuchar productos en tiempo real
export const escucharProductos = (
  callback: (productos: Producto[]) => void,
  onError?: (error: Error) => void
) => {
  const productosRef = collection(db, "productos");

  const unsubscribe = onSnapshot(
    productosRef,
    (querySnapshot) => {
      const productos = querySnapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
      })) as Producto[];

      callback(productos);
    },
    (error) => {
      console.error("Error al escuchar productos:", error);
      onError?.(error);
    }
  );

  return unsubscribe;
};

export const actualizarProducto = async (
  id: string,
  nombre: string,
  precio: number,
  stock: number,
  categoria: string
) => {
  const productRef = doc(db, "productos", id);

  await updateDoc(productRef, {
    nombre,
    precio,
    stock,
    categoria,
  });
};

export const eliminarProducto = async (id: string) => {
  const productoRef = doc(db, "productos", id);

  await deleteDoc(productoRef);
};
