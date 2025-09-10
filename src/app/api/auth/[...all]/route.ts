import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";

// Configure runtime to use Node.js instead of edge runtime
export const runtime = 'nodejs';

export const { POST, GET } = toNextJsHandler(auth);