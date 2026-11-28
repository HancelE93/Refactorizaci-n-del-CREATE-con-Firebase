
import { db } from "../src/firebase";
import { doc, setDoc } from "firebase/firestore";

interface Vehiculo {
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

const vehiculos: Vehiculo[] = [
  { marca: "Toyota", modelo: "Corolla", precio: 24500, anio: 2025, disponible: true, tipo: "Sedan", especificaciones: { motor: "2.0", combustible: "Gasolina", transmision: "Automatica" } },
  { marca: "Toyota", modelo: "RAV4", precio: 38500, anio: 2024, disponible: true, tipo: "SUV", especificaciones: { motor: "2.5", combustible: "Gasolina", transmision: "Automatica" } },
  { marca: "Toyota", modelo: "Hilux", precio: 42000, anio: 2023, disponible: false, tipo: "Pickup", especificaciones: { motor: "2.8", combustible: "Diesel", transmision: "Manual" } },
  { marca: "Toyota", modelo: "Yaris", precio: 19500, anio: 2025, disponible: true, tipo: "Hatchback", especificaciones: { motor: "1.5", combustible: "Gasolina", transmision: "Manual" } },
  { marca: "Toyota", modelo: "Fortuner", precio: 52000, anio: 2024, disponible: true, tipo: "SUV", especificaciones: { motor: "2.8", combustible: "Diesel", transmision: "Automatica" } },

  { marca: "Chevrolet", modelo: "Onix", precio: 18500, anio: 2024, disponible: true, tipo: "Hatchback", especificaciones: { motor: "1.0", combustible: "Gasolina", transmision: "Manual" } },
  { marca: "Chevrolet", modelo: "Tracker", precio: 27900, anio: 2025, disponible: true, tipo: "SUV", especificaciones: { motor: "1.2", combustible: "Gasolina", transmision: "Automatica" } },
  { marca: "Chevrolet", modelo: "D-Max", precio: 36500, anio: 2023, disponible: false, tipo: "Pickup", especificaciones: { motor: "3.0", combustible: "Diesel", transmision: "Manual" } },
  { marca: "Chevrolet", modelo: "Captiva", precio: 31000, anio: 2024, disponible: true, tipo: "SUV", especificaciones: { motor: "1.5", combustible: "Gasolina", transmision: "Automatica" } },
  { marca: "Chevrolet", modelo: "Joy", precio: 16500, anio: 2023, disponible: true, tipo: "Hatchback", especificaciones: { motor: "1.4", combustible: "Gasolina", transmision: "Manual" } },

  { marca: "Kia", modelo: "Sportage", precio: 34000, anio: 2025, disponible: true, tipo: "SUV", especificaciones: { motor: "2.0", combustible: "Gasolina", transmision: "Automatica" } },
  { marca: "Kia", modelo: "Rio", precio: 19000, anio: 2023, disponible: true, tipo: "Sedan", especificaciones: { motor: "1.4", combustible: "Gasolina", transmision: "Manual" } },
  { marca: "Kia", modelo: "Seltos", precio: 29500, anio: 2024, disponible: false, tipo: "SUV", especificaciones: { motor: "1.6", combustible: "Gasolina", transmision: "Automatica" } },
  { marca: "Kia", modelo: "Picanto", precio: 14500, anio: 2025, disponible: true, tipo: "Hatchback", especificaciones: { motor: "1.2", combustible: "Gasolina", transmision: "Manual" } },
  { marca: "Kia", modelo: "Sorento", precio: 48000, anio: 2024, disponible: true, tipo: "SUV", especificaciones: { motor: "2.5", combustible: "Gasolina", transmision: "Automatica" } },

  { marca: "Hyundai", modelo: "Tucson", precio: 33500, anio: 2025, disponible: true, tipo: "SUV", especificaciones: { motor: "2.0", combustible: "Gasolina", transmision: "Automatica" } },
  { marca: "Hyundai", modelo: "Accent", precio: 20500, anio: 2023, disponible: true, tipo: "Sedan", especificaciones: { motor: "1.6", combustible: "Gasolina", transmision: "Manual" } },
  { marca: "Hyundai", modelo: "Creta", precio: 27000, anio: 2024, disponible: false, tipo: "SUV", especificaciones: { motor: "1.5", combustible: "Gasolina", transmision: "Automatica" } },
  { marca: "Hyundai", modelo: "Grand i10", precio: 15500, anio: 2025, disponible: true, tipo: "Hatchback", especificaciones: { motor: "1.2", combustible: "Gasolina", transmision: "Manual" } },
  { marca: "Hyundai", modelo: "Santa Fe", precio: 45000, anio: 2024, disponible: true, tipo: "SUV", especificaciones: { motor: "2.5", combustible: "Gasolina", transmision: "Automatica" } },

  { marca: "Nissan", modelo: "Sentra", precio: 26500, anio: 2025, disponible: true, tipo: "Sedan", especificaciones: { motor: "2.0", combustible: "Gasolina", transmision: "Automatica" } },
  { marca: "Nissan", modelo: "Kicks", precio: 28500, anio: 2024, disponible: true, tipo: "SUV", especificaciones: { motor: "1.6", combustible: "Gasolina", transmision: "Automatica" } },
  { marca: "Nissan", modelo: "Frontier", precio: 39000, anio: 2023, disponible: false, tipo: "Pickup", especificaciones: { motor: "2.5", combustible: "Diesel", transmision: "Manual" } },
  { marca: "Nissan", modelo: "Versa", precio: 21000, anio: 2024, disponible: true, tipo: "Sedan", especificaciones: { motor: "1.6", combustible: "Gasolina", transmision: "Manual" } },
  { marca: "Nissan", modelo: "X-Trail", precio: 41000, anio: 2025, disponible: true, tipo: "SUV", especificaciones: { motor: "2.5", combustible: "Gasolina", transmision: "Automatica" } },

  { marca: "Mazda", modelo: "CX-5", precio: 37000, anio: 2025, disponible: true, tipo: "SUV", especificaciones: { motor: "2.5", combustible: "Gasolina", transmision: "Automatica" } },
  { marca: "Mazda", modelo: "Mazda 3", precio: 28000, anio: 2024, disponible: true, tipo: "Sedan", especificaciones: { motor: "2.0", combustible: "Gasolina", transmision: "Automatica" } },
  { marca: "Mazda", modelo: "CX-30", precio: 32000, anio: 2024, disponible: false, tipo: "SUV", especificaciones: { motor: "2.0", combustible: "Gasolina", transmision: "Automatica" } },
  { marca: "Mazda", modelo: "BT-50", precio: 39500, anio: 2023, disponible: true, tipo: "Pickup", especificaciones: { motor: "3.0", combustible: "Diesel", transmision: "Manual" } },
  { marca: "Mazda", modelo: "Mazda 2", precio: 18500, anio: 2025, disponible: true, tipo: "Hatchback", especificaciones: { motor: "1.5", combustible: "Gasolina", transmision: "Manual" } },

  { marca: "Volkswagen", modelo: "T-Cross", precio: 29000, anio: 2024, disponible: true, tipo: "SUV", especificaciones: { motor: "1.6", combustible: "Gasolina", transmision: "Automatica" } },
  { marca: "Volkswagen", modelo: "Polo", precio: 19500, anio: 2023, disponible: true, tipo: "Hatchback", especificaciones: { motor: "1.0", combustible: "Gasolina", transmision: "Manual" } },
  { marca: "Volkswagen", modelo: "Tiguan", precio: 43000, anio: 2025, disponible: false, tipo: "SUV", especificaciones: { motor: "2.0", combustible: "Gasolina", transmision: "Automatica" } },
  { marca: "Volkswagen", modelo: "Virtus", precio: 23000, anio: 2024, disponible: true, tipo: "Sedan", especificaciones: { motor: "1.6", combustible: "Gasolina", transmision: "Manual" } },
  { marca: "Volkswagen", modelo: "Amarok", precio: 46000, anio: 2025, disponible: true, tipo: "Pickup", especificaciones: { motor: "3.0", combustible: "Diesel", transmision: "Automatica" } },

  { marca: "Ford", modelo: "Ranger", precio: 44000, anio: 2025, disponible: true, tipo: "Pickup", especificaciones: { motor: "2.0", combustible: "Diesel", transmision: "Automatica" } },
  { marca: "Ford", modelo: "Territory", precio: 35000, anio: 2024, disponible: true, tipo: "SUV", especificaciones: { motor: "1.5", combustible: "Gasolina", transmision: "Automatica" } },
  { marca: "Ford", modelo: "Escape", precio: 38000, anio: 2023, disponible: false, tipo: "SUV", especificaciones: { motor: "2.0", combustible: "Gasolina", transmision: "Automatica" } },
  { marca: "Ford", modelo: "Mustang", precio: 62000, anio: 2025, disponible: true, tipo: "Deportivo", especificaciones: { motor: "5.0", combustible: "Gasolina", transmision: "Automatica" } },
  { marca: "Ford", modelo: "EcoSport", precio: 24000, anio: 2023, disponible: true, tipo: "SUV", especificaciones: { motor: "1.5", combustible: "Gasolina", transmision: "Manual" } }
];

async function cargarVehiculos() {
  try {
    console.log("Iniciando carga de vehículos...");

    for (let i = 0; i < vehiculos.length; i++) {
      const id = `AUTO${String(i + 1).padStart(3, "0")}`;

      await setDoc(doc(db, "inventario_autos", id), vehiculos[i]);

      console.log(`Vehículo ${id} guardado correctamente`);
    }

    console.log(`Carga finalizada: ${vehiculos.length} vehículos registrados.`);
  } catch (error) {
    console.error("Error al cargar vehículos:", error);
  }
}

cargarVehiculos();
