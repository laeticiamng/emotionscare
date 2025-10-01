export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      abonnement_biovida: {
        Row: {
          created_at: string
          email: string
          id: string
          prenom: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          prenom: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          prenom?: string
        }
        Relationships: []
      }
      abonnement_fiches: {
        Row: {
          created_at: string
          email: string
          id: string
          prenom: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          prenom: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          prenom?: string
        }
        Relationships: []
      }
      achievements: {
        Row: {
          category: string
          conditions: Json
          created_at: string | null
          description: string
          icon: string | null
          id: string
          is_hidden: boolean | null
          name: string
          rarity: string
          rewards: Json
        }
        Insert: {
          category: string
          conditions?: Json
          created_at?: string | null
          description: string
          icon?: string | null
          id?: string
          is_hidden?: boolean | null
          name: string
          rarity: string
          rewards?: Json
        }
        Update: {
          category?: string
          conditions?: Json
          created_at?: string | null
          description?: string
          icon?: string | null
          id?: string
          is_hidden?: boolean | null
          name?: string
          rarity?: string
          rewards?: Json
        }
        Relationships: []
      }
      admin_changelog: {
        Row: {
          action_type: string
          admin_user_id: string | null
          created_at: string
          field_name: string | null
          id: string
          metadata: Json | null
          new_value: Json | null
          old_value: Json | null
          reason: string | null
          record_id: string
          table_name: string
        }
        Insert: {
          action_type: string
          admin_user_id?: string | null
          created_at?: string
          field_name?: string | null
          id?: string
          metadata?: Json | null
          new_value?: Json | null
          old_value?: Json | null
          reason?: string | null
          record_id: string
          table_name: string
        }
        Update: {
          action_type?: string
          admin_user_id?: string | null
          created_at?: string
          field_name?: string | null
          id?: string
          metadata?: Json | null
          new_value?: Json | null
          old_value?: Json | null
          reason?: string | null
          record_id?: string
          table_name?: string
        }
        Relationships: []
      }
      ai_chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_coach_sessions: {
        Row: {
          coach_personality: string | null
          created_at: string | null
          emotions_detected: Json | null
          id: string
          messages_count: number | null
          resources_provided: Json | null
          session_duration: number | null
          session_notes: string | null
          techniques_suggested: string[] | null
          updated_at: string | null
          user_id: string | null
          user_satisfaction: number | null
        }
        Insert: {
          coach_personality?: string | null
          created_at?: string | null
          emotions_detected?: Json | null
          id?: string
          messages_count?: number | null
          resources_provided?: Json | null
          session_duration?: number | null
          session_notes?: string | null
          techniques_suggested?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          user_satisfaction?: number | null
        }
        Update: {
          coach_personality?: string | null
          created_at?: string | null
          emotions_detected?: Json | null
          id?: string
          messages_count?: number | null
          resources_provided?: Json | null
          session_duration?: number | null
          session_notes?: string | null
          techniques_suggested?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          user_satisfaction?: number | null
        }
        Relationships: []
      }
      ai_generated_content: {
        Row: {
          content: Json
          content_type: string
          created_at: string | null
          id: string
          identifier: string
          last_updated: string | null
          title: string
        }
        Insert: {
          content: Json
          content_type: string
          created_at?: string | null
          id?: string
          identifier: string
          last_updated?: string | null
          title: string
        }
        Update: {
          content?: Json
          content_type?: string
          created_at?: string | null
          id?: string
          identifier?: string
          last_updated?: string | null
          title?: string
        }
        Relationships: []
      }
      ai_recommendations: {
        Row: {
          confidence_score: number | null
          content_id: string
          content_type: string
          created_at: string
          estimated_time: number | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          priority_level: string
          reason: string
          recommendation_type: string
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          content_id: string
          content_type: string
          created_at?: string
          estimated_time?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          priority_level: string
          reason: string
          recommendation_type: string
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          content_id?: string
          content_type?: string
          created_at?: string
          estimated_time?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          priority_level?: string
          reason?: string
          recommendation_type?: string
          user_id?: string
        }
        Relationships: []
      }
      ambition_artifacts: {
        Row: {
          description: string | null
          icon: string | null
          id: string
          name: string
          obtained_at: string | null
          rarity: string | null
          run_id: string | null
        }
        Insert: {
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          obtained_at?: string | null
          rarity?: string | null
          run_id?: string | null
        }
        Update: {
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          obtained_at?: string | null
          rarity?: string | null
          run_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ambition_artifacts_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "ambition_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      ambition_quests: {
        Row: {
          completed_at: string | null
          created_at: string | null
          est_minutes: number | null
          flavor: string | null
          id: string
          notes: string | null
          result: string | null
          run_id: string | null
          status: string | null
          title: string
          xp_reward: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          est_minutes?: number | null
          flavor?: string | null
          id?: string
          notes?: string | null
          result?: string | null
          run_id?: string | null
          status?: string | null
          title: string
          xp_reward?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          est_minutes?: number | null
          flavor?: string | null
          id?: string
          notes?: string | null
          result?: string | null
          run_id?: string | null
          status?: string | null
          title?: string
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ambition_quests_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "ambition_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      ambition_runs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          objective: string | null
          status: string | null
          tags: string[] | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          objective?: string | null
          status?: string | null
          tags?: string[] | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          objective?: string | null
          status?: string | null
          tags?: string[] | null
          user_id?: string | null
        }
        Relationships: []
      }
      api_integrations: {
        Row: {
          base_url: string
          configuration: Json
          created_at: string
          id: string
          is_optimized: boolean | null
          name: string
          performance_metrics: Json | null
          updated_at: string
          version: string
        }
        Insert: {
          base_url: string
          configuration?: Json
          created_at?: string
          id?: string
          is_optimized?: boolean | null
          name: string
          performance_metrics?: Json | null
          updated_at?: string
          version?: string
        }
        Update: {
          base_url?: string
          configuration?: Json
          created_at?: string
          id?: string
          is_optimized?: boolean | null
          name?: string
          performance_metrics?: Json | null
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      assessments: {
        Row: {
          created_at: string
          id: string
          instrument: string
          score_json: Json
          ts: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          instrument: string
          score_json: Json
          ts?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          instrument?: string
          score_json?: Json
          ts?: string
          user_id?: string
        }
        Relationships: []
      }
      audio_tracks: {
        Row: {
          created_at: string
          duration: number | null
          file_path: string | null
          file_url: string | null
          id: string
          is_muted: boolean | null
          is_solo: boolean | null
          name: string
          order: number | null
          project_id: string
          type: string
          volume: number | null
        }
        Insert: {
          created_at?: string
          duration?: number | null
          file_path?: string | null
          file_url?: string | null
          id?: string
          is_muted?: boolean | null
          is_solo?: boolean | null
          name: string
          order?: number | null
          project_id: string
          type: string
          volume?: number | null
        }
        Update: {
          created_at?: string
          duration?: number | null
          file_path?: string | null
          file_url?: string | null
          id?: string
          is_muted?: boolean | null
          is_solo?: boolean | null
          name?: string
          order?: number | null
          project_id?: string
          type?: string
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "audio_tracks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "recording_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_fixes: {
        Row: {
          applied: boolean | null
          applied_at: string | null
          created_at: string
          fix_script: string
          fix_type: string
          id: string
          issue_id: string | null
          result: Json | null
          rollback_script: string | null
        }
        Insert: {
          applied?: boolean | null
          applied_at?: string | null
          created_at?: string
          fix_script: string
          fix_type: string
          id?: string
          issue_id?: string | null
          result?: Json | null
          rollback_script?: string | null
        }
        Update: {
          applied?: boolean | null
          applied_at?: string | null
          created_at?: string
          fix_script?: string
          fix_type?: string
          id?: string
          issue_id?: string | null
          result?: Json | null
          rollback_script?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_fixes_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "audit_issues"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_issues: {
        Row: {
          affected_column: string | null
          affected_component: string | null
          affected_file: string | null
          affected_table: string | null
          auto_fixable: boolean | null
          created_at: string
          description: string
          fixed: boolean | null
          id: string
          issue_type: string
          metadata: Json | null
          report_id: string | null
          severity: string
          suggestion: string | null
          title: string
        }
        Insert: {
          affected_column?: string | null
          affected_component?: string | null
          affected_file?: string | null
          affected_table?: string | null
          auto_fixable?: boolean | null
          created_at?: string
          description: string
          fixed?: boolean | null
          id?: string
          issue_type: string
          metadata?: Json | null
          report_id?: string | null
          severity: string
          suggestion?: string | null
          title: string
        }
        Update: {
          affected_column?: string | null
          affected_component?: string | null
          affected_file?: string | null
          affected_table?: string | null
          auto_fixable?: boolean | null
          created_at?: string
          description?: string
          fixed?: boolean | null
          id?: string
          issue_type?: string
          metadata?: Json | null
          report_id?: string | null
          severity?: string
          suggestion?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_issues_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "audit_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_reports: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string | null
          findings: Json | null
          id: string
          metrics: Json | null
          recommendations: Json | null
          report_type: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          findings?: Json | null
          id?: string
          metrics?: Json | null
          recommendations?: Json | null
          report_type: string
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          findings?: Json | null
          id?: string
          metrics?: Json | null
          recommendations?: Json | null
          report_type?: string
          status?: string
        }
        Relationships: []
      }
      aura_connections: {
        Row: {
          connection_strength: number
          created_at: string | null
          id: string
          interaction_types: Json | null
          last_interaction_at: string | null
          user_id_a: string
          user_id_b: string
        }
        Insert: {
          connection_strength?: number
          created_at?: string | null
          id?: string
          interaction_types?: Json | null
          last_interaction_at?: string | null
          user_id_a: string
          user_id_b: string
        }
        Update: {
          connection_strength?: number
          created_at?: string | null
          id?: string
          interaction_types?: Json | null
          last_interaction_at?: string | null
          user_id_a?: string
          user_id_b?: string
        }
        Relationships: []
      }
      aura_history: {
        Row: {
          color_hue: number
          created_at: string | null
          id: string
          luminosity: number
          size_scale: number
          snapshot_data: Json | null
          user_id: string
          week_end: string
          week_start: string
          who5_badge: string | null
        }
        Insert: {
          color_hue: number
          created_at?: string | null
          id?: string
          luminosity: number
          size_scale: number
          snapshot_data?: Json | null
          user_id: string
          week_end: string
          week_start: string
          who5_badge?: string | null
        }
        Update: {
          color_hue?: number
          created_at?: string | null
          id?: string
          luminosity?: number
          size_scale?: number
          snapshot_data?: Json | null
          user_id?: string
          week_end?: string
          week_start?: string
          who5_badge?: string | null
        }
        Relationships: []
      }
      backup_edn_items_immersive: {
        Row: {
          audio_ambiance: Json | null
          created_at: string | null
          id: string | null
          interaction_config: Json | null
          item_code: string | null
          paroles_musicales: string[] | null
          payload_v2: Json | null
          pitch_intro: string | null
          quiz_questions: Json | null
          reward_messages: Json | null
          scene_immersive: Json | null
          slug: string | null
          subtitle: string | null
          tableau_rang_a: Json | null
          tableau_rang_b: Json | null
          title: string | null
          updated_at: string | null
          visual_ambiance: Json | null
        }
        Insert: {
          audio_ambiance?: Json | null
          created_at?: string | null
          id?: string | null
          interaction_config?: Json | null
          item_code?: string | null
          paroles_musicales?: string[] | null
          payload_v2?: Json | null
          pitch_intro?: string | null
          quiz_questions?: Json | null
          reward_messages?: Json | null
          scene_immersive?: Json | null
          slug?: string | null
          subtitle?: string | null
          tableau_rang_a?: Json | null
          tableau_rang_b?: Json | null
          title?: string | null
          updated_at?: string | null
          visual_ambiance?: Json | null
        }
        Update: {
          audio_ambiance?: Json | null
          created_at?: string | null
          id?: string | null
          interaction_config?: Json | null
          item_code?: string | null
          paroles_musicales?: string[] | null
          payload_v2?: Json | null
          pitch_intro?: string | null
          quiz_questions?: Json | null
          reward_messages?: Json | null
          scene_immersive?: Json | null
          slug?: string | null
          subtitle?: string | null
          tableau_rang_a?: Json | null
          tableau_rang_b?: Json | null
          title?: string | null
          updated_at?: string | null
          visual_ambiance?: Json | null
        }
        Relationships: []
      }
      backup_edn_items_immersive_final: {
        Row: {
          audio_ambiance: Json | null
          created_at: string | null
          id: string | null
          interaction_config: Json | null
          item_code: string | null
          paroles_musicales: string[] | null
          paroles_rang_a: string[] | null
          paroles_rang_ab: string[] | null
          paroles_rang_b: string[] | null
          payload_v2: Json | null
          pitch_intro: string | null
          quiz_questions: Json | null
          reward_messages: Json | null
          scene_immersive: Json | null
          slug: string | null
          subtitle: string | null
          tableau_rang_a: Json | null
          tableau_rang_b: Json | null
          title: string | null
          updated_at: string | null
          visual_ambiance: Json | null
        }
        Insert: {
          audio_ambiance?: Json | null
          created_at?: string | null
          id?: string | null
          interaction_config?: Json | null
          item_code?: string | null
          paroles_musicales?: string[] | null
          paroles_rang_a?: string[] | null
          paroles_rang_ab?: string[] | null
          paroles_rang_b?: string[] | null
          payload_v2?: Json | null
          pitch_intro?: string | null
          quiz_questions?: Json | null
          reward_messages?: Json | null
          scene_immersive?: Json | null
          slug?: string | null
          subtitle?: string | null
          tableau_rang_a?: Json | null
          tableau_rang_b?: Json | null
          title?: string | null
          updated_at?: string | null
          visual_ambiance?: Json | null
        }
        Update: {
          audio_ambiance?: Json | null
          created_at?: string | null
          id?: string | null
          interaction_config?: Json | null
          item_code?: string | null
          paroles_musicales?: string[] | null
          paroles_rang_a?: string[] | null
          paroles_rang_ab?: string[] | null
          paroles_rang_b?: string[] | null
          payload_v2?: Json | null
          pitch_intro?: string | null
          quiz_questions?: Json | null
          reward_messages?: Json | null
          scene_immersive?: Json | null
          slug?: string | null
          subtitle?: string | null
          tableau_rang_a?: Json | null
          tableau_rang_b?: Json | null
          title?: string | null
          updated_at?: string | null
          visual_ambiance?: Json | null
        }
        Relationships: []
      }
      backup_oic_competences: {
        Row: {
          completion_last_error: string | null
          completion_last_http: number | null
          completion_status: string | null
          completion_updated_at: string | null
          created_at: string | null
          date_import: string | null
          description: string | null
          hash_content: string | null
          intitule: string | null
          item_parent: string | null
          objectif_id: string | null
          ordre: number | null
          rang: string | null
          raw_json: Json | null
          rubrique: string | null
          source_etag: string | null
          updated_at: string | null
          url_source: string | null
        }
        Insert: {
          completion_last_error?: string | null
          completion_last_http?: number | null
          completion_status?: string | null
          completion_updated_at?: string | null
          created_at?: string | null
          date_import?: string | null
          description?: string | null
          hash_content?: string | null
          intitule?: string | null
          item_parent?: string | null
          objectif_id?: string | null
          ordre?: number | null
          rang?: string | null
          raw_json?: Json | null
          rubrique?: string | null
          source_etag?: string | null
          updated_at?: string | null
          url_source?: string | null
        }
        Update: {
          completion_last_error?: string | null
          completion_last_http?: number | null
          completion_status?: string | null
          completion_updated_at?: string | null
          created_at?: string | null
          date_import?: string | null
          description?: string | null
          hash_content?: string | null
          intitule?: string | null
          item_parent?: string | null
          objectif_id?: string | null
          ordre?: number | null
          rang?: string | null
          raw_json?: Json | null
          rubrique?: string | null
          source_etag?: string | null
          updated_at?: string | null
          url_source?: string | null
        }
        Relationships: []
      }
      badges: {
        Row: {
          awarded_at: string
          description: string
          id: string
          image_url: string | null
          name: string
          user_id: string
        }
        Insert: {
          awarded_at?: string
          description: string
          id?: string
          image_url?: string | null
          name: string
          user_id: string
        }
        Update: {
          awarded_at?: string
          description?: string
          id?: string
          image_url?: string | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      biovida_analyses: {
        Row: {
          analysis_result: string | null
          created_at: string
          email: string
          form_data: Json
          id: string
          payment_status: string | null
          person_name: string
        }
        Insert: {
          analysis_result?: string | null
          created_at?: string
          email: string
          form_data: Json
          id?: string
          payment_status?: string | null
          person_name: string
        }
        Update: {
          analysis_result?: string | null
          created_at?: string
          email?: string
          form_data?: Json
          id?: string
          payment_status?: string | null
          person_name?: string
        }
        Relationships: []
      }
      bounce_battles: {
        Row: {
          created_at: string | null
          duration_seconds: number | null
          ended_at: string | null
          id: string
          mode: string | null
          started_at: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          mode?: string | null
          started_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          mode?: string | null
          started_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      bounce_coping_responses: {
        Row: {
          battle_id: string | null
          created_at: string | null
          id: string
          question_id: string
          response_value: number
        }
        Insert: {
          battle_id?: string | null
          created_at?: string | null
          id?: string
          question_id: string
          response_value: number
        }
        Update: {
          battle_id?: string | null
          created_at?: string | null
          id?: string
          question_id?: string
          response_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "bounce_coping_responses_battle_id_fkey"
            columns: ["battle_id"]
            isOneToOne: false
            referencedRelation: "bounce_battles"
            referencedColumns: ["id"]
          },
        ]
      }
      bounce_events: {
        Row: {
          battle_id: string | null
          event_data: Json | null
          event_type: string
          id: string
          timestamp: number
        }
        Insert: {
          battle_id?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          timestamp: number
        }
        Update: {
          battle_id?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          timestamp?: number
        }
        Relationships: [
          {
            foreignKeyName: "bounce_events_battle_id_fkey"
            columns: ["battle_id"]
            isOneToOne: false
            referencedRelation: "bounce_battles"
            referencedColumns: ["id"]
          },
        ]
      }
      bounce_pair_tips: {
        Row: {
          battle_id: string | null
          id: string
          pair_token: string
          received_tip: string | null
          sent_at: string | null
          tip_content: string | null
        }
        Insert: {
          battle_id?: string | null
          id?: string
          pair_token: string
          received_tip?: string | null
          sent_at?: string | null
          tip_content?: string | null
        }
        Update: {
          battle_id?: string | null
          id?: string
          pair_token?: string
          received_tip?: string | null
          sent_at?: string | null
          tip_content?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bounce_pair_tips_battle_id_fkey"
            columns: ["battle_id"]
            isOneToOne: false
            referencedRelation: "bounce_battles"
            referencedColumns: ["id"]
          },
        ]
      }
      buddies: {
        Row: {
          buddy_user_id: string
          date: string
          id: string
          user_id: string
        }
        Insert: {
          buddy_user_id: string
          date?: string
          id?: string
          user_id: string
        }
        Update: {
          buddy_user_id?: string
          date?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      challenges: {
        Row: {
          category: string
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          description: string
          difficulty: string
          expires_at: string
          id: string
          points: number
          progress: number | null
          target_value: number
          title: string
          type: string
          user_id: string
        }
        Insert: {
          category: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          description: string
          difficulty: string
          expires_at: string
          id?: string
          points?: number
          progress?: number | null
          target_value: number
          title: string
          type: string
          user_id: string
        }
        Update: {
          category?: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          description?: string
          difficulty?: string
          expires_at?: string
          id?: string
          points?: number
          progress?: number | null
          target_value?: number
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          last_message: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          conversation_id: string
          id: string
          sender: string
          text: string
          timestamp: string
        }
        Insert: {
          conversation_id: string
          id?: string
          sender: string
          text: string
          timestamp?: string
        }
        Update: {
          conversation_id?: string
          id?: string
          sender?: string
          text?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      cleanup_history: {
        Row: {
          affected_records: number | null
          cleanup_type: string
          created_at: string
          created_by: string | null
          details: Json | null
          id: string
        }
        Insert: {
          affected_records?: number | null
          cleanup_type: string
          created_at?: string
          created_by?: string | null
          details?: Json | null
          id?: string
        }
        Update: {
          affected_records?: number | null
          cleanup_type?: string
          created_at?: string
          created_by?: string | null
          details?: Json | null
          id?: string
        }
        Relationships: []
      }
      clinical_consents: {
        Row: {
          granted_at: string | null
          id: string
          instrument_code: string
          is_active: boolean | null
          revoked_at: string | null
          user_id: string
        }
        Insert: {
          granted_at?: string | null
          id?: string
          instrument_code: string
          is_active?: boolean | null
          revoked_at?: string | null
          user_id: string
        }
        Update: {
          granted_at?: string | null
          id?: string
          instrument_code?: string
          is_active?: boolean | null
          revoked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      clinical_feature_flags: {
        Row: {
          created_at: string | null
          flag_name: string
          id: string
          instrument_domain: string | null
          is_enabled: boolean | null
          metadata: Json | null
          rollout_percentage: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          flag_name: string
          id?: string
          instrument_domain?: string | null
          is_enabled?: boolean | null
          metadata?: Json | null
          rollout_percentage?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          flag_name?: string
          id?: string
          instrument_domain?: string | null
          is_enabled?: boolean | null
          metadata?: Json | null
          rollout_percentage?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      clinical_instruments: {
        Row: {
          cadence: string
          code: string
          created_at: string | null
          domain: string
          id: string
          max_score: number
          min_score: number
          name: string
          questions: Json
          thresholds: Json
          ttl_hours: number
        }
        Insert: {
          cadence: string
          code: string
          created_at?: string | null
          domain: string
          id?: string
          max_score: number
          min_score: number
          name: string
          questions: Json
          thresholds: Json
          ttl_hours: number
        }
        Update: {
          cadence?: string
          code?: string
          created_at?: string | null
          domain?: string
          id?: string
          max_score?: number
          min_score?: number
          name?: string
          questions?: Json
          thresholds?: Json
          ttl_hours?: number
        }
        Relationships: []
      }
      clinical_responses: {
        Row: {
          cadence: string
          context_data: Json | null
          created_at: string | null
          expires_at: string | null
          id: string
          instrument_code: string
          internal_level: number | null
          internal_score: number | null
          responses: Json
          tags: string[] | null
          user_id: string
        }
        Insert: {
          cadence: string
          context_data?: Json | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          instrument_code: string
          internal_level?: number | null
          internal_score?: number | null
          responses: Json
          tags?: string[] | null
          user_id: string
        }
        Update: {
          cadence?: string
          context_data?: Json | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          instrument_code?: string
          internal_level?: number | null
          internal_score?: number | null
          responses?: Json
          tags?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      clinical_signals: {
        Row: {
          created_at: string | null
          domain: string
          expires_at: string
          id: string
          level: number
          metadata: Json | null
          module_context: string
          source_instrument: string
          user_id: string
          window_type: string
        }
        Insert: {
          created_at?: string | null
          domain: string
          expires_at: string
          id?: string
          level: number
          metadata?: Json | null
          module_context: string
          source_instrument: string
          user_id: string
          window_type: string
        }
        Update: {
          created_at?: string | null
          domain?: string
          expires_at?: string
          id?: string
          level?: number
          metadata?: Json | null
          module_context?: string
          source_instrument?: string
          user_id?: string
          window_type?: string
        }
        Relationships: []
      }
      coach_conversations: {
        Row: {
          coach_mode: string | null
          created_at: string | null
          id: string
          last_message_at: string | null
          message_count: number | null
          title: string | null
          user_id: string
        }
        Insert: {
          coach_mode?: string | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          message_count?: number | null
          title?: string | null
          user_id: string
        }
        Update: {
          coach_mode?: string | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          message_count?: number | null
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      coach_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          message_type: string | null
          sender: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          message_type?: string | null
          sender: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          message_type?: string | null
          sender?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "coach_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_sessions: {
        Row: {
          aaq_score: number | null
          completed_at: string | null
          created_at: string
          flexibility_level: string | null
          id: string
          session_duration: number | null
          thoughts_collected: number | null
          thoughts_shown: Json | null
          user_id: string
        }
        Insert: {
          aaq_score?: number | null
          completed_at?: string | null
          created_at?: string
          flexibility_level?: string | null
          id?: string
          session_duration?: number | null
          thoughts_collected?: number | null
          thoughts_shown?: Json | null
          user_id: string
        }
        Update: {
          aaq_score?: number | null
          completed_at?: string | null
          created_at?: string
          flexibility_level?: string | null
          id?: string
          session_duration?: number | null
          thoughts_collected?: number | null
          thoughts_shown?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      cocon_content: {
        Row: {
          content: string
          content_type: string
          created_at: string | null
          id: string
          is_private: boolean | null
          mood: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          content_type: string
          created_at?: string | null
          id?: string
          is_private?: boolean | null
          mood?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          content_type?: string
          created_at?: string | null
          id?: string
          is_private?: boolean | null
          mood?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          date: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          date?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          date?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_badges: {
        Row: {
          badge_type: string
          earned_at: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          badge_type: string
          earned_at?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          badge_type?: string
          earned_at?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      community_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          is_empathy_template: boolean | null
          likes_count: number | null
          post_id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          is_empathy_template?: boolean | null
          likes_count?: number | null
          post_id: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          is_empathy_template?: boolean | null
          likes_count?: number | null
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_groups: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          icon: string | null
          id: string
          is_private: boolean | null
          member_count: number | null
          name: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_private?: boolean | null
          member_count?: number | null
          name: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_private?: boolean | null
          member_count?: number | null
          name?: string
        }
        Relationships: []
      }
      community_house_state: {
        Row: {
          acts_of_care: number
          created_at: string | null
          id: string
          last_activity_at: string | null
          light_intensity: number
          user_id: string
        }
        Insert: {
          acts_of_care?: number
          created_at?: string | null
          id?: string
          last_activity_at?: string | null
          light_intensity?: number
          user_id: string
        }
        Update: {
          acts_of_care?: number
          created_at?: string | null
          id?: string
          last_activity_at?: string | null
          light_intensity?: number
          user_id?: string
        }
        Relationships: []
      }
      community_posts: {
        Row: {
          author_id: string
          comments_count: number | null
          content: string
          created_at: string | null
          group_id: string | null
          has_empathy_response: boolean | null
          id: string
          likes_count: number | null
          mood_halo: string | null
          reply_count: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          comments_count?: number | null
          content: string
          created_at?: string | null
          group_id?: string | null
          has_empathy_response?: boolean | null
          id?: string
          likes_count?: number | null
          mood_halo?: string | null
          reply_count?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          comments_count?: number | null
          content?: string
          created_at?: string | null
          group_id?: string | null
          has_empathy_response?: boolean | null
          id?: string
          likes_count?: number | null
          mood_halo?: string | null
          reply_count?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "community_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      community_room_members: {
        Row: {
          badges_earned: string[] | null
          id: string
          joined_at: string | null
          left_at: string | null
          room_id: string
          user_id: string
        }
        Insert: {
          badges_earned?: string[] | null
          id?: string
          joined_at?: string | null
          left_at?: string | null
          room_id: string
          user_id: string
        }
        Update: {
          badges_earned?: string[] | null
          id?: string
          joined_at?: string | null
          left_at?: string | null
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_room_members_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "community_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      community_rooms: {
        Row: {
          capacity: number | null
          created_at: string | null
          created_by: string | null
          current_participants: number | null
          ended_at: string | null
          id: string
          name: string
          ritual_stage: string | null
          scheduled_at: string | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          created_by?: string | null
          current_participants?: number | null
          ended_at?: string | null
          id?: string
          name: string
          ritual_stage?: string | null
          scheduled_at?: string | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          created_by?: string | null
          current_participants?: number | null
          ended_at?: string | null
          id?: string
          name?: string
          ritual_stage?: string | null
          scheduled_at?: string | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      completeness_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          id: string
          item_code: string
          message: string
          metadata: Json | null
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          id?: string
          item_code: string
          message: string
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          id?: string
          item_code?: string
          message?: string
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
        }
        Relationships: []
      }
      data_exports: {
        Row: {
          completed_at: string | null
          expires_at: string | null
          export_type: string
          file_url: string | null
          id: string
          requested_at: string
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          expires_at?: string | null
          export_type?: string
          file_url?: string | null
          id?: string
          requested_at?: string
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          expires_at?: string | null
          export_type?: string
          file_url?: string | null
          id?: string
          requested_at?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      data_integrity_checks: {
        Row: {
          batch_id: string | null
          check_type: string
          completed_at: string | null
          created_at: string
          created_by: string | null
          critical_issues: number | null
          id: string
          issues_found: number | null
          results: Json | null
          should_block: boolean | null
          started_at: string | null
          status: string
          tables_checked: string[]
        }
        Insert: {
          batch_id?: string | null
          check_type: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          critical_issues?: number | null
          id?: string
          issues_found?: number | null
          results?: Json | null
          should_block?: boolean | null
          started_at?: string | null
          status?: string
          tables_checked: string[]
        }
        Update: {
          batch_id?: string | null
          check_type?: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          critical_issues?: number | null
          id?: string
          issues_found?: number | null
          results?: Json | null
          should_block?: boolean | null
          started_at?: string | null
          status?: string
          tables_checked?: string[]
        }
        Relationships: []
      }
      data_integrity_reports: {
        Row: {
          created_at: string
          full_report: Json
          id: string
          issues_count: number
          recommendations: string[]
          scan_id: string
          status: string
          summary: Json
          tables_scanned: string[]
          total_records: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_report?: Json
          id?: string
          issues_count?: number
          recommendations?: string[]
          scan_id: string
          status: string
          summary?: Json
          tables_scanned?: string[]
          total_records?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_report?: Json
          id?: string
          issues_count?: number
          recommendations?: string[]
          scan_id?: string
          status?: string
          summary?: Json
          tables_scanned?: string[]
          total_records?: number
          updated_at?: string
        }
        Relationships: []
      }
      "Digital Medicine": {
        Row: {
          created_at: string
          email: string | null
          id: number
          intéret: string | null
          prénom: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: number
          intéret?: string | null
          prénom: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          intéret?: string | null
          prénom?: string
        }
        Relationships: []
      }
      ecos_scenarios: {
        Row: {
          clinical_case: string
          created_at: string
          description: string | null
          difficulty_level: string | null
          estimated_time: number | null
          evaluation_criteria: Json | null
          id: string
          is_active: boolean | null
          multimedia_resources: Json | null
          scenario_code: string
          speciality: string | null
          title: string
          updated_at: string
        }
        Insert: {
          clinical_case: string
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          estimated_time?: number | null
          evaluation_criteria?: Json | null
          id?: string
          is_active?: boolean | null
          multimedia_resources?: Json | null
          scenario_code: string
          speciality?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          clinical_case?: string
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          estimated_time?: number | null
          evaluation_criteria?: Json | null
          id?: string
          is_active?: boolean | null
          multimedia_resources?: Json | null
          scenario_code?: string
          speciality?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      ecos_situations_complete: {
        Row: {
          content: Json
          created_at: string
          id: string
          situation_number: string
          title: string
          updated_at: string
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          situation_number: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          situation_number?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      ecos_situations_uness: {
        Row: {
          competences_associees: string[] | null
          contenu_complet_html: string | null
          created_at: string
          date_import: string
          id: string
          intitule_sd: string
          sd_id: number
          updated_at: string
          url_source: string | null
        }
        Insert: {
          competences_associees?: string[] | null
          contenu_complet_html?: string | null
          created_at?: string
          date_import?: string
          id?: string
          intitule_sd: string
          sd_id: number
          updated_at?: string
          url_source?: string | null
        }
        Update: {
          competences_associees?: string[] | null
          contenu_complet_html?: string | null
          created_at?: string
          date_import?: string
          id?: string
          intitule_sd?: string
          sd_id?: number
          updated_at?: string
          url_source?: string | null
        }
        Relationships: []
      }
      edn_analytics_advanced: {
        Row: {
          completion_rate: number | null
          created_at: string | null
          engagement_score: number | null
          id: string
          item_code: string
          learning_progress: Json | null
          performance_metrics: Json | null
          session_metadata: Json | null
          session_type: string
          time_spent_minutes: number | null
          user_feedback: Json | null
          user_id: string | null
        }
        Insert: {
          completion_rate?: number | null
          created_at?: string | null
          engagement_score?: number | null
          id?: string
          item_code: string
          learning_progress?: Json | null
          performance_metrics?: Json | null
          session_metadata?: Json | null
          session_type: string
          time_spent_minutes?: number | null
          user_feedback?: Json | null
          user_id?: string | null
        }
        Update: {
          completion_rate?: number | null
          created_at?: string | null
          engagement_score?: number | null
          id?: string
          item_code?: string
          learning_progress?: Json | null
          performance_metrics?: Json | null
          session_metadata?: Json | null
          session_type?: string
          time_spent_minutes?: number | null
          user_feedback?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      edn_content: {
        Row: {
          category: string | null
          content_text: string | null
          created_at: string
          description: string | null
          difficulty_level: string | null
          estimated_time: number | null
          id: string
          is_active: boolean | null
          item_code: string
          multimedia_urls: Json | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content_text?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          estimated_time?: number | null
          id?: string
          is_active?: boolean | null
          item_code: string
          multimedia_urls?: Json | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content_text?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          estimated_time?: number | null
          id?: string
          is_active?: boolean | null
          item_code?: string
          multimedia_urls?: Json | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      edn_generation_jobs: {
        Row: {
          all_items: boolean
          created_at: string
          created_by: string | null
          error_log: string | null
          id: string
          item_ids: string[] | null
          job_type: string
          progress: number
          result: Json
          status: string
          updated_at: string
          versions: string[]
        }
        Insert: {
          all_items?: boolean
          created_at?: string
          created_by?: string | null
          error_log?: string | null
          id?: string
          item_ids?: string[] | null
          job_type: string
          progress?: number
          result?: Json
          status?: string
          updated_at?: string
          versions?: string[]
        }
        Update: {
          all_items?: boolean
          created_at?: string
          created_by?: string | null
          error_log?: string | null
          id?: string
          item_ids?: string[] | null
          job_type?: string
          progress?: number
          result?: Json
          status?: string
          updated_at?: string
          versions?: string[]
        }
        Relationships: []
      }
      edn_items: {
        Row: {
          created_at: string | null
          has_link: string | null
          has_recommendation: boolean | null
          id: number
          item_number: string
          rank: string | null
          specialty: string
          title: string
        }
        Insert: {
          created_at?: string | null
          has_link?: string | null
          has_recommendation?: boolean | null
          id?: number
          item_number: string
          rank?: string | null
          specialty: string
          title: string
        }
        Update: {
          created_at?: string | null
          has_link?: string | null
          has_recommendation?: boolean | null
          id?: number
          item_number?: string
          rank?: string | null
          specialty?: string
          title?: string
        }
        Relationships: []
      }
      edn_items_complete: {
        Row: {
          audio_ambiance: Json | null
          backup_data: Json | null
          competences_count_rang_a: number | null
          competences_count_rang_b: number | null
          competences_count_total: number | null
          competences_oic_rang_a: Json | null
          competences_oic_rang_b: Json | null
          completeness_score: number | null
          created_at: string
          domaine_medical: string | null
          id: string
          interaction_config: Json | null
          is_validated: boolean | null
          item_code: string
          migration_notes: string | null
          mots_cles: string[] | null
          niveau_complexite: string | null
          paroles_musicales: string[] | null
          paroles_rang_a: string[] | null
          paroles_rang_ab: string[] | null
          paroles_rang_b: string[] | null
          payload_v2: Json | null
          pitch_intro: string | null
          quiz_questions: Json | null
          reward_messages: Json | null
          scene_immersive: Json | null
          slug: string
          specialite: string | null
          status: string | null
          subtitle: string | null
          tableau_rang_a: Json | null
          tableau_rang_b: Json | null
          tags_medicaux: string[] | null
          title: string
          updated_at: string
          validation_date: string | null
          visual_ambiance: Json | null
        }
        Insert: {
          audio_ambiance?: Json | null
          backup_data?: Json | null
          competences_count_rang_a?: number | null
          competences_count_rang_b?: number | null
          competences_count_total?: number | null
          competences_oic_rang_a?: Json | null
          competences_oic_rang_b?: Json | null
          completeness_score?: number | null
          created_at?: string
          domaine_medical?: string | null
          id?: string
          interaction_config?: Json | null
          is_validated?: boolean | null
          item_code: string
          migration_notes?: string | null
          mots_cles?: string[] | null
          niveau_complexite?: string | null
          paroles_musicales?: string[] | null
          paroles_rang_a?: string[] | null
          paroles_rang_ab?: string[] | null
          paroles_rang_b?: string[] | null
          payload_v2?: Json | null
          pitch_intro?: string | null
          quiz_questions?: Json | null
          reward_messages?: Json | null
          scene_immersive?: Json | null
          slug: string
          specialite?: string | null
          status?: string | null
          subtitle?: string | null
          tableau_rang_a?: Json | null
          tableau_rang_b?: Json | null
          tags_medicaux?: string[] | null
          title: string
          updated_at?: string
          validation_date?: string | null
          visual_ambiance?: Json | null
        }
        Update: {
          audio_ambiance?: Json | null
          backup_data?: Json | null
          competences_count_rang_a?: number | null
          competences_count_rang_b?: number | null
          competences_count_total?: number | null
          competences_oic_rang_a?: Json | null
          competences_oic_rang_b?: Json | null
          completeness_score?: number | null
          created_at?: string
          domaine_medical?: string | null
          id?: string
          interaction_config?: Json | null
          is_validated?: boolean | null
          item_code?: string
          migration_notes?: string | null
          mots_cles?: string[] | null
          niveau_complexite?: string | null
          paroles_musicales?: string[] | null
          paroles_rang_a?: string[] | null
          paroles_rang_ab?: string[] | null
          paroles_rang_b?: string[] | null
          payload_v2?: Json | null
          pitch_intro?: string | null
          quiz_questions?: Json | null
          reward_messages?: Json | null
          scene_immersive?: Json | null
          slug?: string
          specialite?: string | null
          status?: string | null
          subtitle?: string | null
          tableau_rang_a?: Json | null
          tableau_rang_b?: Json | null
          tags_medicaux?: string[] | null
          title?: string
          updated_at?: string
          validation_date?: string | null
          visual_ambiance?: Json | null
        }
        Relationships: []
      }
      edn_items_immersive: {
        Row: {
          audio_ambiance: Json | null
          competences_count_rang_a: number | null
          competences_count_rang_b: number | null
          competences_count_total: number | null
          competences_oic_rang_a: Json | null
          competences_oic_rang_b: Json | null
          created_at: string
          id: string
          interaction_config: Json | null
          item_code: string
          paroles_musicales: string[] | null
          paroles_rang_a: string[] | null
          paroles_rang_ab: string[] | null
          paroles_rang_b: string[] | null
          payload_v2: Json | null
          pitch_intro: string | null
          quiz_questions: Json | null
          reward_messages: Json | null
          scene_immersive: Json | null
          slug: string | null
          subtitle: string | null
          tableau_rang_a: Json | null
          tableau_rang_b: Json | null
          title: string
          updated_at: string
          visual_ambiance: Json | null
        }
        Insert: {
          audio_ambiance?: Json | null
          competences_count_rang_a?: number | null
          competences_count_rang_b?: number | null
          competences_count_total?: number | null
          competences_oic_rang_a?: Json | null
          competences_oic_rang_b?: Json | null
          created_at?: string
          id?: string
          interaction_config?: Json | null
          item_code: string
          paroles_musicales?: string[] | null
          paroles_rang_a?: string[] | null
          paroles_rang_ab?: string[] | null
          paroles_rang_b?: string[] | null
          payload_v2?: Json | null
          pitch_intro?: string | null
          quiz_questions?: Json | null
          reward_messages?: Json | null
          scene_immersive?: Json | null
          slug?: string | null
          subtitle?: string | null
          tableau_rang_a?: Json | null
          tableau_rang_b?: Json | null
          title: string
          updated_at?: string
          visual_ambiance?: Json | null
        }
        Update: {
          audio_ambiance?: Json | null
          competences_count_rang_a?: number | null
          competences_count_rang_b?: number | null
          competences_count_total?: number | null
          competences_oic_rang_a?: Json | null
          competences_oic_rang_b?: Json | null
          created_at?: string
          id?: string
          interaction_config?: Json | null
          item_code?: string
          paroles_musicales?: string[] | null
          paroles_rang_a?: string[] | null
          paroles_rang_ab?: string[] | null
          paroles_rang_b?: string[] | null
          payload_v2?: Json | null
          pitch_intro?: string | null
          quiz_questions?: Json | null
          reward_messages?: Json | null
          scene_immersive?: Json | null
          slug?: string | null
          subtitle?: string | null
          tableau_rang_a?: Json | null
          tableau_rang_b?: Json | null
          title?: string
          updated_at?: string
          visual_ambiance?: Json | null
        }
        Relationships: []
      }
      edn_lyrics_versions: {
        Row: {
          couverture_json: Json
          created_at: string
          id: string
          item_code: string | null
          item_id: string
          metadata: Json
          prompt_hash: string | null
          score_couverture: number
          texte: string[]
          texte_hash: string | null
          updated_at: string
          valide: boolean
          version: string
        }
        Insert: {
          couverture_json?: Json
          created_at?: string
          id?: string
          item_code?: string | null
          item_id: string
          metadata?: Json
          prompt_hash?: string | null
          score_couverture?: number
          texte: string[]
          texte_hash?: string | null
          updated_at?: string
          valide?: boolean
          version: string
        }
        Update: {
          couverture_json?: Json
          created_at?: string
          id?: string
          item_code?: string | null
          item_id?: string
          metadata?: Json
          prompt_hash?: string | null
          score_couverture?: number
          texte?: string[]
          texte_hash?: string | null
          updated_at?: string
          valide?: boolean
          version?: string
        }
        Relationships: []
      }
      edn_smart_recommendations: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          reasoning: string | null
          recommendation_type: string
          recommended_item_code: string
          user_id: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          reasoning?: string | null
          recommendation_type: string
          recommended_item_code: string
          user_id?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          reasoning?: string | null
          recommendation_type?: string
          recommended_item_code?: string
          user_id?: string | null
        }
        Relationships: []
      }
      edn_suno_tracks: {
        Row: {
          audio_url: string | null
          bpm: number | null
          created_at: string
          duration: number | null
          error_log: string | null
          genre: string | null
          id: string
          intensity: string | null
          lyrics_version_id: string
          metadata: Json
          provider: string
          provider_track_id: string | null
          seed: string | null
          status: string
          updated_at: string
        }
        Insert: {
          audio_url?: string | null
          bpm?: number | null
          created_at?: string
          duration?: number | null
          error_log?: string | null
          genre?: string | null
          id?: string
          intensity?: string | null
          lyrics_version_id: string
          metadata?: Json
          provider?: string
          provider_track_id?: string | null
          seed?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          audio_url?: string | null
          bpm?: number | null
          created_at?: string
          duration?: number | null
          error_log?: string | null
          genre?: string | null
          id?: string
          intensity?: string | null
          lyrics_version_id?: string
          metadata?: Json
          provider?: string
          provider_track_id?: string | null
          seed?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "edn_suno_tracks_lyrics_version_id_fkey"
            columns: ["lyrics_version_id"]
            isOneToOne: false
            referencedRelation: "edn_lyrics_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          created_at: string | null
          html_content: string
          id: string
          name: string
          subject: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          created_at?: string | null
          html_content: string
          id?: string
          name: string
          subject: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          created_at?: string | null
          html_content?: string
          id?: string
          name?: string
          subject?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      emotion_analysis_logs: {
        Row: {
          analysis_metadata: Json | null
          arousal: number | null
          confidence_score: number | null
          created_at: string | null
          detected_emotion: string
          id: string
          input_text: string | null
          user_id: string | null
          valence: number | null
        }
        Insert: {
          analysis_metadata?: Json | null
          arousal?: number | null
          confidence_score?: number | null
          created_at?: string | null
          detected_emotion: string
          id?: string
          input_text?: string | null
          user_id?: string | null
          valence?: number | null
        }
        Update: {
          analysis_metadata?: Json | null
          arousal?: number | null
          confidence_score?: number | null
          created_at?: string | null
          detected_emotion?: string
          id?: string
          input_text?: string | null
          user_id?: string | null
          valence?: number | null
        }
        Relationships: []
      }
      emotion_cards: {
        Row: {
          animation_config: Json | null
          code: string
          color_primary: string
          color_secondary: string
          created_at: string | null
          description: string | null
          icon_name: string
          id: string
          mantra: string
          mantra_emoji: string
          rarity: string
          sound_url: string | null
          unlock_rewards: Json | null
          who5_range_max: number
          who5_range_min: number
        }
        Insert: {
          animation_config?: Json | null
          code: string
          color_primary: string
          color_secondary: string
          created_at?: string | null
          description?: string | null
          icon_name: string
          id?: string
          mantra: string
          mantra_emoji: string
          rarity?: string
          sound_url?: string | null
          unlock_rewards?: Json | null
          who5_range_max: number
          who5_range_min: number
        }
        Update: {
          animation_config?: Json | null
          code?: string
          color_primary?: string
          color_secondary?: string
          created_at?: string | null
          description?: string | null
          icon_name?: string
          id?: string
          mantra?: string
          mantra_emoji?: string
          rarity?: string
          sound_url?: string | null
          unlock_rewards?: Json | null
          who5_range_max?: number
          who5_range_min?: number
        }
        Relationships: []
      }
      emotion_metrics: {
        Row: {
          confidence_score: number | null
          context: Json | null
          created_at: string
          emotion_type: string
          id: string
          session_id: string
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          context?: Json | null
          created_at?: string
          emotion_type: string
          id?: string
          session_id: string
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          context?: Json | null
          created_at?: string
          emotion_type?: string
          id?: string
          session_id?: string
          user_id?: string
        }
        Relationships: []
      }
      emotion_scans: {
        Row: {
          confidence: number | null
          created_at: string | null
          emotions: Json
          id: string
          mood: string | null
          recommendations: Json | null
          scan_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          emotions?: Json
          id?: string
          mood?: string | null
          recommendations?: Json | null
          scan_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          emotions?: Json
          id?: string
          mood?: string | null
          recommendations?: Json | null
          scan_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      emotions: {
        Row: {
          ai_feedback: string | null
          audio_url: string | null
          date: string
          emojis: string | null
          id: string
          score: number | null
          text: string | null
          user_id: string
        }
        Insert: {
          ai_feedback?: string | null
          audio_url?: string | null
          date?: string
          emojis?: string | null
          id?: string
          score?: number | null
          text?: string | null
          user_id: string
        }
        Update: {
          ai_feedback?: string | null
          audio_url?: string | null
          date?: string
          emojis?: string | null
          id?: string
          score?: number | null
          text?: string | null
          user_id?: string
        }
        Relationships: []
      }
      emotionscare_song_likes: {
        Row: {
          created_at: string
          id: string
          song_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          song_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          song_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emotionscare_song_likes_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "emotionscare_songs"
            referencedColumns: ["id"]
          },
        ]
      }
      emotionscare_songs: {
        Row: {
          created_at: string
          id: string
          lyrics: Json | null
          meta: Json | null
          suno_audio_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          lyrics?: Json | null
          meta?: Json | null
          suno_audio_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          lyrics?: Json | null
          meta?: Json | null
          suno_audio_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      emotionscare_user_songs: {
        Row: {
          created_at: string
          id: string
          song_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          song_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          song_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emotionscare_user_songs_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "emotionscare_songs"
            referencedColumns: ["id"]
          },
        ]
      }
      emotionsroom_favorites: {
        Row: {
          created_at: string
          favorite_user_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          favorite_user_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          favorite_user_id?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      emotionsroom_ice_candidates: {
        Row: {
          candidate: Json
          created_at: string
          from_peer_id: string
          id: string
          room_id: string
          to_peer_id: string
        }
        Insert: {
          candidate: Json
          created_at?: string
          from_peer_id: string
          id?: string
          room_id: string
          to_peer_id: string
        }
        Update: {
          candidate?: Json
          created_at?: string
          from_peer_id?: string
          id?: string
          room_id?: string
          to_peer_id?: string
        }
        Relationships: []
      }
      emotionsroom_participants: {
        Row: {
          audio_enabled: boolean
          created_at: string
          id: string
          joined_at: string
          left_at: string | null
          peer_id: string
          room_id: string
          user_id: string
          video_enabled: boolean
        }
        Insert: {
          audio_enabled?: boolean
          created_at?: string
          id?: string
          joined_at?: string
          left_at?: string | null
          peer_id: string
          room_id: string
          user_id: string
          video_enabled?: boolean
        }
        Update: {
          audio_enabled?: boolean
          created_at?: string
          id?: string
          joined_at?: string
          left_at?: string | null
          peer_id?: string
          room_id?: string
          user_id?: string
          video_enabled?: boolean
        }
        Relationships: []
      }
      emotionsroom_profiles: {
        Row: {
          avatar_emoji: string | null
          created_at: string
          favorite_mood: string | null
          id: string
          is_anonymous: boolean | null
          nickname: string
          settings: Json | null
          total_rooms: number | null
          total_time_minutes: number | null
          updated_at: string
        }
        Insert: {
          avatar_emoji?: string | null
          created_at?: string
          favorite_mood?: string | null
          id: string
          is_anonymous?: boolean | null
          nickname: string
          settings?: Json | null
          total_rooms?: number | null
          total_time_minutes?: number | null
          updated_at?: string
        }
        Update: {
          avatar_emoji?: string | null
          created_at?: string
          favorite_mood?: string | null
          id?: string
          is_anonymous?: boolean | null
          nickname?: string
          settings?: Json | null
          total_rooms?: number | null
          total_time_minutes?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      emotionsroom_rooms: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          is_active: boolean | null
          max_participants: number | null
          mood: string
          music_track_id: string | null
          participants: Json | null
          room_settings: Json | null
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          mood: string
          music_track_id?: string | null
          participants?: Json | null
          room_settings?: Json | null
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          mood?: string
          music_track_id?: string | null
          participants?: Json | null
          room_settings?: Json | null
        }
        Relationships: []
      }
      emotionsroom_sessions: {
        Row: {
          duration_minutes: number | null
          feedback_rating: number | null
          feedback_text: string | null
          id: string
          joined_at: string
          left_at: string | null
          mood: string
          room_id: string
          user_id: string
        }
        Insert: {
          duration_minutes?: number | null
          feedback_rating?: number | null
          feedback_text?: string | null
          id?: string
          joined_at?: string
          left_at?: string | null
          mood: string
          room_id: string
          user_id: string
        }
        Update: {
          duration_minutes?: number | null
          feedback_rating?: number | null
          feedback_text?: string | null
          id?: string
          joined_at?: string
          left_at?: string | null
          mood?: string
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emotionsroom_sessions_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "emotionsroom_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      emotionsroom_webrtc_answers: {
        Row: {
          answer: Json
          created_at: string
          from_peer_id: string
          id: string
          room_id: string
          to_peer_id: string
        }
        Insert: {
          answer: Json
          created_at?: string
          from_peer_id: string
          id?: string
          room_id: string
          to_peer_id: string
        }
        Update: {
          answer?: Json
          created_at?: string
          from_peer_id?: string
          id?: string
          room_id?: string
          to_peer_id?: string
        }
        Relationships: []
      }
      emotionsroom_webrtc_offers: {
        Row: {
          created_at: string
          from_peer_id: string
          id: string
          offer: Json
          room_id: string
          to_peer_id: string
        }
        Insert: {
          created_at?: string
          from_peer_id: string
          id?: string
          offer: Json
          room_id: string
          to_peer_id: string
        }
        Update: {
          created_at?: string
          from_peer_id?: string
          id?: string
          offer?: Json
          room_id?: string
          to_peer_id?: string
        }
        Relationships: []
      }
      empathy_templates: {
        Row: {
          category: string | null
          created_at: string | null
          emoji: string | null
          id: string
          text_en: string
          text_fr: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          emoji?: string | null
          id?: string
          text_en: string
          text_fr: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          emoji?: string | null
          id?: string
          text_en?: string
          text_fr?: string
        }
        Relationships: []
      }
      enhanced_chat_logs: {
        Row: {
          conversation_id: string
          created_at: string
          edn_context_items: string[]
          id: string
          question: string
          response: string
          response_quality_score: number | null
          response_source: string
          updated_at: string
          user_id: string
          web_fallback_used: boolean
        }
        Insert: {
          conversation_id: string
          created_at?: string
          edn_context_items?: string[]
          id?: string
          question: string
          response: string
          response_quality_score?: number | null
          response_source: string
          updated_at?: string
          user_id: string
          web_fallback_used?: boolean
        }
        Update: {
          conversation_id?: string
          created_at?: string
          edn_context_items?: string[]
          id?: string
          question?: string
          response?: string
          response_quality_score?: number | null
          response_source?: string
          updated_at?: string
          user_id?: string
          web_fallback_used?: boolean
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          context: string | null
          created_at: string
          error_message: string
          error_stack: string | null
          id: string
          metadata: Json | null
          resolved: boolean | null
          severity: string
          user_id: string | null
        }
        Insert: {
          context?: string | null
          created_at?: string
          error_message: string
          error_stack?: string | null
          id?: string
          metadata?: Json | null
          resolved?: boolean | null
          severity?: string
          user_id?: string | null
        }
        Update: {
          context?: string | null
          created_at?: string
          error_message?: string
          error_stack?: string | null
          id?: string
          metadata?: Json | null
          resolved?: boolean | null
          severity?: string
          user_id?: string | null
        }
        Relationships: []
      }
      error_songs: {
        Row: {
          audio_url: string | null
          created_at: string | null
          errors_analyzed: Json
          generation_prompt: string
          generation_status: string | null
          id: string
          lyrics: Json
          session_id: string
          song_title: string
          suno_audio_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          audio_url?: string | null
          created_at?: string | null
          errors_analyzed: Json
          generation_prompt: string
          generation_status?: string | null
          id?: string
          lyrics: Json
          session_id: string
          song_title: string
          suno_audio_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          audio_url?: string | null
          created_at?: string | null
          errors_analyzed?: Json
          generation_prompt?: string
          generation_status?: string | null
          id?: string
          lyrics?: Json
          session_id?: string
          song_title?: string
          suno_audio_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "error_songs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "qcm_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      exports: {
        Row: {
          created_at: string | null
          file_path: string | null
          id: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          file_path?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          file_path?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      extraction_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_message: string
          event_type: string
          extraction_log_id: string
          id: string
          item_reference: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_message: string
          event_type: string
          extraction_log_id: string
          id?: string
          item_reference?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_message?: string
          event_type?: string
          extraction_log_id?: string
          id?: string
          item_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "extraction_events_extraction_log_id_fkey"
            columns: ["extraction_log_id"]
            isOneToOne: false
            referencedRelation: "extraction_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      extraction_logs: {
        Row: {
          batch_id: string
          batch_type: string
          completed_at: string | null
          created_at: string
          created_by: string | null
          error_details: Json | null
          error_message: string | null
          failed_items: number | null
          id: string
          performance_metrics: Json | null
          processed_items: number | null
          progress_percentage: number | null
          session_data: Json | null
          started_at: string
          status: string
          total_items: number | null
          updated_at: string
        }
        Insert: {
          batch_id: string
          batch_type: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          error_details?: Json | null
          error_message?: string | null
          failed_items?: number | null
          id?: string
          performance_metrics?: Json | null
          processed_items?: number | null
          progress_percentage?: number | null
          session_data?: Json | null
          started_at?: string
          status?: string
          total_items?: number | null
          updated_at?: string
        }
        Update: {
          batch_id?: string
          batch_type?: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          error_details?: Json | null
          error_message?: string | null
          failed_items?: number | null
          id?: string
          performance_metrics?: Json | null
          processed_items?: number | null
          progress_percentage?: number | null
          session_data?: Json | null
          started_at?: string
          status?: string
          total_items?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      gamification_activities: {
        Row: {
          achievements_unlocked: string[] | null
          activity_name: string
          activity_type: string
          completion_percentage: number | null
          created_at: string | null
          difficulty_level: string | null
          duration: number | null
          id: string
          points_earned: number | null
          session_data: Json | null
          user_id: string | null
        }
        Insert: {
          achievements_unlocked?: string[] | null
          activity_name: string
          activity_type: string
          completion_percentage?: number | null
          created_at?: string | null
          difficulty_level?: string | null
          duration?: number | null
          id?: string
          points_earned?: number | null
          session_data?: Json | null
          user_id?: string | null
        }
        Update: {
          achievements_unlocked?: string[] | null
          activity_name?: string
          activity_type?: string
          completion_percentage?: number | null
          created_at?: string | null
          difficulty_level?: string | null
          duration?: number | null
          id?: string
          points_earned?: number | null
          session_data?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      generated_ambient_images: {
        Row: {
          created_at: string
          generation_status: string | null
          id: string
          image_base64: string | null
          metadata: Json | null
          prompt: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          generation_status?: string | null
          id?: string
          image_base64?: string | null
          metadata?: Json | null
          prompt: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          generation_status?: string | null
          id?: string
          image_base64?: string | null
          metadata?: Json | null
          prompt?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      generated_music_tracks: {
        Row: {
          audio_url: string | null
          created_at: string
          duration: number | null
          generation_status: string | null
          id: string
          image_url: string | null
          metadata: Json | null
          original_task_id: string | null
          stream_url: string | null
          suno_track_id: string | null
          task_id: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          duration?: number | null
          generation_status?: string | null
          id?: string
          image_url?: string | null
          metadata?: Json | null
          original_task_id?: string | null
          stream_url?: string | null
          suno_track_id?: string | null
          task_id?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          duration?: number | null
          generation_status?: string | null
          id?: string
          image_url?: string | null
          metadata?: Json | null
          original_task_id?: string | null
          stream_url?: string | null
          suno_track_id?: string | null
          task_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      generated_voice_tracks: {
        Row: {
          audio_base64: string | null
          created_at: string
          generation_status: string | null
          id: string
          metadata: Json | null
          model: string
          text: string
          updated_at: string
          user_id: string
          voice_id: string
        }
        Insert: {
          audio_base64?: string | null
          created_at?: string
          generation_status?: string | null
          id?: string
          metadata?: Json | null
          model: string
          text: string
          updated_at?: string
          user_id: string
          voice_id: string
        }
        Update: {
          audio_base64?: string | null
          created_at?: string
          generation_status?: string | null
          id?: string
          metadata?: Json | null
          model?: string
          text?: string
          updated_at?: string
          user_id?: string
          voice_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string | null
          id: string
          status: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          status?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      google_sheets_integrations: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          last_sync: string | null
          mapping_config: Json
          sheet_id: string
          sheet_name: string
          updated_at: string
          user_id: string | null
          webhook_token: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          mapping_config?: Json
          sheet_id: string
          sheet_name: string
          updated_at?: string
          user_id?: string | null
          webhook_token?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          mapping_config?: Json
          sheet_id?: string
          sheet_name?: string
          updated_at?: string
          user_id?: string | null
          webhook_token?: string
        }
        Relationships: []
      }
      group_memberships: {
        Row: {
          group_id: string
          id: string
          joined_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_memberships_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "community_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          id: string
          members: string[] | null
          name: string
          topic: string
        }
        Insert: {
          id?: string
          members?: string[] | null
          name: string
          topic: string
        }
        Update: {
          id?: string
          members?: string[] | null
          name?: string
          topic?: string
        }
        Relationships: []
      }
      hr_aggregates: {
        Row: {
          created_at: string | null
          domain: string
          id: string
          min_n_met: boolean | null
          participant_count: number
          period_end: string
          period_start: string
          team_id: string
          verbalization: string
        }
        Insert: {
          created_at?: string | null
          domain: string
          id?: string
          min_n_met?: boolean | null
          participant_count: number
          period_end: string
          period_start: string
          team_id: string
          verbalization: string
        }
        Update: {
          created_at?: string | null
          domain?: string
          id?: string
          min_n_met?: boolean | null
          participant_count?: number
          period_end?: string
          period_start?: string
          team_id?: string
          verbalization?: string
        }
        Relationships: []
      }
      ia_usage_logs: {
        Row: {
          created_at: string
          credits_used: number
          error_details: string | null
          id: string
          operation_type: string
          request_details: Json | null
          response_status: string
          service_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits_used?: number
          error_details?: string | null
          id?: string
          operation_type: string
          request_details?: Json | null
          response_status: string
          service_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits_used?: number
          error_details?: string | null
          id?: string
          operation_type?: string
          request_details?: Json | null
          response_status?: string
          service_type?: string
          user_id?: string
        }
        Relationships: []
      }
      import_batches: {
        Row: {
          completed_at: string | null
          created_at: string
          error_rows: number | null
          errors: Json | null
          file_url: string | null
          filename: string
          id: string
          mapping_config: Json | null
          processed_rows: number | null
          status: string
          success_rows: number | null
          total_rows: number | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_rows?: number | null
          errors?: Json | null
          file_url?: string | null
          filename: string
          id?: string
          mapping_config?: Json | null
          processed_rows?: number | null
          status?: string
          success_rows?: number | null
          total_rows?: number | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_rows?: number | null
          errors?: Json | null
          file_url?: string | null
          filename?: string
          id?: string
          mapping_config?: Json | null
          processed_rows?: number | null
          status?: string
          success_rows?: number | null
          total_rows?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      import_raw_data: {
        Row: {
          batch_id: string | null
          created_at: string
          error_message: string | null
          id: string
          processed: boolean | null
          raw_data: Json
          row_number: number
        }
        Insert: {
          batch_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          processed?: boolean | null
          raw_data: Json
          row_number: number
        }
        Update: {
          batch_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          processed?: boolean | null
          raw_data?: Json
          row_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "import_raw_data_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "import_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_logs: {
        Row: {
          created_at: string
          id: string
          integration_id: string | null
          metadata: Json | null
          request_type: string
          response_time_ms: number | null
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          integration_id?: string | null
          metadata?: Json | null
          request_type: string
          response_time_ms?: number | null
          status: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          integration_id?: string | null
          metadata?: Json | null
          request_type?: string
          response_time_ms?: number | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integration_logs_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "api_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          role: string
          status: Database["public"]["Enums"]["invitation_status"]
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at: string
          id?: string
          role: string
          status?: Database["public"]["Enums"]["invitation_status"]
          token: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          role?: string
          status?: Database["public"]["Enums"]["invitation_status"]
          token?: string
        }
        Relationships: []
      }
      item_situation_relations: {
        Row: {
          created_at: string | null
          id: number
          item_id: number | null
          situation_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          item_id?: number | null
          situation_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          item_id?: number | null
          situation_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "item_situation_relations_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "edn_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_situation_relations_situation_id_fkey"
            columns: ["situation_id"]
            isOneToOne: false
            referencedRelation: "starting_situations"
            referencedColumns: ["id"]
          },
        ]
      }
      item_therapeutic_relations: {
        Row: {
          created_at: string | null
          id: number
          item_id: number | null
          therapeutic_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          item_id?: number | null
          therapeutic_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          item_id?: number | null
          therapeutic_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "item_therapeutic_relations_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "edn_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_therapeutic_relations_therapeutic_id_fkey"
            columns: ["therapeutic_id"]
            isOneToOne: false
            referencedRelation: "therapeutic_classes"
            referencedColumns: ["id"]
          },
        ]
      }
      items_completeness_history: {
        Row: {
          completeness_score: number
          content_score: number | null
          created_at: string | null
          id: string
          item_code: string
          metadata: Json | null
          quiz_score: number | null
          report_id: string | null
          tableau_a_score: number | null
          tableau_b_score: number | null
        }
        Insert: {
          completeness_score: number
          content_score?: number | null
          created_at?: string | null
          id?: string
          item_code: string
          metadata?: Json | null
          quiz_score?: number | null
          report_id?: string | null
          tableau_a_score?: number | null
          tableau_b_score?: number | null
        }
        Update: {
          completeness_score?: number
          content_score?: number | null
          created_at?: string | null
          id?: string
          item_code?: string
          metadata?: Json | null
          quiz_score?: number | null
          report_id?: string | null
          tableau_a_score?: number | null
          tableau_b_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "items_completeness_history_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "items_completeness_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      items_completeness_reports: {
        Row: {
          alerts: Json | null
          audit_type: string
          average_completeness: number | null
          complete_items: number
          created_at: string | null
          critical_issues: number
          id: string
          incomplete_items: number
          results: Json | null
          summary: Json | null
          total_items: number
        }
        Insert: {
          alerts?: Json | null
          audit_type?: string
          average_completeness?: number | null
          complete_items?: number
          created_at?: string | null
          critical_issues?: number
          id?: string
          incomplete_items?: number
          results?: Json | null
          summary?: Json | null
          total_items?: number
        }
        Update: {
          alerts?: Json | null
          audit_type?: string
          average_completeness?: number | null
          complete_items?: number
          created_at?: string | null
          critical_issues?: number
          id?: string
          incomplete_items?: number
          results?: Json | null
          summary?: Json | null
          total_items?: number
        }
        Relationships: []
      }
      jam_participants: {
        Row: {
          current_mood: string | null
          id: string
          instrument_type: string
          is_spectator: boolean | null
          joined_at: string
          left_at: string | null
          room_id: string
          user_id: string
        }
        Insert: {
          current_mood?: string | null
          id?: string
          instrument_type: string
          is_spectator?: boolean | null
          joined_at?: string
          left_at?: string | null
          room_id: string
          user_id: string
        }
        Update: {
          current_mood?: string | null
          id?: string
          instrument_type?: string
          is_spectator?: boolean | null
          joined_at?: string
          left_at?: string | null
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jam_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "jam_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      jam_rooms: {
        Row: {
          created_at: string
          creator_id: string
          current_participants: number | null
          description: string | null
          id: string
          is_active: boolean | null
          is_public: boolean | null
          max_participants: number | null
          mood: string
          name: string
          recording_project_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          current_participants?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_public?: boolean | null
          max_participants?: number | null
          mood: string
          name: string
          recording_project_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          current_participants?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_public?: boolean | null
          max_participants?: number | null
          mood?: string
          name?: string
          recording_project_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jam_rooms_recording_project_id_fkey"
            columns: ["recording_project_id"]
            isOneToOne: false
            referencedRelation: "recording_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      jam_sessions: {
        Row: {
          created_at: string
          duration_minutes: number | null
          id: string
          mood_evolution: Json | null
          participants_count: number | null
          recording_url: string | null
          room_id: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          mood_evolution?: Json | null
          participants_count?: number | null
          recording_url?: string | null
          room_id: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          mood_evolution?: Json | null
          participants_count?: number | null
          recording_url?: string | null
          room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jam_sessions_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "jam_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      journal: {
        Row: {
          audio_path: string | null
          created_at: string | null
          id: string
          sentiment_label: string | null
          text: string | null
          ts: string | null
          user_id: string | null
        }
        Insert: {
          audio_path?: string | null
          created_at?: string | null
          id?: string
          sentiment_label?: string | null
          text?: string | null
          ts?: string | null
          user_id?: string | null
        }
        Update: {
          audio_path?: string | null
          created_at?: string | null
          id?: string
          sentiment_label?: string | null
          text?: string | null
          ts?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          affect_negative: number | null
          affect_positive: number | null
          audio_url: string | null
          badge_text: string | null
          color_palette: Json | null
          content: string
          created_at: string | null
          id: string
          is_precious: boolean | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          affect_negative?: number | null
          affect_positive?: number | null
          audio_url?: string | null
          badge_text?: string | null
          color_palette?: Json | null
          content: string
          created_at?: string | null
          id?: string
          is_precious?: boolean | null
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          affect_negative?: number | null
          affect_positive?: number | null
          audio_url?: string | null
          badge_text?: string | null
          color_palette?: Json | null
          content?: string
          created_at?: string | null
          id?: string
          is_precious?: boolean | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      lyrics_generation_jobs: {
        Row: {
          attempt_count: number
          completed_at: string | null
          created_at: string
          error: string | null
          id: string
          item_code: string
          model: string
          priority: number
          prompt: string | null
          rang: string
          requested_by: string | null
          started_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          attempt_count?: number
          completed_at?: string | null
          created_at?: string
          error?: string | null
          id?: string
          item_code: string
          model?: string
          priority?: number
          prompt?: string | null
          rang: string
          requested_by?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          attempt_count?: number
          completed_at?: string | null
          created_at?: string
          error?: string | null
          id?: string
          item_code?: string
          model?: string
          priority?: number
          prompt?: string | null
          rang?: string
          requested_by?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      lyrics_texts: {
        Row: {
          content: string
          created_at: string
          generated_by: string | null
          id: string
          is_published: boolean
          item_code: string
          previous_version_id: string | null
          rang: string
          status: string
          style_meta: Json
          updated_at: string
          version: number
        }
        Insert: {
          content: string
          created_at?: string
          generated_by?: string | null
          id?: string
          is_published?: boolean
          item_code: string
          previous_version_id?: string | null
          rang: string
          status?: string
          style_meta?: Json
          updated_at?: string
          version?: number
        }
        Update: {
          content?: string
          created_at?: string
          generated_by?: string | null
          id?: string
          is_published?: boolean
          item_code?: string
          previous_version_id?: string | null
          rang?: string
          status?: string
          style_meta?: Json
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "lyrics_texts_previous_version_id_fkey"
            columns: ["previous_version_id"]
            isOneToOne: false
            referencedRelation: "lyrics_texts"
            referencedColumns: ["id"]
          },
        ]
      }
      med_mng_audio_access_logs: {
        Row: {
          access_type: string
          bytes_transferred: number | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          referer: string | null
          session_duration: number | null
          song_id: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          access_type: string
          bytes_transferred?: number | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          referer?: string | null
          session_duration?: number | null
          song_id: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          access_type?: string
          bytes_transferred?: number | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          referer?: string | null
          session_duration?: number | null
          song_id?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "med_mng_audio_access_logs_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "med_mng_songs"
            referencedColumns: ["id"]
          },
        ]
      }
      med_mng_cancellations: {
        Row: {
          cancelled_at: string
          credits_refunded: number | null
          id: string
          reason: string | null
          task_id: string
          task_type: string
          user_id: string
        }
        Insert: {
          cancelled_at?: string
          credits_refunded?: number | null
          id?: string
          reason?: string | null
          task_id: string
          task_type: string
          user_id: string
        }
        Update: {
          cancelled_at?: string
          credits_refunded?: number | null
          id?: string
          reason?: string | null
          task_id?: string
          task_type?: string
          user_id?: string
        }
        Relationships: []
      }
      med_mng_chat_interactions: {
        Row: {
          context_used: Json | null
          created_at: string | null
          id: string
          question: string
          response: string
          response_time_ms: number | null
          satisfaction_rating: number | null
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          context_used?: Json | null
          created_at?: string | null
          id?: string
          question: string
          response: string
          response_time_ms?: number | null
          satisfaction_rating?: number | null
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          context_used?: Json | null
          created_at?: string | null
          id?: string
          question?: string
          response?: string
          response_time_ms?: number | null
          satisfaction_rating?: number | null
          tokens_used?: number | null
          user_id?: string
        }
        Relationships: []
      }
      med_mng_content_ai: {
        Row: {
          comic_panels: Json | null
          created_at: string
          generated_at: string | null
          generation_status: string
          id: string
          item_id: string
          novel_text: string | null
          poem_text: string | null
          updated_at: string
        }
        Insert: {
          comic_panels?: Json | null
          created_at?: string
          generated_at?: string | null
          generation_status?: string
          id?: string
          item_id: string
          novel_text?: string | null
          poem_text?: string | null
          updated_at?: string
        }
        Update: {
          comic_panels?: Json | null
          created_at?: string
          generated_at?: string | null
          generation_status?: string
          id?: string
          item_id?: string
          novel_text?: string | null
          poem_text?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      med_mng_content_master: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          avg_reading_time: number | null
          comic_data: Json | null
          content_size_kb: number | null
          created_at: string | null
          generated_at: string | null
          generation_version: string | null
          has_lyrics_sync: boolean | null
          id: string
          images_data: Json | null
          item_id: string
          novel_data: Json | null
          poem_data: Json | null
          quality_score: number | null
          unique_viewers_count: number | null
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          avg_reading_time?: number | null
          comic_data?: Json | null
          content_size_kb?: number | null
          created_at?: string | null
          generated_at?: string | null
          generation_version?: string | null
          has_lyrics_sync?: boolean | null
          id?: string
          images_data?: Json | null
          item_id: string
          novel_data?: Json | null
          poem_data?: Json | null
          quality_score?: number | null
          unique_viewers_count?: number | null
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          avg_reading_time?: number | null
          comic_data?: Json | null
          content_size_kb?: number | null
          created_at?: string | null
          generated_at?: string | null
          generation_version?: string | null
          has_lyrics_sync?: boolean | null
          id?: string
          images_data?: Json | null
          item_id?: string
          novel_data?: Json | null
          poem_data?: Json | null
          quality_score?: number | null
          unique_viewers_count?: number | null
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: []
      }
      med_mng_content_views: {
        Row: {
          completed: boolean | null
          completion_percentage: number | null
          content_type: string
          device_type: string | null
          id: string
          ip_address: unknown | null
          item_id: string
          user_agent: string | null
          user_id: string | null
          view_duration: number | null
          viewed_at: string | null
        }
        Insert: {
          completed?: boolean | null
          completion_percentage?: number | null
          content_type: string
          device_type?: string | null
          id?: string
          ip_address?: unknown | null
          item_id: string
          user_agent?: string | null
          user_id?: string | null
          view_duration?: number | null
          viewed_at?: string | null
        }
        Update: {
          completed?: boolean | null
          completion_percentage?: number | null
          content_type?: string
          device_type?: string | null
          id?: string
          ip_address?: unknown | null
          item_id?: string
          user_agent?: string | null
          user_id?: string | null
          view_duration?: number | null
          viewed_at?: string | null
        }
        Relationships: []
      }
      med_mng_generation_alerts: {
        Row: {
          acknowledged: boolean | null
          acknowledged_at: string | null
          acknowledged_by: string | null
          actual_value: number | null
          alert_type: string
          created_at: string | null
          generation_log_id: string | null
          id: string
          message: string
          metadata: Json | null
          resolved: boolean | null
          resolved_at: string | null
          severity: string
          threshold_value: number | null
        }
        Insert: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          actual_value?: number | null
          alert_type: string
          created_at?: string | null
          generation_log_id?: string | null
          id?: string
          message: string
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          severity?: string
          threshold_value?: number | null
        }
        Update: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          actual_value?: number | null
          alert_type?: string
          created_at?: string | null
          generation_log_id?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          severity?: string
          threshold_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "med_mng_generation_alerts_generation_log_id_fkey"
            columns: ["generation_log_id"]
            isOneToOne: false
            referencedRelation: "med_mng_music_generation_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      med_mng_generation_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          generation_time_ms: number | null
          generation_type: string
          id: string
          metadata: Json | null
          prompt: string | null
          response_data: Json | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          generation_time_ms?: number | null
          generation_type: string
          id?: string
          metadata?: Json | null
          prompt?: string | null
          response_data?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          generation_time_ms?: number | null
          generation_type?: string
          id?: string
          metadata?: Json | null
          prompt?: string | null
          response_data?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      med_mng_listening_events: {
        Row: {
          event_type: string
          id: string
          listen_duration: number | null
          metadata: Json | null
          song_id: string
          timestamp: string
          user_id: string
        }
        Insert: {
          event_type: string
          id?: string
          listen_duration?: number | null
          metadata?: Json | null
          song_id: string
          timestamp?: string
          user_id: string
        }
        Update: {
          event_type?: string
          id?: string
          listen_duration?: number | null
          metadata?: Json | null
          song_id?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      med_mng_listening_sessions: {
        Row: {
          browser_info: Json | null
          buffer_events: number | null
          bytes_streamed: number | null
          completion_percentage: number | null
          connection_quality: string | null
          created_at: string | null
          device_type: string | null
          duration_seconds: number | null
          id: string
          next_song_id: string | null
          playback_source: string | null
          playlist_id: string | null
          previous_song_id: string | null
          seek_events: number | null
          session_end: string | null
          session_start: string | null
          song_id: string
          user_id: string | null
        }
        Insert: {
          browser_info?: Json | null
          buffer_events?: number | null
          bytes_streamed?: number | null
          completion_percentage?: number | null
          connection_quality?: string | null
          created_at?: string | null
          device_type?: string | null
          duration_seconds?: number | null
          id?: string
          next_song_id?: string | null
          playback_source?: string | null
          playlist_id?: string | null
          previous_song_id?: string | null
          seek_events?: number | null
          session_end?: string | null
          session_start?: string | null
          song_id: string
          user_id?: string | null
        }
        Update: {
          browser_info?: Json | null
          buffer_events?: number | null
          bytes_streamed?: number | null
          completion_percentage?: number | null
          connection_quality?: string | null
          created_at?: string | null
          device_type?: string | null
          duration_seconds?: number | null
          id?: string
          next_song_id?: string | null
          playback_source?: string | null
          playlist_id?: string | null
          previous_song_id?: string | null
          seek_events?: number | null
          session_end?: string | null
          session_start?: string | null
          song_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "med_mng_listening_sessions_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "med_mng_songs"
            referencedColumns: ["id"]
          },
        ]
      }
      med_mng_lyrics_access_logs: {
        Row: {
          created_at: string | null
          format: string
          id: string
          ip_address: unknown | null
          song_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          format: string
          id?: string
          ip_address?: unknown | null
          song_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          format?: string
          id?: string
          ip_address?: unknown | null
          song_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "med_mng_lyrics_access_logs_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "med_mng_songs"
            referencedColumns: ["id"]
          },
        ]
      }
      med_mng_music_generation_logs: {
        Row: {
          audio_url: string | null
          completed_at: string | null
          created_at: string | null
          credits_consumed: number | null
          error_message: string | null
          generation_duration_seconds: number | null
          generation_status: string | null
          generation_type: string
          id: string
          item_code: string
          processing_time_seconds: number | null
          prompt_used: string | null
          queue_time_seconds: number | null
          request_ip: unknown | null
          request_metadata: Json | null
          song_id: string | null
          started_at: string | null
          style_tags: string | null
          success: boolean | null
          suno_model_used: string | null
          suno_task_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          audio_url?: string | null
          completed_at?: string | null
          created_at?: string | null
          credits_consumed?: number | null
          error_message?: string | null
          generation_duration_seconds?: number | null
          generation_status?: string | null
          generation_type: string
          id?: string
          item_code: string
          processing_time_seconds?: number | null
          prompt_used?: string | null
          queue_time_seconds?: number | null
          request_ip?: unknown | null
          request_metadata?: Json | null
          song_id?: string | null
          started_at?: string | null
          style_tags?: string | null
          success?: boolean | null
          suno_model_used?: string | null
          suno_task_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          audio_url?: string | null
          completed_at?: string | null
          created_at?: string | null
          credits_consumed?: number | null
          error_message?: string | null
          generation_duration_seconds?: number | null
          generation_status?: string | null
          generation_type?: string
          id?: string
          item_code?: string
          processing_time_seconds?: number | null
          prompt_used?: string | null
          queue_time_seconds?: number | null
          request_ip?: unknown | null
          request_metadata?: Json | null
          song_id?: string | null
          started_at?: string | null
          style_tags?: string | null
          success?: boolean | null
          suno_model_used?: string | null
          suno_task_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "med_mng_music_generation_logs_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "med_mng_songs"
            referencedColumns: ["id"]
          },
        ]
      }
      med_mng_playlist_analytics: {
        Row: {
          created_at: string
          id: string
          last_played: string | null
          playlist_id: string
          total_listen_time: number
          total_plays: number
          unique_listeners: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_played?: string | null
          playlist_id: string
          total_listen_time?: number
          total_plays?: number
          unique_listeners?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_played?: string | null
          playlist_id?: string
          total_listen_time?: number
          total_plays?: number
          unique_listeners?: number
          updated_at?: string
        }
        Relationships: []
      }
      med_mng_playlist_songs: {
        Row: {
          added_at: string | null
          added_by: string
          id: string
          playlist_id: string
          position: number
          song_id: string
        }
        Insert: {
          added_at?: string | null
          added_by: string
          id?: string
          playlist_id: string
          position?: number
          song_id: string
        }
        Update: {
          added_at?: string | null
          added_by?: string
          id?: string
          playlist_id?: string
          position?: number
          song_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "med_mng_playlist_songs_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "med_mng_playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "med_mng_playlist_songs_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "med_mng_songs"
            referencedColumns: ["id"]
          },
        ]
      }
      med_mng_playlists: {
        Row: {
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      med_mng_qcm_sessions: {
        Row: {
          answers: Json
          completed_at: string | null
          created_at: string
          errors: Json
          id: string
          item_id: string
          questions: Json
          score: number | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answers?: Json
          completed_at?: string | null
          created_at?: string
          errors?: Json
          id?: string
          item_id: string
          questions?: Json
          score?: number | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answers?: Json
          completed_at?: string | null
          created_at?: string
          errors?: Json
          id?: string
          item_id?: string
          questions?: Json
          score?: number | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      med_mng_song_likes: {
        Row: {
          created_at: string
          id: string
          song_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          song_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          song_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "med_mng_song_likes_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "med_mng_songs"
            referencedColumns: ["id"]
          },
        ]
      }
      med_mng_songs: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          lyrics: Json | null
          meta: Json | null
          suno_audio_id: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          lyrics?: Json | null
          meta?: Json | null
          suno_audio_id: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          lyrics?: Json | null
          meta?: Json | null
          suno_audio_id?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      med_mng_subscriptions: {
        Row: {
          created_at: string
          credits_left: number
          gateway: string
          id: string
          paypal_subscription_id: string | null
          plan: string
          renews_at: string
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits_left?: number
          gateway: string
          id?: string
          paypal_subscription_id?: string | null
          plan: string
          renews_at: string
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits_left?: number
          gateway?: string
          id?: string
          paypal_subscription_id?: string | null
          plan?: string
          renews_at?: string
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      med_mng_synchronized_lyrics: {
        Row: {
          created_at: string
          id: string
          lyrics_data: Json
          song_id: string
          source: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          lyrics_data: Json
          song_id: string
          source?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          lyrics_data?: Json
          song_id?: string
          source?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "med_mng_synchronized_lyrics_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: true
            referencedRelation: "med_mng_songs"
            referencedColumns: ["id"]
          },
        ]
      }
      med_mng_user_analytics: {
        Row: {
          created_at: string
          id: string
          last_played: string
          play_count: number
          song_id: string
          total_listen_time: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_played?: string
          play_count?: number
          song_id: string
          total_listen_time?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_played?: string
          play_count?: number
          song_id?: string
          total_listen_time?: number
          user_id?: string
        }
        Relationships: []
      }
      med_mng_user_favorites: {
        Row: {
          created_at: string
          id: string
          song_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          song_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          song_id?: string
          user_id?: string
        }
        Relationships: []
      }
      med_mng_user_settings: {
        Row: {
          created_at: string
          theme_json: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          theme_json?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          theme_json?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      med_mng_user_songs: {
        Row: {
          created_at: string
          id: string
          song_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          song_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          song_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "med_mng_user_songs_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "med_mng_songs"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_learning_analytics: {
        Row: {
          action_type: string
          created_at: string
          duration_seconds: number | null
          id: string
          item_code: string
          metadata: Json | null
          score: number | null
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          item_code: string
          metadata?: Json | null
          score?: number | null
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          item_code?: string
          metadata?: Json | null
          score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      medilinko_consultations: {
        Row: {
          consultation_result: string | null
          created_at: string
          email: string
          id: string
          patient_data: Json
          patient_name: string
          payment_status: string | null
        }
        Insert: {
          consultation_result?: string | null
          created_at?: string
          email: string
          id?: string
          patient_data: Json
          patient_name: string
          payment_status?: string | null
        }
        Update: {
          consultation_result?: string | null
          created_at?: string
          email?: string
          id?: string
          patient_data?: Json
          patient_name?: string
          payment_status?: string | null
        }
        Relationships: []
      }
      meditation_content: {
        Row: {
          audio_url: string | null
          category: string
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          duration: number
          id: string
          instructor: string | null
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          audio_url?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration: number
          id?: string
          instructor?: string | null
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          audio_url?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration?: number
          id?: string
          instructor?: string | null
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: []
      }
      metrics_bubble_beat: {
        Row: {
          id: string
          payload: Json | null
          session_id: string | null
          ts: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          payload?: Json | null
          session_id?: string | null
          ts?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          payload?: Json | null
          session_id?: string | null
          ts?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      metrics_emotion_scan: {
        Row: {
          id: string
          payload: Json | null
          session_id: string | null
          ts: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          payload?: Json | null
          session_id?: string | null
          ts?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          payload?: Json | null
          session_id?: string | null
          ts?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      metrics_face_filter: {
        Row: {
          id: string
          payload: Json | null
          session_id: string | null
          ts: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          payload?: Json | null
          session_id?: string | null
          ts?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          payload?: Json | null
          session_id?: string | null
          ts?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      metrics_flash_glow: {
        Row: {
          id: string
          payload: Json | null
          session_id: string | null
          ts: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          payload?: Json | null
          session_id?: string | null
          ts?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          payload?: Json | null
          session_id?: string | null
          ts?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      metrics_vr_breath: {
        Row: {
          id: string
          payload: Json | null
          session_id: string | null
          ts: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          payload?: Json | null
          session_id?: string | null
          ts?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          payload?: Json | null
          session_id?: string | null
          ts?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      metrics_vr_galaxy: {
        Row: {
          id: string
          payload: Json | null
          session_id: string | null
          ts: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          payload?: Json | null
          session_id?: string | null
          ts?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          payload?: Json | null
          session_id?: string | null
          ts?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      monitoring_incidents: {
        Row: {
          created_at: string
          details: Json | null
          id: string
          incident_type: string
          message: string
          resolution_notes: string | null
          resolved_at: string | null
          service_name: string
          severity: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          details?: Json | null
          id?: string
          incident_type: string
          message: string
          resolution_notes?: string | null
          resolved_at?: string | null
          service_name: string
          severity: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          details?: Json | null
          id?: string
          incident_type?: string
          message?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          service_name?: string
          severity?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      mood_entries: {
        Row: {
          created_at: string | null
          emotions: string[] | null
          id: string
          mood_level: number
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          emotions?: string[] | null
          id?: string
          mood_level: number
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          emotions?: string[] | null
          id?: string
          mood_level?: number
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mood_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      music_completion_logs: {
        Row: {
          completion_percentage: number | null
          completion_timestamp: string | null
          id: string
          listen_duration: number | null
          track_id: string
          user_id: string | null
        }
        Insert: {
          completion_percentage?: number | null
          completion_timestamp?: string | null
          id?: string
          listen_duration?: number | null
          track_id: string
          user_id?: string | null
        }
        Update: {
          completion_percentage?: number | null
          completion_timestamp?: string | null
          id?: string
          listen_duration?: number | null
          track_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      music_favorites: {
        Row: {
          created_at: string
          id: string
          meta: Json
          track_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          meta?: Json
          track_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          meta?: Json
          track_id?: string
          user_id?: string
        }
        Relationships: []
      }
      music_fragments: {
        Row: {
          created_at: string | null
          id: string
          rarity: string
          session_id: string | null
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          rarity: string
          session_id?: string | null
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          rarity?: string
          session_id?: string | null
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "music_fragments_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "music_therapy_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      music_generation_logs: {
        Row: {
          created_at: string | null
          emotion: string
          generation_metadata: Json | null
          id: string
          intensity: number | null
          tracks_generated: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          emotion: string
          generation_metadata?: Json | null
          id?: string
          intensity?: number | null
          tracks_generated?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          emotion?: string
          generation_metadata?: Json | null
          id?: string
          intensity?: number | null
          tracks_generated?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      music_generation_usage: {
        Row: {
          created_at: string
          generated_count: number
          id: string
          month_year: string
          quota_limit: number
          subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          generated_count?: number
          id?: string
          month_year: string
          quota_limit: number
          subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          generated_count?: number
          id?: string
          month_year?: string
          quota_limit?: number
          subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "music_generation_usage_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      music_play_logs: {
        Row: {
          emotion_context: string | null
          id: string
          play_timestamp: string | null
          session_metadata: Json | null
          track_id: string
          user_id: string | null
        }
        Insert: {
          emotion_context?: string | null
          id?: string
          play_timestamp?: string | null
          session_metadata?: Json | null
          track_id: string
          user_id?: string | null
        }
        Update: {
          emotion_context?: string | null
          id?: string
          play_timestamp?: string | null
          session_metadata?: Json | null
          track_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      music_playlists: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          mood: string | null
          name: string
          play_count: number | null
          tags: string[] | null
          total_duration: number | null
          tracks: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          mood?: string | null
          name: string
          play_count?: number | null
          tags?: string[] | null
          total_duration?: number | null
          tracks?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          mood?: string | null
          name?: string
          play_count?: number | null
          tags?: string[] | null
          total_duration?: number | null
          tracks?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      music_recent: {
        Row: {
          id: string
          meta: Json
          position_sec: number
          track_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          meta?: Json
          position_sec?: number
          track_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          meta?: Json
          position_sec?: number
          track_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      music_sessions: {
        Row: {
          created_at: string | null
          id: string
          mood_tag: string | null
          suno_track_ids: string[] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          mood_tag?: string | null
          suno_track_ids?: string[] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          mood_tag?: string | null
          suno_track_ids?: string[] | null
          user_id?: string | null
        }
        Relationships: []
      }
      music_skip_logs: {
        Row: {
          id: string
          skip_position: number | null
          skip_reason: string | null
          skip_timestamp: string | null
          track_id: string
          user_id: string | null
        }
        Insert: {
          id?: string
          skip_position?: number | null
          skip_reason?: string | null
          skip_timestamp?: string | null
          track_id: string
          user_id?: string | null
        }
        Update: {
          id?: string
          skip_position?: number | null
          skip_reason?: string | null
          skip_timestamp?: string | null
          track_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      music_therapy_sessions: {
        Row: {
          badge_verbal: string | null
          completed_at: string | null
          created_at: string | null
          duration_seconds: number | null
          fragment_rarity: string | null
          fragment_unlocked: boolean | null
          id: string
          interactions_count: number | null
          mood_state_post: Json | null
          mood_state_pre: Json | null
          music_metadata: Json | null
          music_url: string | null
          started_at: string | null
          user_id: string
        }
        Insert: {
          badge_verbal?: string | null
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          fragment_rarity?: string | null
          fragment_unlocked?: boolean | null
          id?: string
          interactions_count?: number | null
          mood_state_post?: Json | null
          mood_state_pre?: Json | null
          music_metadata?: Json | null
          music_url?: string | null
          started_at?: string | null
          user_id: string
        }
        Update: {
          badge_verbal?: string | null
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          fragment_rarity?: string | null
          fragment_unlocked?: boolean | null
          id?: string
          interactions_count?: number | null
          mood_state_post?: Json | null
          mood_state_pre?: Json | null
          music_metadata?: Json | null
          music_url?: string | null
          started_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          category: string
          created_at: string | null
          delivery_methods: string[] | null
          enabled: boolean | null
          frequency: string | null
          id: string
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          timezone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          delivery_methods?: string[] | null
          enabled?: boolean | null
          frequency?: string | null
          id?: string
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          delivery_methods?: string[] | null
          enabled?: boolean | null
          frequency?: string | null
          id?: string
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notification_templates: {
        Row: {
          category: string
          created_at: string | null
          default_delivery_methods: string[] | null
          default_priority: string | null
          id: string
          message_template: string
          name: string
          title_template: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          default_delivery_methods?: string[] | null
          default_priority?: string | null
          id?: string
          message_template: string
          name: string
          title_template: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          default_delivery_methods?: string[] | null
          default_priority?: string | null
          id?: string
          message_template?: string
          name?: string
          title_template?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_link: string | null
          action_text: string | null
          category: string | null
          channel: string | null
          clicked_at: string | null
          created_at: string | null
          deeplink: string | null
          delivered_at: string | null
          delivery_method: string[] | null
          expires_at: string | null
          icon: string | null
          id: string
          image: string | null
          message: string
          metadata: Json | null
          priority: string | null
          read: boolean | null
          scheduled_at: string | null
          source_url: string | null
          target_audience: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_link?: string | null
          action_text?: string | null
          category?: string | null
          channel?: string | null
          clicked_at?: string | null
          created_at?: string | null
          deeplink?: string | null
          delivered_at?: string | null
          delivery_method?: string[] | null
          expires_at?: string | null
          icon?: string | null
          id?: string
          image?: string | null
          message: string
          metadata?: Json | null
          priority?: string | null
          read?: boolean | null
          scheduled_at?: string | null
          source_url?: string | null
          target_audience?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_link?: string | null
          action_text?: string | null
          category?: string | null
          channel?: string | null
          clicked_at?: string | null
          created_at?: string | null
          deeplink?: string | null
          delivered_at?: string | null
          delivery_method?: string[] | null
          expires_at?: string | null
          icon?: string | null
          id?: string
          image?: string | null
          message?: string
          metadata?: Json | null
          priority?: string | null
          read?: boolean | null
          scheduled_at?: string | null
          source_url?: string | null
          target_audience?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      official_content_cache: {
        Row: {
          content: string
          id: string
          item_number: string | null
          last_updated: string | null
          situation_number: string | null
        }
        Insert: {
          content: string
          id?: string
          item_number?: string | null
          last_updated?: string | null
          situation_number?: string | null
        }
        Update: {
          content?: string
          id?: string
          item_number?: string | null
          last_updated?: string | null
          situation_number?: string | null
        }
        Relationships: []
      }
      "official_content_cache new": {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          identifier: string
          identifier_type: string | null
          title: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          identifier?: string
          identifier_type?: string | null
          title?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          identifier?: string
          identifier_type?: string | null
          title?: string | null
        }
        Relationships: []
      }
      oic_competences: {
        Row: {
          causes_echec: string | null
          contenu_detaille: Json | null
          contributeurs: string | null
          created_at: string | null
          date_import: string | null
          description: string | null
          effets_indesirables: string | null
          extraction_status: string | null
          hash_content: string | null
          indications: string | null
          interactions: string | null
          intitule: string
          item_parent: string
          mecanismes: string | null
          modalites_surveillance: string | null
          objectif_id: string
          ordre: number | null
          ordre_affichage: number | null
          rang: string
          raw_json: Json | null
          rubrique: string | null
          sections_detaillees: Json | null
          sommaire: string | null
          titre_complet: string | null
          updated_at: string | null
          url_source: string
        }
        Insert: {
          causes_echec?: string | null
          contenu_detaille?: Json | null
          contributeurs?: string | null
          created_at?: string | null
          date_import?: string | null
          description?: string | null
          effets_indesirables?: string | null
          extraction_status?: string | null
          hash_content?: string | null
          indications?: string | null
          interactions?: string | null
          intitule: string
          item_parent: string
          mecanismes?: string | null
          modalites_surveillance?: string | null
          objectif_id: string
          ordre?: number | null
          ordre_affichage?: number | null
          rang: string
          raw_json?: Json | null
          rubrique?: string | null
          sections_detaillees?: Json | null
          sommaire?: string | null
          titre_complet?: string | null
          updated_at?: string | null
          url_source: string
        }
        Update: {
          causes_echec?: string | null
          contenu_detaille?: Json | null
          contributeurs?: string | null
          created_at?: string | null
          date_import?: string | null
          description?: string | null
          effets_indesirables?: string | null
          extraction_status?: string | null
          hash_content?: string | null
          indications?: string | null
          interactions?: string | null
          intitule?: string
          item_parent?: string
          mecanismes?: string | null
          modalites_surveillance?: string | null
          objectif_id?: string
          ordre?: number | null
          ordre_affichage?: number | null
          rang?: string
          raw_json?: Json | null
          rubrique?: string | null
          sections_detaillees?: Json | null
          sommaire?: string | null
          titre_complet?: string | null
          updated_at?: string | null
          url_source?: string
        }
        Relationships: []
      }
      oic_extraction_methods: {
        Row: {
          created_at: string
          extraction_date: string
          extraction_script: string
          id: string
          method_name: string
          notes: string | null
          regex_patterns: Json
          success_rate: number
          total_extracted: number
        }
        Insert: {
          created_at?: string
          extraction_date?: string
          extraction_script: string
          id?: string
          method_name: string
          notes?: string | null
          regex_patterns: Json
          success_rate: number
          total_extracted: number
        }
        Update: {
          created_at?: string
          extraction_date?: string
          extraction_script?: string
          id?: string
          method_name?: string
          notes?: string | null
          regex_patterns?: Json
          success_rate?: number
          total_extracted?: number
        }
        Relationships: []
      }
      oic_extraction_progress: {
        Row: {
          auth_cookies: string | null
          created_at: string | null
          current_page_url: string | null
          error_message: string | null
          failed_urls: Json | null
          id: string
          items_extracted: number | null
          last_activity: string | null
          last_item_id: string | null
          page_number: number | null
          session_id: string
          status: string | null
          total_expected: number | null
          total_pages: number | null
        }
        Insert: {
          auth_cookies?: string | null
          created_at?: string | null
          current_page_url?: string | null
          error_message?: string | null
          failed_urls?: Json | null
          id?: string
          items_extracted?: number | null
          last_activity?: string | null
          last_item_id?: string | null
          page_number?: number | null
          session_id: string
          status?: string | null
          total_expected?: number | null
          total_pages?: number | null
        }
        Update: {
          auth_cookies?: string | null
          created_at?: string | null
          current_page_url?: string | null
          error_message?: string | null
          failed_urls?: Json | null
          id?: string
          items_extracted?: number | null
          last_activity?: string | null
          last_item_id?: string | null
          page_number?: number | null
          session_id?: string
          status?: string | null
          total_expected?: number | null
          total_pages?: number | null
        }
        Relationships: []
      }
      onboarding_steps: {
        Row: {
          body: Json
          created_at: string
          id: string
          is_active: boolean
          key: string
          title: Json
          type: string
          updated_at: string
          version: number
        }
        Insert: {
          body?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          key: string
          title?: Json
          type?: string
          updated_at?: string
          version?: number
        }
        Update: {
          body?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          key?: string
          title?: Json
          type?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      operation_logs: {
        Row: {
          created_at: string
          duration_ms: number | null
          endpoint: string | null
          id: string
          message: string
          meta: Json | null
          status_code: number | null
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          duration_ms?: number | null
          endpoint?: string | null
          id?: string
          message: string
          meta?: Json | null
          status_code?: number | null
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          duration_ms?: number | null
          endpoint?: string | null
          id?: string
          message?: string
          meta?: Json | null
          status_code?: number | null
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      org_aggregates: {
        Row: {
          created_at: string | null
          id: string
          label_bins: Json | null
          min_n: number | null
          org_id: string | null
          period: string
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          label_bins?: Json | null
          min_n?: number | null
          org_id?: string | null
          period: string
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          label_bins?: Json | null
          min_n?: number | null
          org_id?: string | null
          period?: string
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      org_assess_rollups: {
        Row: {
          created_at: string
          id: string
          instrument: string
          n: number
          org_id: string
          period: string
          text_summary: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          instrument: string
          n: number
          org_id: string
          period: string
          text_summary?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          instrument?: string
          n?: number
          org_id?: string
          period?: string
          text_summary?: string | null
        }
        Relationships: []
      }
      org_memberships: {
        Row: {
          created_at: string
          id: string
          org_id: string
          role: string
          team_name: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          org_id: string
          role: string
          team_name?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          org_id?: string
          role?: string
          team_name?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_memberships_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          id: string
          joined_at: string | null
          organization_id: string
          role: string | null
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          organization_id: string
          role?: string | null
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          organization_id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          domain: string | null
          id: string
          name: string
          settings: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          domain?: string | null
          id?: string
          name: string
          settings?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          domain?: string | null
          id?: string
          name?: string
          settings?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      page_analytics: {
        Row: {
          id: string
          interactions_count: number | null
          route_path: string
          session_duration: number | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          interactions_count?: number | null
          route_path: string
          session_duration?: number | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          interactions_count?: number | null
          route_path?: string
          session_duration?: number | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      pending_corrections: {
        Row: {
          applied_at: string | null
          correction_reason: string | null
          created_at: string
          current_value: Json | null
          field_name: string
          id: string
          priority: string | null
          proposed_value: Json
          record_id: string
          requested_by: string | null
          reviewed_by: string | null
          status: string | null
          table_name: string
        }
        Insert: {
          applied_at?: string | null
          correction_reason?: string | null
          created_at?: string
          current_value?: Json | null
          field_name: string
          id?: string
          priority?: string | null
          proposed_value: Json
          record_id: string
          requested_by?: string | null
          reviewed_by?: string | null
          status?: string | null
          table_name: string
        }
        Update: {
          applied_at?: string | null
          correction_reason?: string | null
          created_at?: string
          current_value?: Json | null
          field_name?: string
          id?: string
          priority?: string | null
          proposed_value?: Json
          record_id?: string
          requested_by?: string | null
          reviewed_by?: string | null
          status?: string | null
          table_name?: string
        }
        Relationships: []
      }
      performance_alerts: {
        Row: {
          acknowledged: boolean
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_type: string
          created_at: string
          description: string
          id: string
          metric_data: Json
          resolved: boolean
          resolved_at: string | null
          severity: string
          title: string
        }
        Insert: {
          acknowledged?: boolean
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type: string
          created_at?: string
          description: string
          id?: string
          metric_data: Json
          resolved?: boolean
          resolved_at?: string | null
          severity: string
          title: string
        }
        Update: {
          acknowledged?: boolean
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type?: string
          created_at?: string
          description?: string
          id?: string
          metric_data?: Json
          resolved?: boolean
          resolved_at?: string | null
          severity?: string
          title?: string
        }
        Relationships: []
      }
      performance_budgets: {
        Row: {
          active: boolean
          created_at: string
          critical_threshold: number
          id: string
          metric_name: string
          metric_type: string
          name: string
          target_value: number
          updated_at: string
          warning_threshold: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          critical_threshold: number
          id?: string
          metric_name: string
          metric_type: string
          name: string
          target_value: number
          updated_at?: string
          warning_threshold: number
        }
        Update: {
          active?: boolean
          created_at?: string
          critical_threshold?: number
          id?: string
          metric_name?: string
          metric_type?: string
          name?: string
          target_value?: number
          updated_at?: string
          warning_threshold?: number
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          connection_type: string | null
          created_at: string
          device_type: string | null
          id: string
          metadata: Json | null
          metric_name: string
          metric_type: string
          metric_unit: string
          metric_value: number
          session_id: string
          timestamp: string
          url: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          connection_type?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_type: string
          metric_unit: string
          metric_value: number
          session_id: string
          timestamp?: string
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          connection_type?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_type?: string
          metric_unit?: string
          metric_value?: number
          session_id?: string
          timestamp?: string
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      personalized_recommendations: {
        Row: {
          acted_upon: boolean | null
          ai_confidence: number | null
          created_at: string | null
          description: string | null
          expires_at: string | null
          id: string
          priority_score: number | null
          reasoning: string | null
          recommendation_type: string
          target_activity: string | null
          title: string
          user_id: string
          viewed: boolean | null
        }
        Insert: {
          acted_upon?: boolean | null
          ai_confidence?: number | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          priority_score?: number | null
          reasoning?: string | null
          recommendation_type: string
          target_activity?: string | null
          title: string
          user_id: string
          viewed?: boolean | null
        }
        Update: {
          acted_upon?: boolean | null
          ai_confidence?: number | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          priority_score?: number | null
          reasoning?: string | null
          recommendation_type?: string
          target_activity?: string | null
          title?: string
          user_id?: string
          viewed?: boolean | null
        }
        Relationships: []
      }
      points_history: {
        Row: {
          challenge_id: string | null
          created_at: string | null
          id: string
          points: number
          reason: string
          user_id: string
        }
        Insert: {
          challenge_id?: string | null
          created_at?: string | null
          id?: string
          points: number
          reason: string
          user_id: string
        }
        Update: {
          challenge_id?: string | null
          created_at?: string | null
          id?: string
          points?: number
          reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "points_history_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string
          date: string
          id: string
          image_url: string | null
          reactions: number | null
          user_id: string
        }
        Insert: {
          content: string
          date?: string
          id?: string
          image_url?: string | null
          reactions?: number | null
          user_id: string
        }
        Update: {
          content?: string
          date?: string
          id?: string
          image_url?: string | null
          reactions?: number | null
          user_id?: string
        }
        Relationships: []
      }
      privacy_consents: {
        Row: {
          consent_type: string
          created_at: string
          granted: boolean
          granted_at: string
          id: string
          metadata: Json | null
          revoked_at: string | null
          source: string
          user_id: string
        }
        Insert: {
          consent_type: string
          created_at?: string
          granted?: boolean
          granted_at?: string
          id?: string
          metadata?: Json | null
          revoked_at?: string | null
          source?: string
          user_id: string
        }
        Update: {
          consent_type?: string
          created_at?: string
          granted?: boolean
          granted_at?: string
          id?: string
          metadata?: Json | null
          revoked_at?: string | null
          source?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          credits_left: number | null
          department: string | null
          email: string | null
          emotional_score: number | null
          id: string
          is_test_account: boolean | null
          job_title: string | null
          location: string | null
          name: string | null
          phone: string | null
          preferences: Json | null
          role: string | null
          subscription_plan: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          credits_left?: number | null
          department?: string | null
          email?: string | null
          emotional_score?: number | null
          id: string
          is_test_account?: boolean | null
          job_title?: string | null
          location?: string | null
          name?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: string | null
          subscription_plan?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          credits_left?: number | null
          department?: string | null
          email?: string | null
          emotional_score?: number | null
          id?: string
          is_test_account?: boolean | null
          job_title?: string | null
          location?: string | null
          name?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: string | null
          subscription_plan?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string | null
          endpoint: string
          id: string
          p256dh: string
          user_id: string | null
        }
        Insert: {
          auth: string
          created_at?: string | null
          endpoint: string
          id?: string
          p256dh: string
          user_id?: string | null
        }
        Update: {
          auth?: string
          created_at?: string | null
          endpoint?: string
          id?: string
          p256dh?: string
          user_id?: string | null
        }
        Relationships: []
      }
      qcm_responses: {
        Row: {
          correct_answer: string
          created_at: string | null
          explanation: string | null
          id: string
          is_correct: boolean
          medical_concept: string | null
          question_id: string
          question_text: string
          response_time_seconds: number | null
          session_id: string
          user_answer: string
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          explanation?: string | null
          id?: string
          is_correct: boolean
          medical_concept?: string | null
          question_id: string
          question_text: string
          response_time_seconds?: number | null
          session_id: string
          user_answer: string
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          explanation?: string | null
          id?: string
          is_correct?: boolean
          medical_concept?: string | null
          question_id?: string
          question_text?: string
          response_time_seconds?: number | null
          session_id?: string
          user_answer?: string
        }
        Relationships: [
          {
            foreignKeyName: "qcm_responses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "qcm_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      qcm_sessions: {
        Row: {
          completed_at: string | null
          correct_answers: number | null
          created_at: string | null
          id: string
          incorrect_answers: number | null
          item_code: string
          score: number | null
          session_type: string
          time_spent_seconds: number | null
          total_questions: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          correct_answers?: number | null
          created_at?: string | null
          id?: string
          incorrect_answers?: number | null
          item_code: string
          score?: number | null
          session_type: string
          time_spent_seconds?: number | null
          total_questions?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          correct_answers?: number | null
          created_at?: string | null
          id?: string
          incorrect_answers?: number | null
          item_code?: string
          score?: number | null
          session_type?: string
          time_spent_seconds?: number | null
          total_questions?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      quiz_sessions: {
        Row: {
          completed: boolean
          correct_answers: number
          created_at: string
          id: string
          item_code: string
          questions_count: number
          rang: string
          score: number
          session_data: Json
          time_spent_seconds: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          completed?: boolean
          correct_answers?: number
          created_at?: string
          id?: string
          item_code: string
          questions_count?: number
          rang: string
          score?: number
          session_data?: Json
          time_spent_seconds?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          completed?: boolean
          correct_answers?: number
          created_at?: string
          id?: string
          item_code?: string
          questions_count?: number
          rang?: string
          score?: number
          session_data?: Json
          time_spent_seconds?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      rare_auras_catalog: {
        Row: {
          animation_preset: string | null
          aura_type: string
          color_palette: Json
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          rarity_level: string
          unlock_conditions: Json
        }
        Insert: {
          animation_preset?: string | null
          aura_type: string
          color_palette: Json
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          rarity_level: string
          unlock_conditions: Json
        }
        Update: {
          animation_preset?: string | null
          aura_type?: string
          color_palette?: Json
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          rarity_level?: string
          unlock_conditions?: Json
        }
        Relationships: []
      }
      rate_limit_counters: {
        Row: {
          created_at: string | null
          id: string
          identifier: string
          max_requests: number
          request_count: number
          updated_at: string | null
          window_end: string
          window_start: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          identifier: string
          max_requests: number
          request_count?: number
          updated_at?: string | null
          window_end: string
          window_start: string
        }
        Update: {
          created_at?: string | null
          id?: string
          identifier?: string
          max_requests?: number
          request_count?: number
          updated_at?: string | null
          window_end?: string
          window_start?: string
        }
        Relationships: []
      }
      recording_projects: {
        Row: {
          bpm: number | null
          created_at: string
          id: string
          key: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bpm?: number | null
          created_at?: string
          id?: string
          key?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bpm?: number | null
          created_at?: string
          id?: string
          key?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rituals: {
        Row: {
          description: string
          frequency: string
          id: string
          is_completed: boolean | null
          name: string
        }
        Insert: {
          description: string
          frequency: string
          id?: string
          is_completed?: boolean | null
          name: string
        }
        Update: {
          description?: string
          frequency?: string
          id?: string
          is_completed?: boolean | null
          name?: string
        }
        Relationships: []
      }
      route_metadata: {
        Row: {
          category: string
          completion_percentage: number | null
          components_used: Json | null
          created_at: string | null
          features: Json | null
          id: string
          last_updated: string | null
          page_name: string
          route_path: string
        }
        Insert: {
          category: string
          completion_percentage?: number | null
          components_used?: Json | null
          created_at?: string | null
          features?: Json | null
          id?: string
          last_updated?: string | null
          page_name: string
          route_path: string
        }
        Update: {
          category?: string
          completion_percentage?: number | null
          components_used?: Json | null
          created_at?: string | null
          features?: Json | null
          id?: string
          last_updated?: string | null
          page_name?: string
          route_path?: string
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          action_taken: string
          audit_type: string
          audited_by: string | null
          created_at: string | null
          description: string
          finding_type: string
          id: string
          location: string
          metadata: Json | null
          resolved_at: string | null
          sensitive_data_hash: string | null
          severity: string
        }
        Insert: {
          action_taken: string
          audit_type: string
          audited_by?: string | null
          created_at?: string | null
          description: string
          finding_type: string
          id?: string
          location: string
          metadata?: Json | null
          resolved_at?: string | null
          sensitive_data_hash?: string | null
          severity: string
        }
        Update: {
          action_taken?: string
          audit_type?: string
          audited_by?: string | null
          created_at?: string | null
          description?: string
          finding_type?: string
          id?: string
          location?: string
          metadata?: Json | null
          resolved_at?: string | null
          sensitive_data_hash?: string | null
          severity?: string
        }
        Relationships: []
      }
      security_audit_logs: {
        Row: {
          created_at: string | null
          event_details: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_details?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_details?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_incidents: {
        Row: {
          content_preview: string
          created_at: string
          file_path: string
          id: string
          line_number: number | null
          notes: string | null
          pattern_matched: string
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          content_preview: string
          created_at?: string
          file_path: string
          id?: string
          line_number?: number | null
          notes?: string | null
          pattern_matched: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          content_preview?: string
          created_at?: string
          file_path?: string
          id?: string
          line_number?: number | null
          notes?: string | null
          pattern_matched?: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      sla_metrics: {
        Row: {
          breach_count: number
          created_at: string
          current_value: number | null
          id: string
          last_calculated: string | null
          metric_name: string
          period_end: string
          period_start: string
          service_name: string
          status: string
          target_value: number
          updated_at: string
        }
        Insert: {
          breach_count?: number
          created_at?: string
          current_value?: number | null
          id?: string
          last_calculated?: string | null
          metric_name: string
          period_end: string
          period_start: string
          service_name: string
          status?: string
          target_value: number
          updated_at?: string
        }
        Update: {
          breach_count?: number
          created_at?: string
          current_value?: number | null
          id?: string
          last_calculated?: string | null
          metric_name?: string
          period_end?: string
          period_start?: string
          service_name?: string
          status?: string
          target_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      starting_situations: {
        Row: {
          category: string | null
          created_at: string | null
          description: string
          id: number
          situation_number: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description: string
          id?: number
          situation_number: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string
          id?: number
          situation_number?: string
        }
        Relationships: []
      }
      story_acts_catalog: {
        Row: {
          act_code: string
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          duration_minutes: number | null
          id: string
          music_palette: Json | null
          scenes: Json
          theme: string
          title: string
          unlock_conditions: Json | null
          visual_palette: Json | null
        }
        Insert: {
          act_code: string
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          id?: string
          music_palette?: Json | null
          scenes: Json
          theme: string
          title: string
          unlock_conditions?: Json | null
          visual_palette?: Json | null
        }
        Update: {
          act_code?: string
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          id?: string
          music_palette?: Json | null
          scenes?: Json
          theme?: string
          title?: string
          unlock_conditions?: Json | null
          visual_palette?: Json | null
        }
        Relationships: []
      }
      story_ambients: {
        Row: {
          ambient_code: string
          created_at: string | null
          description: string | null
          id: string
          music_texture: Json
          name: string
          unlocked_at: string | null
          user_id: string
          visual_effect: Json | null
        }
        Insert: {
          ambient_code: string
          created_at?: string | null
          description?: string | null
          id?: string
          music_texture: Json
          name: string
          unlocked_at?: string | null
          user_id: string
          visual_effect?: Json | null
        }
        Update: {
          ambient_code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          music_texture?: Json
          name?: string
          unlocked_at?: string | null
          user_id?: string
          visual_effect?: Json | null
        }
        Relationships: []
      }
      story_fragments: {
        Row: {
          act_code: string
          ambient_unlock: string | null
          created_at: string | null
          description: string | null
          fragment_code: string
          id: string
          is_favorite: boolean | null
          rarity: string
          times_viewed: number | null
          title: string
          unlocked_at: string | null
          user_id: string
          visual_asset: string | null
        }
        Insert: {
          act_code: string
          ambient_unlock?: string | null
          created_at?: string | null
          description?: string | null
          fragment_code: string
          id?: string
          is_favorite?: boolean | null
          rarity: string
          times_viewed?: number | null
          title: string
          unlocked_at?: string | null
          user_id: string
          visual_asset?: string | null
        }
        Update: {
          act_code?: string
          ambient_unlock?: string | null
          created_at?: string | null
          description?: string | null
          fragment_code?: string
          id?: string
          is_favorite?: boolean | null
          rarity?: string
          times_viewed?: number | null
          title?: string
          unlocked_at?: string | null
          user_id?: string
          visual_asset?: string | null
        }
        Relationships: []
      }
      story_fragments_catalog: {
        Row: {
          act_code: string
          ambient_data: Json | null
          created_at: string | null
          description: string | null
          fragment_code: string
          id: string
          rarity: string
          title: string
          unlock_hints: Json | null
          visual_data: Json
        }
        Insert: {
          act_code: string
          ambient_data?: Json | null
          created_at?: string | null
          description?: string | null
          fragment_code: string
          id?: string
          rarity: string
          title: string
          unlock_hints?: Json | null
          visual_data: Json
        }
        Update: {
          act_code?: string
          ambient_data?: Json | null
          created_at?: string | null
          description?: string | null
          fragment_code?: string
          id?: string
          rarity?: string
          title?: string
          unlock_hints?: Json | null
          visual_data?: Json
        }
        Relationships: []
      }
      story_sessions: {
        Row: {
          act_code: string
          badge_received: string | null
          choices: Json | null
          completed_at: string | null
          created_at: string | null
          duration_seconds: number | null
          ending_reached: string | null
          fragments_unlocked: Json | null
          id: string
          poms_post: Json | null
          poms_pre: Json | null
          scenes_completed: number | null
          session_id: string | null
          started_at: string | null
          user_id: string
        }
        Insert: {
          act_code: string
          badge_received?: string | null
          choices?: Json | null
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          ending_reached?: string | null
          fragments_unlocked?: Json | null
          id?: string
          poms_post?: Json | null
          poms_pre?: Json | null
          scenes_completed?: number | null
          session_id?: string | null
          started_at?: string | null
          user_id: string
        }
        Update: {
          act_code?: string
          badge_received?: string | null
          choices?: Json | null
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          ending_reached?: string | null
          fragments_unlocked?: Json | null
          id?: string
          poms_post?: Json | null
          poms_pre?: Json | null
          scenes_completed?: number | null
          session_id?: string | null
          started_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      streaming_access_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: string | null
          session_token: string
          song_id: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: string | null
          session_token: string
          song_id: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          session_token?: string
          song_id?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      study_sessions: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          content_id: string | null
          created_at: string
          duration_minutes: number
          id: string
          score: number | null
          session_data: Json | null
          session_type: string
          started_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          content_id?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          score?: number | null
          session_data?: Json | null
          session_type: string
          started_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          content_id?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          score?: number | null
          session_data?: Json | null
          session_type?: string
          started_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          features: Json
          id: string
          monthly_music_quota: number
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          features?: Json
          id: string
          monthly_music_quota: number
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          features?: Json
          id?: string
          monthly_music_quota?: number
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          expires_at: string | null
          features: Json | null
          id: string
          organization_id: string | null
          plan_type: string
          started_at: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          expires_at?: string | null
          features?: Json | null
          id?: string
          organization_id?: string | null
          plan_type: string
          started_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          expires_at?: string | null
          features?: Json | null
          id?: string
          organization_id?: string | null
          plan_type?: string
          started_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      therapeutic_classes: {
        Row: {
          created_at: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      therapists: {
        Row: {
          available: boolean | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string
          id: string
          languages: string[] | null
          price_per_session: number
          rating: number | null
          specialization: string
        }
        Insert: {
          available?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name: string
          id?: string
          languages?: string[] | null
          price_per_session: number
          rating?: number | null
          specialization: string
        }
        Update: {
          available?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          languages?: string[] | null
          price_per_session?: number
          rating?: number | null
          specialization?: string
        }
        Relationships: []
      }
      therapy_sessions: {
        Row: {
          created_at: string | null
          duration_minutes: number | null
          id: string
          meeting_url: string | null
          notes: string | null
          scheduled_at: string
          status: string | null
          therapist_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          meeting_url?: string | null
          notes?: string | null
          scheduled_at: string
          status?: string | null
          therapist_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          meeting_url?: string | null
          notes?: string | null
          scheduled_at?: string
          status?: string | null
          therapist_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "therapy_sessions_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapists"
            referencedColumns: ["id"]
          },
        ]
      }
      thought_grimoire: {
        Row: {
          category: string
          collected_at: string
          id: string
          is_favorite: boolean | null
          rarity: string
          thought_emoji: string | null
          thought_text: string
          times_viewed: number | null
          user_id: string
        }
        Insert: {
          category?: string
          collected_at?: string
          id?: string
          is_favorite?: boolean | null
          rarity?: string
          thought_emoji?: string | null
          thought_text: string
          times_viewed?: number | null
          user_id: string
        }
        Update: {
          category?: string
          collected_at?: string
          id?: string
          is_favorite?: boolean | null
          rarity?: string
          thought_emoji?: string | null
          thought_text?: string
          times_viewed?: number | null
          user_id?: string
        }
        Relationships: []
      }
      ui_suggestion_cache: {
        Row: {
          created_at: string | null
          cta_route: string | null
          display_context: string
          expires_at: string
          id: string
          label_text: string
          priority: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          cta_route?: string | null
          display_context: string
          expires_at: string
          id?: string
          label_text: string
          priority?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          cta_route?: string | null
          display_context?: string
          expires_at?: string
          id?: string
          label_text?: string
          priority?: number | null
          user_id?: string
        }
        Relationships: []
      }
      unified_music_generation: {
        Row: {
          audio_url: string | null
          completed_at: string | null
          created_at: string
          duration: number | null
          id: string
          item_code: string
          metadata: Json | null
          paroles: string[]
          status: string
          style: string
          suno_task_id: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          audio_url?: string | null
          completed_at?: string | null
          created_at?: string
          duration?: number | null
          id?: string
          item_code: string
          metadata?: Json | null
          paroles: string[]
          status?: string
          style?: string
          suno_task_id?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          audio_url?: string | null
          completed_at?: string | null
          created_at?: string
          duration?: number | null
          id?: string
          item_code?: string
          metadata?: Json | null
          paroles?: string[]
          status?: string
          style?: string
          suno_task_id?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      urge_gpt_queries: {
        Row: {
          created_at: string
          id: string
          query: string
          response: string
          sources: string[] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          query: string
          response: string
          sources?: string[] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          query?: string
          response?: string
          sources?: string[] | null
          user_id?: string | null
        }
        Relationships: []
      }
      urgegpt_protocols: {
        Row: {
          created_at: string
          id: string
          professional_id: string | null
          protocol: string | null
          query: string
          sources: string[] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          professional_id?: string | null
          protocol?: string | null
          query: string
          sources?: string[] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          professional_id?: string | null
          protocol?: string | null
          query?: string
          sources?: string[] | null
          user_id?: string | null
        }
        Relationships: []
      }
      urgent_protocols: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          sources: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          id?: string
          sources?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          sources?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          progress: number | null
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          progress?: number | null
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          progress?: number | null
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_logs: {
        Row: {
          activity_details: Json | null
          activity_type: string
          id: string
          ip_address: unknown | null
          performance_metrics: Json | null
          session_id: string | null
          timestamp: string
          url: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          activity_details?: Json | null
          activity_type: string
          id?: string
          ip_address?: unknown | null
          performance_metrics?: Json | null
          session_id?: string | null
          timestamp?: string
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          activity_details?: Json | null
          activity_type?: string
          id?: string
          ip_address?: unknown | null
          performance_metrics?: Json | null
          session_id?: string | null
          timestamp?: string
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_activity_preferences: {
        Row: {
          activity_type: string
          created_at: string | null
          id: string
          preferences: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          id?: string
          preferences?: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          id?: string
          preferences?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_activity_sessions: {
        Row: {
          activity_type: string
          completed_at: string | null
          created_at: string | null
          duration_seconds: number | null
          id: string
          mood_after: string | null
          mood_before: string | null
          satisfaction_score: number | null
          session_data: Json
          user_id: string
        }
        Insert: {
          activity_type: string
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          mood_after?: string | null
          mood_before?: string | null
          satisfaction_score?: number | null
          session_data?: Json
          user_id: string
        }
        Update: {
          activity_type?: string
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          mood_after?: string | null
          mood_before?: string | null
          satisfaction_score?: number | null
          session_data?: Json
          user_id?: string
        }
        Relationships: []
      }
      user_analytics: {
        Row: {
          analytics_data: Json | null
          average_score: number | null
          content_types_studied: string[] | null
          date: string
          id: string
          peak_performance_hour: number | null
          sessions_completed: number | null
          study_time_minutes: number | null
          user_id: string
        }
        Insert: {
          analytics_data?: Json | null
          average_score?: number | null
          content_types_studied?: string[] | null
          date?: string
          id?: string
          peak_performance_hour?: number | null
          sessions_completed?: number | null
          study_time_minutes?: number | null
          user_id: string
        }
        Update: {
          analytics_data?: Json | null
          average_score?: number | null
          content_types_studied?: string[] | null
          date?: string
          id?: string
          peak_performance_hour?: number | null
          sessions_completed?: number | null
          study_time_minutes?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_auras: {
        Row: {
          animation_speed: number
          color_hue: number
          created_at: string | null
          id: string
          interactions_count: number
          is_rare: boolean | null
          last_who5_at: string | null
          luminosity: number
          rare_type: string | null
          size_scale: number
          streak_weeks: number
          unlocked_at: string | null
          updated_at: string | null
          user_id: string
          who5_internal_level: number | null
        }
        Insert: {
          animation_speed?: number
          color_hue?: number
          created_at?: string | null
          id?: string
          interactions_count?: number
          is_rare?: boolean | null
          last_who5_at?: string | null
          luminosity?: number
          rare_type?: string | null
          size_scale?: number
          streak_weeks?: number
          unlocked_at?: string | null
          updated_at?: string | null
          user_id: string
          who5_internal_level?: number | null
        }
        Update: {
          animation_speed?: number
          color_hue?: number
          created_at?: string | null
          id?: string
          interactions_count?: number
          is_rare?: boolean | null
          last_who5_at?: string | null
          luminosity?: number
          rare_type?: string | null
          size_scale?: number
          streak_weeks?: number
          unlocked_at?: string | null
          updated_at?: string | null
          user_id?: string
          who5_internal_level?: number | null
        }
        Relationships: []
      }
      user_favorite_flashcards: {
        Row: {
          created_at: string | null
          id: number
          item_id: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          item_id?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          item_id?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorite_flashcards_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "edn_items"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorite_tracks: {
        Row: {
          favorited_at: string | null
          id: string
          track_id: string
          user_id: string | null
        }
        Insert: {
          favorited_at?: string | null
          id?: string
          track_id: string
          user_id?: string | null
        }
        Update: {
          favorited_at?: string | null
          id?: string
          track_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_generated_music: {
        Row: {
          audio_url: string
          created_at: string
          id: string
          item_code: string | null
          music_id: string
          music_style: string
          rang: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          audio_url: string
          created_at?: string
          id?: string
          item_code?: string | null
          music_id: string
          music_style: string
          rang: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          audio_url?: string
          created_at?: string
          id?: string
          item_code?: string | null
          music_id?: string
          music_style?: string
          rang?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_goals: {
        Row: {
          category: string
          created_at: string | null
          current_progress: number | null
          description: string | null
          end_date: string | null
          id: string
          reward_points: number | null
          start_date: string
          status: string | null
          target_value: number | null
          title: string
          unit: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          current_progress?: number | null
          description?: string | null
          end_date?: string | null
          id?: string
          reward_points?: number | null
          start_date: string
          status?: string | null
          target_value?: number | null
          title: string
          unit?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          current_progress?: number | null
          description?: string | null
          end_date?: string | null
          id?: string
          reward_points?: number | null
          start_date?: string
          status?: string | null
          target_value?: number | null
          title?: string
          unit?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_meditation_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          meditation_id: string
          progress_seconds: number | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          meditation_id: string
          progress_seconds?: number | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          meditation_id?: string
          progress_seconds?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_meditation_progress_meditation_id_fkey"
            columns: ["meditation_id"]
            isOneToOne: false
            referencedRelation: "meditation_content"
            referencedColumns: ["id"]
          },
        ]
      }
      user_music_preferences: {
        Row: {
          created_at: string | null
          id: string
          last_played_emotion: string | null
          preferred_emotions: string[] | null
          total_plays: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_played_emotion?: string | null
          preferred_emotions?: string[] | null
          total_plays?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_played_emotion?: string | null
          preferred_emotions?: string[] | null
          total_plays?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          action_label: string | null
          action_url: string | null
          actionable: boolean | null
          category: string
          created_at: string
          id: string
          message: string
          priority: string
          read: boolean
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          actionable?: boolean | null
          category?: string
          created_at?: string
          id?: string
          message: string
          priority?: string
          read?: boolean
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          actionable?: boolean | null
          category?: string
          created_at?: string
          id?: string
          message?: string
          priority?: string
          read?: boolean
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_playlists: {
        Row: {
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          play_count: number | null
          song_ids: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          play_count?: number | null
          song_ids?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          play_count?: number | null
          song_ids?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          id: string
          preferences: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          preferences?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          preferences?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences_advanced: {
        Row: {
          accessibility_settings: Json | null
          created_at: string | null
          daily_reminders: boolean | null
          data_sharing_consent: boolean | null
          id: string
          notification_preferences: Json | null
          preferred_coach_personality: string | null
          privacy_settings: Json | null
          ui_customization: Json | null
          updated_at: string | null
          user_id: string | null
          wellbeing_goals: Json | null
        }
        Insert: {
          accessibility_settings?: Json | null
          created_at?: string | null
          daily_reminders?: boolean | null
          data_sharing_consent?: boolean | null
          id?: string
          notification_preferences?: Json | null
          preferred_coach_personality?: string | null
          privacy_settings?: Json | null
          ui_customization?: Json | null
          updated_at?: string | null
          user_id?: string | null
          wellbeing_goals?: Json | null
        }
        Update: {
          accessibility_settings?: Json | null
          created_at?: string | null
          daily_reminders?: boolean | null
          data_sharing_consent?: boolean | null
          id?: string
          notification_preferences?: Json | null
          preferred_coach_personality?: string | null
          privacy_settings?: Json | null
          ui_customization?: Json | null
          updated_at?: string | null
          user_id?: string | null
          wellbeing_goals?: Json | null
        }
        Relationships: []
      }
      user_preferences_extended: {
        Row: {
          auto_play: boolean
          binaural_enabled: boolean
          created_at: string
          dark_mode: boolean
          id: string
          language: string
          music_volume: number
          notification_email: boolean
          notification_push: boolean
          study_reminders: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_play?: boolean
          binaural_enabled?: boolean
          created_at?: string
          dark_mode?: boolean
          id?: string
          language?: string
          music_volume?: number
          notification_email?: boolean
          notification_push?: boolean
          study_reminders?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_play?: boolean
          binaural_enabled?: boolean
          created_at?: string
          dark_mode?: boolean
          id?: string
          language?: string
          music_volume?: number
          notification_email?: boolean
          notification_push?: boolean
          study_reminders?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_privacy_preferences: {
        Row: {
          analytics_opt_in: boolean
          consent_version: string
          created_at: string
          pseudonymized_user_id: string
          retention_days: number
          updated_at: string
          user_id: string
        }
        Insert: {
          analytics_opt_in?: boolean
          consent_version?: string
          created_at?: string
          pseudonymized_user_id?: string
          retention_days?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          analytics_opt_in?: boolean
          consent_version?: string
          created_at?: string
          pseudonymized_user_id?: string
          retention_days?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          achievements: Json | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          current_score_average: number | null
          display_name: string
          id: string
          preferences: Json | null
          speciality: string | null
          study_streak: number | null
          total_study_time: number | null
          university: string | null
          updated_at: string
          user_id: string
          year_of_study: number | null
        }
        Insert: {
          achievements?: Json | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          current_score_average?: number | null
          display_name: string
          id?: string
          preferences?: Json | null
          speciality?: string | null
          study_streak?: number | null
          total_study_time?: number | null
          university?: string | null
          updated_at?: string
          user_id: string
          year_of_study?: number | null
        }
        Update: {
          achievements?: Json | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          current_score_average?: number | null
          display_name?: string
          id?: string
          preferences?: Json | null
          speciality?: string | null
          study_streak?: number | null
          total_study_time?: number | null
          university?: string | null
          updated_at?: string
          user_id?: string
          year_of_study?: number | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          attempts_count: number | null
          best_score: number | null
          bookmarked: boolean | null
          content_id: string
          content_type: string
          created_at: string
          id: string
          last_accessed: string | null
          mastery_level: string | null
          notes: string | null
          progress_percentage: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          attempts_count?: number | null
          best_score?: number | null
          bookmarked?: boolean | null
          content_id: string
          content_type: string
          created_at?: string
          id?: string
          last_accessed?: string | null
          mastery_level?: string | null
          notes?: string | null
          progress_percentage?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          attempts_count?: number | null
          best_score?: number | null
          bookmarked?: boolean | null
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          last_accessed?: string | null
          mastery_level?: string | null
          notes?: string | null
          progress_percentage?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_quotas: {
        Row: {
          created_at: string | null
          id: string
          monthly_chat_quota: number | null
          monthly_chat_used: number | null
          monthly_music_quota: number | null
          monthly_music_used: number | null
          monthly_qcm_quota: number | null
          monthly_qcm_used: number | null
          quota_reset_date: string | null
          subscription_type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          monthly_chat_quota?: number | null
          monthly_chat_used?: number | null
          monthly_music_quota?: number | null
          monthly_music_used?: number | null
          monthly_qcm_quota?: number | null
          monthly_qcm_used?: number | null
          quota_reset_date?: string | null
          subscription_type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          monthly_chat_quota?: number | null
          monthly_chat_used?: number | null
          monthly_music_quota?: number | null
          monthly_music_used?: number | null
          monthly_qcm_quota?: number | null
          monthly_qcm_used?: number | null
          quota_reset_date?: string | null
          subscription_type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_rewards: {
        Row: {
          activity_related: string | null
          badge_icon: string | null
          earned_at: string | null
          id: string
          points_earned: number | null
          reward_description: string | null
          reward_name: string
          reward_type: string
          user_id: string
        }
        Insert: {
          activity_related?: string | null
          badge_icon?: string | null
          earned_at?: string | null
          id?: string
          points_earned?: number | null
          reward_description?: string | null
          reward_name: string
          reward_type: string
          user_id: string
        }
        Update: {
          activity_related?: string | null
          badge_icon?: string | null
          earned_at?: string | null
          id?: string
          points_earned?: number | null
          reward_description?: string | null
          reward_name?: string
          reward_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string | null
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          security_flags: Json | null
          session_end: string | null
          session_start: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          security_flags?: Json | null
          session_end?: string | null
          session_start?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          security_flags?: Json | null
          session_end?: string | null
          session_start?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          completed_challenges: number | null
          created_at: string | null
          id: string
          level: number | null
          rank: string | null
          streak_days: number | null
          total_badges: number | null
          total_points: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_challenges?: number | null
          created_at?: string | null
          id?: string
          level?: number | null
          rank?: string | null
          streak_days?: number | null
          total_badges?: number | null
          total_points?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_challenges?: number | null
          created_at?: string | null
          id?: string
          level?: number | null
          rank?: string | null
          streak_days?: number | null
          total_badges?: number | null
          total_points?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string
          status: string
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_journal_entries: {
        Row: {
          ai_insights: string | null
          audio_url: string | null
          created_at: string
          duration: number | null
          emotion: string | null
          id: string
          keywords: string[] | null
          sentiment: number | null
          title: string
          transcription: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          ai_insights?: string | null
          audio_url?: string | null
          created_at?: string
          duration?: number | null
          emotion?: string | null
          id?: string
          keywords?: string[] | null
          sentiment?: number | null
          title: string
          transcription: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          ai_insights?: string | null
          audio_url?: string | null
          created_at?: string
          duration?: number | null
          emotion?: string | null
          id?: string
          keywords?: string[] | null
          sentiment?: number | null
          title?: string
          transcription?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      vr_sessions: {
        Row: {
          category: string | null
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          duration_minutes: number | null
          experience_id: string
          experience_title: string
          id: string
          rating: number | null
          user_id: string
        }
        Insert: {
          category?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          experience_id: string
          experience_title: string
          id?: string
          rating?: number | null
          user_id: string
        }
        Update: {
          category?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          experience_id?: string
          experience_title?: string
          id?: string
          rating?: number | null
          user_id?: string
        }
        Relationships: []
      }
      weekly_card_draws: {
        Row: {
          assessment_session_id: string | null
          card_id: string
          created_at: string | null
          drawn_at: string | null
          id: string
          user_id: string
          viewed: boolean | null
          week_end: string
          week_start: string
          who5_score: number | null
        }
        Insert: {
          assessment_session_id?: string | null
          card_id: string
          created_at?: string | null
          drawn_at?: string | null
          id?: string
          user_id: string
          viewed?: boolean | null
          week_end: string
          week_start: string
          who5_score?: number | null
        }
        Update: {
          assessment_session_id?: string | null
          card_id?: string
          created_at?: string | null
          drawn_at?: string | null
          id?: string
          user_id?: string
          viewed?: boolean | null
          week_end?: string
          week_start?: string
          who5_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "weekly_card_draws_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "emotion_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      who5_assessments: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          responses: Json | null
          session_id: string
          total_score: number | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          responses?: Json | null
          session_id?: string
          total_score?: number | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          responses?: Json | null
          session_id?: string
          total_score?: number | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_invitation: {
        Args: { token_param: string }
        Returns: boolean
      }
      audit_and_correct_edn_content: {
        Args: Record<PropertyKey, never>
        Returns: {
          fixed_issues: Json
          updated_count: number
        }[]
      }
      audit_and_fix_edn_content: {
        Args: Record<PropertyKey, never>
        Returns: {
          audit_report: Json
          updated_count: number
        }[]
      }
      audit_tableau_duplicates: {
        Args: Record<PropertyKey, never>
        Returns: {
          audit_type: string
          duplicate_content: string
          issue_description: string
          item_code_result: string
          recommendation: string
          severity: string
        }[]
      }
      auto_security_maintenance: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      backup_critical_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      calculate_completeness_score: {
        Args: { item_data: Json } | { item_id: string }
        Returns: number
      }
      calculate_internal_level: {
        Args: { instrument_code: string; score: number }
        Returns: number
      }
      calculate_item_completeness_score: {
        Args: {
          p_item_code: string
          p_paroles_musicales: string[]
          p_quiz_questions: Json
          p_scene_immersive: Json
          p_tableau_a: Json
          p_tableau_b: Json
        }
        Returns: number
      }
      calculate_sla_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      calculate_user_learning_path: {
        Args: { p_user_id: string }
        Returns: Json
      }
      calculate_who5_score: {
        Args: { responses: Json }
        Returns: number
      }
      check_music_generation_quota: {
        Args: { user_uuid: string }
        Returns: {
          can_generate: boolean
          current_usage: number
          plan_name: string
          quota_limit: number
        }[]
      }
      check_rare_aura_unlocks: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      check_rate_limit: {
        Args: {
          action_type: string
          max_attempts?: number
          time_window_minutes?: number
          user_identifier: string
        }
        Returns: boolean
      }
      check_slow_generations: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      clean_corrupted_edn_items: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      clean_generic_lisa_content: {
        Args: Record<PropertyKey, never>
        Returns: {
          affected_competences: Json
          cleaned_count: number
        }[]
      }
      cleanup_duplicates: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      cleanup_expired_clinical_data: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_expired_rate_limit_counters: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_failed_generations: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_chat_logs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_imports: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_integrity_reports: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_old_logs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_music_generations: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_operation_logs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_performance_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_streaming_logs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_security_issues: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      cleanup_security_scan_false_positives: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      complete_all_items_with_competences: {
        Args: Record<PropertyKey, never>
        Returns: {
          items_details: Json
          processed_items: number
          total_competences_rang_a: number
          total_competences_rang_b: number
          updated_items: number
        }[]
      }
      complete_extraction_batch: {
        Args: {
          p_error_details?: Json
          p_error_message?: string
          p_log_id: string
          p_performance_metrics?: Json
          p_status?: string
        }
        Returns: undefined
      }
      complete_missing_edn_fields: {
        Args: Record<PropertyKey, never>
        Returns: {
          details: Json
          updated_count: number
        }[]
      }
      complete_story_session: {
        Args: {
          p_badge: string
          p_fragments_to_unlock: string[]
          p_session_id: string
        }
        Returns: Json
      }
      count_all_invitations: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      count_generic_lisa_content: {
        Args: Record<PropertyKey, never>
        Returns: {
          sample_objectifs: Json
          total_count: number
        }[]
      }
      count_invitations_by_status: {
        Args: { status_param: Database["public"]["Enums"]["invitation_status"] }
        Returns: number
      }
      create_activity_log_cleanup_job: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_generation_alert: {
        Args: {
          p_actual_value?: number
          p_alert_type: string
          p_generation_log_id?: string
          p_message: string
          p_metadata?: Json
          p_severity: string
          p_threshold_value?: number
        }
        Returns: string
      }
      create_notification_from_template: {
        Args: {
          target_user_id: string
          template_name: string
          template_variables?: Json
        }
        Returns: string
      }
      create_user_session: {
        Args:
          | { p_ip_address?: unknown; p_user_agent?: string }
          | { session_data: Json }
        Returns: string
      }
      detect_and_fix_redundancies: {
        Args: Record<PropertyKey, never>
        Returns: {
          description: string
          fixed: boolean
          issue_type: string
          item_code: string
        }[]
      }
      detect_data_inconsistencies: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      detect_edn_duplicates: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      emergency_security_cleanup: {
        Args: Record<PropertyKey, never>
        Returns: {
          cleaned_column: string
          cleaned_table: string
          cleanup_type: string
          records_affected: number
        }[]
      }
      enrich_edn_items_with_oic_competences: {
        Args: Record<PropertyKey, never>
        Returns: {
          details: Json
          error_count: number
          processed_count: number
          success_count: number
        }[]
      }
      enrich_edn_items_with_oic_competences_fixed: {
        Args: Record<PropertyKey, never>
        Returns: {
          details: Json
          error_count: number
          processed_count: number
          success_count: number
        }[]
      }
      enrich_oic_by_specialty_range: {
        Args: { end_item: number; specialty_name: string; start_item: number }
        Returns: number
      }
      final_security_check: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      fix_all_edn_items_complete_oic_correction: {
        Args: Record<PropertyKey, never>
        Returns: {
          details: Json
          errors_count: number
          fixed_count: number
        }[]
      }
      fix_all_edn_items_complete_uness_correction: {
        Args: Record<PropertyKey, never>
        Returns: {
          details: Json
          errors_count: number
          fixed_count: number
        }[]
      }
      fix_all_edn_items_complete_unique_content: {
        Args: Record<PropertyKey, never>
        Returns: {
          details: Json
          updated_count: number
        }[]
      }
      fix_all_edn_items_simple_correction: {
        Args: Record<PropertyKey, never>
        Returns: {
          details: Json
          errors_count: number
          fixed_count: number
        }[]
      }
      fix_all_edn_items_with_real_content: {
        Args: Record<PropertyKey, never>
        Returns: {
          errors_count: number
          fixed_count: number
        }[]
      }
      fix_all_edn_items_with_real_oic_competences: {
        Args: Record<PropertyKey, never>
        Returns: {
          details: Json
          errors_count: number
          fixed_count: number
        }[]
      }
      fix_all_edn_items_with_unique_content: {
        Args: Record<PropertyKey, never>
        Returns: {
          details: Json
          error_count: number
          updated_count: number
        }[]
      }
      fix_competences_mapping_correct: {
        Args: Record<PropertyKey, never>
        Returns: {
          details: Json
          total_competences_added: number
          updated_items: number
        }[]
      }
      fix_generic_content_and_complete_platform: {
        Args: Record<PropertyKey, never>
        Returns: {
          details: Json
          fixed_count: number
        }[]
      }
      fusion_complete_finale: {
        Args: Record<PropertyKey, never>
        Returns: {
          competences_oic_integrees: number
          details: Json
          items_backup_utilises: number
          items_traites: number
        }[]
      }
      generate_audit_report: {
        Args: { report_type_param?: string }
        Returns: string
      }
      generate_completeness_alerts: {
        Args: {
          p_item_code: string
          p_paroles_musicales: string[]
          p_quiz_questions: Json
          p_scene_immersive: Json
          p_tableau_a: Json
          p_tableau_b: Json
        }
        Returns: string[]
      }
      generate_master_content: {
        Args: { p_item_id: string }
        Returns: Json
      }
      generate_security_audit_report: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      generate_slug: {
        Args: { item_code: string; title: string }
        Returns: string
      }
      generate_specific_content_all_items: {
        Args: Record<PropertyKey, never>
        Returns: {
          updated_count: number
        }[]
      }
      get_activity_stats: {
        Args: { p_end_date?: string; p_start_date?: string }
        Returns: {
          activity_type: string
          percentage: number
          total_count: number
        }[]
      }
      get_all_music_tracks: {
        Args: Record<PropertyKey, never>
        Returns: {
          audio_url: string
          created_at: string
          generation_status: string
          id: string
          title: string
          user_id: string
        }[]
      }
      get_anonymous_activity_logs: {
        Args: {
          p_activity_type?: string
          p_end_date?: string
          p_page?: number
          p_page_size?: number
          p_search_term?: string
          p_start_date?: string
        }
        Returns: {
          activity_type: string
          category: string
          count: number
          id: string
          timestamp_day: string
        }[]
      }
      get_audit_summary: {
        Args: Record<PropertyKey, never>
        Returns: {
          avg_completeness_score: number
          table_name: string
          total_rows: number
          valid_descriptions: number
          valid_titles: number
        }[]
      }
      get_competences_parsed: {
        Args: Record<PropertyKey, never>
        Returns: {
          description: string
          intitule: string
          item_id: string
          item_parent: string
          objectif_id: string
          ordre_num: number
          rang: string
          rang_code: string
          url_source: string
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_week_bounds: {
        Args: Record<PropertyKey, never>
        Returns: {
          week_end: string
          week_start: string
        }[]
      }
      get_edn_objectifs_rapport: {
        Args: Record<PropertyKey, never>
        Returns: {
          completude_pct: number
          item_parent: number
          manquants: string[]
          objectifs_attendus: number
          objectifs_extraits: number
        }[]
      }
      get_extraction_status: {
        Args: { p_batch_id?: string }
        Returns: {
          batch_id: string
          batch_type: string
          completed_at: string
          duration_minutes: number
          error_message: string
          failed_items: number
          id: string
          processed_items: number
          progress_percentage: number
          recent_events: Json
          started_at: string
          status: string
          total_items: number
        }[]
      }
      get_latest_lyrics_texts: {
        Args: Record<PropertyKey, never>
        Returns: {
          content: string
          created_at: string
          generated_by: string
          id: string
          is_published: boolean
          item_code: string
          rang: string
          status: string
          style_meta: Json
          updated_at: string
          version: number
        }[]
      }
      get_medical_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_oic_competences_rapport: {
        Args: Record<PropertyKey, never>
        Returns: {
          competences_attendues: number
          competences_extraites: number
          completude_pct: number
          item_parent: string
          manquants: string[]
        }[]
      }
      get_oic_completion_dashboard: {
        Args: Record<PropertyKey, never>
        Returns: {
          nb_empty: number
          nb_error: number
          nb_updated: number
          total: number
        }[]
      }
      get_oic_extraction_report: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_or_create_weekly_draw: {
        Args: { p_user_id: string }
        Returns: {
          card_code: string
          color_primary: string
          color_secondary: string
          draw_id: string
          icon_name: string
          is_new_draw: boolean
          mantra: string
          mantra_emoji: string
          rarity: string
          unlock_rewards: Json
        }[]
      }
      get_platform_completion_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          competences_rang_a_integrated: number
          competences_rang_b_integrated: number
          completion_percentage: number
          items_with_3_paroles: number
          items_with_50_qcm: number
          total_competences_available: number
          total_items: number
        }[]
      }
      get_platform_statistics: {
        Args: Record<PropertyKey, never>
        Returns: {
          active_users: number
          total_content: number
          total_users: number
        }[]
      }
      get_platform_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          metric: string
          unit: string
          value: string
        }[]
      }
      get_rate_limit_status: {
        Args: {
          p_identifier: string
          p_max_requests: number
          p_window_duration_seconds: number
        }
        Returns: Json
      }
      get_secure_platform_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          metric: string
          unit: string
          value: string
        }[]
      }
      get_secure_user_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_security_headers: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_security_recommendations: {
        Args: Record<PropertyKey, never>
        Returns: {
          category: string
          issue: string
          priority: string
          recommendation: string
        }[]
      }
      get_security_status: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_security_summary: {
        Args: Record<PropertyKey, never>
        Returns: {
          description: string
          metric: string
          value: string
        }[]
      }
      get_security_violations_summary: {
        Args: Record<PropertyKey, never>
        Returns: {
          finding_type: string
          last_detection: string
          severity: string
          unresolved_count: number
          violation_count: number
        }[]
      }
      get_system_health_status: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_team_analytics: {
        Args: {
          p_end_date?: string
          p_org_id: string
          p_start_date?: string
          p_team_name?: string
        }
        Returns: {
          avg_confidence: number
          date: string
          emotion_type: string
          user_count: number
        }[]
      }
      get_team_emotion_summary: {
        Args: Record<PropertyKey, never>
        Returns: {
          avg_confidence: number
          count: number
          date: string
          emotion_type: string
          org_id: string
          team_name: string
        }[]
      }
      get_user_active_room_ids: {
        Args: { p_user_id?: string }
        Returns: {
          room_id: string
        }[]
      }
      get_user_activity_summary: {
        Args: Record<PropertyKey, never>
        Returns: {
          last_conversation_date: string
          last_emotion_date: string
          total_conversations: number
          total_emotions: number
          total_favorite_songs: number
          user_id: string
        }[]
      }
      get_user_ai_quota: {
        Args: { p_user_id?: string }
        Returns: {
          credits_used: number
          remaining_credits: number
          reset_date: string
          subscription_type: string
          total_credits: number
        }[]
      }
      get_user_analytics: {
        Args: { p_user_id?: string }
        Returns: {
          last_activity: string
          total_duration: number
          total_sessions: number
          user_id: string
        }[]
      }
      get_user_ia_stats: {
        Args: { p_period_days?: number }
        Returns: Json
      }
      get_user_medical_stats: {
        Args: { p_user_id?: string }
        Returns: Json
      }
      get_user_music_library: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          id: string
          in_library: boolean
          title: string
        }[]
      }
      get_user_organization_role: {
        Args: { org_id: string }
        Returns: string
      }
      get_user_progress: {
        Args: Record<PropertyKey, never>
        Returns: {
          avg_points: number
          completed_challenges: number
          total_badges: number
          total_challenges: number
          user_id: string
        }[]
      }
      get_user_subscription: {
        Args: { user_uuid: string }
        Returns: {
          features: Json
          monthly_quota: number
          plan_id: string
          plan_name: string
          status: string
        }[]
      }
      increment_aura_interaction: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      increment_house_light: {
        Args: { p_acts?: number; p_user_id: string }
        Returns: undefined
      }
      increment_music_usage: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      increment_rate_limit_counter: {
        Args: {
          p_identifier: string
          p_max_requests: number
          p_window_duration_seconds: number
        }
        Returns: Json
      }
      integrate_all_oic_competences_into_edn_items: {
        Args: Record<PropertyKey, never>
        Returns: {
          integrated_competences: number
          processed_items: number
          rang_a_total: number
          rang_b_total: number
          success_details: Json
        }[]
      }
      integrate_oic_into_edn_items: {
        Args: Record<PropertyKey, never>
        Returns: {
          details: Json
          error_count: number
          success_count: number
          updated_items: number
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_admin_change: {
        Args: {
          p_action_type?: string
          p_field_name?: string
          p_new_value?: Json
          p_old_value?: Json
          p_reason?: string
          p_record_id: string
          p_table_name: string
        }
        Returns: string
      }
      log_audio_access: {
        Args: {
          p_access_type: string
          p_bytes_transferred?: number
          p_ip_address?: string
          p_referer?: string
          p_session_duration?: number
          p_song_id: string
          p_user_agent?: string
          p_user_id: string
        }
        Returns: undefined
      }
      log_chat_interaction: {
        Args: {
          p_context_used?: Json
          p_question: string
          p_response: string
          p_response_time_ms?: number
          p_tokens_used?: number
          p_user_id: string
        }
        Returns: undefined
      }
      log_ia_usage: {
        Args:
          | {
              p_credits_used?: number
              p_error_details?: string
              p_operation_type: string
              p_request_details?: Json
              p_response_status?: string
              p_response_time_ms?: number
              p_service_type: string
            }
          | {
              p_credits_used?: number
              p_error_details?: string
              p_operation_type: string
              p_request_details?: Json
              p_response_status?: string
              p_service_type: string
            }
        Returns: string
      }
      log_lyrics_access: {
        Args: {
          p_format: string
          p_ip_address?: string
          p_song_id: string
          p_user_id: string
        }
        Returns: undefined
      }
      log_security_audit: {
        Args: {
          p_details?: Json
          p_event_type: string
          p_resource_id?: string
          p_resource_type?: string
          p_severity?: string
        }
        Returns: string
      }
      log_security_event: {
        Args:
          | { event_details?: Json; event_type: string }
          | {
              p_action: string
              p_finding_type?: string
              p_metadata?: Json
              p_record_id?: string
              p_severity?: string
              p_table_name?: string
            }
          | {
              p_event_details?: Json
              p_event_type: string
              p_ip_address?: unknown
              p_severity?: string
              p_user_agent?: string
              p_user_id?: string
            }
          | {
              p_event_details?: Json
              p_event_type: string
              p_ip_address?: unknown
              p_user_agent?: string
            }
          | {
              p_event_details?: Json
              p_event_type: string
              p_ip_address?: unknown
              p_user_agent?: string
              p_user_id?: string
            }
        Returns: string
      }
      log_security_finding: {
        Args: {
          _action_taken?: string
          _audit_type: string
          _description: string
          _finding_type: string
          _location: string
          _metadata?: Json
          _sensitive_data?: string
          _severity: string
        }
        Returns: string
      }
      mark_notifications_as_read: {
        Args: { notification_ids?: string[]; user_id_param: string }
        Returns: number
      }
      med_mng_add_song_to_playlist: {
        Args: { playlist_id: string; song_id: string }
        Returns: undefined
      }
      med_mng_add_to_library: {
        Args: { song_id: string }
        Returns: undefined
      }
      med_mng_create_activity_log_cleanup_job: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      med_mng_create_playlist: {
        Args: {
          is_public?: boolean
          playlist_description?: string
          playlist_name: string
        }
        Returns: string
      }
      med_mng_create_user_sub: {
        Args: {
          gateway_name: string
          plan_name: string
          subscription_id?: string
        }
        Returns: undefined
      }
      med_mng_decrement_quota: {
        Args: { credits_to_use: number }
        Returns: Json
      }
      med_mng_generate_qcm: {
        Args: { p_difficulty?: number; p_item_id: string; p_type: string }
        Returns: Json
      }
      med_mng_get_activity_stats: {
        Args: { p_end_date?: string; p_start_date?: string }
        Returns: {
          activity_type: string
          percentage: number
          total_count: number
        }[]
      }
      med_mng_get_anonymous_activity_logs: {
        Args: {
          p_activity_type?: string
          p_end_date?: string
          p_page?: number
          p_page_size?: number
          p_search_term?: string
          p_start_date?: string
        }
        Returns: {
          activity_type: string
          category: string
          count: number
          id: string
          timestamp_day: string
        }[]
      }
      med_mng_get_remaining_quota: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      med_mng_increment_quota: {
        Args: { credits_to_add: number }
        Returns: boolean
      }
      med_mng_log_listen: {
        Args: {
          completion_percentage?: number
          device_type?: string
          duration_seconds?: number
          song_id: string
        }
        Returns: undefined
      }
      med_mng_log_listening_event: {
        Args: {
          p_event_type: string
          p_listen_duration?: number
          p_metadata?: Json
          p_song_id: string
        }
        Returns: undefined
      }
      med_mng_log_user_activity: {
        Args: { activity_details_param?: Json; activity_type_param: string }
        Returns: undefined
      }
      med_mng_refresh_monthly_quota: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      med_mng_refund_credits: {
        Args: { p_credits: number; p_user_id: string }
        Returns: boolean
      }
      med_mng_remove_from_library: {
        Args: { song_id: string }
        Returns: undefined
      }
      med_mng_save_theme: {
        Args: { theme_json: Json }
        Returns: undefined
      }
      med_mng_toggle_favorite: {
        Args: { song_id: string }
        Returns: boolean
      }
      med_mng_toggle_like: {
        Args: { song_id: string }
        Returns: boolean
      }
      med_mng_track_listening: {
        Args: { p_listen_duration?: number; p_song_id: string }
        Returns: undefined
      }
      merge_all_tables_into_complete: {
        Args: Record<PropertyKey, never>
        Returns: {
          backup_items_restored: number
          integrated_competences: number
          processed_items: number
          total_unified_records: number
        }[]
      }
      migrate_edn_items_complete: {
        Args: Record<PropertyKey, never>
        Returns: {
          details: Json
          error_count: number
          processed_count: number
          success_count: number
        }[]
      }
      migrate_edn_items_to_platform: {
        Args: Record<PropertyKey, never>
        Returns: {
          details: Json
          error_count: number
          processed_count: number
          success_count: number
        }[]
      }
      organize_competences_by_item_and_rank: {
        Args: Record<PropertyKey, never>
        Returns: {
          item_number: number
          rang_a_competences: Json
          rang_b_competences: Json
          total_rang_a: number
          total_rang_b: number
        }[]
      }
      panic_overlay_get_state: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      reset_monthly_quotas: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      run_automated_completeness_audit: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      run_security_health_check: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      sanitize_user_input: {
        Args: { input_text: string }
        Returns: string
      }
      scan_for_security_violations: {
        Args: Record<PropertyKey, never>
        Returns: {
          column_name: string
          sample_finding: string
          suspicious_data_count: number
          table_name: string
        }[]
      }
      secure_generate_music: {
        Args: {
          p_item_code: string
          p_paroles: string[]
          p_style?: string
          p_type: string
        }
        Returns: string
      }
      security_audit_check: {
        Args: Record<PropertyKey, never>
        Returns: {
          check_name: string
          details: string
          severity: string
          status: string
        }[]
      }
      security_audit_summary: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      security_validation_final: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      set_analytics_opt_in: {
        Args: {
          p_consent_version?: string
          p_opt_in: boolean
          p_retention_days?: number
          p_user_id: string
        }
        Returns: {
          analytics_opt_in: boolean
          consent_version: string
          created_at: string
          pseudonymized_user_id: string
          retention_days: number
          updated_at: string
          user_id: string
        }
      }
      snapshot_aura_weekly: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      start_extraction_batch: {
        Args: {
          p_batch_type: string
          p_session_data?: Json
          p_total_items?: number
        }
        Returns: string
      }
      sync_oic_competences: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      ultimate_security_validation: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      unlock_story_fragment: {
        Args: { p_fragment_code: string; p_user_id: string }
        Returns: Json
      }
      update_all_edn_items_unique_content: {
        Args: Record<PropertyKey, never>
        Returns: {
          details: Json
          updated_count: number
        }[]
      }
      update_aura_from_who5: {
        Args: { p_user_id: string; p_who5_score: number }
        Returns: undefined
      }
      update_competences_counters: {
        Args: Record<PropertyKey, never>
        Returns: {
          item_code: string
          rang_a_count: number
          rang_b_count: number
          total_count: number
          updated: boolean
        }[]
      }
      update_edn_items_with_real_specific_content: {
        Args: Record<PropertyKey, never>
        Returns: {
          details: Json
          updated_count: number
        }[]
      }
      update_edn_items_with_specific_content: {
        Args: Record<PropertyKey, never>
        Returns: {
          error_count: number
          processed_count: number
          success_count: number
        }[]
      }
      update_extraction_progress: {
        Args: {
          p_event_data?: Json
          p_event_message?: string
          p_failed_items?: number
          p_log_id: string
          p_processed_items: number
        }
        Returns: undefined
      }
      validate_edn_item_data: {
        Args: { item_data: Json }
        Returns: boolean
      }
      validate_music_lyrics: {
        Args: { lyrics_data: Json }
        Returns: boolean
      }
      verify_competences_completeness: {
        Args: Record<PropertyKey, never>
        Returns: {
          actual_rang_a: number
          actual_rang_b: number
          actual_total: number
          has_missing_rang_a: boolean
          has_missing_rang_b: boolean
          item_code: string
          needs_update: boolean
          status: string
          stored_rang_a: number
          stored_rang_b: number
          stored_total: number
          title: string
        }[]
      }
      verify_integration_success: {
        Args: Record<PropertyKey, never>
        Returns: {
          avg_competences_per_item: number
          integration_health_score: number
          items_with_competences: number
          items_without_competences: number
          paroles_generated: number
          rang_a_total: number
          rang_b_total: number
          total_items: number
        }[]
      }
      verify_invitation_token: {
        Args: { token_param: string }
        Returns: Json
      }
      verify_oic_data_integrity: {
        Args: Record<PropertyKey, never>
        Returns: {
          by_item: Json
          by_rank: Json
          integrity_score: number
          total_competences: number
          with_content: number
          without_content: number
        }[]
      }
    }
    Enums: {
      invitation_status: "pending" | "accepted" | "expired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      invitation_status: ["pending", "accepted", "expired"],
    },
  },
} as const
