// src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const AdminDashboard = () => {
  
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");
  const [filterPlayer, setFilterPlayer] = useState("");
  
  
  useEffect(() => {
    const fetchAvailability = async () => {
      const q = query(collection(db, "availability"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubmissions(data);
      setLoading(false);
    };

    fetchAvailability();
  }, []);

  const filteredSubmissions = submissions.filter((entry) => {
    const matchesDate = filterDate ? entry.date.includes(filterDate) : true;
    const matchesPlayer = filterPlayer
      ? entry.player.toLowerCase().includes(filterPlayer.toLowerCase())
      : true;
    return matchesDate && matchesPlayer;
  });

  return (
    <div className="bg-red-100 min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center text-red-700 mb-6">
        🏀 Savio Basketball Admin Dashboard
      </h1>

      <div className="flex gap-4 mb-6 flex-col sm:flex-row">
        <input
          type="text"
          placeholder="Filter by date (YYYY-MM-DD)"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="p-2 rounded border border-gray-300 w-full sm:w-1/2"
        />
        <input
          type="text"
          placeholder="Filter by player email"
          value={filterPlayer}
          onChange={(e) => setFilterPlayer(e.target.value)}
          className="p-2 rounded border border-gray-300 w-full sm:w-1/2"
        />
      </div>

      {loading ? (
        <p className="text-gray-700 text-center">Loading submissions...</p>
      ) : filteredSubmissions.length === 0 ? (
        <p className="text-center text-gray-600">No matching submissions found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-red-200 text-left">
                <th className="p-3">Date</th>
                <th className="p-3">Player</th>
                <th className="p-3">Available?</th>
                <th className="p-3">Reason</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((entry) => (
                <tr key={entry.id} className="border-t border-gray-200 hover:bg-red-50">
                  <td className="p-3">{entry.date}</td>
                  <td className="p-3">{entry.player}</td>
                  <td className="p-3">
                    {entry.available ? "✅ Yes" : "❌ No"}
                  </td>
                  <td className="p-3">{entry.reason || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
