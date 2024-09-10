import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { authMiddleware } from "./middleware/auth";

export async function middleware(request: NextRequest) {
  const { success: sessionSuccess, response: sessionResponse } = await updateSession(request);

  // todo: use the updated request in the authMiddleware (now using unchanged request object)
  const {success: authSuccess, response: authResponse} = await authMiddleware(request);
  if (!authSuccess) return authResponse

  // If no redirection or response is returned, proceed with the request
  return sessionResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - /api (API routes)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

