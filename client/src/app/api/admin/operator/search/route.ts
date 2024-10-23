import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  type OperatorData = {
    operator_id: string;
  };

  const supabase = createClient();

  const { operator_id }: OperatorData = await req.json();

  const { data: operatorData }: any = await supabase
    .from("tbl_operators")
    .select("*")
    .eq("operator_id", operator_id)
    .single();

  if (operatorData) {
    return NextResponse.json(
      { success: true, message: "Operator found" },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { success: false, message: "No operator found" },
      { status: 200 }
    );
  }
}
