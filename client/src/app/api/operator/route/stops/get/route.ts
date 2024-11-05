import { createClient } from "@/utils/supabase/server";
import { request } from "http";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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

  try {
    const requestData: any = await req.json();
    if (requestData?.routeId) {
      const { data, error } = await supabase
        .from("tbl_route_stops")
        .select(`*,tbl_bus_stops(stop_name)`)
        .eq("route_id", requestData.routeId);

      if (error) {
        return NextResponse.json(
          { success: false, data: error, message: "No route found" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { success: true, data: data, message: "Route found" },
        { status: 200 }
      );
    }
  } catch (e) {
    return NextResponse.json(
      { success: false, data: null, message: "Request body not found" },
      { status: 500 }
    );
  }
  return NextResponse.json(
    { success: false, data: null, message: "Default return" },
    { status: 500 }
  );
}
