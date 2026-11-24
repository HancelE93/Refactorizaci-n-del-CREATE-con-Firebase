/*
import { useEffect, useState } from "react";

import {
    obtenerVehiculosDisponibles,
    obtenerSUVDisponibles,
    obtenerVehiculosPorPrecio,
    obtenerSedanRecientes,
    type Vehiculo,
} from "./services/vehiculoService";

import "./App.css";

const imagenesVehiculos: Record<string, string> = {
    Sedan: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80",
    SUV: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80",
    Pickup: "https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=900&q=80",
    Hatchback: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
};

const formatoPrecio = (precio: number) =>
    new Intl.NumberFormat("es-EC", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(precio);

function App() {
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [titulo, setTitulo] = useState("Inventario disponible");
    const [consultaActiva, setConsultaActiva] = useState("todos");
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const cargarVehiculos = async () => {
            try {
                setCargando(true);
                const resultado = await obtenerVehiculosDisponibles();
                setVehiculos(resultado);
            } catch (error) {
                console.error(error);
                setError("No se pudieron cargar los vehículos.");
            } finally {
                setCargando(false);
            }
        };

        void cargarVehiculos();
    }, []);

    const ejecutarConsulta = async (
        consulta: () => Promise<Vehiculo[]>,
        nombre: string,
        identificador: string
    ) => {
        try {
            setCargando(true);
            setError("");
            setTitulo(nombre);
            setConsultaActiva(identificador);
            setBusqueda("");

            const resultado = await consulta();
            setVehiculos(resultado);
        } catch (error) {
            console.error("Error al ejecutar la consulta:", error);
            setError("Ocurrió un error al consultar Firestore.");
            setVehiculos([]);
        } finally {
            setCargando(false);
        }
    };

    const vehiculosFiltrados = vehiculos.filter((vehiculo) => {
        const texto = `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.tipo}`.toLowerCase();
        return texto.includes(busqueda.toLowerCase());
    });

    const unidadesStock = vehiculos.reduce(
        (total, vehiculo) => total + vehiculo.stock,
        0
    );

    const cantidadSUV = vehiculos.filter(
        (vehiculo) => vehiculo.tipo === "SUV"
    ).length;

    const cantidadSedan = vehiculos.filter(
        (vehiculo) => vehiculo.tipo === "Sedan"
    ).length;

    return (
        <main className="dashboard-wrapper">

            <header className="header-bar">
                <div className="brand-container">
                    <div className="brand-icon">A</div>
                    <div>
                        <h1>AUTOSTOCK</h1>
                        <p>Sistema de inventario vehicular</p>
                    </div>
                </div>

                <div className="status-badge">
                    <span className="dot-pulse"></span>
                    Firebase conectado
                </div>
            </header>

            <section className="welcome-section">
                <div>
                    <span className="eyebrow">PANEL DE CONTROL</span>
                    <h2>Inventario de vehículos</h2>
                    <p>Consulta y administra la información de tus vehículos.</p>
                </div>

                <div className="inventory-label">
                    <span>COLECCIÓN</span>
                    <strong>vehiculos</strong>
                </div>
            </section>

            <section className="stats-grid">
                <article className="stat-card">
                    <div className="stat-icon blue-icon">V</div>
                    <div>
                        <span>Vehículos encontrados</span>
                        <strong>{vehiculos.length}</strong>
                    </div>
                </article>

                <article className="stat-card">
                    <div className="stat-icon green-icon">S</div>
                    <div>
                        <span>Unidades en stock</span>
                        <strong>{unidadesStock}</strong>
                    </div>
                </article>

                <article className="stat-card">
                    <div className="stat-icon purple-icon">SUV</div>
                    <div>
                        <span>SUV encontrados</span>
                        <strong>{cantidadSUV}</strong>
                    </div>
                </article>

                <article className="stat-card">
                    <div className="stat-icon amber-icon">SD</div>
                    <div>
                        <span>Sedan encontrados</span>
                        <strong>{cantidadSedan}</strong>
                    </div>
                </article>
            </section>

            <section className="queries-section">
                <div className="section-heading">
                    <div>
                        <span className="eyebrow">FIRESTORE</span>
                        <h2>Consultas compuestas</h2>
                        <p>Selecciona una consulta para filtrar los vehículos.</p>
                    </div>
                </div>

                <div className="queries-buttons">
                    <button
                        className={consultaActiva === "todos" ? "active" : ""}
                        disabled={cargando}
                        onClick={() => ejecutarConsulta(
                            obtenerVehiculosDisponibles,
                            "Vehículos disponibles por precio",
                            "todos"
                        )}
                    >
                        <span>01</span>
                        Disponibles
                    </button>

                    <button
                        className={consultaActiva === "suv" ? "active" : ""}
                        disabled={cargando}
                        onClick={() => ejecutarConsulta(
                            obtenerSUVDisponibles,
                            "SUV disponibles",
                            "suv"
                        )}
                    >
                        <span>02</span>
                        SUV disponibles
                    </button>

                    <button
                        className={consultaActiva === "precio" ? "active" : ""}
                        disabled={cargando}
                        onClick={() => ejecutarConsulta(
                            obtenerVehiculosPorPrecio,
                            "Vehículos entre $20.000 y $40.000",
                            "precio"
                        )}
                    >
                        <span>03</span>
                        Rango de precios
                    </button>

                    <button
                        className={consultaActiva === "sedan" ? "active" : ""}
                        disabled={cargando}
                        onClick={() => ejecutarConsulta(
                            obtenerSedanRecientes,
                            "Sedan desde el año 2023",
                            "sedan"
                        )}
                    >
                        <span>04</span>
                        Sedan recientes
                    </button>
                </div>
            </section>

            <section className="vehicles-section">
                <div className="results-header">
                    <div>
                        <span className="eyebrow">RESULTADOS</span>
                        <h2>{titulo}</h2>
                        <p>{vehiculosFiltrados.length} vehículos encontrados</p>
                    </div>

                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Buscar marca o modelo..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                </div>

                {cargando && (
                    <div className="message-card">
                        <div className="loader"></div>
                        <p>Consultando vehículos en Firebase...</p>
                    </div>
                )}

                {error && !cargando && (
                    <div className="error-message">{error}</div>
                )}

                {!cargando && !error && vehiculosFiltrados.length === 0 && (
                    <div className="message-card">
                        <h3>No se encontraron vehículos</h3>
                        <p>Prueba otra consulta o cambia tu búsqueda.</p>
                    </div>
                )}

                {!cargando && !error && vehiculosFiltrados.length > 0 && (
                    <div className="vehicles-grid">
                        {vehiculosFiltrados.map((vehiculo) => (
                            <article className="vehicle-card" key={vehiculo.id}>
                                <div className="vehicle-image">
                                    <img
                                        src={
                                            imagenesVehiculos[vehiculo.tipo] ||
                                            imagenesVehiculos.Sedan
                                        }
                                        alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                                        loading="lazy"
                                    />

                                    <span className="vehicle-type">
                                        {vehiculo.tipo}
                                    </span>

                                    <span className="vehicle-stock">
                                        {vehiculo.stock} disponibles
                                    </span>
                                </div>

                                <div className="vehicle-info">
                                    <div className="vehicle-title">
                                        <div>
                                            <span className="vehicle-brand">
                                                {vehiculo.marca}
                                            </span>
                                            <h3>{vehiculo.modelo}</h3>
                                        </div>

                                        <span className="vehicle-year">
                                            {vehiculo.anio}
                                        </span>
                                    </div>

                                    <div className="vehicle-details">
                                        <span>Modelo {vehiculo.anio}</span>
                                        <span>Stock: {vehiculo.stock}</span>
                                    </div>

                                    <div className="vehicle-footer">
                                        <div>
                                            <span className="price-label">
                                                PRECIO
                                            </span>
                                            <strong>
                                                {formatoPrecio(vehiculo.precio)}
                                            </strong>
                                        </div>

                                        <span className="vehicle-arrow">↗</span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <footer className="dashboard-footer">
                <span>AUTOSTOCK · Inventario vehicular</span>
                <span>Consultas con Firebase Firestore</span>
            </footer>

        </main>
    );
}

export default App;
*/


