
import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
} from "firebase/firestore";

import { db } from "../firebase";

export interface Vehiculo {
    id: string;
    marca: string;
    modelo: string;
    precio: number;
    stock: number;
    anio: number;
    tipo: string;
}

const vehiculosRef = collection(db, "vehiculos");

// CONSULTA 1: Vehículos disponibles por precio
export const obtenerVehiculosDisponibles = async (): Promise<Vehiculo[]> => {
    const q = query(
        vehiculosRef,
        where("stock", ">", 0),
        orderBy("stock", "asc"),
        orderBy("precio", "asc")
    );

    const resultado = await getDocs(q);

    const vehiculos: Vehiculo[] = resultado.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
    } as Vehiculo));

    return vehiculos.sort((a, b) => a.precio - b.precio);
};

// CONSULTA 2: SUV disponibles por precio
export const obtenerSUVDisponibles = async (): Promise<Vehiculo[]> => {
    const q = query(
        vehiculosRef,
        where("tipo", "==", "SUV"),
        where("stock", ">", 0),
        orderBy("stock", "asc"),
        orderBy("precio", "asc")
    );

    const resultado = await getDocs(q);

    const vehiculos: Vehiculo[] = resultado.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
    } as Vehiculo));

    return vehiculos.sort((a, b) => a.precio - b.precio);
};

// CONSULTA 3: Vehículos entre 20000 y 40000
export const obtenerVehiculosPorPrecio = async (): Promise<Vehiculo[]> => {
    const q = query(
        vehiculosRef,
        where("precio", ">=", 20000),
        where("precio", "<=", 40000),
        where("stock", ">", 0),
        orderBy("precio", "asc"),
        orderBy("stock", "asc")
    );

    const resultado = await getDocs(q);

    return resultado.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
    } as Vehiculo));
};

// CONSULTA 4: Sedan desde 2023
export const obtenerSedanRecientes = async (): Promise<Vehiculo[]> => {
    const q = query(
        vehiculosRef,
        where("tipo", "==", "Sedan"),
        where("anio", ">=", 2023),
        where("stock", ">", 0),
        orderBy("anio", "desc"),
        orderBy("stock", "desc")
    );

    const resultado = await getDocs(q);

    return resultado.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
    } as Vehiculo));
};
