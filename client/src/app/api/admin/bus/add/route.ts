import { AdminBusForm, BusForm } from "@/lib/types/bus";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const supabase = createClient();

  const { operator_id, name, type, color, reg, bus_capacity }: AdminBusForm =
    await req.json();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const adminUser = await supabase
    .from("tbl_user_roles")
    .select("*")
    .eq("id", user?.id || 0);

  if (adminUser.data) {
    const res = await supabase
      .from("tbl_buses")
      .insert({
        bus_number: 10,
        bus_type_id: 1,
        registration_number: reg,
        bus_name: name,
        operator_id: operator_id,
        is_ksrtc: true, //todo: remove this field from the db
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
