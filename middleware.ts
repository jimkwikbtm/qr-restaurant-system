import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
    const isSuperAdminRoute = req.nextUrl.pathname.startsWith("/admin/super")
    const isRestaurantAdminRoute = req.nextUrl.pathname.startsWith("/admin/restaurant")
    const isBranchAdminRoute = req.nextUrl.pathname.startsWith("/admin/branch")
    const isStaffRoute = req.nextUrl.pathname.startsWith("/admin/staff")

    if (isAdminRoute && !token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    if (isSuperAdminRoute && token?.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    if (isRestaurantAdminRoute && token?.role !== "RESTAURANT_OWNER" && token?.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    if (isBranchAdminRoute && token?.role !== "BRANCH_MANAGER" && token?.role !== "MANAGER" && token?.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    if (isStaffRoute && token?.role !== "CHEF" && token?.role !== "WAITER" && token?.role !== "STAFF" && token?.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ]
}