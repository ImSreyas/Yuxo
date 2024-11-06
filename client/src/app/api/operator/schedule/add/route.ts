import { createClient } from "@/utils/supabase/server";
import { stat } from "fs";
import { NextRequest, NextResponse } from "next/server";

type Route = {
  label: string;
  path: any[];
  stops: number[];
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

  const scheduleData: any = await req.json();

  const { res, error }: any = await supabase.rpc("create_schedule", {
    ...scheduleData,
    running_days: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    status: true,
    operator_id: user.id,
  });

  if (error) {
    return NextResponse.json(
      { success: false, data: error, message: "Data insertion failed" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: true, data: res, message: "Data inserted successfully" },
    { status: 200 }
  );
}
