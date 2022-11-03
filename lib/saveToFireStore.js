import app from "./firebase";
import dayjs from "dayjs";
import {
  getFirestore,
  collection,
  updateDoc,
  doc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";

export const db = getFirestore(app);

export const saveNewTask = async (task) => {
  const docRef = await addDoc(collection(db, "meeting_schedule"), task);
  console.log("Document written with ID: ", docRef.id);
};

export const deleteTask = async (id) => {
  const docRef = await deleteDoc(doc(db, "meeting_schedule", id));
};

export const updateExistingTask = async (id, task) => {
  const docRef = await updateDoc(doc(db, "meeting_schedule", id), task);
  console.log("Document updated with ID: ", docRef.id);
};
