import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

function normalizeClerkPath(value: string | undefined, fallback: string) {
  const raw = (value ?? "").trim();
  if (!raw) return fallback;

  try {
    const pathname = /^https?:\/\//i.test(raw) ? new URL(raw).pathname : raw;
    const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
    const cleaned = normalized.replace(/\/+$/, "") || "/";
    return cleaned === "/" ? fallback : cleaned;
  } catch {
    return fallback;
  }
}

const signInUrl = normalizeClerkPath(
  process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  "/sign-in"
);
const signUpUrl = normalizeClerkPath(
  process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
  "/sign-up"
);

const isPublicRoute = createRouteMatcher([
  "/",
  "/api/projects(.*)",
  `${signInUrl}(.*)`,
  `${signUpUrl}(.*)`,
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
