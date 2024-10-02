import { BusForm } from "@/lib/types/bus";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // const { name, type, color, reg, is_ksrtc, bus_capacity }: BusForm =
  //   await req.json();

  if (user) {
    const userId = user.id;
    const res = await supabase
      .from("tbl_buses")
      .select("*")
      .eq("operator_id", userId);

    return NextResponse.json(
      { success: true, response: res.data, message: "Data got successfully" },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { success: false, response: null, message: "Unautherized user" },
      { status: 403 }
    );
  }
}
