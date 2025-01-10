import { NextResponse } from "next/server";
// import { cookies } from "next/headers";

const MOCK_USER = {
  email: "admin@tryalma.ai",
  password: "password",
};

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      const response = NextResponse.json({ success: true });
      response.cookies.set("auth_token", "demo_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return response;
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
