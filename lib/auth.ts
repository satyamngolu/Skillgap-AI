import "server-only";

import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "skillgap_session";

type SessionPayload = {
  userId: string;
  email: string;
  name: string;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing in .env.local");
  }

  return new TextEncoder().encode(secret);
}

export async function getCurrentUser(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();

  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      getJwtSecret(),
      {
        algorithms: ["HS256"],
      }
    );

    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string"
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
    };
  } catch {
    return null;
  }
}