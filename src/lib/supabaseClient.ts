
import { supabase as existingClient } from "@/integrations/supabase/client";

// Use the existing client to avoid duplicate initializations
export const supabase = existingClient;

export default supabase;
