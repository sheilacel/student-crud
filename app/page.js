"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [siswa, setSiswa] = useState([]);
  const [form, setForm] = useState({ nama: "", nis: "", email: "", kelas: "", jurusan: "SIJA" });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/siswa");
      
      if (!res.ok) {
        throw new Error("Gagal mengambil data dari server");
      }
      
      const data = await res.json();
      setSiswa(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Tidak dapat terhubung ke database. Periksa koneksi Anda.");
      setSiswa([]);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validasi form
    if (!form.nama.trim() || !form.nis.trim() || !form.email.trim() || !form.kelas.trim() || !form.jurusan.trim()) {
      setError("Semua field harus diisi!");
      return;
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Format email tidak valid!");
      return;
    }

    setSubmitting(true);

    try {
      let res;
      const formData = {
        nama: form.nama.trim(),
        nis: form.nis.trim(),
        email: form.email.trim().toLowerCase(),
        kelas: form.kelas.trim(),
        jurusan: form.jurusan.trim()
      };

      if (editingId) {
        // UPDATE
        res = await fetch(`/api/siswa/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        // CREATE
        res = await fetch("/api/siswa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Terjadi kesalahan pada server");
      }

      // Reset form dan state
      setForm({ nama: "", nis: "", email: "", kelas: "", jurusan: "SIJA" });
      setEditingId(null);
      
      // Refresh data
      await fetchData();
      
    } catch (err) {
      setError(err.message || "Gagal menyimpan data. Periksa koneksi database.");
      console.error("Error submitting form:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus data ini? Data yang dihapus tidak dapat dikembalikan.")) return;
    
    try {
      const res = await fetch(`/api/siswa/${id}`, { method: "DELETE" });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal menghapus data");
      }
      
      await fetchData();
    } catch (err) {
      setError(err.message || "Gagal menghapus data. Periksa koneksi database.");
      console.error("Error deleting data:", err);
    }
  };

  const handleEdit = (s) => {
    setForm({ nama: s.nama, nis: s.nis, email: s.email, kelas: s.kelas, jurusan: s.jurusan });
    setEditingId(s._id);
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setError("");
    setForm({ nama: "", nis: "", email: "", kelas: "", jurusan: "SIJA" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
            🎓 Student Management System
          </h1>
          <p className="text-xl opacity-90">
            Kelola data siswa dengan mudah dan modern
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-8 pb-12 relative">
        {/* Form Input */}
        <div className="bg-white backdrop-blur-sm shadow-2xl rounded-3xl p-8 mb-12 border border-gray-100 hover:shadow-3xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {editingId ? "✏️ Edit Data Siswa" : "➕ Tambah Data Siswa"}
            </h2>
            {editingId && (
              <button
                onClick={cancelEdit}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-full transition-colors duration-200 font-medium"
              >
                ❌ Batal
              </button>
            )}
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center">
                <span className="text-red-500 text-xl mr-2">⚠️</span>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">👤 Nama Lengkap</label>
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 hover:border-gray-300"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">🆔 NIS</label>
              <input
                type="text"
                placeholder="Nomor Induk Siswa"
                value={form.nis}
                onChange={(e) => setForm({ ...form, nis: e.target.value })}
                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 hover:border-gray-300"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">📧 Email</label>
              <input
                type="email"
                placeholder="contoh@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 hover:border-gray-300"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">🏫 Kelas</label>
              <input
                type="text"
                placeholder="Contoh: XII-1"
                value={form.kelas}
                onChange={(e) => setForm({ ...form, kelas: e.target.value })}
                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 hover:border-gray-300"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">📚 Jurusan</label>
              <select
                value={form.jurusan}
                onChange={(e) => setForm({ ...form, jurusan: e.target.value })}
                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 hover:border-gray-300"
              >
                <option value="SIJA">SIJA - Sistem Informasi Jaringan Aplikasi</option>
                <option value="GP">GP - Geologi Tambang</option>
                <option value="KA">KA - Kimia Analisis</option>
                <option value="TKI">TKI - Teknik Kimia Industri</option>
                <option value="TFLM">TFLM - Teknik Fabrikasi Logam Manifaktur</option>
                <option value="TP">TP - Teknik Pemesinan</option>
                <option value="TKR">TKR - Teknik Kendaraan Ringan</option>
                <option value="TBKR">TBKR - Teknik Body Kendaraan Ringan</option>
                <option value="DPIB">DPIB - Desain Permodelan Informasi Bangunan</option>
                <option value="TOI">TOI - Teknik Otomasi Industri</option>
                <option value="TITL">TITL - Teknik Instalasi Tenaga Listrik</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none transition-all duration-200"
              >
                {submitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    {editingId ? "Mengupdate..." : "Menambah..."}
                  </div>
                ) : (
                  editingId ? "🔄 Update Data" : "✨ Tambah Data"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tabel Data */}
        <div className="bg-white backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-gray-100 hover:shadow-3xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              📋 Daftar Siswa ({siswa.length})
            </h2>
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-indigo-700">
                Total: {siswa.length} siswa
              </span>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"></div>
              <p className="text-xl text-gray-500">Memuat data dari database...</p>
            </div>
          ) : error && siswa.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">⚠️</div>
              <p className="text-xl text-red-500 mb-2">Koneksi Database Bermasalah</p>
              <p className="text-gray-400 mb-4">{error}</p>
              <button
                onClick={fetchData}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                🔄 Coba Lagi
              </button>
            </div>
          ) : siswa.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-xl text-gray-500 mb-2">Belum ada data siswa</p>
              <p className="text-gray-400">Tambahkan siswa pertama Anda!</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
                    <th className="p-4 text-left font-bold text-gray-700 rounded-tl-xl">No</th>
                    <th className="p-4 text-left font-bold text-gray-700">👤 Nama</th>
                    <th className="p-4 text-left font-bold text-gray-700">🆔 NIS</th>
                    <th className="p-4 text-left font-bold text-gray-700">📧 Email</th>
                    <th className="p-4 text-left font-bold text-gray-700">🏫 Kelas</th>
                    <th className="p-4 text-left font-bold text-gray-700">📚 Jurusan</th>
                    <th className="p-4 text-center font-bold text-gray-700 rounded-tr-xl">⚙️ Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {siswa.map((s, i) => (
                    <tr key={s._id} className="border-t border-gray-100 hover:bg-gradient-to-r hover:from-indigo-25 hover:to-purple-25 transition-all duration-200">
                      <td className="p-4 text-center">
                        <span className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                          {i + 1}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-gray-800">{s.nama}</td>
                      <td className="p-4 text-gray-600 font-mono">{s.nis}</td>
                      <td className="p-4 text-blue-600 hover:text-blue-800">{s.email}</td>
                      <td className="p-4">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                          {s.kelas}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                          {s.jurusan}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(s)}
                            className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(s._id)}
                            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                          >
                            🗑️ Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}