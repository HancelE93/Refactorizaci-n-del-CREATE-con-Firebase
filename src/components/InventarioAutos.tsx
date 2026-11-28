
import { useEffect, useState } from "react";

import type {
  QueryDocumentSnapshot,
  DocumentData
} from "firebase/firestore";

import {
  consultarInventarioPaginado
} from "../services/inventarioAutosService";

import type {
  VehiculoInventario,
  FiltrosInventario
} from "../services/inventarioAutosService";

import "./InventarioAutos.css";

// Fotografías gratuitas de automóviles por categoría
const obtenerImagenAuto = (tipo: string) => {
  const categoria = tipo.toLowerCase().trim();

  const imagenes: Record<string, string> = {
    suv: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=900",
    sedán: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900",
    sedan: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900",
    pickup: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900",
    hatchback: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900",
    deportivo: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900"
  };

  return imagenes[categoria] || imagenes.suv;
};

function InventarioAutos() {
  const [vehiculos, setVehiculos] = useState<VehiculoInventario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [marca, setMarca] = useState("");
  const [tipo, setTipo] = useState("");
  const [disponibles, setDisponibles] = useState(false);
  const [precioMinimo, setPrecioMinimo] = useState("");
  const [precioMaximo, setPrecioMaximo] = useState("");

  const [pagina, setPagina] = useState(1);

  const [historial, setHistorial] = useState<
    (QueryDocumentSnapshot<DocumentData> | undefined)[]
  >([undefined]);

  const [ultimoDocumento, setUltimoDocumento] = useState<
    QueryDocumentSnapshot<DocumentData> | undefined
  >();

  const [haySiguiente, setHaySiguiente] = useState(false);

  const obtenerFiltros = (): FiltrosInventario => {
    return {
      marca: marca.trim() || undefined,
      tipo: tipo.trim() || undefined,
      disponible: disponibles ? true : undefined,
      precioMinimo:
        precioMinimo !== "" ? Number(precioMinimo) : undefined,
      precioMaximo:
        precioMaximo !== "" ? Number(precioMaximo) : undefined
    };
  };

  const cargarVehiculos = async (
    filtros: FiltrosInventario = {},
    cursor?: QueryDocumentSnapshot<DocumentData>
  ) => {
    try {
      setCargando(true);
      setError("");

      const resultado = await consultarInventarioPaginado(
        filtros,
        cursor
      );

      setVehiculos(resultado.vehiculos);
      setUltimoDocumento(resultado.ultimoDocumento);

      setHaySiguiente(resultado.vehiculos.length === 10);
    } catch (err) {
      console.error("Error consultando inventario:", err);
      setError(
        "No se pudo cargar el inventario. Revisa tu conexión con Firebase."
      );
      setVehiculos([]);
      setHaySiguiente(false);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const ejecutarFiltro = async () => {
    if (
      precioMinimo !== "" &&
      precioMaximo !== "" &&
      Number(precioMinimo) > Number(precioMaximo)
    ) {
      setError("El precio mínimo no puede superar el máximo.");
      return;
    }

    if (
      (precioMinimo !== "" && Number(precioMinimo) < 0) ||
      (precioMaximo !== "" && Number(precioMaximo) < 0)
    ) {
      setError("Los precios no pueden ser negativos.");
      return;
    }

    setPagina(1);
    setHistorial([undefined]);

    await cargarVehiculos(obtenerFiltros());
  };

  const limpiarFiltros = async () => {
    setMarca("");
    setTipo("");
    setDisponibles(false);
    setPrecioMinimo("");
    setPrecioMaximo("");

    setPagina(1);
    setHistorial([undefined]);

    await cargarVehiculos();
  };

  const siguientePagina = async () => {
    if (!ultimoDocumento || !haySiguiente) return;

    const nuevoHistorial = [...historial, ultimoDocumento];

    setHistorial(nuevoHistorial);
    setPagina(pagina + 1);

    await cargarVehiculos(
      obtenerFiltros(),
      ultimoDocumento
    );
  };

  const anteriorPagina = async () => {
    if (pagina <= 1) return;

    const nuevoHistorial = historial.slice(0, -1);
    const cursorAnterior =
      nuevoHistorial[nuevoHistorial.length - 1];

    setHistorial(nuevoHistorial);
    setPagina(pagina - 1);

    await cargarVehiculos(
      obtenerFiltros(),
      cursorAnterior
    );
  };

  const formatoPrecio = (precio: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(precio);
  };

  return (
    <main className="inventario-container">

      {/* ENCABEZADO */}
      <header className="inventario-header">
        <div>
          <span className="inventario-etiqueta">
            PREMIUM AUTOMOTIVE
          </span>

          <h1>Inventario de vehículos</h1>

          <p>
            Encuentra el automóvil ideal para tu próximo viaje.
          </p>
        </div>

        <div className="inventario-icono">
          🚘
        </div>
      </header>

      {/* FILTROS */}
      <section className="filtros-panel">
        <h2>⌕ Buscar vehículos</h2>

        <div className="filtros-grid">

          <label>
            Marca
            <input
              type="text"
              placeholder="Ej. Toyota"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
            />
          </label>

          <label>
            Tipo de vehículo
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              <option value="SUV">SUV</option>
              <option value="Sedán">Sedán</option>
              <option value="Pickup">Pickup</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Deportivo">Deportivo</option>
            </select>
          </label>

          <label>
            Precio mínimo ($)
            <input
              type="number"
              min="0"
              placeholder="Ej. 10000"
              value={precioMinimo}
              onChange={(e) => setPrecioMinimo(e.target.value)}
            />
          </label>

          <label>
            Precio máximo ($)
            <input
              type="number"
              min="0"
              placeholder="Ej. 50000"
              value={precioMaximo}
              onChange={(e) => setPrecioMaximo(e.target.value)}
            />
          </label>

        </div>

        <div style={{ marginTop: "20px" }}>
          <label className="filtro-disponible">
            <input
              type="checkbox"
              checked={disponibles}
              onChange={(e) => setDisponibles(e.target.checked)}
            />
            Mostrar solamente vehículos disponibles
          </label>
        </div>

        <div className="filtros-acciones">
          <button onClick={ejecutarFiltro}>
            Buscar vehículos
          </button>

          <button
            className="boton-limpiar"
            onClick={limpiarFiltros}
          >
            Limpiar filtros
          </button>
        </div>
      </section>

      {/* RESULTADOS */}
      <section className="resultados-panel">

        <div className="resultados-titulo">
          <h2>Vehículos destacados</h2>

          <span>
            Página {pagina} · {vehiculos.length} resultados
          </span>
        </div>

        {cargando && (
          <div className="estado-mensaje">
            Cargando inventario...
          </div>
        )}

        {!cargando && error && (
          <div className="estado-error">
            {error}
          </div>
        )}

        {!cargando && !error && vehiculos.length === 0 && (
          <div className="empty-message">
            No encontramos vehículos con esos filtros.
          </div>
        )}

        {!cargando && !error && vehiculos.length > 0 && (
          <div className="vehiculos-grid">

            {vehiculos.map((vehiculo) => (
              <article
                className="vehiculo-card"
                key={vehiculo.id}
              >

                <div className="vehiculo-imagen">
                  <img
                    src={obtenerImagenAuto(vehiculo.tipo)}
                    alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900";
                    }}
                  />
                </div>

                <div className="vehiculo-info">

                  <span className="vehiculo-marca">
                    {vehiculo.marca}
                  </span>

                  <h3>{vehiculo.modelo}</h3>

                  <div className="vehiculo-detalles">
                    <span>📅 {vehiculo.anio}</span>
                    <span>🚘 {vehiculo.tipo}</span>
                    <span>⚙️ {vehiculo.especificaciones?.motor || "Motor no especificado"}</span>
                  </div>

                  <div className="vehiculo-precio">
                    {formatoPrecio(vehiculo.precio)}
                  </div>

                  <span
                    className={`vehiculo-disponibilidad ${
                      !vehiculo.disponible
                        ? "no-disponible"
                        : ""
                    }`}
                  >
                    {vehiculo.disponible
                      ? "✓ Disponible"
                      : "✕ No disponible"}
                  </span>

                </div>
              </article>
            ))}

          </div>
        )}

        {/* PAGINACIÓN */}
        {!cargando && !error && vehiculos.length > 0 && (
          <div className="paginacion">

            <button
              onClick={anteriorPagina}
              disabled={pagina === 1}
            >
              ← Anterior
            </button>

            <span>Página {pagina}</span>

            <button
              onClick={siguientePagina}
              disabled={!haySiguiente}
            >
              Siguiente →
            </button>

          </div>
        )}

      </section>

      <footer style={{
        textAlign: "center",
        color: "#64748b",
        fontSize: "12px",
        padding: "20px"
      }}>
        PREMIUM AUTOMOTIVE · Sistema de consulta con Cloud Firestore
      </footer>

    </main>
  );
}

export default InventarioAutos;
