import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/p")) {
    const url = req.nextUrl.clone();
    url.pathname = `/profile/`;
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}
