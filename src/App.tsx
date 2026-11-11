import ProductoForm from "./components/ProductoForm";
import { ProductoLista } from "./components/ProductoLista";
import "./App.css";

function App() {
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

      <ProductoForm />
      <ProductoLista />
    </div>
  );
}

export default App;