// src/components/ProtectedRoute.js
import React from "react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const ProtectedRoute = ({ children, role }) => {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAllowed(false);
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      if (userData?.role === role) {
        setAllowed(true);
      } else {
        setAllowed(false);
      }
    });

    return () => unsubscribe();
  }, [role]);

  if (allowed === null) return <p>Loading...</p>;
  if (!allowed) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;