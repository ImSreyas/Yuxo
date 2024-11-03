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

  const RouteData: Route = await req.json();

  const lineString = `LINESTRING(${RouteData.path
    .map((coord) => coord.join(" "))
    .join(", ")})`;

  const { data, error } = await supabase.rpc("insert_route", {
    operator_id: user.id,
    route_name: RouteData.label,
    route_geometry: lineString, // Geometry in WKT format
    status: true,
    stops: RouteData.stops,
  });

  if (error) {
    return NextResponse.json(
      { success: false, data: error, message: "Data insertion failed" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: true, data: data, message: "Data inserted successfully" },
    { status: 200 }
  );
}