/*
import { useState } from "react";
import ProductoForm from "./components/ProductoForm";
import { ProductoLista } from "./components/ProductoLista";
import type { Producto } from "./services/productoService";
import "./App.css";

function App() {
    const [productoEditar, setProductoEditar] = useState<Producto | null>(null);

    return (
        <div className="dashboard-wrapper">
            <header className="header-bar">
                <div className="brand-container">
                    <div className="brand-icon">P</div>
                    <div>
                        <h1>PRODUCT HUB</h1>
                        <p>INVENTARIO INTELIGENTE</p>
                    </div>
                </div>

                <div className="status-badge">
                    <span className="dot-pulse"></span>
                    Firestore
                </div>
            </header>

            <section className="products-welcome">
                <div>
                    <span className="eyebrow">PANEL DE ADMINISTRACIÓN</span>
                    <h2>Gestión de productos</h2>
                    <p>Administra y controla tu inventario desde un solo lugar.</p>
                </div>

                <div className="products-welcome-icon">
                    <span>▦</span>
                </div>
            </section>

            <section className="products-info-grid">
                <article className="products-info-card">
                    <div className="products-info-icon blue-icon">
                        <span>▣</span>
                    </div>
                    <div>
                        <span>Inventario</span>
                        <strong>Productos</strong>
                        <small>Registro y administración</small>
                    </div>
                </article>

                <article className="products-info-card">
                    <div className="products-info-icon green-icon">
                        <span>✓</span>
                    </div>
                    <div>
                        <span>Control</span>
                        <strong>Existencias</strong>
                        <small>Seguimiento de stock</small>
                    </div>
                </article>

                <article className="products-info-card">
                    <div className="products-info-icon purple-icon">
                        <span>◇</span>
                    </div>
                    <div>
                        <span>Organización</span>
                        <strong>Categorías</strong>
                        <small>Clasificación de productos</small>
                    </div>
                </article>

                <article className="products-info-card">
                    <div className="products-info-icon amber-icon">
                        <span>$</span>
                    </div>
                    <div>
                        <span>Valor</span>
                        <strong>Precios</strong>
                        <small>Control de precios unitarios</small>
                    </div>
                </article>
            </section>

            <section className="products-content">
                <div className="products-section-title">
                    <div>
                        <span className="eyebrow">GESTIÓN DE INVENTARIO</span>
                        <h2>
                            {productoEditar ? "Editar producto" : "Registrar producto"}
                        </h2>
                        <p>
                            {productoEditar
                                ? "Modifica la información del producto seleccionado."
                                : "Completa los campos para agregar un nuevo producto."}
                        </p>
                    </div>

                    {productoEditar && (
                        <button
                            className="cancel-edit-button"
                            type="button"
                            onClick={() => setProductoEditar(null)}
                        >
                            Cancelar edición
                        </button>
                    )}
                </div>

                <ProductoForm
                    key={productoEditar?.id ?? "nuevo"}
                    productoEditar={productoEditar}
                />

                <div className="products-list-heading">
                    <div>
                        <span className="eyebrow">BASE DE DATOS</span>
                        <h2>Inventario registrado</h2>
                        <p>Productos almacenados en Firestore.</p>
                    </div>
                    <div className="live-label">
                        <span className="dot-pulse"></span>
                        Actualización en tiempo real
                    </div>
                </div>

                <ProductoLista onEditar={setProductoEditar} />
            </section>

            <footer className="dashboard-footer">
                <span>PRODUCT HUB · Sistema de inventario</span>
                <span>Desarrollado con React + Firebase</span>
            </footer>
        </div>
    );
}

export default App;
*/
/*
import { ProductosListaPaginada } from "./components/ProductosListaPaginada";

function App() {
    return (
        <>
            <h1>Productos paginados</h1>
            <ProductosListaPaginada />
        </>
    );
}

export default App;
*/

import "./App.css";
import { VehiculoListaPaginada } from "./components/VehiculoListaPaginada";

function App() {
    return (
        <>
            <h1>Taller Práctico N.º 8</h1>
            <h2>Paginación eficiente de datos</h2>

            <VehiculoListaPaginada />
        </>
    );
}

export default App;
