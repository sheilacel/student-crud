import dbConnect from "@/lib/mongoose";
import Siswa from "@/models/siswa";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    // ambil semua data siswa
    const siswas = await Siswa.find().sort({ createdAt: -1 });

    // return data dalam format JSON (pretty)
    return NextResponse.json(siswas, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal ambil data", details: err.message },
      { status: 500 }
    );
  }
}
