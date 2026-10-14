export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "What is your mother's maiden name?",
  "What was the name of your primary school?",
  "What is the name of the city where you were born?",
  "What was the model of your first car?",
  "What is your oldest sibling's name?",
  "What was your childhood nickname?"
];

const USERS_KEY = "comicgenie_users";
const SESSION_KEY = "comicgenie_session";

interface StoredUser extends User {
  password: string;
  securityQuestion?: string;
  securityAnswer?: string;
}

function getUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser(
  name: string, email: string, password: string,
  securityQuestion: string, securityAnswer: string
): { success: boolean; error?: string } {
  const users = getUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: "An account with this email already exists" };
  }
  users.push({
    id: "user_" + Date.now(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    createdAt: new Date().toISOString(),
    password: btoa(password),
    securityQuestion,
    securityAnswer: securityAnswer.trim().toLowerCase()
  });
  saveUsers(users);
  return { success: true };
}

export function loginUser(email: string, password: string): { success: boolean; user?: User; error?: string } {
  const users = getUsers();
  const found = users.find(
    u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === btoa(password)
  );
  if (!found) return { success: false, error: "Invalid email or password" };
  const user: User = { id: found.id, name: found.name, email: found.email, createdAt: found.createdAt };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return { success: true, user };
}

export function getSecurityQuestion(email: string): { found: boolean; question?: string; hasSecurityQuestion?: boolean } {
  const users = getUsers();
  const found = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!found) return { found: false };
  if (!found.securityQuestion) return { found: true, hasSecurityQuestion: false };
  return { found: true, question: found.securityQuestion, hasSecurityQuestion: true };
}

export function resetPassword(email: string, securityAnswer: string, newPassword: string): { success: boolean; error?: string } {
  const users = getUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (idx === -1) return { success: false, error: "No account found with this email" };
  const user = users[idx];
  if (!user.securityAnswer) return { success: false, error: "This account has no security question set" };
  if (user.securityAnswer !== securityAnswer.trim().toLowerCase()) {
    return { success: false, error: "Incorrect answer. Please try again." };
  }
  users[idx] = { ...user, password: btoa(newPassword) };
  saveUsers(users);
  return { success: true };
}

export function checkIfSameAsOldPassword(email: string, newPassword: string): boolean {
  const users = getUsers();
  const found = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!found) return false;
  return found.password === btoa(newPassword);
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

export function logoutUser(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}
