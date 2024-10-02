import { BusForm } from "@/lib/types/bus";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { name, type, color, reg, is_ksrtc, bus_capacity }: BusForm =
    await req.json();

  if (user) {
    const userId = user.id;
    const res = await supabase
      .from("tbl_buses")
      .insert({
        bus_number: 10,
        bus_type_id: 1,
        registration_number: reg,
        bus_name: name,
        operator_id: userId,
        is_ksrtc: is_ksrtc,
        bus_color: color,
        bus_capacity: bus_capacity,
      })
      .select();

    return NextResponse.json(
      { success: true, data: res, message: "Data inserted successfully" },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { success: false, data: null, message: "Unautherized user" },
      { status: 403 }
    );
  }
}
