// Vercel SSR entry point
import { createServer as createVercelServer } from "vercel/edge";

/**
 * Vercel Edge SSR - https://vercel.com/docs/frameworks/tanstack-start
 */
export default createVercelServer();