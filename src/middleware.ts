import { JWT } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware"
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default withAuth(
  (req: NextRequest & { nextauth: { token: JWT | null } }) => {
    console.log(req);
    // if (req.nextUrl.pathname.startsWith('/api') || req.nextUrl.pathname.startsWith('/_next')) {
    //   return NextResponse.next();
    // }
    // console.log(req.nextauth);
    // if (!req.nextauth.token) {
    //   const loginUrl = new URL("/api/auth/signin", req.url)
    //   loginUrl.searchParams.set('from', req.nextUrl.pathname)
    //   return NextResponse.redirect(loginUrl)
    // }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized() {
        return true
      },
    },

  }
);
