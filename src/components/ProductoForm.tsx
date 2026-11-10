
import { useState, type FormEvent } from "react";
import { crearProducto } from "../services/productoService";

function ProductoForm() {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");

  const guardarProducto = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const id = await crearProducto({
        nombre,
        precio: Number(precio),
        stock: Number(stock),
      });

      console.log("Producto creado:", id);

      setNombre("");
      setPrecio("");
      setStock("");

    } catch (error) {
      console.error("Error al guardar producto:", error);
    }
  };

  return (
    <div>
      <h1>Registro de productos</h1>

      <form onSubmit={guardarProducto}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />

        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}

export default ProductoForm;
