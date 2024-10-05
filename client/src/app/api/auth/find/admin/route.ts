import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { type authCheckResponse } from "@/lib/types/auth";

type responseType = {
  success: boolean;
  data?: any;
  error: any;
};

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { email } = await request.json();

  //todo: backend validation

  const { data: adminData, error: adminError } = await supabase
    .from("tbl_admins")
    .select("email")
    .eq("email", email)
    .single();

  if (adminError) {
    const response: responseType = {
      success: false,
      error: adminError,
    };
    return NextResponse.json(response, { status: 200 });
  }

  const response: authCheckResponse = {
    success: true,
    data: adminData,
  };

  return NextResponse.json(response, { status: 200 });
}
