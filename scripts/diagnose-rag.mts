#!/usr/bin/env node

/**
 * Diagnose RAG status: check if knowledge_chunks table and match function exist in Supabase.
 * Run with: npx tsx scripts/diagnose-rag.mts
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
  console.error("   Set these in .env.local before running this script.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function diagnose() {
  console.log("🔍 Diagnosing RAG status...\n");

  // Check if knowledge_chunks table exists
  try {
    const { data: tables } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .eq("table_name", "knowledge_chunks");

    if (!tables || tables.length === 0) {
      console.log("❌ knowledge_chunks table DOES NOT EXIST");
      console.log("   → Run supabase/schema-rag.sql in the Supabase SQL editor to create it");
      return;
    }

    console.log("✅ knowledge_chunks table EXISTS");

    // Count rows
    const { count } = await supabase
      .from("knowledge_chunks")
      .select("*", { count: "exact", head: true });

    console.log(
      `   → Contains ${count || 0} chunks across all users\n`
    );

    // Check for v2 tables (rag_documents, rag_index_pointers, rag_retrieval_logs)
    const v2Exists = {
      rag_documents: false,
      rag_index_pointers: false,
      rag_retrieval_logs: false,
    };

    // Check for each table directly
    for (const tableName of Object.keys(v2Exists)) {
      try {
        await supabase
          .from(tableName)
          .select("*", { count: "exact", head: true });
        v2Exists[tableName as keyof typeof v2Exists] = true;
      } catch {}
    }

    if (v2Exists.rag_documents) {
      console.log("✅ RAG v2 (document registry + versioning + hybrid search) ACTIVE");
    } else {
      console.log(
        "⚠️  RAG v1 only (missing v2 hardening: dedup, versioning, hybrid search)"
      );
      console.log(
        "   → Run supabase/schema-rag-v2.sql to add document registry & versioning"
      );
    }

    // Check if match_knowledge_chunks function exists
    try {
      // Try to call the function (will fail gracefully if missing)
      const { data, error } = await supabase.rpc("match_knowledge_chunks", {
        query_embedding: Array(768).fill(0), // dummy
        match_count: 1,
        filter: {},
      });

      if (!error) {
        console.log("✅ Hybrid search function (match_knowledge_chunks_hybrid) EXISTS");
      }
    } catch {
      console.log("⚠️  match_knowledge_chunks function may not exist");
    }

    console.log("\n📋 Status Summary:");
    console.log("   RAG is " + (tables ? "ACTIVE ✅" : "DORMANT ❌"));
    console.log("\n💡 Next steps:");
    console.log("   1. If RAG is dormant, run schema-rag.sql + schema-rag-v2.sql");
    console.log("   2. Backfill old entries (run scripts/backfill-rag.mts --commit)");
    console.log("   3. Test a recall session to verify grounding in your own content");
  } catch (err) {
    console.error("❌ Error:", err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

diagnose();
