import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

// Use the Edge-safe config — no Prisma or bcrypt in this module
const { auth } = NextAuth(authConfig);

// Routes anyone can access without being logged in
const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/api/auth",
];

// Routes only USER role can access
const USER_PATHS = [
  "/island",
  "/garden",
  "/lighthouse",
  "/cave",
  "/home",
  "/treasure-box",
  "/school",
  "/fair",
  "/club-house",
  "/rest-house",
  "/profile",
];

// Routes only MODERATOR role can access
const MODERATOR_PATHS = ["/moderator"];

// Routes only ADMIN role can access
const ADMIN_PATHS = ["/admin"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = (req.auth?.user as { role?: string })?.role ?? null;
  const isAuthenticated = !!req.auth;

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const isApiAuth = pathname.startsWith("/api/auth");

  // Always allow NextAuth API routes through
  if (isApiAuth) return NextResponse.next();

  // Unauthenticated users: redirect to login (unless public path or root)
  if (!isAuthenticated && !isPublic && pathname !== "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Authenticated users on public/auth pages: redirect to welcome
  if (isAuthenticated && isPublic) {
    return NextResponse.redirect(new URL("/welcome", req.url));
  }

  // Deactivated accounts: redirect to login with error
  const accountStatus = (req.auth?.user as { accountStatus?: string })?.accountStatus;
  if (isAuthenticated && accountStatus === "DEACTIVATED") {
    return NextResponse.redirect(new URL("/login?error=AccountDeactivated", req.url));
  }

  // Role-based access control
  if (isAuthenticated) {
    const isUserPath = USER_PATHS.some((p) => pathname.startsWith(p));
    const isModeratorPath = MODERATOR_PATHS.some((p) => pathname.startsWith(p));
    const isAdminPath = ADMIN_PATHS.some((p) => pathname.startsWith(p));

    // USER trying to access moderator or admin pages
    if (role === "USER" && (isModeratorPath || isAdminPath)) {
      return NextResponse.redirect(new URL("/island", req.url));
    }

    // MODERATOR trying to access island/user pages or admin pages
    if (role === "MODERATOR" && (isUserPath || isAdminPath)) {
      return NextResponse.redirect(new URL("/moderator", req.url));
    }

    // ADMIN trying to access island/user pages or moderator pages
    if (role === "ADMIN" && (isUserPath || isModeratorPath)) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
