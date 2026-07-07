import { NextRequest, NextResponse } from "next/server";

const ACCESS_COOKIE_NAME = "bridge_access";
const ACCESS_COOKIE_VALUE = "granted";
const ACCESS_COOKIE_MAX_AGE = 60 * 60 * 24 * 90;
const LOCAL_ACCESS_CODE = "MGB";

function getAccessCode() {
  return process.env.BRIDGE_ACCESS_CODE ?? LOCAL_ACCESS_CODE;
}

function getRedirectPath(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.startsWith("/")) {
    return "/";
  }

  if (value.startsWith("//") || value.startsWith("/api/enter")) {
    return "/";
  }

  return value;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const submittedCode = formData.get("code");
  const redirectPath = getRedirectPath(formData.get("from"));

  if (typeof submittedCode !== "string" || submittedCode !== getAccessCode()) {
    const enterUrl = new URL("/enter", request.url);
    enterUrl.searchParams.set("error", "1");
    enterUrl.searchParams.set("from", redirectPath);

    return NextResponse.redirect(enterUrl, { status: 303 });
  }

  const response = NextResponse.redirect(new URL(redirectPath, request.url), {
    status: 303
  });

  response.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: ACCESS_COOKIE_VALUE,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ACCESS_COOKIE_MAX_AGE,
    path: "/"
  });
  response.headers.set("X-Robots-Tag", "noindex, nofollow");

  return response;
}
