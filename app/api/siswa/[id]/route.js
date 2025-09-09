import dbConnect from "@/lib/mongoose";
import Siswa from "@/models/siswa";
import { NextResponse } from "next/server";

// GET data siswa by ID
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const siswa = await Siswa.findById(params.id);
    if (!siswa) return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
    return NextResponse.json(siswa, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}

// UPDATE data siswa by ID
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const body = await req.json();

    // cek duplicate NIS
    if (body.nis) {
      const nisExists = await Siswa.findOne({ nis: body.nis, _id: { $ne: params.id } });
      if (nisExists) {
        return NextResponse.json({ error: "NIS sudah terdaftar!" }, { status: 400 });
      }
    }

    // cek duplicate Email
    if (body.email) {
      const emailExists = await Siswa.findOne({ email: body.email, _id: { $ne: params.id } });
      if (emailExists) {
        return NextResponse.json({ error: "Email sudah terdaftar!" }, { status: 400 });
      }
    }

    const updated = await Siswa.findByIdAndUpdate(params.id, body, { new: true });
    if (!updated) return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Gagal update data" }, { status: 400 });
  }
}

// DELETE data siswa by ID
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    await Siswa.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Data berhasil dihapus" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Gagal hapus data" }, { status: 400 });
  }
}
