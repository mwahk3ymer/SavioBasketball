import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const RegisterAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const navigate = useNavigate();

  const SECRET_CODE = "Savio2025Admin!";

  const handleRegister = async (e) => {
    e.preventDefault();

    if (adminCode !== SECRET_CODE) {
      alert("❌ Invalid admin code");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add role info to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "admin",
      });

      alert("🎉 Admin account created!");
      navigate("/admin");
    } catch (err) {
      console.error("Admin registration error:", err.message);
      alert("❌ " + err.message);
    }
  };

  return (
    <div>
      <h2>Register as Admin</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        /><br/>
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        /><br/>
        <input
          type="text"
          placeholder="Admin Code"
          value={adminCode}
          required
          onChange={(e) => setAdminCode(e.target.value)}
        /><br/>
        <button type="submit">Create Admin Account</button>
      </form>
    </div>
  );
};

export default RegisterAdmin;
