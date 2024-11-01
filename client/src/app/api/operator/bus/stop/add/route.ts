import { createClient } from "@/utils/supabase/server";
import { stat } from "fs";
import { NextRequest, NextResponse } from "next/server";

type BusStop = {
  label: String;
  lat: String;
  long: String;
  stop_type: String;
};

export async function PUT(req: NextRequest) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { success: false, data: null, message: "Unauthorized user" },
      { status: 403 }
    );
  }

  const { data: roles, error: rolesError } = await supabase
    .from("tbl_user_roles")
    .select("*")
    .eq("id", user.id)
    .eq("role", "operator");

  if (rolesError || !roles || roles.length === 0) {
    return NextResponse.json(
      { success: false, data: null, message: "Not an operator" },
      { status: 403 }
    );
  }

  const data: BusStop = await req.json();

  const { data: insertData, error: insertError } = await supabase.rpc(
    "insert_bus_stop",
    {
      p_stop_name: data.label,
      p_lon: data.long,
      p_lat: data.lat,
      p_stop_type: data.stop_type,
      p_operator_id: user.id,
    }
  );

  if (insertError) {
    return NextResponse.json(
      { success: false, data: insertError, message: "Data insertion failed" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: true, data: insertData, message: "Data inserted successfully" },
    { status: 200 }
  );
}
