import { NextRequest, NextResponse } from "next/server";

const isAuth = (request: NextRequest) => {
  const auth = request.cookies.get("auth");
  if (!auth) return false;
  return true;
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;
  if (url == "/") {
    if (isAuth(request))
      return NextResponse.redirect(new URL("/dashboard", request.url));
    return NextResponse.next();
  }
  if (url == "/dashboard") {
    if (!isAuth(request))
      return NextResponse.redirect(new URL("/login", request.url));
    return NextResponse.next();
  }
}
