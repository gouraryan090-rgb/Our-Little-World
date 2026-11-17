import crypto from "crypto";

// Password → user mapping (env se aata hai)
export function getUserFromPassword(password) {
  if (!password) return null;

  // User ke input ko SHA-256 hash me convert karo
  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  // Aryan ka check
  if (hashedPassword === process.env.ARYAN_PASS_HASH) {
    return { name: "Aryan", key: "aryan" };
  }

  // Manshi ka check
  if (hashedPassword === process.env.MANSHI_PASS_HASH) {
    return { name: "Manshi", key: "manshi" };
  }

  return null;
}