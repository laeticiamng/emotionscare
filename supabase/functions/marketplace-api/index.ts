import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } }
    );

    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    const { data: claims } = token ? await supabaseClient.auth.getClaims(token) : { data: null };
    const userId = claims?.claims?.sub;

    const { action, ...params } = await req.json();
    console.log(`[marketplace-api] Action: ${action}, User: ${userId || 'anonymous'}`);

    let result: any = {};

    switch (action) {
      // ==================== PUBLIC BROWSING ====================
      case "list_programs": {
        const { filters = {} } = params;
        let query = supabaseClient
          .from("marketplace_programs")
          .select(`
            *,
            creator:marketplace_creators(id, display_name, avatar_url, rating, badges)
          `)
          .eq("status", "published");

        if (filters.category) query = query.eq("category", filters.category);
        if (filters.format) query = query.eq("format", filters.format);
        if (filters.minPrice) query = query.gte("price_cents", filters.minPrice);
        if (filters.maxPrice) query = query.lte("price_cents", filters.maxPrice);
        if (filters.minRating) query = query.gte("rating", filters.minRating);
        if (filters.searchQuery) {
          query = query.or(`title.ilike.%${filters.searchQuery}%,short_description.ilike.%${filters.searchQuery}%`);
        }

        switch (filters.sortBy) {
          case "newest": query = query.order("published_at", { ascending: false }); break;
          case "rating": query = query.order("rating", { ascending: false }); break;
          case "price_asc": query = query.order("price_cents", { ascending: true }); break;
          case "price_desc": query = query.order("price_cents", { ascending: false }); break;
          default: query = query.order("total_purchases", { ascending: false });
        }

        const { data, error } = await query.limit(50);
        if (error) throw error;
        result = { programs: data || [] };
        break;
      }

      case "featured_programs": {
        const { data, error } = await supabaseClient
          .from("marketplace_programs")
          .select(`*, creator:marketplace_creators(id, display_name, avatar_url, rating, badges)`)
          .eq("status", "published")
          .eq("is_featured", true)
          .order("rating", { ascending: false })
          .limit(6);
        if (error) throw error;
        result = { programs: data || [] };
        break;
      }

      case "get_program": {
        const { programId } = params;
        const { data, error } = await supabaseClient
          .from("marketplace_programs")
          .select(`*, creator:marketplace_creators(*)`)
          .eq("id", programId)
          .maybeSingle();
        if (error) throw error;
        result = { program: data };
        break;
      }

      case "get_categories": {
        const categories = [
          { category: "stress_management", label: "Gestion du stress" },
          { category: "anxiety_relief", label: "Soulagement anxiété" },
          { category: "sleep_improvement", label: "Amélioration sommeil" },
          { category: "emotional_regulation", label: "Régulation émotionnelle" },
          { category: "burnout_prevention", label: "Prévention burn-out" },
          { category: "mindfulness", label: "Pleine conscience" },
          { category: "breathing_techniques", label: "Techniques respiratoires" },
          { category: "resilience_building", label: "Renforcement résilience" },
        ];

        // Get counts
        const { data: counts } = await supabaseClient
          .from("marketplace_programs")
          .select("category")
          .eq("status", "published");

        const categoryMap = new Map<string, number>();
        (counts || []).forEach((p: any) => {
          categoryMap.set(p.category, (categoryMap.get(p.category) || 0) + 1);
        });

        result = {
          categories: categories.map(c => ({
            ...c,
            count: categoryMap.get(c.category) || 0
          }))
        };
        break;
      }

      case "get_reviews": {
        const { programId } = params;
        const { data, error } = await supabaseClient
          .from("marketplace_reviews")
          .select("*")
          .eq("program_id", programId)
          .order("created_at", { ascending: false })
          .limit(50);
        if (error) throw error;
        result = { reviews: data || [] };
        break;
      }

      // ==================== USER PURCHASES ====================
      case "get_purchases": {
        if (!userId) throw new Error("Authentication required");
        const { data, error } = await supabaseClient
          .from("marketplace_purchases")
          .select(`*, program:marketplace_programs(*, creator:marketplace_creators(display_name, avatar_url))`)
          .eq("user_id", userId)
          .order("purchased_at", { ascending: false });
        if (error) throw error;
        result = { purchases: data || [] };
        break;
      }

      case "complete_module": {
        if (!userId) throw new Error("Authentication required");
        const { purchaseId, moduleId } = params;
        
        const { data: purchase } = await supabaseClient
          .from("marketplace_purchases")
          .select("completed_modules, program:marketplace_programs(modules)")
          .eq("id", purchaseId)
          .eq("user_id", userId)
          .maybeSingle();

        if (!purchase) throw new Error("Purchase not found");

        const completedModules = [...(purchase.completed_modules || []), moduleId];
        const totalModules = (purchase.program?.modules as any[])?.length || 1;
        const progressPercent = Math.round((completedModules.length / totalModules) * 100);

        const { error } = await supabaseClient
          .from("marketplace_purchases")
          .update({ completed_modules: completedModules, progress_percent: progressPercent })
          .eq("id", purchaseId);
        if (error) throw error;
        result = { success: true };
        break;
      }

      case "submit_review": {
        if (!userId) throw new Error("Authentication required");
        const { programId, rating, comment } = params;

        // Verify purchase exists
        const { data: purchase } = await supabaseClient
          .from("marketplace_purchases")
          .select("id")
          .eq("user_id", userId)
          .eq("program_id", programId)
          .eq("status", "completed")
          .maybeSingle();

        if (!purchase) throw new Error("Vous devez avoir acheté ce programme pour laisser un avis");

        const { error } = await supabaseClient
          .from("marketplace_reviews")
          .upsert({
            user_id: userId,
            program_id: programId,
            rating,
            comment
          }, { onConflict: "user_id,program_id" });
        if (error) throw error;
        result = { success: true };
        break;
      }

      // ==================== CREATOR DASHBOARD ====================
      case "get_creator_profile": {
        if (!userId) throw new Error("Authentication required");
        const { data, error } = await supabaseClient
          .from("marketplace_creators")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();
        if (error) throw error;
        result = { creator: data };
        break;
      }

      case "get_creator_stats": {
        if (!userId) throw new Error("Authentication required");
        const { data: creator } = await supabaseClient
          .from("marketplace_creators")
          .select("id")
          .eq("user_id", userId)
          .maybeSingle();

        if (!creator) throw new Error("Creator profile not found");

        const { data: programs } = await supabaseClient
          .from("marketplace_programs")
          .select("id, status, total_purchases, price_cents, rating, review_count")
          .eq("creator_id", creator.id);

        const publishedPrograms = (programs || []).filter((p: any) => p.status === "published");
        const totalSales = publishedPrograms.reduce((sum: number, p: any) => sum + (p.total_purchases || 0), 0);
        const totalRevenue = publishedPrograms.reduce((sum: number, p: any) => sum + ((p.total_purchases || 0) * (p.price_cents || 0) * 0.8), 0);
        const avgRating = publishedPrograms.length > 0 
          ? publishedPrograms.reduce((sum: number, p: any) => sum + (p.rating || 0), 0) / publishedPrograms.length 
          : 0;

        result = {
          stats: {
            total_programs: programs?.length || 0,
            published_programs: publishedPrograms.length,
            total_sales: totalSales,
            total_revenue: Math.round(totalRevenue),
            pending_payout: Math.round(totalRevenue * 0.1), // Simplified
            this_month_sales: Math.round(totalSales * 0.3),
            this_month_revenue: Math.round(totalRevenue * 0.3),
            average_rating: avgRating,
            total_reviews: publishedPrograms.reduce((sum: number, p: any) => sum + (p.review_count || 0), 0)
          }
        };
        break;
      }

      case "get_creator_programs": {
        if (!userId) throw new Error("Authentication required");
        const { data: creator } = await supabaseClient
          .from("marketplace_creators")
          .select("id")
          .eq("user_id", userId)
          .maybeSingle();

        if (!creator) {
          result = { programs: [] };
          break;
        }

        const { data, error } = await supabaseClient
          .from("marketplace_programs")
          .select("*")
          .eq("creator_id", creator.id)
          .order("created_at", { ascending: false });
        if (error) throw error;
        result = { programs: data || [] };
        break;
      }

      case "create_program": {
        if (!userId) throw new Error("Authentication required");
        const { program } = params;

        const { data: creator } = await supabaseClient
          .from("marketplace_creators")
          .select("id")
          .eq("user_id", userId)
          .maybeSingle();

        if (!creator) throw new Error("Vous devez être un créateur vérifié");

        const { data, error } = await supabaseClient
          .from("marketplace_programs")
          .insert({
            ...program,
            creator_id: creator.id,
            status: "draft"
          })
          .select()
          .single();
        if (error) throw error;
        result = { program: data };
        break;
      }

      case "update_program": {
        if (!userId) throw new Error("Authentication required");
        const { programId, updates } = params;

        const { error } = await supabaseClient
          .from("marketplace_programs")
          .update(updates)
          .eq("id", programId);
        if (error) throw error;
        result = { success: true };
        break;
      }

      case "submit_for_review": {
        if (!userId) throw new Error("Authentication required");
        const { programId } = params;

        const { error } = await supabaseClient
          .from("marketplace_programs")
          .update({ status: "pending_review" })
          .eq("id", programId);
        if (error) throw error;
        result = { success: true };
        break;
      }

      case "get_payouts": {
        if (!userId) throw new Error("Authentication required");
        const { data: creator } = await supabaseClient
          .from("marketplace_creators")
          .select("id")
          .eq("user_id", userId)
          .maybeSingle();

        if (!creator) {
          result = { payouts: [] };
          break;
        }

        const { data, error } = await supabaseClient
          .from("marketplace_payouts")
          .select("*")
          .eq("creator_id", creator.id)
          .order("created_at", { ascending: false });
        if (error) throw error;
        result = { payouts: data || [] };
        break;
      }

      case "apply_as_creator": {
        if (!userId) throw new Error("Authentication required");
        const { display_name, bio, credentials } = params;

        const { data, error } = await supabaseClient
          .from("marketplace_creators")
          .insert({
            user_id: userId,
            display_name,
            bio,
            credentials,
            status: "pending"
          })
          .select()
          .single();
        if (error) throw error;
        result = { creator: data };
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[marketplace-api] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
