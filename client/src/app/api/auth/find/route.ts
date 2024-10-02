import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { type authCheckResponse } from "@/lib/types/auth";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { email } = await request.json();

  //todo: backend validation

  const { data: userData, error: userError } = await supabase
    .from("tbl_users")
    .select("email")
    .eq("email", email)
    .single();

  const { data: operatorData, error: operatorError } = await supabase
    .from("tbl_operators")
    .select("email")
    .eq("email", email)
    .single();

  if (userError && operatorError) {
    const response: authCheckResponse = {
      success: false,
      error: {
        userErr: userError?.message,
        operatorErr: operatorError?.message,
      },
    };
    return NextResponse.json(response, { status: 200 });
  }

  const data = userData || operatorData;
  let userRole: string | null = null;
  if (data) {
    userRole = userData ? "user" : "operator";
  }

  const response: authCheckResponse = {
    success: true,
    userRole,
    data,
  };

  return NextResponse.json(response, { status: 200 });
}
