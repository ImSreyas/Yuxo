import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type responseType = {
  success: boolean;
  data?: any;
  error: any;
};

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { email, password } = await req.json();


  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (signInError) {
    const response: responseType = {
      success: false,
      error: {
        error: signInError?.message,
      },
    };
    return NextResponse.json(response, { status: 200 });
  }
  const response: any = {
    success: true,
    data: signInData,
    error: null,
  };
  return NextResponse.json(response, { status: 200 });
}
