import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();

  const { data, error } = await supabase.from("tbl_users").select("*");
  const response = {
    success: true,
    response: data,
  };

  return NextResponse.json(response, { status: 200 });
}
