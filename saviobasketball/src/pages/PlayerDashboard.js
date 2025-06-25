// src/pages/PlayerDashboard.js
console.log("🔥 Current PlayerDashboard loaded");

import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const PlayerDashboard = () => {
  const [date, setDate] = useState("");
  const [isAvailable, setIsAvailable] = useState("yes");
  const [reason, setReason] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) return alert("User not logged in");

    try {
      await addDoc(collection(db, "availability"), {
        player: user.email,
        date: date,
        available: isAvailable === "yes",
        reason: isAvailable === "no" ? reason : "",
        submittedAt: Timestamp.now(),
      });

      setSuccessMsg("✅ Submitted successfully!");
      setDate("");
      setIsAvailable("yes");
      setReason("");
    } catch (err) {
      console.error("Error saving availability:", err);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Submit Your Availability</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          style={styles.input}
        />

        <label>Are you available?</label>
        <select
          value={isAvailable}
          onChange={(e) => setIsAvailable(e.target.value)}
          style={styles.input}
        >
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>

        {isAvailable === "no" && (
          <>
            <label>Reason:</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. School, injury, family..."
              required
              style={styles.textarea}
            />
          </>
        )}

        <button type="submit" style={styles.button}>Submit</button>
        {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "500px",
    margin: "60px auto",
    padding: "30px",
    border: "1px solid #ccc",
    borderRadius: "10px",
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
  },
  textarea: {
    padding: "10px",
    fontSize: "16px",
    minHeight: "60px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default PlayerDashboard;
