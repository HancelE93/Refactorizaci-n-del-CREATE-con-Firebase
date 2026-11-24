
import { useState } from "react";


import {
    obtenerVehiculosPaginados,
    type Vehiculo
} from "../services/vehiculoService";

import type {
    QueryDocumentSnapshot,
    DocumentData
} from "firebase/firestore";

export const VehiculoListaPaginada = () => {

    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);

    const [ultimoDocumento, setUltimoDocumento] =
        useState<QueryDocumentSnapshot<DocumentData>>();

    const [cursores, setCursores] = useState<
        QueryDocumentSnapshot<DocumentData>[]
    >([]);

    const [cargando, setCargando] = useState(false);

    const [paginaActual, setPaginaActual] = useState(1);

    // CARGAR PRIMERA PÁGINA
    const cargarPrimeraPagina = async () => {
        try {
            setCargando(true);

            const resultado = await obtenerVehiculosPaginados();

            setVehiculos(resultado.vehiculos);
            setUltimoDocumento(resultado.ultimoDocumento);

            setPaginaActual(1);

            if (resultado.ultimoDocumento) {
                setCursores([resultado.ultimoDocumento]);
            } else {
                setCursores([]);
            }

        } catch (error) {
            console.error("Error al cargar vehículos:", error);
        } finally {
            setCargando(false);
        }
    };

    // SIGUIENTE PÁGINA
    const siguientePagina = async () => {
        if (!ultimoDocumento || cargando) return;

        try {
            setCargando(true);

            const resultado = await obtenerVehiculosPaginados(
                ultimoDocumento
            );

            if (resultado.vehiculos.length > 0) {

                setVehiculos(resultado.vehiculos);

                setUltimoDocumento(resultado.ultimoDocumento);

                setPaginaActual((pagina) => pagina + 1);

                if (resultado.ultimoDocumento) {
                    setCursores((anteriores) => [
                        ...anteriores,
                        resultado.ultimoDocumento!
                    ]);
                }
            }

        } catch (error) {
            console.error("Error al cargar siguiente página:", error);
        } finally {
            setCargando(false);
        }
    };

    // PÁGINA ANTERIOR
    const paginaAnterior = async () => {
        if (paginaActual <= 1 || cargando) return;

        try {
            setCargando(true);

            const cursorAnterior =
                paginaActual === 2
                    ? undefined
                    : cursores[paginaActual - 3];

            const resultado = await obtenerVehiculosPaginados(
                cursorAnterior
            );

            setVehiculos(resultado.vehiculos);

            setUltimoDocumento(resultado.ultimoDocumento);

            setPaginaActual((pagina) => pagina - 1);

            setCursores((anteriores) => anteriores.slice(0, -1));

        } catch (error) {
            console.error("Error al regresar de página:", error);
        } finally {
            setCargando(false);
        }
    };

  
return (
    <div className="vehiculos-dashboard">
        <header className="vehiculos-header">
            <div>
                <span className="vehiculos-eyebrow">
                    SISTEMA DE INVENTARIO
                </span>
                <h1>Gestión de vehículos</h1>
                <p>Administra y consulta tu inventario de vehículos.</p>
            </div>

            <div className="vehiculos-status">
                <span className="status-dot"></span>
                Firestore conectado
            </div>
        </header>

        <section className="vehiculos-resumen">
            <div className="resumen-card">
                <span>Registros visibles</span>
                <strong>{vehiculos.length}</strong>
                <small>Vehículos en esta página</small>
            </div>

            <div className="resumen-card">
                <span>Página actual</span>
                <strong>{paginaActual}</strong>
                <small>Navegación por Firestore</small>
            </div>

            <div className="resumen-card">
                <span>Tamaño de página</span>
                <strong>10</strong>
                <small>Documentos por consulta</small>
            </div>
        </section>

        <section className="vehiculos-panel">
            <div className="vehiculos-panel-header">
                <div>
                    <h2>Listado de vehículos</h2>
                    <p>Información registrada en la colección vehiculos</p>
                </div>

                <button
                    className="btn-cargar"
                    onClick={cargarPrimeraPagina}
                    disabled={cargando}
                >
                    {cargando ? "Cargando..." : "↻ Cargar vehículos"}
                </button>
            </div>

            {cargando && (
                <p className="vehiculos-loading">
                    Consultando Firestore...
                </p>
            )}

            <div className="vehiculos-table-container">
                <table className="vehiculos-table">
                    <thead>
                        <tr>
                            <th>VEHÍCULO</th>
                            <th>MARCA</th>
                            <th>PRECIO</th>
                            <th>STOCK</th>
                            <th>AÑO</th>
                            <th>CATEGORÍA</th>
                        </tr>
                    </thead>

                    <tbody>
                        {vehiculos.length === 0 && !cargando ? (
                            <tr>
                                <td colSpan={6} className="vehiculos-empty">
                                    No hay vehículos cargados.
                                    Presiona "Cargar vehículos" para comenzar.
                                </td>
                            </tr>
                        ) : (
                            vehiculos.map((vehiculo) => (
                                <tr key={vehiculo.id}>
                                    <td className="vehiculo-modelo">
                                        {vehiculo.modelo}
                                    </td>

                                    <td>{vehiculo.marca}</td>

                                    <td className="vehiculo-precio">
                                        ${Number(vehiculo.precio).toLocaleString("en-US")}
                                    </td>

                                    <td>
                                        <span className={`vehiculo-stock ${
                                            vehiculo.stock > 0
                                                ? "stock-disponible"
                                                : "stock-agotado"
                                        }`}>
                                            {vehiculo.stock > 0
                                                ? `${vehiculo.stock} unidades`
                                                : "Agotado"}
                                        </span>
                                    </td>

                                    <td>{vehiculo.anio}</td>

                                    <td>
                                        <span className="vehiculo-tipo">
                                            {vehiculo.tipo}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <footer className="vehiculos-pagination">
                <span>
                    Página <strong>{paginaActual}</strong>
                    {" · "}
                    {vehiculos.length} registros visibles
                </span>

                <div className="pagination-buttons">
                    <button
                        onClick={paginaAnterior}
                        disabled={paginaActual === 1 || cargando}
                    >
                        ← Anterior
                    </button>

                    <button
                        onClick={siguientePagina}
                        disabled={
                            !ultimoDocumento ||
                            vehiculos.length === 0 ||
                            cargando
                        }
                    >
                        Siguiente →
                    </button>
                </div>
            </footer>
        </section>
    </div>
);

};
