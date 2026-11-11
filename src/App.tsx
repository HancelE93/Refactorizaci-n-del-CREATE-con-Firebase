import ProductoForm from "./components/ProductoForm";
import { ProductoLista } from "./components/ProductoLista";
import "./App.css";
import { useState } from "react";
import type { Producto } from "./services/productoService"; 


function App() {

  const [productoEditar,setProdcutoEditar] = useState<Producto | null>(null);
  return (
    <div className="dashboard-wrapper">
      <div className="header-bar">
        <div>
          <h1>Panel de Inventario</h1>
          <p>Módulo de lectura y persistencia en tiempo real con Cloud Firestore</p>
        </div>
        <div className="status-badge">
          <span className="dot-pulse"></span>
          Conectado a Firestore
        </div>
      </div>

      <ProductoForm key = {productoEditar?.id ?? "nueevo"}productoEditar={productoEditar}/>
      <ProductoLista onEditar={setProdcutoEditar} />
    </div>
  );
}

export default App;