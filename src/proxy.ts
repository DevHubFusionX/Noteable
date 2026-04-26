import { NextRequest, NextResponse } from "next/server";
import { TOKEN_KEYS } from "@/lib/constants";

// const PUBLIC_PATHS = ["/", "/auth", "/docs", "/resources", "/solutions"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isDashboard = pathname.startsWith("/dashboard");
  if (!isDashboard) return NextResponse.next();
  const token = req.cookies.get(TOKEN_KEYS.access)?.value;
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
