// src/pages/PlayerDashboard.js

import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, Timestamp, query, where, getDocs, updateDoc,  } from "firebase/firestore";

const PlayerDashboard = () => {
  const [date, setDate] = useState("");
  const [isAvailable, setIsAvailable] = useState("yes");
  const [reason, setReason] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  

  useEffect(() => {
    const user = auth.currentUser;
    if (!user || !date) return;

    const checkExistingSubmission = async () => {
      const q = query(
        collection(db, "availability"),
        where("player", "==", user.email),
        where("date", "==", date)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        console.log("📄 Found existing entry:", data);
        

        setIsAvailable(data.available ? "yes" : "no");
        setReason(data.reason || "");
      } else {
        setIsAvailable("yes");
        setReason("");
      }
    };

    checkExistingSubmission();
  }, [date]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🧪 Submit button clicked");
    console.log("🔐 Attempting to submit to Firebase");


    const user = auth.currentUser;
    if (!user) return alert("User not logged in");
    
    try {
      const availabilityRef = collection(db, "availability");

// Check if this player already submitted for this date
      const q = query(
        availabilityRef,
        where("player", "==", user.email),
        where("date", "==", date)
      );

const querySnapshot = await getDocs(q);

if (!querySnapshot.empty) {
  // Update the existing document
  const docToUpdate = querySnapshot.docs[0].ref;

  await updateDoc(docToUpdate, {
    available: isAvailable === "yes",
    reason: isAvailable === "no" ? reason : "",
    submittedAt: Timestamp.now(),
  });

  alert("✅ Your availability has been updated.");
} else {
  // No existing doc — create a new one
  await addDoc(availabilityRef, {
    player: user.email,
    date: date,
    available: isAvailable === "yes",
    reason: isAvailable === "no" ? reason : "",
    submittedAt: Timestamp.now(),
  });

  alert("✅ Thanks! Your availability has been submitted.");
}



      setSuccessMsg("✅ Submitted successfully!");
      setDate("");
      setIsAvailable("yes");
      setReason("");
    } catch (err) {
      console.error("Error saving availability:", err);
      alert("❌ Something went wrong. Please try again.");
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
