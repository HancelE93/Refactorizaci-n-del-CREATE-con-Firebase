
import { useEffect, useState } from "react";
import {
    escucharProductos,
    eliminarProducto,
    type Producto,
} from "../services/productoService";

interface Props {
    onEditar: (producto: Producto) => void;
}

export const ProductoLista = ({ onEditar }: Props) => {
    const [productos, setProductos] = useState<Producto[]>([]);

    useEffect(() => {
        const unsubscribe = escucharProductos(
            (datos) => {
                setProductos(datos);
            },
            (error) => {
                console.error("Error al obtener productos:", error);
            }
        );

        return () => {
            unsubscribe();
        };
    }, []);

    const handleEliminar = async (id: string) => {
        try {
            await eliminarProducto(id);
            console.log("Producto eliminado");
        } catch (error) {
            console.log("Error: " + error);
        }
    };

    return (
        <div className="table-container">
            <table className="custom-table">
                <thead>
                    <tr>
                        <th>ID del Documento (Firestore)</th>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Existencias</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                        <th>Categoria</th>
                    </tr>
                </thead>

                <tbody>
                    {productos.length === 0 ? (
                        <tr>
                            <td
                                colSpan={6}
                                style={{ textAlign: "center", color: "#94a3b8" }}
                            >
                                No hay productos en Firestore. Ingresa uno arriba.
                            </td>
                        </tr>
                    ) : (
                        productos.map((producto) => (
                            <tr key={producto.id}>
                                <td>
                                    <span className="doc-id-pill">{producto.id}</span>
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
                                        className={`stock-tag ${producto.stock > 6 ? "in-stock" : "low-stock"
                                            }`}
                                    >
                                        {producto.stock > 6 ? "En stock" : "Stock bajo"}
                                    </span>
                                </td>

                                <td>
                                    <span
                                        className={`stock-tag ${producto.stock > 6 ? "in-stock" : "low-stock"
                                            }`}
                                    >
                                        {producto.stock > 6 ? "En stock" : "Stock bajo"}
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
    );
};
