// src/pages/Login.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    //form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  const adminEmails = ["admin1@example.com", "admin2@example.com"];

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        //firebase login
      await signInWithEmailAndPassword(auth, email, password);

      // Check user role
      if (adminEmails.includes(email)) {
        navigate("/admin");
      } else {
        navigate("/player");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("Login failed. Please check your credentials.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>
          Login
        </button>
        {errorMsg && <p style={styles.error}>{errorMsg}</p>}
      </form>
      <p>
  Don’t have an account? <a href="/register">Register here</a>
</p>

    </div>
  );
};

// Simple inline styles (you can replace with Tailwind or CSS)
const styles = {
  container: {
    maxWidth: "400px",
    margin: "100px auto",
    textAlign: "center",
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "30px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  button: {
    padding: "10px",
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
};

export default Login;
