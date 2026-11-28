
import { useState } from "react";
import type { Matricula } from "../services/matriculaService";

import {
  obtenerEstudiantesPorCurso,
  obtenerEstudianteDeCurso,
  obtenerMatriculasActivas,
  obtenerMatriculasPorAnio
} from "../services/matriculaService";

export default function ConsultasMatriculas() {
  const [cursoId, setCursoId] = useState("");
  const [estudianteId, setEstudianteId] = useState("");
  const [periodo, setPeriodo] = useState("");

  const [datos, setDatos] = useState<Matricula[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const consultar = async (
    funcion: () => Promise<Matricula[]>
  ) => {
    setCargando(true);
    setMensaje("");
    setDatos([]);

    try {
      const resultado = await funcion();

      setDatos(resultado);
      setMensaje(
        `Se encontraron ${resultado.length} matrículas.`
      );
    } catch (error) {
      console.error("Error al consultar Firestore:", error);

      setMensaje(
        error instanceof Error
          ? `Error: ${error.message}`
          : "Error desconocido al consultar Firestore."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container">
      <h1>Sistema de Consultas de Matrículas</h1>

      <p>React + TypeScript + Cloud Firestore</p>

      <hr />

      <h3>Parámetros de búsqueda</h3>

      <div className="formulario">
        <input
          type="text"
          placeholder="ID del curso (ej. CUR001)"
          value={cursoId}
          onChange={(e) => setCursoId(e.target.value)}
        />

        <input
          type="text"
          placeholder="ID del estudiante (ej. EST001)"
          value={estudianteId}
          onChange={(e) => setEstudianteId(e.target.value)}
        />

        <input
          type="text"
          placeholder="Año (ej. 2026)"
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
        />
      </div>

      <h3>Patrones de acceso</h3>

      <div className="botones">
        <button
          disabled={!cursoId.trim() || cargando}
          onClick={() =>
            consultar(() =>
              obtenerEstudiantesPorCurso(cursoId.trim())
            )
          }
        >
          1. Estudiantes por curso
        </button>

        <button
          disabled={
            !cursoId.trim() ||
            !estudianteId.trim() ||
            cargando
          }
          onClick={() =>
            consultar(() =>
              obtenerEstudianteDeCurso(
                estudianteId.trim(),
                cursoId.trim()
              )
            )
          }
        >
          2. Estudiante de un curso
        </button>

        <button
          disabled={cargando}
          onClick={() =>
            consultar(obtenerMatriculasActivas)
          }
        >
          3. Matrículas activas
        </button>

        <button
          disabled={!periodo.trim() || cargando}
          onClick={() =>
            consultar(() =>
              obtenerMatriculasPorAnio(periodo.trim())
            )
          }
        >
          4. Matrículas por año
        </button>
      </div>

      <hr />

      <h3>Resultados de la consulta</h3>

      {cargando && <p>Consultando base de datos...</p>}

      {mensaje && <p>{mensaje}</p>}

      <div className="tabla-container">
        <table>
          <thead>
            <tr>
              <th>ID estudiante</th>
              <th>Nombre</th>
              <th>ID curso</th>
              <th>Curso</th>
              <th>Estado</th>
              <th>Período</th>
            </tr>
          </thead>

          <tbody>
            {datos.map((matricula) => (
              <tr key={matricula.id}>
                <td>{matricula.estudianteId}</td>
                <td>{matricula.estudianteNombre}</td>
                <td>{matricula.cursoId}</td>
                <td>{matricula.cursoNombre}</td>
                <td>{matricula.estado}</td>
                <td>{matricula.periodo}</td>
              </tr>
            ))}

            {datos.length === 0 && !cargando && (
              <tr>
                <td colSpan={6}>
                  No hay registros para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
