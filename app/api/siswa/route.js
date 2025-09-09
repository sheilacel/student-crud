import dbConnect from "@/lib/mongoose";
import Siswa from "@/models/siswa";
import { NextResponse } from "next/server";

// GET semua data siswa
export async function GET() {
  try {
    await dbConnect();
    const siswas = await Siswa.find().sort({ createdAt: -1 });
    return NextResponse.json(siswas, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}

// POST tambah data baru
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    // cek duplicate NIS
    const nisExists = await Siswa.findOne({ nis: body.nis });
    if (nisExists) {
      return NextResponse.json({ error: "NIS sudah terdaftar!" }, { status: 400 });
    }

    // cek duplicate Email
    const emailExists = await Siswa.findOne({ email: body.email });
    if (emailExists) {
      return NextResponse.json({ error: "Email sudah terdaftar!" }, { status: 400 });
    }

    const siswa = await Siswa.create(body);
    return NextResponse.json(siswa, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
