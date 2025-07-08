// src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
//import { CSVLink } from "react-csv";


const downloadCSV = (data) => {
  const headers = ["Date", "Player", "Available", "Reason"];
  const rows = data.map((entry) => [
    entry.date,
    entry.player,
    entry.available ? "Yes" : "No",
    entry.reason || "-",
  ]);

  const csvContent =
    [headers, ...rows]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "availability_data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const AdminDashboard = () => {
  
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");
  const [filterPlayer, setFilterPlayer] = useState("");
  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });

  
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

//sort
  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  //pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedSubmissions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedSubmissions.length / itemsPerPage);

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
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-600">
          Showing {currentItems.length} of {sortedSubmissions.length} submissions
        </p>

       {/* ⬇️ Export Button */}
      <button
        onClick={() => downloadCSV(filteredSubmissions)}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition mb-4"
      >
        ⬇️ Export to CSV
      </button>
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
                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  📅 Date {sortConfig.key === "date" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort("player")}
                >
                  👤 Player {sortConfig.key === "player" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                
                <th className="p-3">Available?</th>
                <th className="p-3">Reason</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((entry) => (
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


     {/*pagination */} 
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === i + 1
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;