

import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
} from "firebase/firestore";

import { db } from "../src/firebase";

// Interfaz del vehículo
interface Vehiculo {
    id: string;
    marca: string;
    modelo: string;
    precio: number;
    stock: number;
    anio: number;
    tipo: string;
}

const vehiculosRef = collection(db, "vehiculos");

// CONSULTA 1: Vehículos disponibles ordenados por precio
const consulta1 = async () => {
    console.log("\nCONSULTA 1: Vehículos disponibles por precio");

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

    vehiculos.sort((a, b) => a.precio - b.precio);

    console.log(vehiculos);
};

// CONSULTA 2: SUV disponibles ordenados por precio
const consulta2 = async () => {
    console.log("\nCONSULTA 2: SUV disponibles por precio");

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

    vehiculos.sort((a, b) => a.precio - b.precio);

    console.log(vehiculos);
};

// CONSULTA 3: Vehículos entre 20000 y 40000 con stock disponible
const consulta3 = async () => {
    console.log("\nCONSULTA 3: Vehículos entre 20000 y 40000");

    const q = query(
        vehiculosRef,
        where("categoria", "==", "Deportivo"),
       // where("precio", ">=", 20000),
       // where("precio", "<=", 40000),
        where("stock", ">", 0),
        orderBy("precio", "asc"),
        //orderBy("stock", "asc")
    );

    const resultado = await getDocs(q);

    resultado.forEach((documento) => {
        console.log({
            id: documento.id,
            ...documento.data(),
        });
    });
};

// CONSULTA 4: Sedan desde 2023 ordenados por año descendente
const consulta4 = async () => {
    console.log("\nCONSULTA 4: Sedan desde 2023");

    const q = query(
        vehiculosRef,
        where("tipo", "==", "Sedan"),
        where("anio", ">=", 2023),
        where("stock", ">", 0),
        orderBy("anio", "desc"),
        orderBy("stock", "desc")
    );

    const resultado = await getDocs(q);

    resultado.forEach((documento) => {
        console.log({
            id: documento.id,
            ...documento.data(),
        });
    });
};


const consulta5 = async () => {
    console.log("\nCONSULTA 5: Prueba");

    const q = query(
        vehiculosRef,
        where("precio", ">=", 30000),
        where("precio", "<=", 45000),
        where("stock", ">", 0),
       
    );

    const resultado = await getDocs(q);

    resultado.forEach((documento) => {
        console.log({
            id: documento.id,
            ...documento.data(),
        });
    });
};

const consulta6 = async () => {
    console.log("\nCONSULTA 6: Prueba");

    const q = query(
        vehiculosRef,
        where("tipo", "==", "Sedan"),
        where("anio", ">=", 2024),
        where("stock", ">", 0),
       
    );

    const resultado = await getDocs(q);

    resultado.forEach((documento) => {
        console.log({
            id: documento.id,
            ...documento.data(),
        });
    });
};
// EJECUTAR TODAS LAS CONSULTAS
const ejecutarConsultas = async () => {
    try {
        //await consulta1();
       // await consulta2();
        //await consulta3();
       // await consulta4();
        await consulta6();
    } catch (error) {
        console.error("Error al ejecutar las consultas:", error);
    }
};

ejecutarConsultas();
