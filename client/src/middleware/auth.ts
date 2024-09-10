import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const isSecurePath = (paths: string[], request: NextRequest) => {
  for (let path of paths) {
    if (request.nextUrl.pathname.startsWith(path)) {
      return true;
    }
  }
  return false;
};

export async function authMiddleware(request: NextRequest) {
  // Create Supabase client
  const supabase = createClient();

  // Fetch session information
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();

  // secure routes.
  const paths: string[] = ["/admin", "/operator"];

  if (isSecurePath(paths, request)) {
    if (!user) {
      // Redirect to login if the user does not exist
      url.pathname = "/login";
      return { success: false, response: NextResponse.redirect(url) };
    }

    // Fetch user role from the database
    const { data: userRole } = await supabase
      .from("tbl_user_roles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!userRole) {
      // Redirect to an error page if the user role could not be found
      url.pathname = "/error";
      return { success: false, response: NextResponse.redirect(url) };
    }

    // Role-based redirection
    if (
      request.nextUrl.pathname.startsWith("/admin") &&
      userRole.role !== "admin"
    ) {
      url.pathname = "/403";
      return { success: false, response: NextResponse.redirect(url) };
    }

    if (
      request.nextUrl.pathname.startsWith("/operator") &&
      userRole.role !== "operator"
    ) {
      url.pathname = "/403";
      return { success: false, response: NextResponse.redirect(url) };
    }
  }
  // Allow access if the user has the correct role
  return { success: true, response: NextResponse.next({ request }) };
}
