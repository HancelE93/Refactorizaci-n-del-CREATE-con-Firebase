
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  type QueryConstraint,
  type QueryDocumentSnapshot,
  type DocumentData
} from "firebase/firestore";

import { db } from "../firebase";

export interface VehiculoInventario {
  id: string;
  marca: string;
  modelo: string;
  precio: number;
  anio: number;
  disponible: boolean;
  tipo: string;
  especificaciones: {
    motor: string;
    combustible: string;
    transmision: string;
  };
}

export interface FiltrosInventario {
  marca?: string;
  tipo?: string;
  disponible?: boolean;
  precioMinimo?: number;
  precioMaximo?: number;
}

const inventarioRef = collection(db, "inventario_autos");

export const consultarInventarioPaginado = async (
  filtros: FiltrosInventario = {},
  cursor?: QueryDocumentSnapshot<DocumentData>
) => {
  const condiciones: QueryConstraint[] = [];

  if (filtros.marca) {
    condiciones.push(where("marca", "==", filtros.marca));
  }

  if (filtros.tipo) {
    condiciones.push(where("tipo", "==", filtros.tipo));
  }

  if (filtros.disponible !== undefined) {
    condiciones.push(where("disponible", "==", filtros.disponible));
  }

  if (filtros.precioMinimo !== undefined) {
    condiciones.push(where("precio", ">=", filtros.precioMinimo));
  }

  if (filtros.precioMaximo !== undefined) {
    condiciones.push(where("precio", "<=", filtros.precioMaximo));
  }

  if (
    filtros.precioMinimo !== undefined ||
    filtros.precioMaximo !== undefined
  ) {
    condiciones.push(orderBy("precio", "asc"));
  } else {
    condiciones.push(orderBy("marca", "asc"));
    condiciones.push(orderBy("modelo", "asc"));
  }

  if (cursor) {
    condiciones.push(startAfter(cursor));
  }

  condiciones.push(limit(10));

  const consulta = query(inventarioRef, ...condiciones);
  const resultado = await getDocs(consulta);

  const vehiculos: VehiculoInventario[] = resultado.docs.map(documento => ({
    id: documento.id,
    ...documento.data()
  } as VehiculoInventario));

  return {
    vehiculos,
    ultimoDocumento:
      resultado.docs.length > 0
        ? resultado.docs[resultado.docs.length - 1]
        : undefined
  };
};
