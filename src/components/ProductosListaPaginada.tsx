
import { useState } from "react";
import {
    obtenerProductosPaginados,
    type Producto
} from "../services/productoService";
import type {
    QueryDocumentSnapshot,
    DocumentData
} from "firebase/firestore";

export const ProductosListaPaginada = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [ultimoDocumento, setUltimoDocumento] =
        useState<QueryDocumentSnapshot<DocumentData>>();
    const [cargando, setCargando] = useState(false);

    const cargarPrimeraPagina = async () => {
        try {
            setCargando(true);

            const resultado = await obtenerProductosPaginados();

            setProductos(resultado.productos);
            setUltimoDocumento(resultado.ultimoDocumento);
        } catch (error) {
            console.error("Error al cargar productos:", error);
        } finally {
            setCargando(false);
        }
    };

    const siguientePagina = async () => {
        if (!ultimoDocumento) return;

        try {
            setCargando(true);

            const resultado = await obtenerProductosPaginados(ultimoDocumento);

            setProductos(resultado.productos);
            setUltimoDocumento(resultado.ultimoDocumento);
        } catch (error) {
            console.error("Error al cargar siguiente página:", error);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div>
            <h2>Productos paginados</h2>

            <button onClick={cargarPrimeraPagina} disabled={cargando}>
                Cargar productos
            </button>

            {cargando && <p>Cargando productos...</p>}

            {productos.map((producto) => (
                <div key={producto.id}>
                    <p>
                        {producto.nombre} -
                        ${producto.precio} -
                        Stock: {producto.stock}
                    </p>
                </div>
            ))}

            {productos.length > 0 && (
                <button
                    onClick={siguientePagina}
                    disabled={!ultimoDocumento || cargando}
                >
                    Siguiente
                </button>
            )}
        </div>
    );
};
