
import { useEffect, useState } from "react";
import {
    obtenerProductosPaginados,
    eliminarProducto,
    type Producto,
} from "../services/productoService";
import type {
    QueryDocumentSnapshot,
    DocumentData,
} from "firebase/firestore";

interface Props {
    onEditar: (producto: Producto) => void;
}

export const ProductoLista = ({ onEditar }: Props) => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [cursores, setCursores] = useState<
        QueryDocumentSnapshot<DocumentData>[]
    >([]);
    const [paginaActual, setPaginaActual] = useState(0);
    const [hayMas, setHayMas] = useState(false);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const resultado = await obtenerProductosPaginados();

                setProductos(resultado.productos);
                setHayMas(resultado.hayMas);

                if (resultado.ultimoDocumento) {
                    setCursores([resultado.ultimoDocumento]);
                }
            } catch (error) {
                console.error("Error al obtener productos:", error);
            } finally {
                setCargando(false);
            }
        };

        cargarProductos();
    }, []);

    const siguientePagina = async () => {
        if (!hayMas || cargando) return;

        setCargando(true);

        try {
            const ultimoDocumento = cursores[paginaActual];

            const resultado = await obtenerProductosPaginados(
                ultimoDocumento
            );

            if (resultado.productos.length > 0) {
                setProductos(resultado.productos);
                setPaginaActual((pagina) => pagina + 1);

                if (resultado.ultimoDocumento) {
                    setCursores((anteriores) => [
                        ...anteriores,
                        resultado.ultimoDocumento!,
                    ]);
                }

                setHayMas(resultado.hayMas);
            }
        } catch (error) {
            console.error("Error al cargar siguiente página:", error);
        } finally {
            setCargando(false);
        }
    };

    const paginaAnterior = async () => {
        if (paginaActual === 0 || cargando) return;

        setCargando(true);

        try {
            const cursorAnterior = cursores[paginaActual - 1];

            const resultado = await obtenerProductosPaginados(
                paginaActual === 1
                    ? undefined
                    : cursores[paginaActual - 2]
            );

            setProductos(resultado.productos);
            setPaginaActual((pagina) => pagina - 1);
            setHayMas(true);
        } catch (error) {
            console.error("Error al cargar página anterior:", error);
        } finally {
            setCargando(false);
        }
    };

    const handleEliminar = async (id: string) => {
        try {
            await eliminarProducto(id);

            setProductos((actuales) =>
                actuales.filter((producto) => producto.id !== id)
            );

            console.log("Producto eliminado");
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    };

    return (
        <div>
            <div className="table-container">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>ID del Documento (Firestore)</th>
                            <th>Producto</th>
                            <th>Precio</th>
                            <th>Existencias</th>
                            <th>Estado</th>
                            <th>Categoria</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {cargando ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: "center" }}>
                                    Cargando productos...
                                </td>
                            </tr>
                        ) : productos.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    style={{
                                        textAlign: "center",
                                        color: "#94a3b8",
                                    }}
                                >
                                    No hay productos en Firestore. Ingresa uno arriba.
                                </td>
                            </tr>
                        ) : (
                            productos.map((producto) => (
                                <tr key={producto.id}>
                                    <td>
                                        <span className="doc-id-pill">
                                            {producto.id}
                                        </span>
                                    </td>

                                    <td className="product-name-cell">
                                        {producto.nombre}
                                    </td>

                                    <td className="price-cell">
                                        ${Number(producto.precio).toFixed(2)}
                                    </td>

                                    <td>{producto.stock}</td>

                                    <td>
                                        <span
                                            className={`stock-tag ${
                                                producto.stock > 6
                                                    ? "in-stock"
                                                    : "low-stock"
                                            }`}
                                        >
                                            {producto.stock > 6
                                                ? "En stock"
                                                : "Stock bajo"}
                                        </span>
                                    </td>

                                    <td className="product-name-cell">
                                        {producto.categoria}
                                    </td>

                                    <td>
                                        <button
                                            type="button"
                                            onClick={() => onEditar(producto)}
                                        >
                                            Editar
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleEliminar(producto.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pagination-controls">
                <button
                    type="button"
                    onClick={paginaAnterior}
                    disabled={paginaActual === 0 || cargando}
                >
                    Anterior
                </button>

                <span>
                    Página {paginaActual + 1}
                </span>

                <button
                    type="button"
                    onClick={siguientePagina}
                    disabled={!hayMas || cargando}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};
