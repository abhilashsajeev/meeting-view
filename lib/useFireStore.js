import { useState, useEffect } from "react";
import { onSnapshot, collection } from "firebase/firestore";
export const useFireStore = (mycollection) => {
  const [docs, setdocs] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, mycollection), (querySnapshot) => {
      const documents = querySnapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
        };
      });
      setdocs(documents);
    });
    return () => unsub();
  }, [mycollection]);
};
