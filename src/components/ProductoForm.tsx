import { useState, type SyntheticEvent } from "react";
import { actualizarProducto, crearProducto, type Producto } from "../services/productoService";


interface Props {
    productoEditar: Producto | null;
}
function ProductoForm({ productoEditar }: Props) {
    const [nombre, setNombre] = useState(productoEditar?.nombre ?? "");
    const [precio, setPrecio] = useState(productoEditar?.precio.toString() ?? "");
    const [stock, setStock] = useState(productoEditar?.stock.toString() ?? "");

    const guardarProducto = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        e.preventDefault();


        if (productoEditar) {
            await actualizarProducto(
                productoEditar.id,
                nombre,
                Number(precio),
                Number(stock)
            );

            console.log("Producto actualizado")
        } else {

            try {
                const id = await crearProducto(
                    nombre,
                    Number(precio),
                    Number(stock)
                );

                console.log("Producto creado: ", id)
                setNombre("");
                setPrecio("");
                setStock("");
            } catch (error) {
                console.error("Error al guardar producto:", error);
            }

        }
    
};

return (
    <div className="glass-panel">
        <div className="panel-header">Registrar Nuevo Item</div>
        <form onSubmit={guardarProducto} className="form-grid-layout">
            <div className="field-group">
                <label>Nombre del Producto</label>
                <input
                    type="text"
                    placeholder="Ej. Laptop Gaming"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
            </div>

            <div className="field-group">
                <label>Precio Unitario ($)</label>
                <input
                    type="number"
                    placeholder="0.00"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    required
                />
            </div>

            <div className="field-group">
                <label>Stock Disponible</label>
                <input
                    type="number"
                    placeholder="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                />
            </div>

            <button type="submit" className="btn-primary">
                {productoEditar ? "Actualizar":"Guardar"}
            </button>
        </form>
    </div>
);
}

export default ProductoForm;