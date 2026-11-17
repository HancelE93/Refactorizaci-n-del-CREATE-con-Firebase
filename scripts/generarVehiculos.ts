
import { collection, addDoc } from "firebase/firestore";
import { db } from "../src/firebase";

const vehiculos = [
    { marca: "Toyota", modelo: "Corolla", precio: 24500, stock: 8, anio: 2025, tipo: "Sedan" },
    { marca: "Chevrolet", modelo: "Tracker", precio: 28900, stock: 5, anio: 2024, tipo: "SUV" },
    { marca: "Ford", modelo: "Ranger", precio: 42000, stock: 3, anio: 2025, tipo: "Pickup" },
    { marca: "Kia", modelo: "Picanto", precio: 15900, stock: 12, anio: 2023, tipo: "Hatchback" },
    { marca: "Hyundai", modelo: "Tucson", precio: 35000, stock: 7, anio: 2026, tipo: "SUV" },
    { marca: "Mazda", modelo: "3", precio: 27000, stock: 6, anio: 2024, tipo: "Sedan" },
    { marca: "Nissan", modelo: "Frontier", precio: 39000, stock: 0, anio: 2022, tipo: "Pickup" },
    { marca: "Suzuki", modelo: "Swift", precio: 18000, stock: 10, anio: 2025, tipo: "Hatchback" },
    { marca: "Toyota", modelo: "RAV4", precio: 38500, stock: 4, anio: 2026, tipo: "SUV" },
    { marca: "Honda", modelo: "Civic", precio: 31000, stock: 9, anio: 2023, tipo: "Sedan" },
    { marca: "Chevrolet", modelo: "D-Max", precio: 45000, stock: 2, anio: 2024, tipo: "Pickup" },
    { marca: "Volkswagen", modelo: "Polo", precio: 19500, stock: 15, anio: 2022, tipo: "Hatchback" },
    { marca: "Kia", modelo: "Sportage", precio: 33500, stock: 6, anio: 2025, tipo: "SUV" },
    { marca: "Hyundai", modelo: "Elantra", precio: 26000, stock: 0, anio: 2023, tipo: "Sedan" },
    { marca: "Ford", modelo: "Explorer", precio: 58000, stock: 3, anio: 2026, tipo: "SUV" },
    { marca: "Mitsubishi", modelo: "L200", precio: 41000, stock: 8, anio: 2021, tipo: "Pickup" },
    { marca: "Renault", modelo: "Sandero", precio: 17000, stock: 11, anio: 2024, tipo: "Hatchback" },
    { marca: "Toyota", modelo: "Yaris", precio: 22000, stock: 7, anio: 2023, tipo: "Sedan" },
    { marca: "Nissan", modelo: "Kicks", precio: 29500, stock: 5, anio: 2025, tipo: "SUV" },
    { marca: "Chevrolet", modelo: "Onix", precio: 18500, stock: 0, anio: 2020, tipo: "Hatchback" },
];

const generarVehiculos = async () => {
    try {
        for (const vehiculo of vehiculos) {
            await addDoc(collection(db, "vehiculos"), vehiculo);
        }

        console.log("Se registraron los 20 vehículos correctamente.");
    } catch (error) {
        console.error("Error al generar vehículos:", error);
    }
};

generarVehiculos();
