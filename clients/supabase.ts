import { createClient } from "@supabase/supabase-js";
import { Database } from "../supabase/databaseTypes.ts";

const url = Deno.env.get("URL") ?? "";
const key = Deno.env.get("KEY") ?? "";

export const supabase = createClient<Database>(url, key);
