import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  console.log("here");
  return NextResponse.json(
    { error: "This endpoint is not implemented yet" },
    { status: 501 }
  );
}
