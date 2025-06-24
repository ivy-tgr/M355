import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://iuclpxuxdwyxgptpobgw.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1Y2xweHV4ZHd5eGdwdHBvYmd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2NjY2NjMsImV4cCI6MjA2NjI0MjY2M30.vU3pfYlqLcbdMF7AzzR5otI1dBsa-bndKHrjgqWoaCE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
export const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteCharacters = atob(base64.split(",")[1]);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

// Recipe Interface für TypeScript
export interface Recipe {
  id?: string;
  name: string;
  category: string;
  description: string;
  ingredients: { ingredient: string; amount: string }[];
  image_url?: string;
  created_at?: string;
}
