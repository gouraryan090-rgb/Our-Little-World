// Password → user mapping (env se aata hai)
export function getUserFromPassword(password) {
  if (!password) return null;

  if (password === process.env.ARYAN_PASS) {
    return { name: "Aryan", key: "aryan" };
  }
  if (password === process.env.MANSHI_PASS) {
    return { name: "Manshi", key: "manshi" };
  }
  return null;
}