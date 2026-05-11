import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

function normalizeClerkPath(value: string | undefined, fallback: string) {
  const route = value ?? fallback;

  if (!/^https?:\/\//i.test(route)) {
    return route || "/";
  }

  try {
    return new URL(route).pathname || "/";
  } catch {
    return route || "/";
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
