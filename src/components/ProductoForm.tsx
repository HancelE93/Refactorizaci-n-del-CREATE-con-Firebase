import { useState, type FormEvent } from "react";
import { crearProducto } from "../services/productoService";

function ProductoForm() {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");

  const guardarProducto = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await crearProducto({
        nombre,
        precio: Number(precio),
        stock: Number(stock),
      });

      setNombre("");
      setPrecio("");
      setStock("");
      window.location.reload();
    } catch (error) {
      console.error("Error al guardar producto:", error);
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
          + Guardar
        </button>
      </form>
    </div>
  );
}

export default ProductoForm;