import { createClient } from "@supabase/supabase-js";
import config from "../config";

const supabaseKey = config.SUPABASE_KEY;
const supabaseUrl = config.SUPABASE_URL;

if (!supabaseKey || !supabaseUrl)
  throw new Error("SUPABASE Crediantials are not defined");

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
