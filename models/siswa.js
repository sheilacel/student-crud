import mongoose, { Schema } from "mongoose";

const siswaSchema = new Schema(
  {
    nama: { type: String, required: true },
    nis: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    kelas: { type: String, required: true },
    jurusan: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Siswa || mongoose.model("Siswa", siswaSchema);
