
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";

import { db } from "../firebase";

export interface Matricula {
  id: string;
  cursoId: string;
  cursoNombre: string;
  estado: string;
  estudianteId: string;
  estudianteNombre: string;
  periodo: string;
}

const matriculasRef = collection(db, "matriculas");

// 1. Estudiantes por curso
export const obtenerEstudiantesPorCurso = async (
  cursoId: string
): Promise<Matricula[]> => {
  const q = query(
    matriculasRef,
    where("cursoId", "==", cursoId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Matricula));
};

// 2. Estudiante de un curso
export const obtenerEstudianteDeCurso = async (
  estudianteId: string,
  cursoId: string
): Promise<Matricula[]> => {
  const q = query(
    matriculasRef,
    where("estudianteId", "==", estudianteId),
    where("cursoId", "==", cursoId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Matricula));
};

// 3. Matrículas activas
export const obtenerMatriculasActivas = async (): Promise<Matricula[]> => {
  const q = query(
    matriculasRef,
    where("estado", "==", "ACTIVA")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Matricula));
};

// 4. Matrículas por año
export const obtenerMatriculasPorAnio = async (
  anio: string
): Promise<Matricula[]> => {
  const q = query(
    matriculasRef,
    where("periodo", ">=", `${anio}-`),
    where("periodo", "<", `${anio}.`)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Matricula));
};

// Consultar todas las matrículas
export const obtenerTodasLasMatriculas = async (): Promise<Matricula[]> => {
  const snapshot = await getDocs(matriculasRef);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Matricula));
};
