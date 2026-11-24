
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  startAfter,
  limit,
  type QueryDocumentSnapshot,
  type DocumentData,
  type Unsubscribe
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

export const obtenerProdcutosDispoinibles = async (): Promise<Producto[]> => {

  const consulta = query(
    collection(db, "productos"),
    where("categoria", "==", "tecnologia"),
    where("stock", ">", 0),
    where("precio", ">=", 100),
    where("precio", "<=", 500),
    limit(2),
    orderBy("precio", "asc"),
  );

  const querySnapshot = await getDocs(consulta);

  const productos = querySnapshot.docs.map((documento) => ({

    id: documento.id,
    ...documento.data(),
  })) as Producto[];

  return productos;

}

export const obtenerProductosPaginados = async (
  ultimoDocumento?: QueryDocumentSnapshot<DocumentData>
) => {
  let consulta;

  if (ultimoDocumento) {
    consulta = query(
      collection(db, "productos"),
      orderBy("precio", "asc"),
      startAfter(ultimoDocumento),
      limit(6)
    );
  } else {
    consulta = query(
      collection(db, "productos"),
      orderBy("precio", "asc"),
      limit(6)
    );
  }

  const snapshot = await getDocs(consulta);

  const hayMas = snapshot.docs.length > 5;
  const documentosPagina = snapshot.docs.slice(0, 5);

  const productos = documentosPagina.map((documento) => ({
    id: documento.id,
    ...documento.data(),
  })) as Producto[];

  const nuevoUltimoDoc =
    documentosPagina[documentosPagina.length - 1];

  return {
    productos,
    ultimoDocumento: nuevoUltimoDoc,
    hayMas,
  };
};