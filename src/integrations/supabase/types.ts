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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ab_test_configurations: {
        Row: {
          confidence_level: number | null
          control_rule_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          metadata: Json | null
          min_sample_size: number | null
          name: string
          start_date: string | null
          status: string
          updated_at: string | null
          variant_rule_id: string | null
          winner: string | null
        }
        Insert: {
          confidence_level?: number | null
          control_rule_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          metadata?: Json | null
          min_sample_size?: number | null
          name: string
          start_date?: string | null
          status?: string
          updated_at?: string | null
          variant_rule_id?: string | null
          winner?: string | null
        }
        Update: {
          confidence_level?: number | null
          control_rule_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          metadata?: Json | null
          min_sample_size?: number | null
          name?: string
          start_date?: string | null
          status?: string
          updated_at?: string | null
          variant_rule_id?: string | null
          winner?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ab_test_configurations_control_rule_id_fkey"
            columns: ["control_rule_id"]
            isOneToOne: false
            referencedRelation: "alert_escalation_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ab_test_configurations_variant_rule_id_fkey"
            columns: ["variant_rule_id"]
            isOneToOne: false
            referencedRelation: "alert_escalation_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_test_results: {
        Row: {
          alert_id: string | null
          created_at: string | null
          escalation_count: number | null
          feedback_score: number | null
          final_severity: string | null
          id: string
          resolution_time_minutes: number | null
          resolved: boolean | null
          resolved_at: string | null
          test_id: string
          variant: string
        }
        Insert: {
          alert_id?: string | null
          created_at?: string | null
          escalation_count?: number | null
          feedback_score?: number | null
          final_severity?: string | null
          id?: string
          resolution_time_minutes?: number | null
          resolved?: boolean | null
          resolved_at?: string | null
          test_id: string
          variant: string
        }
        Update: {
          alert_id?: string | null
          created_at?: string | null
          escalation_count?: number | null
          feedback_score?: number | null
          final_severity?: string | null
          id?: string
          resolution_time_minutes?: number | null
          resolved?: boolean | null
          resolved_at?: string | null
          test_id?: string
          variant?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_test_results_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "unified_alerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ab_test_results_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "ab_test_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
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
      accessibility_report_config: {
        Row: {
          created_at: string
          enabled: boolean
          frequency: string
          github_token: string | null
          id: string
          last_sent_at: string | null
          recipients: string[]
          send_day: number | null
          send_hour: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          frequency?: string
          github_token?: string | null
          id?: string
          last_sent_at?: string | null
          recipients?: string[]
          send_day?: number | null
          send_hour?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          frequency?: string
          github_token?: string | null
          id?: string
          last_sent_at?: string | null
          recipients?: string[]
          send_day?: number | null
          send_hour?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      accessibility_report_history: {
        Row: {
          config_id: string | null
          created_at: string
          error_message: string | null
          id: string
          recipients: string[]
          report_data: Json | null
          sent_at: string
          status: string
        }
        Insert: {
          config_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          recipients: string[]
          report_data?: Json | null
          sent_at?: string
          status: string
        }
        Update: {
          config_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          recipients?: string[]
          report_data?: Json | null
          sent_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "accessibility_report_history_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "accessibility_report_config"
            referencedColumns: ["id"]
          },
        ]
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
      active_escalations: {
        Row: {
          alert_id: string | null
          assigned_to: string[] | null
          created_at: string
          current_level: number
          id: string
          last_escalated_at: string | null
          metadata: Json | null
          resolution_notes: string | null
          resolved_at: string | null
          started_at: string
          status: string
          updated_at: string
        }
        Insert: {
          alert_id?: string | null
          assigned_to?: string[] | null
          created_at?: string
          current_level?: number
          id?: string
          last_escalated_at?: string | null
          metadata?: Json | null
          resolution_notes?: string | null
          resolved_at?: string | null
          started_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          alert_id?: string | null
          assigned_to?: string[] | null
          created_at?: string
          current_level?: number
          id?: string
          last_escalated_at?: string | null
          metadata?: Json | null
          resolution_notes?: string | null
          resolved_at?: string | null
          started_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "active_escalations_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "unified_alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      activities: {
        Row: {
          audio_url: string | null
          benefits: string[] | null
          category: string
          created_at: string
          description: string
          difficulty: string
          duration_minutes: number
          icon: string | null
          id: string
          image_url: string | null
          instructions: string[] | null
          is_premium: boolean | null
          popularity_score: number | null
          tags: string[] | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          audio_url?: string | null
          benefits?: string[] | null
          category: string
          created_at?: string
          description: string
          difficulty: string
          duration_minutes?: number
          icon?: string | null
          id?: string
          image_url?: string | null
          instructions?: string[] | null
          is_premium?: boolean | null
          popularity_score?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          audio_url?: string | null
          benefits?: string[] | null
          category?: string
          created_at?: string
          description?: string
          difficulty?: string
          duration_minutes?: number
          icon?: string | null
          id?: string
          image_url?: string | null
          instructions?: string[] | null
          is_premium?: boolean | null
          popularity_score?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      activity_badges: {
        Row: {
          category: string
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          rarity: string | null
          requirement_category: string | null
          requirement_type: string
          requirement_value: number
          xp_reward: number | null
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
          rarity?: string | null
          requirement_category?: string | null
          requirement_type: string
          requirement_value: number
          xp_reward?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          rarity?: string | null
          requirement_category?: string | null
          requirement_type?: string
          requirement_value?: number
          xp_reward?: number | null
        }
        Relationships: []
      }
      activity_recommendations: {
        Row: {
          activity_id: string
          based_on: string | null
          clicked: boolean | null
          completed: boolean | null
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          reason: string
          score: number | null
          user_id: string
        }
        Insert: {
          activity_id: string
          based_on?: string | null
          clicked?: boolean | null
          completed?: boolean | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          reason: string
          score?: number | null
          user_id: string
        }
        Update: {
          activity_id?: string
          based_on?: string | null
          clicked?: boolean | null
          completed?: boolean | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          reason?: string
          score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_recommendations_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_reminders: {
        Row: {
          activity_id: string | null
          created_at: string
          days_of_week: number[] | null
          id: string
          is_active: boolean | null
          last_sent_at: string | null
          message: string | null
          reminder_time: string
          user_id: string
        }
        Insert: {
          activity_id?: string | null
          created_at?: string
          days_of_week?: number[] | null
          id?: string
          is_active?: boolean | null
          last_sent_at?: string | null
          message?: string | null
          reminder_time: string
          user_id: string
        }
        Update: {
          activity_id?: string | null
          created_at?: string
          days_of_week?: number[] | null
          id?: string
          is_active?: boolean | null
          last_sent_at?: string | null
          message?: string | null
          reminder_time?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_reminders_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_sessions: {
        Row: {
          activity_id: string | null
          completed: boolean | null
          completed_at: string | null
          duration_seconds: number | null
          energy_after: number | null
          energy_before: number | null
          id: string
          metadata: Json | null
          mood_after: number | null
          mood_before: number | null
          notes: string | null
          rating: number | null
          started_at: string
          user_id: string
          was_guided: boolean | null
          xp_earned: number | null
        }
        Insert: {
          activity_id?: string | null
          completed?: boolean | null
          completed_at?: string | null
          duration_seconds?: number | null
          energy_after?: number | null
          energy_before?: number | null
          id?: string
          metadata?: Json | null
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          rating?: number | null
          started_at?: string
          user_id: string
          was_guided?: boolean | null
          xp_earned?: number | null
        }
        Update: {
          activity_id?: string | null
          completed?: boolean | null
          completed_at?: string | null
          duration_seconds?: number | null
          energy_after?: number | null
          energy_before?: number | null
          id?: string
          metadata?: Json | null
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          rating?: number | null
          started_at?: string
          user_id?: string
          was_guided?: boolean | null
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_sessions_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_streaks: {
        Row: {
          created_at: string
          current_streak: number | null
          id: string
          last_activity_date: string | null
          longest_streak: number | null
          total_activities: number | null
          total_minutes: number | null
          updated_at: string
          user_id: string
          weekly_goal: number | null
          weekly_progress: number | null
        }
        Insert: {
          created_at?: string
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          total_activities?: number | null
          total_minutes?: number | null
          updated_at?: string
          user_id: string
          weekly_goal?: number | null
          weekly_progress?: number | null
        }
        Update: {
          created_at?: string
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          total_activities?: number | null
          total_minutes?: number | null
          updated_at?: string
          user_id?: string
          weekly_goal?: number | null
          weekly_progress?: number | null
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
      ai_clinical_cases: {
        Row: {
          average_score: number | null
          created_at: string
          description: string | null
          difficulty: string | null
          estimated_time: number | null
          generated_by: string | null
          id: string
          learning_objectives: string[] | null
          patient_presentation: string
          related_items: string[] | null
          specialty: string
          steps: Json
          title: string
          use_count: number | null
        }
        Insert: {
          average_score?: number | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          estimated_time?: number | null
          generated_by?: string | null
          id?: string
          learning_objectives?: string[] | null
          patient_presentation: string
          related_items?: string[] | null
          specialty: string
          steps?: Json
          title: string
          use_count?: number | null
        }
        Update: {
          average_score?: number | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          estimated_time?: number | null
          generated_by?: string | null
          id?: string
          learning_objectives?: string[] | null
          patient_presentation?: string
          related_items?: string[] | null
          specialty?: string
          steps?: Json
          title?: string
          use_count?: number | null
        }
        Relationships: []
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
      ai_exam_history: {
        Row: {
          ai_generated: boolean | null
          answers: Json | null
          completed_at: string | null
          created_at: string | null
          exam_type: string | null
          id: string
          questions: Json | null
          score: number | null
          started_at: string | null
          time_limit_minutes: number | null
          total_questions: number | null
          user_id: string
        }
        Insert: {
          ai_generated?: boolean | null
          answers?: Json | null
          completed_at?: string | null
          created_at?: string | null
          exam_type?: string | null
          id?: string
          questions?: Json | null
          score?: number | null
          started_at?: string | null
          time_limit_minutes?: number | null
          total_questions?: number | null
          user_id: string
        }
        Update: {
          ai_generated?: boolean | null
          answers?: Json | null
          completed_at?: string | null
          created_at?: string | null
          exam_type?: string | null
          id?: string
          questions?: Json | null
          score?: number | null
          started_at?: string | null
          time_limit_minutes?: number | null
          total_questions?: number | null
          user_id?: string
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
      ai_monitoring_errors: {
        Row: {
          ai_analysis: Json
          category: string
          context: Json | null
          created_at: string
          error_type: string
          id: string
          is_known_issue: boolean | null
          message: string
          needs_alert: boolean | null
          priority: string
          resolution_notes: string | null
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          stack: string | null
          url: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          ai_analysis: Json
          category: string
          context?: Json | null
          created_at?: string
          error_type: string
          id?: string
          is_known_issue?: boolean | null
          message: string
          needs_alert?: boolean | null
          priority: string
          resolution_notes?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          stack?: string | null
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          ai_analysis?: Json
          category?: string
          context?: Json | null
          created_at?: string
          error_type?: string
          id?: string
          is_known_issue?: boolean | null
          message?: string
          needs_alert?: boolean | null
          priority?: string
          resolution_notes?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          stack?: string | null
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
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
      ai_template_suggestions: {
        Row: {
          applied_at: string | null
          confidence_score: number
          created_at: string
          error_pattern: Json
          id: string
          last_seen_at: string
          occurrences: number
          pattern_name: string
          sample_errors: Json | null
          status: string | null
          suggested_template: Json
        }
        Insert: {
          applied_at?: string | null
          confidence_score: number
          created_at?: string
          error_pattern: Json
          id?: string
          last_seen_at?: string
          occurrences?: number
          pattern_name: string
          sample_errors?: Json | null
          status?: string | null
          suggested_template: Json
        }
        Update: {
          applied_at?: string | null
          confidence_score?: number
          created_at?: string
          error_pattern?: Json
          id?: string
          last_seen_at?: string
          occurrences?: number
          pattern_name?: string
          sample_errors?: Json | null
          status?: string | null
          suggested_template?: Json
        }
        Relationships: []
      }
      alert_configurations: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          discord_template_id: string | null
          discord_username: string | null
          discord_webhook_url: string | null
          email_recipients: string[] | null
          email_template_id: string | null
          enabled: boolean
          excluded_categories: string[] | null
          id: string
          included_categories: string[] | null
          last_triggered_at: string | null
          max_alerts_per_hour: number | null
          min_priority: string
          min_severity: string
          name: string
          notify_discord: boolean
          notify_email: boolean
          notify_slack: boolean
          require_alert_flag: boolean
          slack_channel: string | null
          slack_template_id: string | null
          slack_webhook_url: string | null
          throttle_minutes: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          discord_template_id?: string | null
          discord_username?: string | null
          discord_webhook_url?: string | null
          email_recipients?: string[] | null
          email_template_id?: string | null
          enabled?: boolean
          excluded_categories?: string[] | null
          id?: string
          included_categories?: string[] | null
          last_triggered_at?: string | null
          max_alerts_per_hour?: number | null
          min_priority?: string
          min_severity?: string
          name: string
          notify_discord?: boolean
          notify_email?: boolean
          notify_slack?: boolean
          require_alert_flag?: boolean
          slack_channel?: string | null
          slack_template_id?: string | null
          slack_webhook_url?: string | null
          throttle_minutes?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          discord_template_id?: string | null
          discord_username?: string | null
          discord_webhook_url?: string | null
          email_recipients?: string[] | null
          email_template_id?: string | null
          enabled?: boolean
          excluded_categories?: string[] | null
          id?: string
          included_categories?: string[] | null
          last_triggered_at?: string | null
          max_alerts_per_hour?: number | null
          min_priority?: string
          min_severity?: string
          name?: string
          notify_discord?: boolean
          notify_email?: boolean
          notify_slack?: boolean
          require_alert_flag?: boolean
          slack_channel?: string | null
          slack_template_id?: string | null
          slack_webhook_url?: string | null
          throttle_minutes?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "alert_configurations_discord_template_id_fkey"
            columns: ["discord_template_id"]
            isOneToOne: false
            referencedRelation: "alert_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alert_configurations_email_template_id_fkey"
            columns: ["email_template_id"]
            isOneToOne: false
            referencedRelation: "alert_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alert_configurations_slack_template_id_fkey"
            columns: ["slack_template_id"]
            isOneToOne: false
            referencedRelation: "alert_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      alert_escalation_rules: {
        Row: {
          created_at: string
          delay_hours: number
          description: string | null
          id: string
          is_active: boolean | null
          max_escalation_level: number
          name: string
          notification_levels: Json
          priority_increase: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          delay_hours?: number
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_escalation_level?: number
          name: string
          notification_levels?: Json
          priority_increase?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          delay_hours?: number
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_escalation_level?: number
          name?: string
          notification_levels?: Json
          priority_increase?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      alert_score_history: {
        Row: {
          age_score: number | null
          alert_id: string | null
          calculated_at: string | null
          cvss_normalized_score: number | null
          factors: Json | null
          frequency_score: number | null
          id: string
          pagerduty_score: number | null
          unified_score: number
        }
        Insert: {
          age_score?: number | null
          alert_id?: string | null
          calculated_at?: string | null
          cvss_normalized_score?: number | null
          factors?: Json | null
          frequency_score?: number | null
          id?: string
          pagerduty_score?: number | null
          unified_score: number
        }
        Update: {
          age_score?: number | null
          alert_id?: string | null
          calculated_at?: string | null
          cvss_normalized_score?: number | null
          factors?: Json | null
          frequency_score?: number | null
          id?: string
          pagerduty_score?: number | null
          unified_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "alert_score_history_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "unified_alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      alert_templates: {
        Row: {
          available_variables: Json | null
          body: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_default: boolean
          last_used_at: string | null
          name: string
          subject: string | null
          template_type: string
          updated_at: string
        }
        Insert: {
          available_variables?: Json | null
          body: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_default?: boolean
          last_used_at?: string | null
          name: string
          subject?: string | null
          template_type: string
          updated_at?: string
        }
        Update: {
          available_variables?: Json | null
          body?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_default?: boolean
          last_used_at?: string | null
          name?: string
          subject?: string | null
          template_type?: string
          updated_at?: string
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
      anatomical_landmarks: {
        Row: {
          confidence: number | null
          created_at: string | null
          detection_method: string | null
          id: string
          landmark_code: string
          landmark_name: string
          position: number[]
          scan_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          detection_method?: string | null
          id?: string
          landmark_code: string
          landmark_name: string
          position: number[]
          scan_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          detection_method?: string | null
          id?: string
          landmark_code?: string
          landmark_name?: string
          position?: number[]
          scan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "anatomical_landmarks_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "wholebody_scans"
            referencedColumns: ["id"]
          },
        ]
      }
      anatomical_structures: {
        Row: {
          body_zone: string
          bounding_box: number[] | null
          centroid: number[] | null
          created_at: string | null
          default_color: string
          id: string
          laterality: string | null
          mask_file_path: string | null
          mesh_file_path_high: string | null
          mesh_file_path_low: string | null
          mesh_file_path_medium: string | null
          metadata: Json | null
          priority: number | null
          scan_id: string
          structure_category: string
          structure_code: string
          structure_name: string
          volume_ml: number | null
        }
        Insert: {
          body_zone: string
          bounding_box?: number[] | null
          centroid?: number[] | null
          created_at?: string | null
          default_color?: string
          id?: string
          laterality?: string | null
          mask_file_path?: string | null
          mesh_file_path_high?: string | null
          mesh_file_path_low?: string | null
          mesh_file_path_medium?: string | null
          metadata?: Json | null
          priority?: number | null
          scan_id: string
          structure_category: string
          structure_code: string
          structure_name: string
          volume_ml?: number | null
        }
        Update: {
          body_zone?: string
          bounding_box?: number[] | null
          centroid?: number[] | null
          created_at?: string | null
          default_color?: string
          id?: string
          laterality?: string | null
          mask_file_path?: string | null
          mesh_file_path_high?: string | null
          mesh_file_path_low?: string | null
          mesh_file_path_medium?: string | null
          metadata?: Json | null
          priority?: number | null
          scan_id?: string
          structure_category?: string
          structure_code?: string
          structure_name?: string
          volume_ml?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "anatomical_structures_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "wholebody_scans"
            referencedColumns: ["id"]
          },
        ]
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
      applied_recommendations: {
        Row: {
          applied_at: string | null
          category: string
          created_at: string | null
          description: string | null
          id: string
          impact_calculated: boolean | null
          impact_details: Json | null
          impact_level: string
          impact_score: number | null
          metrics_after: Json | null
          metrics_after_period_end: string | null
          metrics_after_period_start: string | null
          metrics_before: Json
          metrics_before_period_end: string | null
          metrics_before_period_start: string | null
          notes: string | null
          recommendation_id: string
          status: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          applied_at?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          impact_calculated?: boolean | null
          impact_details?: Json | null
          impact_level: string
          impact_score?: number | null
          metrics_after?: Json | null
          metrics_after_period_end?: string | null
          metrics_after_period_start?: string | null
          metrics_before?: Json
          metrics_before_period_end?: string | null
          metrics_before_period_start?: string | null
          notes?: string | null
          recommendation_id: string
          status?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          applied_at?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          impact_calculated?: boolean | null
          impact_details?: Json | null
          impact_level?: string
          impact_score?: number | null
          metrics_after?: Json | null
          metrics_after_period_end?: string | null
          metrics_after_period_start?: string | null
          metrics_before?: Json
          metrics_before_period_end?: string | null
          metrics_before_period_start?: string | null
          notes?: string | null
          recommendation_id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ar_filter_sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          duration_seconds: number | null
          filter_type: string
          id: string
          mood_impact: string | null
          photos_taken: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          duration_seconds?: number | null
          filter_type: string
          id?: string
          mood_impact?: string | null
          photos_taken?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          duration_seconds?: number | null
          filter_type?: string
          id?: string
          mood_impact?: string | null
          photos_taken?: number | null
          user_id?: string
        }
        Relationships: []
      }
      ar_registration_matrices: {
        Row: {
          calibration_accuracy: number | null
          calibration_method: string | null
          created_at: string | null
          id: string
          scale_factor: number | null
          scan_id: string
          session_id: string | null
          transformation_matrix: number[] | null
        }
        Insert: {
          calibration_accuracy?: number | null
          calibration_method?: string | null
          created_at?: string | null
          id?: string
          scale_factor?: number | null
          scan_id: string
          session_id?: string | null
          transformation_matrix?: number[] | null
        }
        Update: {
          calibration_accuracy?: number | null
          calibration_method?: string | null
          created_at?: string | null
          id?: string
          scale_factor?: number | null
          scan_id?: string
          session_id?: string | null
          transformation_matrix?: number[] | null
        }
        Relationships: [
          {
            foreignKeyName: "ar_registration_matrices_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "wholebody_scans"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_sessions: {
        Row: {
          answers: Json | null
          completed_at: string | null
          context: Json | null
          created_at: string
          duration_seconds: number | null
          id: string
          instrument: string
          locale: string
          metadata: Json | null
          started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answers?: Json | null
          completed_at?: string | null
          context?: Json | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          instrument: string
          locale?: string
          metadata?: Json | null
          started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answers?: Json | null
          completed_at?: string | null
          context?: Json | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          instrument?: string
          locale?: string
          metadata?: Json | null
          started_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      assessments: {
        Row: {
          created_at: string
          id: string
          instrument: string
          score_json: Json
          submitted_at: string | null
          ts: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          instrument: string
          score_json: Json
          submitted_at?: string | null
          ts?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          instrument?: string
          score_json?: Json
          submitted_at?: string | null
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
      audit_alerts: {
        Row: {
          alert_type: string
          audit_id: string
          created_at: string
          current_score: number | null
          id: string
          is_sent: boolean
          message: string
          previous_score: number | null
          schedule_id: string | null
          score_drop: number | null
          sent_at: string | null
          severity: string
          title: string
        }
        Insert: {
          alert_type: string
          audit_id: string
          created_at?: string
          current_score?: number | null
          id?: string
          is_sent?: boolean
          message: string
          previous_score?: number | null
          schedule_id?: string | null
          score_drop?: number | null
          sent_at?: string | null
          severity?: string
          title: string
        }
        Update: {
          alert_type?: string
          audit_id?: string
          created_at?: string
          current_score?: number | null
          id?: string
          is_sent?: boolean
          message?: string
          previous_score?: number | null
          schedule_id?: string | null
          score_drop?: number | null
          sent_at?: string | null
          severity?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_alerts_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "compliance_audits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_alerts_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "audit_schedules"
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
      audit_notifications: {
        Row: {
          alert_id: string
          created_at: string
          error_message: string | null
          id: string
          notification_type: string
          recipient_email: string
          sent_at: string | null
          status: string
        }
        Insert: {
          alert_id: string
          created_at?: string
          error_message?: string | null
          id?: string
          notification_type: string
          recipient_email: string
          sent_at?: string | null
          status?: string
        }
        Update: {
          alert_id?: string
          created_at?: string
          error_message?: string | null
          id?: string
          notification_type?: string
          recipient_email?: string
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_notifications_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "audit_alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_report_logs: {
        Row: {
          created_at: string | null
          critical_alerts: number | null
          id: string
          period_end: string
          period_start: string
          recipients: string[]
          sent_at: string | null
          sent_by: string | null
          total_alerts: number | null
          total_changes: number | null
        }
        Insert: {
          created_at?: string | null
          critical_alerts?: number | null
          id?: string
          period_end: string
          period_start: string
          recipients: string[]
          sent_at?: string | null
          sent_by?: string | null
          total_alerts?: number | null
          total_changes?: number | null
        }
        Update: {
          created_at?: string | null
          critical_alerts?: number | null
          id?: string
          period_end?: string
          period_start?: string
          recipients?: string[]
          sent_at?: string | null
          sent_by?: string | null
          total_alerts?: number | null
          total_changes?: number | null
        }
        Relationships: []
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
      audit_schedules: {
        Row: {
          alert_recipients: Json | null
          alert_threshold: number | null
          created_at: string
          created_by: string | null
          day_of_month: number | null
          day_of_week: number | null
          frequency: string
          id: string
          is_active: boolean
          last_run_at: string | null
          name: string
          next_run_at: string | null
          time_of_day: string
          updated_at: string
        }
        Insert: {
          alert_recipients?: Json | null
          alert_threshold?: number | null
          created_at?: string
          created_by?: string | null
          day_of_month?: number | null
          day_of_week?: number | null
          frequency: string
          id?: string
          is_active?: boolean
          last_run_at?: string | null
          name: string
          next_run_at?: string | null
          time_of_day?: string
          updated_at?: string
        }
        Update: {
          alert_recipients?: Json | null
          alert_threshold?: number | null
          created_at?: string
          created_by?: string | null
          day_of_month?: number | null
          day_of_week?: number | null
          frequency?: string
          id?: string
          is_active?: boolean
          last_run_at?: string | null
          name?: string
          next_run_at?: string | null
          time_of_day?: string
          updated_at?: string
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
      auto_created_tickets: {
        Row: {
          alert_id: string
          assigned_to: string | null
          created_at: string | null
          id: string
          integration_id: string
          ml_confidence: number | null
          ml_suggested_assignee: string | null
          pattern_analysis: Json | null
          status: string | null
          synced_at: string | null
          ticket_key: string
          ticket_url: string | null
          updated_at: string | null
        }
        Insert: {
          alert_id: string
          assigned_to?: string | null
          created_at?: string | null
          id?: string
          integration_id: string
          ml_confidence?: number | null
          ml_suggested_assignee?: string | null
          pattern_analysis?: Json | null
          status?: string | null
          synced_at?: string | null
          ticket_key: string
          ticket_url?: string | null
          updated_at?: string | null
        }
        Update: {
          alert_id?: string
          assigned_to?: string | null
          created_at?: string | null
          id?: string
          integration_id?: string
          ml_confidence?: number | null
          ml_suggested_assignee?: string | null
          pattern_analysis?: Json | null
          status?: string | null
          synced_at?: string | null
          ticket_key?: string
          ticket_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auto_created_tickets_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "unified_alerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auto_created_tickets_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "ticket_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      auto_detected_skills: {
        Row: {
          approved: boolean | null
          approved_at: string | null
          approved_by: string | null
          confidence_score: number
          detected_at: string | null
          detection_source: string
          evidence: Json | null
          id: string
          skill_name: string
          team_member_id: string | null
        }
        Insert: {
          approved?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          confidence_score: number
          detected_at?: string | null
          detection_source: string
          evidence?: Json | null
          id?: string
          skill_name: string
          team_member_id?: string | null
        }
        Update: {
          approved?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          confidence_score?: number
          detected_at?: string | null
          detection_source?: string
          evidence?: Json | null
          id?: string
          skill_name?: string
          team_member_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auto_detected_skills_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_member_skills"
            referencedColumns: ["id"]
          },
        ]
      }
      automix_feedback: {
        Row: {
          context_snapshot: Json
          created_at: string
          feedback_notes: string | null
          id: string
          playlist_id: string
          rating: number
          user_id: string
        }
        Insert: {
          context_snapshot: Json
          created_at?: string
          feedback_notes?: string | null
          id?: string
          playlist_id: string
          rating: number
          user_id: string
        }
        Update: {
          context_snapshot?: Json
          created_at?: string
          feedback_notes?: string | null
          id?: string
          playlist_id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "automix_feedback_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "automix_playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      automix_playlists: {
        Row: {
          context_rules: Json
          created_at: string
          generated_tracks: Json | null
          id: string
          is_active: boolean | null
          name: string
          tempo_range: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          context_rules?: Json
          created_at?: string
          generated_tracks?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          tempo_range?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          context_rules?: Json
          created_at?: string
          generated_tracks?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          tempo_range?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      b2b_anonymous_sessions: {
        Row: {
          access_code_id: string | null
          created_at: string
          duration_seconds: number | null
          ended_at: string | null
          id: string
          org_id: string
          session_hash: string
          session_type: string
          started_at: string
        }
        Insert: {
          access_code_id?: string | null
          created_at?: string
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          org_id: string
          session_hash: string
          session_type?: string
          started_at?: string
        }
        Update: {
          access_code_id?: string | null
          created_at?: string
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          org_id?: string
          session_hash?: string
          session_type?: string
          started_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "b2b_anonymous_sessions_access_code_id_fkey"
            columns: ["access_code_id"]
            isOneToOne: false
            referencedRelation: "org_access_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_anonymous_sessions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      b2b_audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          entity_id: string
          entity_type: string
          id: string
          ip_address: unknown
          org_id: string
          user_agent: string | null
          user_email: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          entity_id: string
          entity_type: string
          id?: string
          ip_address?: unknown
          org_id: string
          user_agent?: string | null
          user_email?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string
          entity_type?: string
          id?: string
          ip_address?: unknown
          org_id?: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string
        }
        Relationships: []
      }
      b2b_music_aggregates: {
        Row: {
          cohort_size: number
          created_at: string
          id: string
          metrics: Json | null
          org_id: string
          text_summary: string
          week_start: string
        }
        Insert: {
          cohort_size: number
          created_at?: string
          id?: string
          metrics?: Json | null
          org_id: string
          text_summary: string
          week_start: string
        }
        Update: {
          cohort_size?: number
          created_at?: string
          id?: string
          metrics?: Json | null
          org_id?: string
          text_summary?: string
          week_start?: string
        }
        Relationships: []
      }
      b2b_reports: {
        Row: {
          content: Json | null
          created_at: string | null
          generated_at: string | null
          generated_by: string | null
          id: string
          metrics: Json | null
          narrative: string | null
          org_id: string
          period: string
          report_type: string | null
          title: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          generated_at?: string | null
          generated_by?: string | null
          id?: string
          metrics?: Json | null
          narrative?: string | null
          org_id: string
          period: string
          report_type?: string | null
          title?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          generated_at?: string | null
          generated_by?: string | null
          id?: string
          metrics?: Json | null
          narrative?: string | null
          org_id?: string
          period?: string
          report_type?: string | null
          title?: string | null
        }
        Relationships: []
      }
      b2b_user_roles: {
        Row: {
          expires_at: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          org_id: string
          role: Database["public"]["Enums"]["b2b_role"]
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          org_id: string
          role?: Database["public"]["Enums"]["b2b_role"]
          user_id: string
        }
        Update: {
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          org_id?: string
          role?: Database["public"]["Enums"]["b2b_role"]
          user_id?: string
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
      badge_shares: {
        Row: {
          achievement_id: string
          id: string
          platform: string
          share_url: string | null
          shared_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          platform: string
          share_url?: string | null
          shared_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          platform?: string
          share_url?: string | null
          shared_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "badge_shares_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "music_achievements"
            referencedColumns: ["id"]
          },
        ]
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
      blockchain_backups: {
        Row: {
          backup_date: string
          block_count: number
          checksum: string
          created_at: string
          encryption_key_hash: string | null
          file_path: string
          file_size_bytes: number | null
          id: string
          metadata: Json | null
          restored_at: string | null
          status: string
        }
        Insert: {
          backup_date?: string
          block_count: number
          checksum: string
          created_at?: string
          encryption_key_hash?: string | null
          file_path: string
          file_size_bytes?: number | null
          id?: string
          metadata?: Json | null
          restored_at?: string | null
          status?: string
        }
        Update: {
          backup_date?: string
          block_count?: number
          checksum?: string
          created_at?: string
          encryption_key_hash?: string | null
          file_path?: string
          file_size_bytes?: number | null
          id?: string
          metadata?: Json | null
          restored_at?: string | null
          status?: string
        }
        Relationships: []
      }
      boss_grit_quests: {
        Row: {
          completed_at: string | null
          created_at: string | null
          difficulty: string | null
          elapsed_seconds: number | null
          id: string
          quest_description: string | null
          quest_title: string
          success: boolean | null
          tasks_completed: number | null
          total_tasks: number | null
          user_id: string | null
          xp_earned: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          difficulty?: string | null
          elapsed_seconds?: number | null
          id?: string
          quest_description?: string | null
          quest_title: string
          success?: boolean | null
          tasks_completed?: number | null
          total_tasks?: number | null
          user_id?: string | null
          xp_earned?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          difficulty?: string | null
          elapsed_seconds?: number | null
          id?: string
          quest_description?: string | null
          quest_title?: string
          success?: boolean | null
          tasks_completed?: number | null
          total_tasks?: number | null
          user_id?: string | null
          xp_earned?: number | null
        }
        Relationships: []
      }
      boss_grit_sessions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          difficulty: string | null
          elapsed_seconds: number | null
          id: string
          quest_description: string | null
          quest_title: string
          success: boolean | null
          tasks_completed: number | null
          total_tasks: number | null
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          difficulty?: string | null
          elapsed_seconds?: number | null
          id?: string
          quest_description?: string | null
          quest_title: string
          success?: boolean | null
          tasks_completed?: number | null
          total_tasks?: number | null
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          difficulty?: string | null
          elapsed_seconds?: number | null
          id?: string
          quest_description?: string | null
          quest_title?: string
          success?: boolean | null
          tasks_completed?: number | null
          total_tasks?: number | null
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: []
      }
      bounce_back_players: {
        Row: {
          avatar_emoji: string | null
          best_comeback: number | null
          current_streak: number | null
          display_name: string
          id: string
          is_eliminated: boolean | null
          joined_at: string
          resilience_score: number | null
          rounds_won: number | null
          tournament_id: string
          user_id: string
        }
        Insert: {
          avatar_emoji?: string | null
          best_comeback?: number | null
          current_streak?: number | null
          display_name: string
          id?: string
          is_eliminated?: boolean | null
          joined_at?: string
          resilience_score?: number | null
          rounds_won?: number | null
          tournament_id: string
          user_id: string
        }
        Update: {
          avatar_emoji?: string | null
          best_comeback?: number | null
          current_streak?: number | null
          display_name?: string
          id?: string
          is_eliminated?: boolean | null
          joined_at?: string
          resilience_score?: number | null
          rounds_won?: number | null
          tournament_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bounce_back_players_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "bounce_back_tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      bounce_back_rounds: {
        Row: {
          challenge_prompt: string
          challenge_type: string
          completions_count: number | null
          ended_at: string | null
          id: string
          participants_count: number | null
          round_number: number
          started_at: string | null
          time_limit_seconds: number | null
          tournament_id: string
        }
        Insert: {
          challenge_prompt: string
          challenge_type?: string
          completions_count?: number | null
          ended_at?: string | null
          id?: string
          participants_count?: number | null
          round_number: number
          started_at?: string | null
          time_limit_seconds?: number | null
          tournament_id: string
        }
        Update: {
          challenge_prompt?: string
          challenge_type?: string
          completions_count?: number | null
          ended_at?: string | null
          id?: string
          participants_count?: number | null
          round_number?: number
          started_at?: string | null
          time_limit_seconds?: number | null
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bounce_back_rounds_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "bounce_back_tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      bounce_back_submissions: {
        Row: {
          id: string
          player_id: string
          response: string
          round_id: string
          score: number | null
          submitted_at: string
          time_taken_seconds: number | null
        }
        Insert: {
          id?: string
          player_id: string
          response: string
          round_id: string
          score?: number | null
          submitted_at?: string
          time_taken_seconds?: number | null
        }
        Update: {
          id?: string
          player_id?: string
          response?: string
          round_id?: string
          score?: number | null
          submitted_at?: string
          time_taken_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bounce_back_submissions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "bounce_back_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bounce_back_submissions_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "bounce_back_rounds"
            referencedColumns: ["id"]
          },
        ]
      }
      bounce_back_tournaments: {
        Row: {
          created_at: string
          current_round: number | null
          description: string | null
          id: string
          max_players: number
          name: string
          phase: string
          prize_xp: number | null
          starts_at: string
          total_rounds: number | null
        }
        Insert: {
          created_at?: string
          current_round?: number | null
          description?: string | null
          id?: string
          max_players?: number
          name: string
          phase?: string
          prize_xp?: number | null
          starts_at?: string
          total_rounds?: number | null
        }
        Update: {
          created_at?: string
          current_round?: number | null
          description?: string | null
          id?: string
          max_players?: number
          name?: string
          phase?: string
          prize_xp?: number | null
          starts_at?: string
          total_rounds?: number | null
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
      brain_annotations: {
        Row: {
          annotation_type: string
          author_id: string | null
          content: string
          created_at: string
          id: string
          position: Json | null
          region_id: string | null
          scan_id: string
          updated_at: string
        }
        Insert: {
          annotation_type?: string
          author_id?: string | null
          content: string
          created_at?: string
          id?: string
          position?: Json | null
          region_id?: string | null
          scan_id: string
          updated_at?: string
        }
        Update: {
          annotation_type?: string
          author_id?: string | null
          content?: string
          created_at?: string
          id?: string
          position?: Json | null
          region_id?: string | null
          scan_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brain_annotations_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brain_annotations_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brain_annotations_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "brain_regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brain_annotations_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "brain_scans"
            referencedColumns: ["id"]
          },
        ]
      }
      brain_regions: {
        Row: {
          created_at: string
          default_color: string
          hemisphere: string | null
          id: string
          mesh_data: Json | null
          region_code: string
          region_name: string
          scan_id: string
          volume_mm3: number | null
        }
        Insert: {
          created_at?: string
          default_color?: string
          hemisphere?: string | null
          id?: string
          mesh_data?: Json | null
          region_code: string
          region_name: string
          scan_id: string
          volume_mm3?: number | null
        }
        Update: {
          created_at?: string
          default_color?: string
          hemisphere?: string | null
          id?: string
          mesh_data?: Json | null
          region_code?: string
          region_name?: string
          scan_id?: string
          volume_mm3?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "brain_regions_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "brain_scans"
            referencedColumns: ["id"]
          },
        ]
      }
      brain_scans: {
        Row: {
          created_at: string
          dimensions: number[] | null
          id: string
          is_anonymized: boolean | null
          mesh_file_path: string | null
          metadata: Json | null
          modality: string
          original_file_path: string | null
          patient_id: string
          series_description: string | null
          status: string
          study_date: string | null
          thumbnail_url: string | null
          updated_at: string
          voxel_size: number[] | null
        }
        Insert: {
          created_at?: string
          dimensions?: number[] | null
          id?: string
          is_anonymized?: boolean | null
          mesh_file_path?: string | null
          metadata?: Json | null
          modality: string
          original_file_path?: string | null
          patient_id: string
          series_description?: string | null
          status?: string
          study_date?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          voxel_size?: number[] | null
        }
        Update: {
          created_at?: string
          dimensions?: number[] | null
          id?: string
          is_anonymized?: boolean | null
          mesh_file_path?: string | null
          metadata?: Json | null
          modality?: string
          original_file_path?: string | null
          patient_id?: string
          series_description?: string | null
          status?: string
          study_date?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          voxel_size?: number[] | null
        }
        Relationships: [
          {
            foreignKeyName: "brain_scans_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brain_scans_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      brain_view_sessions: {
        Row: {
          duration_seconds: number | null
          emotions_overlaid: boolean | null
          ended_at: string | null
          export_formats: string[] | null
          id: string
          regions_viewed: string[] | null
          scan_id: string
          started_at: string
          user_id: string
        }
        Insert: {
          duration_seconds?: number | null
          emotions_overlaid?: boolean | null
          ended_at?: string | null
          export_formats?: string[] | null
          id?: string
          regions_viewed?: string[] | null
          scan_id: string
          started_at?: string
          user_id: string
        }
        Update: {
          duration_seconds?: number | null
          emotions_overlaid?: boolean | null
          ended_at?: string | null
          export_formats?: string[] | null
          id?: string
          regions_viewed?: string[] | null
          scan_id?: string
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brain_view_sessions_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "brain_scans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brain_view_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brain_view_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      breath_session_feedback: {
        Row: {
          created_at: string
          felt_calm: boolean | null
          felt_focused: boolean | null
          felt_relaxed: boolean | null
          id: string
          notes: string | null
          rating: number
          session_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          felt_calm?: boolean | null
          felt_focused?: boolean | null
          felt_relaxed?: boolean | null
          id?: string
          notes?: string | null
          rating: number
          session_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          felt_calm?: boolean | null
          felt_focused?: boolean | null
          felt_relaxed?: boolean | null
          id?: string
          notes?: string | null
          rating?: number
          session_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "breath_session_feedback_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "breathing_vr_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      breath_weekly_metrics: {
        Row: {
          coherence_avg: number | null
          created_at: string
          hrv_stress_idx: number | null
          id: string
          mindfulness_avg: number | null
          mood_score: number | null
          mvpa_week: number | null
          relax_idx: number | null
          updated_at: string
          user_id: string
          week_start: string
        }
        Insert: {
          coherence_avg?: number | null
          created_at?: string
          hrv_stress_idx?: number | null
          id?: string
          mindfulness_avg?: number | null
          mood_score?: number | null
          mvpa_week?: number | null
          relax_idx?: number | null
          updated_at?: string
          user_id: string
          week_start: string
        }
        Update: {
          coherence_avg?: number | null
          created_at?: string
          hrv_stress_idx?: number | null
          id?: string
          mindfulness_avg?: number | null
          mood_score?: number | null
          mvpa_week?: number | null
          relax_idx?: number | null
          updated_at?: string
          user_id?: string
          week_start?: string
        }
        Relationships: []
      }
      breath_weekly_org_metrics: {
        Row: {
          created_at: string
          id: string
          members: number | null
          org_coherence: number | null
          org_hrv_idx: number | null
          org_id: string
          org_mindfulness: number | null
          org_mood: number | null
          org_mvpa: number | null
          org_relax: number | null
          updated_at: string
          week_start: string
        }
        Insert: {
          created_at?: string
          id?: string
          members?: number | null
          org_coherence?: number | null
          org_hrv_idx?: number | null
          org_id: string
          org_mindfulness?: number | null
          org_mood?: number | null
          org_mvpa?: number | null
          org_relax?: number | null
          updated_at?: string
          week_start: string
        }
        Update: {
          created_at?: string
          id?: string
          members?: number | null
          org_coherence?: number | null
          org_hrv_idx?: number | null
          org_id?: string
          org_mindfulness?: number | null
          org_mood?: number | null
          org_mvpa?: number | null
          org_relax?: number | null
          updated_at?: string
          week_start?: string
        }
        Relationships: []
      }
      breathing_vr_sessions: {
        Row: {
          average_pace: number | null
          completed_at: string | null
          created_at: string
          cycles_completed: number | null
          duration_seconds: number
          id: string
          mood_after: number | null
          mood_before: number | null
          notes: string | null
          pattern: string
          started_at: string
          updated_at: string
          user_id: string
          vr_mode: boolean | null
        }
        Insert: {
          average_pace?: number | null
          completed_at?: string | null
          created_at?: string
          cycles_completed?: number | null
          duration_seconds: number
          id?: string
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          pattern: string
          started_at?: string
          updated_at?: string
          user_id: string
          vr_mode?: boolean | null
        }
        Update: {
          average_pace?: number | null
          completed_at?: string | null
          created_at?: string
          cycles_completed?: number | null
          duration_seconds?: number
          id?: string
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          pattern?: string
          started_at?: string
          updated_at?: string
          user_id?: string
          vr_mode?: boolean | null
        }
        Relationships: []
      }
      breathwork_sessions: {
        Row: {
          completion_rate: number | null
          created_at: string | null
          cycles_completed: number | null
          duration_seconds: number
          id: string
          pattern_name: string
          session_date: string | null
          user_id: string | null
        }
        Insert: {
          completion_rate?: number | null
          created_at?: string | null
          cycles_completed?: number | null
          duration_seconds: number
          id?: string
          pattern_name: string
          session_date?: string | null
          user_id?: string | null
        }
        Update: {
          completion_rate?: number | null
          created_at?: string | null
          cycles_completed?: number | null
          duration_seconds?: number
          id?: string
          pattern_name?: string
          session_date?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      bubble_beat_sessions: {
        Row: {
          average_heart_rate: number | null
          biometrics: Json | null
          bubbles_popped: number | null
          completed_at: string | null
          created_at: string
          difficulty: string | null
          duration_seconds: number | null
          game_mode: string | null
          id: string
          rhythm_accuracy: number | null
          score: number | null
          target_heart_rate: number | null
          user_id: string
        }
        Insert: {
          average_heart_rate?: number | null
          biometrics?: Json | null
          bubbles_popped?: number | null
          completed_at?: string | null
          created_at?: string
          difficulty?: string | null
          duration_seconds?: number | null
          game_mode?: string | null
          id?: string
          rhythm_accuracy?: number | null
          score?: number | null
          target_heart_rate?: number | null
          user_id: string
        }
        Update: {
          average_heart_rate?: number | null
          biometrics?: Json | null
          bubbles_popped?: number | null
          completed_at?: string | null
          created_at?: string
          difficulty?: string | null
          duration_seconds?: number | null
          game_mode?: string | null
          id?: string
          rhythm_accuracy?: number | null
          score?: number | null
          target_heart_rate?: number | null
          user_id?: string
        }
        Relationships: []
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
      buddy_activities: {
        Row: {
          activity_type: string
          completed_at: string | null
          created_at: string | null
          created_by: string
          description: string | null
          duration_minutes: number | null
          id: string
          match_id: string | null
          outcome_notes: string | null
          participants_mood_after: Json | null
          participants_mood_before: Json | null
          scheduled_at: string | null
          status: string | null
          title: string
          xp_reward: number | null
        }
        Insert: {
          activity_type: string
          completed_at?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          match_id?: string | null
          outcome_notes?: string | null
          participants_mood_after?: Json | null
          participants_mood_before?: Json | null
          scheduled_at?: string | null
          status?: string | null
          title: string
          xp_reward?: number | null
        }
        Update: {
          activity_type?: string
          completed_at?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          match_id?: string | null
          outcome_notes?: string | null
          participants_mood_after?: Json | null
          participants_mood_before?: Json | null
          scheduled_at?: string | null
          status?: string | null
          title?: string
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "buddy_activities_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "buddy_matches"
            referencedColumns: ["id"]
          },
        ]
      }
      buddy_matches: {
        Row: {
          compatibility_score: number | null
          created_at: string | null
          id: string
          initiated_by: string | null
          interaction_count: number | null
          last_interaction_at: string | null
          match_reason: string | null
          matched_at: string | null
          mutual_interests: string[] | null
          status: string | null
          user_id_1: string
          user_id_2: string
        }
        Insert: {
          compatibility_score?: number | null
          created_at?: string | null
          id?: string
          initiated_by?: string | null
          interaction_count?: number | null
          last_interaction_at?: string | null
          match_reason?: string | null
          matched_at?: string | null
          mutual_interests?: string[] | null
          status?: string | null
          user_id_1: string
          user_id_2: string
        }
        Update: {
          compatibility_score?: number | null
          created_at?: string | null
          id?: string
          initiated_by?: string | null
          interaction_count?: number | null
          last_interaction_at?: string | null
          match_reason?: string | null
          matched_at?: string | null
          mutual_interests?: string[] | null
          status?: string | null
          user_id_1?: string
          user_id_2?: string
        }
        Relationships: []
      }
      buddy_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          match_id: string | null
          message_type: string | null
          metadata: Json | null
          read_at: string | null
          receiver_id: string
          reply_to_id: string | null
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          match_id?: string | null
          message_type?: string | null
          metadata?: Json | null
          read_at?: string | null
          receiver_id: string
          reply_to_id?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          match_id?: string | null
          message_type?: string | null
          metadata?: Json | null
          read_at?: string | null
          receiver_id?: string
          reply_to_id?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "buddy_messages_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "buddy_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "buddy_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "buddy_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      buddy_profiles: {
        Row: {
          age_range: string | null
          availability_schedule: Json | null
          availability_status: string | null
          avatar_url: string | null
          badges: string[] | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          experience_level: string | null
          goals: string[] | null
          id: string
          interests: string[] | null
          is_premium: boolean | null
          is_verified: boolean | null
          is_visible: boolean | null
          languages: string[] | null
          last_active_at: string | null
          location: string | null
          looking_for: string[] | null
          mood_preference: string | null
          response_rate: number | null
          support_score: number | null
          timezone: string | null
          updated_at: string | null
          user_id: string
          xp_points: number | null
        }
        Insert: {
          age_range?: string | null
          availability_schedule?: Json | null
          availability_status?: string | null
          avatar_url?: string | null
          badges?: string[] | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          experience_level?: string | null
          goals?: string[] | null
          id?: string
          interests?: string[] | null
          is_premium?: boolean | null
          is_verified?: boolean | null
          is_visible?: boolean | null
          languages?: string[] | null
          last_active_at?: string | null
          location?: string | null
          looking_for?: string[] | null
          mood_preference?: string | null
          response_rate?: number | null
          support_score?: number | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
          xp_points?: number | null
        }
        Update: {
          age_range?: string | null
          availability_schedule?: Json | null
          availability_status?: string | null
          avatar_url?: string | null
          badges?: string[] | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          experience_level?: string | null
          goals?: string[] | null
          id?: string
          interests?: string[] | null
          is_premium?: boolean | null
          is_verified?: boolean | null
          is_visible?: boolean | null
          languages?: string[] | null
          last_active_at?: string | null
          location?: string | null
          looking_for?: string[] | null
          mood_preference?: string | null
          response_rate?: number | null
          support_score?: number | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
          xp_points?: number | null
        }
        Relationships: []
      }
      buddy_requests: {
        Row: {
          compatibility_score: number | null
          created_at: string | null
          expires_at: string | null
          from_user_id: string
          id: string
          message: string | null
          responded_at: string | null
          status: string | null
          to_user_id: string
        }
        Insert: {
          compatibility_score?: number | null
          created_at?: string | null
          expires_at?: string | null
          from_user_id: string
          id?: string
          message?: string | null
          responded_at?: string | null
          status?: string | null
          to_user_id: string
        }
        Update: {
          compatibility_score?: number | null
          created_at?: string | null
          expires_at?: string | null
          from_user_id?: string
          id?: string
          message?: string | null
          responded_at?: string | null
          status?: string | null
          to_user_id?: string
        }
        Relationships: []
      }
      buddy_sessions: {
        Row: {
          created_at: string | null
          duration_seconds: number | null
          ended_at: string | null
          id: string
          match_id: string | null
          metadata: Json | null
          notes: string | null
          quality_rating: number | null
          session_type: string
          started_at: string | null
          started_by: string
          xp_earned: number | null
        }
        Insert: {
          created_at?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          match_id?: string | null
          metadata?: Json | null
          notes?: string | null
          quality_rating?: number | null
          session_type: string
          started_at?: string | null
          started_by: string
          xp_earned?: number | null
        }
        Update: {
          created_at?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          match_id?: string | null
          metadata?: Json | null
          notes?: string | null
          quality_rating?: number | null
          session_type?: string
          started_at?: string | null
          started_by?: string
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "buddy_sessions_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "buddy_matches"
            referencedColumns: ["id"]
          },
        ]
      }
      buddy_stats: {
        Row: {
          average_response_time_minutes: number | null
          created_at: string | null
          current_streak_days: number | null
          id: string
          last_activity_at: string | null
          longest_streak_days: number | null
          total_activities_completed: number | null
          total_buddies: number | null
          total_messages_received: number | null
          total_messages_sent: number | null
          total_session_minutes: number | null
          total_sessions: number | null
          updated_at: string | null
          user_id: string
          xp_from_buddies: number | null
        }
        Insert: {
          average_response_time_minutes?: number | null
          created_at?: string | null
          current_streak_days?: number | null
          id?: string
          last_activity_at?: string | null
          longest_streak_days?: number | null
          total_activities_completed?: number | null
          total_buddies?: number | null
          total_messages_received?: number | null
          total_messages_sent?: number | null
          total_session_minutes?: number | null
          total_sessions?: number | null
          updated_at?: string | null
          user_id: string
          xp_from_buddies?: number | null
        }
        Update: {
          average_response_time_minutes?: number | null
          created_at?: string | null
          current_streak_days?: number | null
          id?: string
          last_activity_at?: string | null
          longest_streak_days?: number | null
          total_activities_completed?: number | null
          total_buddies?: number | null
          total_messages_received?: number | null
          total_messages_sent?: number | null
          total_session_minutes?: number | null
          total_sessions?: number | null
          updated_at?: string | null
          user_id?: string
          xp_from_buddies?: number | null
        }
        Relationships: []
      }
      cache_config: {
        Row: {
          cache_key: string
          created_at: string | null
          description: string | null
          hit_count: number | null
          id: string
          last_invalidated_at: string | null
          miss_count: number | null
          ttl_seconds: number
          updated_at: string | null
        }
        Insert: {
          cache_key: string
          created_at?: string | null
          description?: string | null
          hit_count?: number | null
          id?: string
          last_invalidated_at?: string | null
          miss_count?: number | null
          ttl_seconds: number
          updated_at?: string | null
        }
        Update: {
          cache_key?: string
          created_at?: string | null
          description?: string | null
          hit_count?: number | null
          id?: string
          last_invalidated_at?: string | null
          miss_count?: number | null
          ttl_seconds?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      cache_metrics: {
        Row: {
          cache_key: string
          created_at: string | null
          id: string
          operation: string
          response_time_ms: number | null
        }
        Insert: {
          cache_key: string
          created_at?: string | null
          id?: string
          operation: string
          response_time_ms?: number | null
        }
        Update: {
          cache_key?: string
          created_at?: string | null
          id?: string
          operation?: string
          response_time_ms?: number | null
        }
        Relationships: []
      }
      campaign_consents: {
        Row: {
          campaign_id: string
          can_contact: boolean
          consent_preference_id: string | null
          consent_validated_at: string
          id: string
          user_id: string
          validation_notes: string | null
        }
        Insert: {
          campaign_id: string
          can_contact?: boolean
          consent_preference_id?: string | null
          consent_validated_at?: string
          id?: string
          user_id: string
          validation_notes?: string | null
        }
        Update: {
          campaign_id?: string
          can_contact?: boolean
          consent_preference_id?: string | null
          consent_validated_at?: string
          id?: string
          user_id?: string
          validation_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_consents_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_consents_consent_preference_id_fkey"
            columns: ["consent_preference_id"]
            isOneToOne: false
            referencedRelation: "user_consent_preferences"
            referencedColumns: ["id"]
          },
        ]
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
      clinical_case_history: {
        Row: {
          case_id: string
          completed_at: string | null
          completed_steps: string[] | null
          correct_answers: number | null
          created_at: string | null
          decisions: Json | null
          id: string
          score: number | null
          started_at: string | null
          total_answers: number | null
          user_id: string
        }
        Insert: {
          case_id: string
          completed_at?: string | null
          completed_steps?: string[] | null
          correct_answers?: number | null
          created_at?: string | null
          decisions?: Json | null
          id?: string
          score?: number | null
          started_at?: string | null
          total_answers?: number | null
          user_id: string
        }
        Update: {
          case_id?: string
          completed_at?: string | null
          completed_steps?: string[] | null
          correct_answers?: number | null
          created_at?: string | null
          decisions?: Json | null
          id?: string
          score?: number | null
          started_at?: string | null
          total_answers?: number | null
          user_id?: string
        }
        Relationships: []
      }
      clinical_case_progress: {
        Row: {
          answers: Json | null
          case_id: string
          completed_at: string | null
          created_at: string
          current_step: number | null
          feedback: Json | null
          id: string
          score: number | null
          started_at: string
          user_id: string
        }
        Insert: {
          answers?: Json | null
          case_id: string
          completed_at?: string | null
          created_at?: string
          current_step?: number | null
          feedback?: Json | null
          id?: string
          score?: number | null
          started_at?: string
          user_id: string
        }
        Update: {
          answers?: Json | null
          case_id?: string
          completed_at?: string | null
          created_at?: string
          current_step?: number | null
          feedback?: Json | null
          id?: string
          score?: number | null
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinical_case_progress_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "clinical_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      clinical_cases: {
        Row: {
          created_at: string
          difficulty: string
          estimated_duration_minutes: number | null
          id: string
          is_published: boolean | null
          learning_objectives: string[] | null
          patient_presentation: Json
          related_items: string[] | null
          specialty: string
          steps: Json
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          difficulty?: string
          estimated_duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          learning_objectives?: string[] | null
          patient_presentation: Json
          related_items?: string[] | null
          specialty: string
          steps: Json
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          difficulty?: string
          estimated_duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          learning_objectives?: string[] | null
          patient_presentation?: Json
          related_items?: string[] | null
          specialty?: string
          steps?: Json
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      clinical_cases_history: {
        Row: {
          case_id: string
          completed_at: string | null
          completed_steps: string[] | null
          correct_answers: number | null
          created_at: string | null
          decisions: Json | null
          id: string
          started_at: string | null
          total_answers: number | null
          user_id: string
        }
        Insert: {
          case_id: string
          completed_at?: string | null
          completed_steps?: string[] | null
          correct_answers?: number | null
          created_at?: string | null
          decisions?: Json | null
          id?: string
          started_at?: string | null
          total_answers?: number | null
          user_id: string
        }
        Update: {
          case_id?: string
          completed_at?: string | null
          completed_steps?: string[] | null
          correct_answers?: number | null
          created_at?: string | null
          decisions?: Json | null
          id?: string
          started_at?: string | null
          total_answers?: number | null
          user_id?: string
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
      clinical_optins: {
        Row: {
          created_at: string
          id: string
          revoked_at: string | null
          scope: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          revoked_at?: string | null
          scope: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          revoked_at?: string | null
          scope?: string
          user_id?: string
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
      coach_memory: {
        Row: {
          content: string
          created_at: string | null
          expires_at: string | null
          id: string
          importance_score: number | null
          memory_type: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          importance_score?: number | null
          memory_type?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          importance_score?: number | null
          memory_type?: string
          metadata?: Json | null
          user_id?: string | null
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
      code_quality_reports: {
        Row: {
          analyzed_at: string | null
          bugs: number | null
          code_smells: number | null
          coverage: number | null
          duplications: number | null
          file_path: string
          id: string
          issues: Json | null
          maintainability_rating: string | null
          security_rating: string | null
          vulnerabilities: number | null
        }
        Insert: {
          analyzed_at?: string | null
          bugs?: number | null
          code_smells?: number | null
          coverage?: number | null
          duplications?: number | null
          file_path: string
          id?: string
          issues?: Json | null
          maintainability_rating?: string | null
          security_rating?: string | null
          vulnerabilities?: number | null
        }
        Update: {
          analyzed_at?: string | null
          bugs?: number | null
          code_smells?: number | null
          coverage?: number | null
          duplications?: number | null
          file_path?: string
          id?: string
          issues?: Json | null
          maintainability_rating?: string | null
          security_rating?: string | null
          vulnerabilities?: number | null
        }
        Relationships: []
      }
      collaborative_playlist_members: {
        Row: {
          id: string
          joined_at: string
          playlist_id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          playlist_id: string
          role?: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          playlist_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaborative_playlist_members_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "collaborative_playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      collaborative_playlist_tracks: {
        Row: {
          added_by: string
          artist: string | null
          audio_url: string | null
          created_at: string
          duration: number | null
          id: string
          playlist_id: string
          position: number | null
          title: string
          votes_down: number | null
          votes_up: number | null
        }
        Insert: {
          added_by: string
          artist?: string | null
          audio_url?: string | null
          created_at?: string
          duration?: number | null
          id?: string
          playlist_id: string
          position?: number | null
          title: string
          votes_down?: number | null
          votes_up?: number | null
        }
        Update: {
          added_by?: string
          artist?: string | null
          audio_url?: string | null
          created_at?: string
          duration?: number | null
          id?: string
          playlist_id?: string
          position?: number | null
          title?: string
          votes_down?: number | null
          votes_up?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "collaborative_playlist_tracks_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "collaborative_playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      collaborative_playlists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          invite_code: string | null
          is_public: boolean
          max_collaborators: number | null
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          invite_code?: string | null
          is_public?: boolean
          max_collaborators?: number | null
          name: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          invite_code?: string | null
          is_public?: boolean
          max_collaborators?: number | null
          name?: string
          owner_id?: string
          updated_at?: string
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
      community_group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string | null
          last_activity_at: string | null
          role: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string | null
          last_activity_at?: string | null
          role?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string | null
          last_activity_at?: string | null
          role?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "community_groups"
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
      community_mentions: {
        Row: {
          comment_id: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          mentioned_by: string
          mentioned_user_id: string
          post_id: string | null
        }
        Insert: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          mentioned_by: string
          mentioned_user_id: string
          post_id?: string | null
        }
        Update: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          mentioned_by?: string
          mentioned_user_id?: string
          post_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_mentions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "community_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_mentions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          author_id: string
          category: string | null
          comments_count: number | null
          content: string
          created_at: string | null
          group_id: string | null
          has_empathy_response: boolean | null
          id: string
          is_anonymous: boolean | null
          is_featured: boolean | null
          likes_count: number | null
          location: string | null
          media_urls: string[] | null
          moderation_status: string | null
          mood_halo: string | null
          reply_count: number | null
          shares_count: number | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string | null
          views_count: number | null
        }
        Insert: {
          author_id: string
          category?: string | null
          comments_count?: number | null
          content: string
          created_at?: string | null
          group_id?: string | null
          has_empathy_response?: boolean | null
          id?: string
          is_anonymous?: boolean | null
          is_featured?: boolean | null
          likes_count?: number | null
          location?: string | null
          media_urls?: string[] | null
          moderation_status?: string | null
          mood_halo?: string | null
          reply_count?: number | null
          shares_count?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id?: string | null
          views_count?: number | null
        }
        Update: {
          author_id?: string
          category?: string | null
          comments_count?: number | null
          content?: string
          created_at?: string | null
          group_id?: string | null
          has_empathy_response?: boolean | null
          id?: string
          is_anonymous?: boolean | null
          is_featured?: boolean | null
          likes_count?: number | null
          location?: string | null
          media_urls?: string[] | null
          moderation_status?: string | null
          mood_halo?: string | null
          reply_count?: number | null
          shares_count?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
          views_count?: number | null
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
      community_presets: {
        Row: {
          category: string | null
          created_at: string
          creator_id: string
          creator_name: string
          description: string | null
          downloads_count: number | null
          id: string
          is_featured: boolean | null
          is_public: boolean | null
          likes_count: number | null
          name: string
          preset_data: Json
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          creator_id: string
          creator_name: string
          description?: string | null
          downloads_count?: number | null
          id?: string
          is_featured?: boolean | null
          is_public?: boolean | null
          likes_count?: number | null
          name: string
          preset_data?: Json
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          creator_id?: string
          creator_name?: string
          description?: string | null
          downloads_count?: number | null
          id?: string
          is_featured?: boolean | null
          is_public?: boolean | null
          likes_count?: number | null
          name?: string
          preset_data?: Json
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      community_reports: {
        Row: {
          comment_id: string | null
          created_at: string | null
          description: string | null
          id: string
          post_id: string | null
          reason: string
          reported_user_id: string | null
          reporter_id: string
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          comment_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          post_id?: string | null
          reason: string
          reported_user_id?: string | null
          reporter_id: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          comment_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          post_id?: string | null
          reason?: string
          reported_user_id?: string | null
          reporter_id?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_reports_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "community_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_reports_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
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
      community_saved_posts: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_saved_posts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_trending_tags: {
        Row: {
          created_at: string | null
          id: string
          last_used_at: string | null
          tag: string
          usage_count: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_used_at?: string | null
          tag: string
          usage_count?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_used_at?: string | null
          tag?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      competitive_seasons: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          is_active: boolean | null
          name: string
          season_number: number
          start_date: string
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          name: string
          season_number: number
          start_date: string
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          name?: string
          season_number?: number
          start_date?: string
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
      compliance_audits: {
        Row: {
          audit_date: string
          audit_type: string
          completed_at: string | null
          created_at: string
          id: string
          metadata: Json | null
          overall_score: number
          report_url: string | null
          status: string
          triggered_by: string | null
        }
        Insert: {
          audit_date?: string
          audit_type?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          overall_score?: number
          report_url?: string | null
          status?: string
          triggered_by?: string | null
        }
        Update: {
          audit_date?: string
          audit_type?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          overall_score?: number
          report_url?: string | null
          status?: string
          triggered_by?: string | null
        }
        Relationships: []
      }
      compliance_categories: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          max_score: number
          name: string
          weight: number
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          max_score?: number
          name: string
          weight?: number
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          max_score?: number
          name?: string
          weight?: number
        }
        Relationships: []
      }
      compliance_checks: {
        Row: {
          category_id: string
          check_code: string
          check_name: string
          created_at: string
          description: string | null
          expected_result: string | null
          id: string
          is_active: boolean
          query_function: string | null
        }
        Insert: {
          category_id: string
          check_code: string
          check_name: string
          created_at?: string
          description?: string | null
          expected_result?: string | null
          id?: string
          is_active?: boolean
          query_function?: string | null
        }
        Update: {
          category_id?: string
          check_code?: string
          check_name?: string
          created_at?: string
          description?: string | null
          expected_result?: string | null
          id?: string
          is_active?: boolean
          query_function?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_checks_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "compliance_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_recommendations: {
        Row: {
          audit_id: string
          category_id: string | null
          created_at: string
          description: string
          id: string
          impact: string | null
          priority: number
          remediation: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          status: string
          title: string
        }
        Insert: {
          audit_id: string
          category_id?: string | null
          created_at?: string
          description: string
          id?: string
          impact?: string | null
          priority?: number
          remediation?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          status?: string
          title: string
        }
        Update: {
          audit_id?: string
          category_id?: string | null
          created_at?: string
          description?: string
          id?: string
          impact?: string | null
          priority?: number
          remediation?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_recommendations_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "compliance_audits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_recommendations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "compliance_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_reports: {
        Row: {
          created_at: string
          email_sent: boolean | null
          email_sent_at: string | null
          generated_at: string
          html_content: string | null
          id: string
          metadata: Json | null
          pdf_url: string | null
          period_end: string
          period_start: string
          report_type: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email_sent?: boolean | null
          email_sent_at?: string | null
          generated_at?: string
          html_content?: string | null
          id?: string
          metadata?: Json | null
          pdf_url?: string | null
          period_end: string
          period_start: string
          report_type: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email_sent?: boolean | null
          email_sent_at?: string | null
          generated_at?: string
          html_content?: string | null
          id?: string
          metadata?: Json | null
          pdf_url?: string | null
          period_end?: string
          period_start?: string
          report_type?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      compliance_scores: {
        Row: {
          affected_areas: string[] | null
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          impact: number | null
          previous_score: number | null
          score: number
          user_id: string | null
        }
        Insert: {
          affected_areas?: string[] | null
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          impact?: number | null
          previous_score?: number | null
          score: number
          user_id?: string | null
        }
        Update: {
          affected_areas?: string[] | null
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          impact?: number | null
          previous_score?: number | null
          score?: number
          user_id?: string | null
        }
        Relationships: []
      }
      consent_channels: {
        Row: {
          channel_code: string
          channel_name: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
        }
        Insert: {
          channel_code: string
          channel_name: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
        }
        Update: {
          channel_code?: string
          channel_name?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
        }
        Relationships: []
      }
      consent_history: {
        Row: {
          change_type: string
          channel_id: string
          consent_type: string | null
          consent_version: string | null
          created_at: string
          granted: boolean | null
          id: string
          ip_address: unknown
          metadata: Json | null
          new_consent: boolean
          notes: string | null
          previous_consent: boolean | null
          purpose_id: string
          source: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          change_type: string
          channel_id: string
          consent_type?: string | null
          consent_version?: string | null
          created_at?: string
          granted?: boolean | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          new_consent: boolean
          notes?: string | null
          previous_consent?: boolean | null
          purpose_id: string
          source?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          change_type?: string
          channel_id?: string
          consent_type?: string | null
          consent_version?: string | null
          created_at?: string
          granted?: boolean | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          new_consent?: boolean
          notes?: string | null
          previous_consent?: boolean | null
          purpose_id?: string
          source?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consent_history_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "consent_channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consent_history_purpose_id_fkey"
            columns: ["purpose_id"]
            isOneToOne: false
            referencedRelation: "consent_purposes"
            referencedColumns: ["id"]
          },
        ]
      }
      consent_purposes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_required: boolean
          legal_basis: string | null
          purpose_code: string
          purpose_name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_required?: boolean
          legal_basis?: string | null
          purpose_code: string
          purpose_name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_required?: boolean
          legal_basis?: string | null
          purpose_code?: string
          purpose_name?: string
        }
        Relationships: []
      }
      consent_records: {
        Row: {
          analytics_consent: boolean | null
          audio_consent: boolean | null
          consent_version: string
          created_at: string | null
          data_sharing_consent: boolean | null
          data_storage_consent: boolean | null
          emotion_analysis_consent: boolean | null
          id: string
          ip_address: string | null
          marketing_consent: boolean | null
          updated_at: string | null
          user_agent: string | null
          user_id: string
          video_consent: boolean | null
        }
        Insert: {
          analytics_consent?: boolean | null
          audio_consent?: boolean | null
          consent_version?: string
          created_at?: string | null
          data_sharing_consent?: boolean | null
          data_storage_consent?: boolean | null
          emotion_analysis_consent?: boolean | null
          id?: string
          ip_address?: string | null
          marketing_consent?: boolean | null
          updated_at?: string | null
          user_agent?: string | null
          user_id: string
          video_consent?: boolean | null
        }
        Update: {
          analytics_consent?: boolean | null
          audio_consent?: boolean | null
          consent_version?: string
          created_at?: string | null
          data_sharing_consent?: boolean | null
          data_storage_consent?: boolean | null
          emotion_analysis_consent?: boolean | null
          id?: string
          ip_address?: string | null
          marketing_consent?: boolean | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string
          video_consent?: boolean | null
        }
        Relationships: []
      }
      crisis_alerts: {
        Row: {
          acknowledged_at: string | null
          created_at: string
          crisis_score: number | null
          detected_at: string
          id: string
          indicators: Json | null
          message_snippet: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          acknowledged_at?: string | null
          created_at?: string
          crisis_score?: number | null
          detected_at?: string
          id?: string
          indicators?: Json | null
          message_snippet?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          acknowledged_at?: string | null
          created_at?: string
          crisis_score?: number | null
          detected_at?: string
          id?: string
          indicators?: Json | null
          message_snippet?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      csrf_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          token: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          token: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
          user_id?: string | null
        }
        Relationships: []
      }
      custom_challenges: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          emotional_profile: string
          end_date: string | null
          id: string
          is_active: boolean | null
          objective: string
          reward_type: string
          reward_value: Json
          start_date: string | null
          target_value: number | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          emotional_profile: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          objective: string
          reward_type: string
          reward_value: Json
          start_date?: string | null
          target_value?: number | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          emotional_profile?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          objective?: string
          reward_type?: string
          reward_value?: Json
          start_date?: string | null
          target_value?: number | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cvss_assessments: {
        Row: {
          assessed_at: string | null
          assessed_by: string | null
          attack_complexity: string
          attack_vector: string
          availability_impact: string
          availability_requirement: string | null
          base_score: number | null
          base_severity: string | null
          confidentiality_impact: string
          confidentiality_requirement: string | null
          created_at: string | null
          cve_id: string | null
          description: string | null
          environmental_score: number | null
          exploit_code_maturity: string | null
          id: string
          integrity_impact: string
          integrity_requirement: string | null
          notes: string | null
          patch_deadline: string | null
          patch_priority: number | null
          patched: boolean | null
          privileges_required: string
          remediation_level: string | null
          report_confidence: string | null
          scope: string
          temporal_score: number | null
          updated_at: string | null
          user_interaction: string
          vector_string: string | null
          vulnerability_name: string
        }
        Insert: {
          assessed_at?: string | null
          assessed_by?: string | null
          attack_complexity: string
          attack_vector: string
          availability_impact: string
          availability_requirement?: string | null
          base_score?: number | null
          base_severity?: string | null
          confidentiality_impact: string
          confidentiality_requirement?: string | null
          created_at?: string | null
          cve_id?: string | null
          description?: string | null
          environmental_score?: number | null
          exploit_code_maturity?: string | null
          id?: string
          integrity_impact: string
          integrity_requirement?: string | null
          notes?: string | null
          patch_deadline?: string | null
          patch_priority?: number | null
          patched?: boolean | null
          privileges_required: string
          remediation_level?: string | null
          report_confidence?: string | null
          scope: string
          temporal_score?: number | null
          updated_at?: string | null
          user_interaction: string
          vector_string?: string | null
          vulnerability_name: string
        }
        Update: {
          assessed_at?: string | null
          assessed_by?: string | null
          attack_complexity?: string
          attack_vector?: string
          availability_impact?: string
          availability_requirement?: string | null
          base_score?: number | null
          base_severity?: string | null
          confidentiality_impact?: string
          confidentiality_requirement?: string | null
          created_at?: string | null
          cve_id?: string | null
          description?: string | null
          environmental_score?: number | null
          exploit_code_maturity?: string | null
          id?: string
          integrity_impact?: string
          integrity_requirement?: string | null
          notes?: string | null
          patch_deadline?: string | null
          patch_priority?: number | null
          patched?: boolean | null
          privileges_required?: string
          remediation_level?: string | null
          report_confidence?: string | null
          scope?: string
          temporal_score?: number | null
          updated_at?: string | null
          user_interaction?: string
          vector_string?: string | null
          vulnerability_name?: string
        }
        Relationships: []
      }
      daily_challenge_progress: {
        Row: {
          challenge_id: string | null
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          progress: number | null
          user_id: string
          xp_claimed: boolean | null
        }
        Insert: {
          challenge_id?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          progress?: number | null
          user_id: string
          xp_claimed?: boolean | null
        }
        Update: {
          challenge_id?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          progress?: number | null
          user_id?: string
          xp_claimed?: boolean | null
        }
        Relationships: []
      }
      daily_challenges: {
        Row: {
          challenge_date: string
          created_at: string | null
          emotional_profile: string | null
          id: string
          objective: string
          reward_type: string
          reward_value: Json
          type: string
        }
        Insert: {
          challenge_date?: string
          created_at?: string | null
          emotional_profile?: string | null
          id?: string
          objective: string
          reward_type: string
          reward_value: Json
          type: string
        }
        Update: {
          challenge_date?: string
          created_at?: string | null
          emotional_profile?: string | null
          id?: string
          objective?: string
          reward_type?: string
          reward_value?: Json
          type?: string
        }
        Relationships: []
      }
      daily_mood_heatmap: {
        Row: {
          activity_count: number | null
          created_at: string
          date: string
          dominant_emotion: string | null
          hour: number | null
          id: string
          mood_score: number | null
          user_id: string
        }
        Insert: {
          activity_count?: number | null
          created_at?: string
          date: string
          dominant_emotion?: string | null
          hour?: number | null
          id?: string
          mood_score?: number | null
          user_id: string
        }
        Update: {
          activity_count?: number | null
          created_at?: string
          date?: string
          dominant_emotion?: string | null
          hour?: number | null
          id?: string
          mood_score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      data_archives: {
        Row: {
          archived_at: string
          deleted_at: string | null
          entity_id: string
          entity_type: string
          expires_at: string
          id: string
          original_data: Json
          reason: string | null
          user_id: string
        }
        Insert: {
          archived_at?: string
          deleted_at?: string | null
          entity_id: string
          entity_type: string
          expires_at: string
          id?: string
          original_data: Json
          reason?: string | null
          user_id: string
        }
        Update: {
          archived_at?: string
          deleted_at?: string | null
          entity_id?: string
          entity_type?: string
          expires_at?: string
          id?: string
          original_data?: Json
          reason?: string | null
          user_id?: string
        }
        Relationships: []
      }
      data_export_logs: {
        Row: {
          export_type: string | null
          exported_at: string
          id: string
          sections_exported: string[] | null
          user_id: string
        }
        Insert: {
          export_type?: string | null
          exported_at?: string
          id?: string
          sections_exported?: string[] | null
          user_id: string
        }
        Update: {
          export_type?: string | null
          exported_at?: string
          id?: string
          sections_exported?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      data_exports: {
        Row: {
          completed_at: string | null
          expires_at: string | null
          export_type: string
          file_size_bytes: number | null
          file_url: string | null
          id: string
          metadata: Json | null
          requested_at: string
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          expires_at?: string | null
          export_type?: string
          file_size_bytes?: number | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          requested_at?: string
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          expires_at?: string | null
          export_type?: string
          file_size_bytes?: number | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
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
      data_retention_rules: {
        Row: {
          archive_enabled: boolean
          auto_delete_enabled: boolean
          created_at: string
          created_by: string | null
          entity_type: string
          id: string
          notification_days_before: number
          retention_days: number
          updated_at: string
        }
        Insert: {
          archive_enabled?: boolean
          auto_delete_enabled?: boolean
          created_at?: string
          created_by?: string | null
          entity_type: string
          id?: string
          notification_days_before?: number
          retention_days?: number
          updated_at?: string
        }
        Update: {
          archive_enabled?: boolean
          auto_delete_enabled?: boolean
          created_at?: string
          created_by?: string | null
          entity_type?: string
          id?: string
          notification_days_before?: number
          retention_days?: number
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
      direct_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      dsar_approvals: {
        Row: {
          approval_level: number
          approver_id: string
          created_at: string
          decided_at: string | null
          decision_notes: string | null
          id: string
          request_id: string
          status: string
        }
        Insert: {
          approval_level?: number
          approver_id: string
          created_at?: string
          decided_at?: string | null
          decision_notes?: string | null
          id?: string
          request_id: string
          status?: string
        }
        Update: {
          approval_level?: number
          approver_id?: string
          created_at?: string
          decided_at?: string | null
          decision_notes?: string | null
          id?: string
          request_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "dsar_approvals_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "dsar_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      dsar_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          completed_at: string | null
          created_at: string
          id: string
          justification: string | null
          legal_deadline: string
          notes: string | null
          package_url: string | null
          priority: string
          request_type: string
          requested_data: Json | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          justification?: string | null
          legal_deadline: string
          notes?: string | null
          package_url?: string | null
          priority?: string
          request_type: string
          requested_data?: Json | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          justification?: string | null
          legal_deadline?: string
          notes?: string | null
          package_url?: string | null
          priority?: string
          request_type?: string
          requested_data?: Json | null
          status?: string
          updated_at?: string
          user_id?: string
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
          category: string | null
          color: string | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          duration_min: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          is_premium: boolean | null
          item_number: number | null
          metadata: Json | null
          order_index: number | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration_min?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          item_number?: number | null
          metadata?: Json | null
          order_index?: number | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration_min?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          item_number?: number | null
          metadata?: Json | null
          order_index?: number | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      edn_items_audit: {
        Row: {
          ai_analysis: Json | null
          audit_date: string
          competence_details: Json | null
          completeness_score: number | null
          created_at: string
          error_message: string | null
          expected_competences_rang_a: string[] | null
          expected_competences_rang_b: string[] | null
          id: string
          incomplete_rang_a: string[] | null
          incomplete_rang_b: string[] | null
          item_code: string
          missing_rang_a: string[] | null
          missing_rang_b: string[] | null
          rang_a_complete: boolean | null
          rang_b_complete: boolean | null
          status: string | null
          suggestions: string | null
          updated_at: string
        }
        Insert: {
          ai_analysis?: Json | null
          audit_date?: string
          competence_details?: Json | null
          completeness_score?: number | null
          created_at?: string
          error_message?: string | null
          expected_competences_rang_a?: string[] | null
          expected_competences_rang_b?: string[] | null
          id?: string
          incomplete_rang_a?: string[] | null
          incomplete_rang_b?: string[] | null
          item_code: string
          missing_rang_a?: string[] | null
          missing_rang_b?: string[] | null
          rang_a_complete?: boolean | null
          rang_b_complete?: boolean | null
          status?: string | null
          suggestions?: string | null
          updated_at?: string
        }
        Update: {
          ai_analysis?: Json | null
          audit_date?: string
          competence_details?: Json | null
          completeness_score?: number | null
          created_at?: string
          error_message?: string | null
          expected_competences_rang_a?: string[] | null
          expected_competences_rang_b?: string[] | null
          id?: string
          incomplete_rang_a?: string[] | null
          incomplete_rang_b?: string[] | null
          item_code?: string
          missing_rang_a?: string[] | null
          missing_rang_b?: string[] | null
          rang_a_complete?: boolean | null
          rang_b_complete?: boolean | null
          status?: string | null
          suggestions?: string | null
          updated_at?: string
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
          bd_panels: Json | null
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
          roman_story: Json | null
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
          bd_panels?: Json | null
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
          roman_story?: Json | null
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
          bd_panels?: Json | null
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
          roman_story?: Json | null
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
      email_logs: {
        Row: {
          created_at: string
          id: string
          recipients: string[]
          report_data: Json | null
          resend_id: string | null
          sent_at: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          recipients: string[]
          report_data?: Json | null
          resend_id?: string | null
          sent_at?: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          recipients?: string[]
          report_data?: Json | null
          resend_id?: string | null
          sent_at?: string
          type?: string
        }
        Relationships: []
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
      emotion_assets: {
        Row: {
          ambient_config: Json | null
          base_price: number | null
          created_at: string | null
          creator_id: string | null
          current_price: number | null
          demand_score: number | null
          description: string | null
          emotion_type: string
          id: string
          intensity: number | null
          is_premium: boolean | null
          music_config: Json | null
          name: string
          total_purchases: number | null
          updated_at: string | null
        }
        Insert: {
          ambient_config?: Json | null
          base_price?: number | null
          created_at?: string | null
          creator_id?: string | null
          current_price?: number | null
          demand_score?: number | null
          description?: string | null
          emotion_type: string
          id?: string
          intensity?: number | null
          is_premium?: boolean | null
          music_config?: Json | null
          name: string
          total_purchases?: number | null
          updated_at?: string | null
        }
        Update: {
          ambient_config?: Json | null
          base_price?: number | null
          created_at?: string | null
          creator_id?: string | null
          current_price?: number | null
          demand_score?: number | null
          description?: string | null
          emotion_type?: string
          id?: string
          intensity?: number | null
          is_premium?: boolean | null
          music_config?: Json | null
          name?: string
          total_purchases?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      emotion_brain_mappings: {
        Row: {
          created_at: string
          hume_session_id: string | null
          id: string
          mappings: Json
          patient_id: string
          scan_id: string | null
          source: string | null
          timestamp: string
        }
        Insert: {
          created_at?: string
          hume_session_id?: string | null
          id?: string
          mappings?: Json
          patient_id: string
          scan_id?: string | null
          source?: string | null
          timestamp?: string
        }
        Update: {
          created_at?: string
          hume_session_id?: string | null
          id?: string
          mappings?: Json
          patient_id?: string
          scan_id?: string | null
          source?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "emotion_brain_mappings_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emotion_brain_mappings_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emotion_brain_mappings_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "brain_scans"
            referencedColumns: ["id"]
          },
        ]
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
      emotion_generations: {
        Row: {
          created_at: string | null
          metadata: Json | null
          prompt: string | null
          status: string
          task_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          metadata?: Json | null
          prompt?: string | null
          status?: string
          task_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          metadata?: Json | null
          prompt?: string | null
          status?: string
          task_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      emotion_market_history: {
        Row: {
          asset_id: string | null
          id: string
          price: number
          recorded_at: string | null
          volume: number | null
        }
        Insert: {
          asset_id?: string | null
          id?: string
          price: number
          recorded_at?: string | null
          volume?: number | null
        }
        Update: {
          asset_id?: string | null
          id?: string
          price?: number
          recorded_at?: string | null
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "emotion_market_history_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "emotion_assets"
            referencedColumns: ["id"]
          },
        ]
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
      emotion_patterns: {
        Row: {
          created_at: string | null
          dominant_emotions: Json
          emotion_trends: Json | null
          id: string
          trigger_patterns: Json | null
          user_id: string
          week_end: string
          week_start: string
        }
        Insert: {
          created_at?: string | null
          dominant_emotions: Json
          emotion_trends?: Json | null
          id?: string
          trigger_patterns?: Json | null
          user_id: string
          week_end: string
          week_start: string
        }
        Update: {
          created_at?: string | null
          dominant_emotions?: Json
          emotion_trends?: Json | null
          id?: string
          trigger_patterns?: Json | null
          user_id?: string
          week_end?: string
          week_start?: string
        }
        Relationships: []
      }
      emotion_portfolio: {
        Row: {
          acquired_at: string | null
          acquired_price: number | null
          asset_id: string | null
          id: string
          last_used_at: string | null
          quantity: number | null
          user_id: string
        }
        Insert: {
          acquired_at?: string | null
          acquired_price?: number | null
          asset_id?: string | null
          id?: string
          last_used_at?: string | null
          quantity?: number | null
          user_id: string
        }
        Update: {
          acquired_at?: string | null
          acquired_price?: number | null
          asset_id?: string | null
          id?: string
          last_used_at?: string | null
          quantity?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emotion_portfolio_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "emotion_assets"
            referencedColumns: ["id"]
          },
        ]
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
      emotion_tracks: {
        Row: {
          created_at: string | null
          duration_seconds: number | null
          emotion_label: string | null
          id: string
          metadata: Json | null
          source: string | null
          storage_path: string | null
          task_id: string | null
          title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          duration_seconds?: number | null
          emotion_label?: string | null
          id?: string
          metadata?: Json | null
          source?: string | null
          storage_path?: string | null
          task_id?: string | null
          title?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          duration_seconds?: number | null
          emotion_label?: string | null
          id?: string
          metadata?: Json | null
          source?: string | null
          storage_path?: string | null
          task_id?: string | null
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      emotion_transactions: {
        Row: {
          asset_id: string | null
          created_at: string | null
          id: string
          price_per_unit: number | null
          quantity: number | null
          total_price: number | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          asset_id?: string | null
          created_at?: string | null
          id?: string
          price_per_unit?: number | null
          quantity?: number | null
          total_price?: number | null
          transaction_type: string
          user_id: string
        }
        Update: {
          asset_id?: string | null
          created_at?: string | null
          id?: string
          price_per_unit?: number | null
          quantity?: number | null
          total_price?: number | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emotion_transactions_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "emotion_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      emotional_boosts: {
        Row: {
          active: boolean
          boost_type: string
          content: Json | null
          created_at: string
          description: string
          duration_minutes: number
          energy_restore: number
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          active?: boolean
          boost_type: string
          content?: Json | null
          created_at?: string
          description: string
          duration_minutes?: number
          energy_restore?: number
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          active?: boolean
          boost_type?: string
          content?: Json | null
          created_at?: string
          description?: string
          duration_minutes?: number
          energy_restore?: number
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      emotional_scan_results: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          emotions_detected: Json
          id: string
          scan_data: Json
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          emotions_detected?: Json
          id?: string
          scan_data?: Json
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          emotions_detected?: Json
          id?: string
          scan_data?: Json
          user_id?: string
        }
        Relationships: []
      }
      emotional_scans: {
        Row: {
          audio_url: string | null
          confidence: number | null
          created_at: string | null
          duration_seconds: number | null
          emotions: Json
          hume_job_id: string | null
          id: string
          scan_type: string
          text_content: string | null
          top_emotion: string | null
          updated_at: string | null
          user_id: string
          video_url: string | null
        }
        Insert: {
          audio_url?: string | null
          confidence?: number | null
          created_at?: string | null
          duration_seconds?: number | null
          emotions?: Json
          hume_job_id?: string | null
          id?: string
          scan_type: string
          text_content?: string | null
          top_emotion?: string | null
          updated_at?: string | null
          user_id: string
          video_url?: string | null
        }
        Update: {
          audio_url?: string | null
          confidence?: number | null
          created_at?: string | null
          duration_seconds?: number | null
          emotions?: Json
          hume_job_id?: string | null
          id?: string
          scan_type?: string
          text_content?: string | null
          top_emotion?: string | null
          updated_at?: string | null
          user_id?: string
          video_url?: string | null
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
          created_by: string | null
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
          created_by?: string | null
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
          created_by?: string | null
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
      encryption_keys: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          key_name: string
          key_type: string
          key_value: string
          rotated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          key_name: string
          key_type?: string
          key_value: string
          rotated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          key_name?: string
          key_type?: string
          key_value?: string
          rotated_at?: string | null
        }
        Relationships: []
      }
      energy_transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          metadata: Json | null
          reason: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          metadata?: Json | null
          reason: string
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          metadata?: Json | null
          reason?: string
          transaction_type?: string
          user_id?: string
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
      error_patterns: {
        Row: {
          created_at: string | null
          error_category: string | null
          error_message: string | null
          first_seen: string | null
          id: string
          last_seen: string | null
          occurrence_count: number | null
          pattern_key: string
          severity: string | null
          unique_urls: number | null
          unique_users: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          error_category?: string | null
          error_message?: string | null
          first_seen?: string | null
          id?: string
          last_seen?: string | null
          occurrence_count?: number | null
          pattern_key: string
          severity?: string | null
          unique_urls?: number | null
          unique_users?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          error_category?: string | null
          error_message?: string | null
          first_seen?: string | null
          id?: string
          last_seen?: string | null
          occurrence_count?: number | null
          pattern_key?: string
          severity?: string | null
          unique_urls?: number | null
          unique_users?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      error_patterns_history: {
        Row: {
          alert_id: string | null
          context: Json | null
          error_message: string
          error_type: string
          id: string
          occurred_at: string
          severity: string
          stack_trace: string | null
        }
        Insert: {
          alert_id?: string | null
          context?: Json | null
          error_message: string
          error_type: string
          id?: string
          occurred_at?: string
          severity: string
          stack_trace?: string | null
        }
        Update: {
          alert_id?: string | null
          context?: Json | null
          error_message?: string
          error_type?: string
          id?: string
          occurred_at?: string
          severity?: string
          stack_trace?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "error_patterns_history_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "unified_alerts"
            referencedColumns: ["id"]
          },
        ]
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
      escalation_performance_metrics: {
        Row: {
          avg_resolution_time_minutes: number | null
          created_at: string
          escalation_accuracy: number | null
          false_positives: number | null
          id: string
          metric_date: string
          missed_alerts: number | null
          recommendation: Json | null
          rule_id: string | null
          successful_resolutions: number | null
          total_escalations: number | null
          updated_at: string
        }
        Insert: {
          avg_resolution_time_minutes?: number | null
          created_at?: string
          escalation_accuracy?: number | null
          false_positives?: number | null
          id?: string
          metric_date?: string
          missed_alerts?: number | null
          recommendation?: Json | null
          rule_id?: string | null
          successful_resolutions?: number | null
          total_escalations?: number | null
          updated_at?: string
        }
        Update: {
          avg_resolution_time_minutes?: number | null
          created_at?: string
          escalation_accuracy?: number | null
          false_positives?: number | null
          id?: string
          metric_date?: string
          missed_alerts?: number | null
          recommendation?: Json | null
          rule_id?: string | null
          successful_resolutions?: number | null
          total_escalations?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "escalation_performance_metrics_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "alert_escalation_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_history: {
        Row: {
          answers: Json | null
          completed_at: string | null
          created_at: string | null
          exam_type: string | null
          id: string
          questions: Json | null
          score: number | null
          started_at: string | null
          time_limit_minutes: number | null
          total_questions: number | null
          user_id: string
        }
        Insert: {
          answers?: Json | null
          completed_at?: string | null
          created_at?: string | null
          exam_type?: string | null
          id?: string
          questions?: Json | null
          score?: number | null
          started_at?: string | null
          time_limit_minutes?: number | null
          total_questions?: number | null
          user_id: string
        }
        Update: {
          answers?: Json | null
          completed_at?: string | null
          created_at?: string | null
          exam_type?: string | null
          id?: string
          questions?: Json | null
          score?: number | null
          started_at?: string | null
          time_limit_minutes?: number | null
          total_questions?: number | null
          user_id?: string
        }
        Relationships: []
      }
      exam_paused_sessions: {
        Row: {
          created_at: string | null
          id: string
          paused_at: string | null
          questions: Json
          session_data: Json
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          paused_at?: string | null
          questions: Json
          session_data: Json
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          paused_at?: string | null
          questions?: Json
          session_data?: Json
          user_id?: string
        }
        Relationships: []
      }
      exam_questions: {
        Row: {
          answered_at: string | null
          created_at: string
          id: string
          is_correct: boolean | null
          item_id: string
          question_order: number
          session_id: string
          time_spent_seconds: number | null
          user_answer: string | null
        }
        Insert: {
          answered_at?: string | null
          created_at?: string
          id?: string
          is_correct?: boolean | null
          item_id: string
          question_order: number
          session_id: string
          time_spent_seconds?: number | null
          user_answer?: string | null
        }
        Update: {
          answered_at?: string | null
          created_at?: string
          id?: string
          is_correct?: boolean | null
          item_id?: string
          question_order?: number
          session_id?: string
          time_spent_seconds?: number | null
          user_answer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_questions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "exam_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_sessions: {
        Row: {
          completed_at: string | null
          correct_answers: number | null
          created_at: string
          exam_type: string
          id: string
          score_percentage: number | null
          settings: Json | null
          started_at: string
          status: string | null
          time_limit_minutes: number | null
          total_questions: number
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          correct_answers?: number | null
          created_at?: string
          exam_type?: string
          id?: string
          score_percentage?: number | null
          settings?: Json | null
          started_at?: string
          status?: string | null
          time_limit_minutes?: number | null
          total_questions: number
          user_id: string
        }
        Update: {
          completed_at?: string | null
          correct_answers?: number | null
          created_at?: string
          exam_type?: string
          id?: string
          score_percentage?: number | null
          settings?: Json | null
          started_at?: string
          status?: string | null
          time_limit_minutes?: number | null
          total_questions?: number
          user_id?: string
        }
        Relationships: []
      }
      exchange_leaderboards: {
        Row: {
          id: string
          market_type: string
          period: string | null
          rank: number | null
          recorded_at: string | null
          score: number
          user_id: string
        }
        Insert: {
          id?: string
          market_type: string
          period?: string | null
          rank?: number | null
          recorded_at?: string | null
          score: number
          user_id: string
        }
        Update: {
          id?: string
          market_type?: string
          period?: string | null
          rank?: number | null
          recorded_at?: string | null
          score?: number
          user_id?: string
        }
        Relationships: []
      }
      exchange_profiles: {
        Row: {
          achievements: Json | null
          avatar_url: string | null
          badges: Json | null
          created_at: string | null
          display_name: string | null
          emotion_rank: number | null
          id: string
          improvement_rank: number | null
          level: number | null
          stats: Json | null
          time_rank: number | null
          total_xp: number | null
          trust_rank: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achievements?: Json | null
          avatar_url?: string | null
          badges?: Json | null
          created_at?: string | null
          display_name?: string | null
          emotion_rank?: number | null
          id?: string
          improvement_rank?: number | null
          level?: number | null
          stats?: Json | null
          time_rank?: number | null
          total_xp?: number | null
          trust_rank?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          achievements?: Json | null
          avatar_url?: string | null
          badges?: Json | null
          created_at?: string | null
          display_name?: string | null
          emotion_rank?: number | null
          id?: string
          improvement_rank?: number | null
          level?: number | null
          stats?: Json | null
          time_rank?: number | null
          total_xp?: number | null
          trust_rank?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      executive_business_metrics: {
        Row: {
          ab_test_roi_percentage: number | null
          ab_test_value_saved: number | null
          ab_test_wins: number | null
          automation_rate_percentage: number | null
          business_value_saved: number | null
          cost_per_escalation: number | null
          created_at: string | null
          id: string
          manual_interventions: number | null
          metric_date: string
          time_saved_hours: number | null
          total_escalation_cost: number | null
          total_escalations: number | null
          updated_at: string | null
        }
        Insert: {
          ab_test_roi_percentage?: number | null
          ab_test_value_saved?: number | null
          ab_test_wins?: number | null
          automation_rate_percentage?: number | null
          business_value_saved?: number | null
          cost_per_escalation?: number | null
          created_at?: string | null
          id?: string
          manual_interventions?: number | null
          metric_date: string
          time_saved_hours?: number | null
          total_escalation_cost?: number | null
          total_escalations?: number | null
          updated_at?: string | null
        }
        Update: {
          ab_test_roi_percentage?: number | null
          ab_test_value_saved?: number | null
          ab_test_wins?: number | null
          automation_rate_percentage?: number | null
          business_value_saved?: number | null
          cost_per_escalation?: number | null
          created_at?: string | null
          id?: string
          manual_interventions?: number | null
          metric_date?: string
          time_saved_hours?: number | null
          total_escalation_cost?: number | null
          total_escalations?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      export_logs: {
        Row: {
          created_at: string
          duration_ms: number | null
          file_size: number | null
          format: string
          id: string
          template: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          duration_ms?: number | null
          file_size?: number | null
          format: string
          id?: string
          template?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          duration_ms?: number | null
          file_size?: number | null
          format?: string
          id?: string
          template?: string | null
          user_id?: string | null
        }
        Relationships: []
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
      fcm_tokens: {
        Row: {
          created_at: string
          device_type: string | null
          id: string
          last_used_at: string
          token: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_type?: string | null
          id?: string
          last_used_at?: string
          token: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_type?: string | null
          id?: string
          last_used_at?: string
          token?: string
          user_id?: string
        }
        Relationships: []
      }
      flash_glow_sessions: {
        Row: {
          completed: boolean | null
          created_at: string | null
          duration_seconds: number
          id: string
          pattern: string | null
          score: number | null
          session_date: string | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          duration_seconds: number
          id?: string
          pattern?: string | null
          score?: number | null
          session_date?: string | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          duration_seconds?: number
          id?: string
          pattern?: string | null
          score?: number | null
          session_date?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      flash_lite_cards: {
        Row: {
          answer: string
          created_at: string
          difficulty: string | null
          id: string
          is_correct: boolean | null
          question: string
          response_time_ms: number | null
          session_id: string
          user_answer: string | null
        }
        Insert: {
          answer: string
          created_at?: string
          difficulty?: string | null
          id?: string
          is_correct?: boolean | null
          question: string
          response_time_ms?: number | null
          session_id: string
          user_answer?: string | null
        }
        Update: {
          answer?: string
          created_at?: string
          difficulty?: string | null
          id?: string
          is_correct?: boolean | null
          question?: string
          response_time_ms?: number | null
          session_id?: string
          user_answer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flash_lite_cards_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "flash_lite_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      flash_lite_sessions: {
        Row: {
          accuracy_percentage: number | null
          average_response_time: number | null
          cards_completed: number
          cards_correct: number
          cards_total: number
          category: string | null
          completed_at: string | null
          created_at: string
          duration_seconds: number | null
          id: string
          mode: string
          notes: string | null
          started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          accuracy_percentage?: number | null
          average_response_time?: number | null
          cards_completed?: number
          cards_correct?: number
          cards_total?: number
          category?: string | null
          completed_at?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          mode: string
          notes?: string | null
          started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          accuracy_percentage?: number | null
          average_response_time?: number | null
          cards_completed?: number
          cards_correct?: number
          cards_total?: number
          category?: string | null
          completed_at?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          mode?: string
          notes?: string | null
          started_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      flashcard_decks: {
        Row: {
          card_count: number | null
          created_at: string
          description: string | null
          id: string
          is_ai_generated: boolean | null
          is_public: boolean | null
          item_codes: string[] | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          card_count?: number | null
          created_at?: string
          description?: string | null
          id?: string
          is_ai_generated?: boolean | null
          is_public?: boolean | null
          item_codes?: string[] | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          card_count?: number | null
          created_at?: string
          description?: string | null
          id?: string
          is_ai_generated?: boolean | null
          is_public?: boolean | null
          item_codes?: string[] | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      flashcard_reviews: {
        Row: {
          ease_factor: number | null
          flashcard_id: string
          id: string
          interval_days: number | null
          next_review_date: string | null
          quality: number
          reviewed_at: string
          user_id: string
        }
        Insert: {
          ease_factor?: number | null
          flashcard_id: string
          id?: string
          interval_days?: number | null
          next_review_date?: string | null
          quality: number
          reviewed_at?: string
          user_id: string
        }
        Update: {
          ease_factor?: number | null
          flashcard_id?: string
          id?: string
          interval_days?: number | null
          next_review_date?: string | null
          quality?: number
          reviewed_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcard_reviews_flashcard_id_fkey"
            columns: ["flashcard_id"]
            isOneToOne: false
            referencedRelation: "flashcards"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcards: {
        Row: {
          back_content: string
          correct_count: number | null
          created_at: string
          deck_id: string
          difficulty: string | null
          ease_factor: number | null
          front_content: string
          id: string
          interval_days: number | null
          item_code: string | null
          last_reviewed: string | null
          next_review: string | null
          review_count: number | null
          tags: string[] | null
        }
        Insert: {
          back_content: string
          correct_count?: number | null
          created_at?: string
          deck_id: string
          difficulty?: string | null
          ease_factor?: number | null
          front_content: string
          id?: string
          interval_days?: number | null
          item_code?: string | null
          last_reviewed?: string | null
          next_review?: string | null
          review_count?: number | null
          tags?: string[] | null
        }
        Update: {
          back_content?: string
          correct_count?: number | null
          created_at?: string
          deck_id?: string
          difficulty?: string | null
          ease_factor?: number | null
          front_content?: string
          id?: string
          interval_days?: number | null
          item_code?: string | null
          last_reviewed?: string | null
          next_review?: string | null
          review_count?: number | null
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "flashcard_decks"
            referencedColumns: ["id"]
          },
        ]
      }
      focus_leaderboard: {
        Row: {
          id: string
          last_session_at: string | null
          streak_days: number | null
          total_minutes: number | null
          total_pomodoros: number | null
          total_sessions: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          last_session_at?: string | null
          streak_days?: number | null
          total_minutes?: number | null
          total_pomodoros?: number | null
          total_sessions?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          last_session_at?: string | null
          streak_days?: number | null
          total_minutes?: number | null
          total_pomodoros?: number | null
          total_sessions?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      focus_session_tracks: {
        Row: {
          created_at: string | null
          duration_seconds: number | null
          emotion: string | null
          generation_status: string | null
          id: string
          phase: string
          pomodoro_index: number
          sequence_order: number
          session_id: string
          suno_task_id: string | null
          target_tempo: number
          track_title: string | null
          track_url: string | null
        }
        Insert: {
          created_at?: string | null
          duration_seconds?: number | null
          emotion?: string | null
          generation_status?: string | null
          id?: string
          phase: string
          pomodoro_index: number
          sequence_order: number
          session_id: string
          suno_task_id?: string | null
          target_tempo: number
          track_title?: string | null
          track_url?: string | null
        }
        Update: {
          created_at?: string | null
          duration_seconds?: number | null
          emotion?: string | null
          generation_status?: string | null
          id?: string
          phase?: string
          pomodoro_index?: number
          sequence_order?: number
          session_id?: string
          suno_task_id?: string | null
          target_tempo?: number
          track_title?: string | null
          track_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "focus_session_tracks_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "focus_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      focus_sessions: {
        Row: {
          break_duration: number
          completed_at: string | null
          created_at: string | null
          duration_minutes: number
          end_tempo: number
          id: string
          mode: string
          peak_tempo: number
          pomodoro_duration: number
          pomodoros_completed: number | null
          start_tempo: number
          started_at: string | null
          tracks_generated: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          break_duration?: number
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number
          end_tempo?: number
          id?: string
          mode: string
          peak_tempo?: number
          pomodoro_duration?: number
          pomodoros_completed?: number | null
          start_tempo?: number
          started_at?: string | null
          tracks_generated?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          break_duration?: number
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number
          end_tempo?: number
          id?: string
          mode?: string
          peak_tempo?: number
          pomodoro_duration?: number
          pomodoros_completed?: number | null
          start_tempo?: number
          started_at?: string | null
          tracks_generated?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      focus_team_sessions: {
        Row: {
          created_at: string
          creator_id: string
          current_phase: string | null
          duration_minutes: number
          id: string
          mode: string
          participant_count: number | null
          phase_started_at: string | null
          playlist_id: string | null
          team_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          current_phase?: string | null
          duration_minutes: number
          id?: string
          mode: string
          participant_count?: number | null
          phase_started_at?: string | null
          playlist_id?: string | null
          team_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          current_phase?: string | null
          duration_minutes?: number
          id?: string
          mode?: string
          participant_count?: number | null
          phase_started_at?: string | null
          playlist_id?: string | null
          team_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "focus_team_sessions_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "automix_playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_bookmarks: {
        Row: {
          created_at: string
          id: string
          topic_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          topic_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          topic_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_bookmarks_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "forum_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_likes: {
        Row: {
          created_at: string
          id: string
          reply_id: string | null
          topic_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reply_id?: string | null
          topic_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reply_id?: string | null
          topic_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_likes_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "forum_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_likes_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "forum_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_replies: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          is_best_answer: boolean | null
          likes_count: number | null
          topic_id: string | null
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          is_best_answer?: boolean | null
          likes_count?: number | null
          topic_id?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          is_best_answer?: boolean | null
          likes_count?: number | null
          topic_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "forum_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_topics: {
        Row: {
          author_id: string
          category: string
          content: string
          created_at: string
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          is_solved: boolean | null
          last_reply_at: string | null
          last_reply_author_id: string | null
          likes_count: number | null
          replies_count: number | null
          tags: string[] | null
          title: string
          updated_at: string
          views: number | null
        }
        Insert: {
          author_id: string
          category?: string
          content: string
          created_at?: string
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          is_solved?: boolean | null
          last_reply_at?: string | null
          last_reply_author_id?: string | null
          likes_count?: number | null
          replies_count?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string
          views?: number | null
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          is_solved?: boolean | null
          last_reply_at?: string | null
          last_reply_author_id?: string | null
          likes_count?: number | null
          replies_count?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          views?: number | null
        }
        Relationships: []
      }
      free_trial_usage: {
        Row: {
          created_at: string | null
          generations_used: number | null
          id: string
          last_generation_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          generations_used?: number | null
          id?: string
          last_generation_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          generations_used?: number | null
          id?: string
          last_generation_at?: string | null
          updated_at?: string | null
          user_id?: string
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
      gdpr_alerts: {
        Row: {
          alert_type: string
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      gdpr_scheduled_exports: {
        Row: {
          admin_emails: string[]
          created_at: string
          created_by: string | null
          day_of_month: number | null
          day_of_week: number | null
          format: string
          frequency: string
          id: string
          is_active: boolean
          last_run_at: string | null
          next_run_at: string | null
          org_id: string | null
          time: string
          updated_at: string
        }
        Insert: {
          admin_emails: string[]
          created_at?: string
          created_by?: string | null
          day_of_month?: number | null
          day_of_week?: number | null
          format: string
          frequency: string
          id?: string
          is_active?: boolean
          last_run_at?: string | null
          next_run_at?: string | null
          org_id?: string | null
          time?: string
          updated_at?: string
        }
        Update: {
          admin_emails?: string[]
          created_at?: string
          created_by?: string | null
          day_of_month?: number | null
          day_of_week?: number | null
          format?: string
          frequency?: string
          id?: string
          is_active?: boolean
          last_run_at?: string | null
          next_run_at?: string | null
          org_id?: string | null
          time?: string
          updated_at?: string
        }
        Relationships: []
      }
      gdpr_violations: {
        Row: {
          affected_data_types: string[] | null
          affected_users_count: number | null
          created_at: string | null
          description: string
          detected_at: string | null
          id: string
          metadata: Json | null
          ml_confidence: number | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          risk_score: number
          severity: string
          status: string | null
          title: string
          updated_at: string | null
          violation_type: string
        }
        Insert: {
          affected_data_types?: string[] | null
          affected_users_count?: number | null
          created_at?: string | null
          description: string
          detected_at?: string | null
          id?: string
          metadata?: Json | null
          ml_confidence?: number | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          risk_score: number
          severity: string
          status?: string | null
          title: string
          updated_at?: string | null
          violation_type: string
        }
        Update: {
          affected_data_types?: string[] | null
          affected_users_count?: number | null
          created_at?: string | null
          description?: string
          detected_at?: string | null
          id?: string
          metadata?: Json | null
          ml_confidence?: number | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          risk_score?: number
          severity?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          violation_type?: string
        }
        Relationships: []
      }
      gdpr_webhooks: {
        Row: {
          created_at: string
          event_type: string
          id: string
          is_active: boolean | null
          last_triggered_at: string | null
          secret: string
          trigger_count: number | null
          url: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          secret: string
          trigger_count?: number | null
          url: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          secret?: string
          trigger_count?: number | null
          url?: string
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
          emotion: string | null
          generation_status: string | null
          id: string
          image_url: string | null
          is_public: boolean | null
          metadata: Json | null
          original_task_id: string | null
          prompt: string | null
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
          emotion?: string | null
          generation_status?: string | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          metadata?: Json | null
          original_task_id?: string | null
          prompt?: string | null
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
          emotion?: string | null
          generation_status?: string | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          metadata?: Json | null
          original_task_id?: string | null
          prompt?: string | null
          stream_url?: string | null
          suno_track_id?: string | null
          task_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      generated_songs: {
        Row: {
          audio_url: string
          created_at: string | null
          duration: number
          emotion_input: string
          id: string
          metadata: Json | null
          style: string
          suno_job_id: string | null
          user_id: string
        }
        Insert: {
          audio_url: string
          created_at?: string | null
          duration: number
          emotion_input: string
          id?: string
          metadata?: Json | null
          style: string
          suno_job_id?: string | null
          user_id: string
        }
        Update: {
          audio_url?: string
          created_at?: string | null
          duration?: number
          emotion_input?: string
          id?: string
          metadata?: Json | null
          style?: string
          suno_job_id?: string | null
          user_id?: string
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
      global_leaderboard: {
        Row: {
          avatar_emoji: string | null
          avatar_url: string | null
          badges_count: number | null
          best_streak: number | null
          current_streak: number | null
          display_name: string
          id: string
          level: number | null
          monthly_xp: number | null
          rank_position: number | null
          streak_days: number | null
          total_score: number | null
          total_sessions: number | null
          total_xp: number | null
          updated_at: string | null
          user_id: string | null
          weekly_score: number | null
          weekly_xp: number | null
        }
        Insert: {
          avatar_emoji?: string | null
          avatar_url?: string | null
          badges_count?: number | null
          best_streak?: number | null
          current_streak?: number | null
          display_name: string
          id?: string
          level?: number | null
          monthly_xp?: number | null
          rank_position?: number | null
          streak_days?: number | null
          total_score?: number | null
          total_sessions?: number | null
          total_xp?: number | null
          updated_at?: string | null
          user_id?: string | null
          weekly_score?: number | null
          weekly_xp?: number | null
        }
        Update: {
          avatar_emoji?: string | null
          avatar_url?: string | null
          badges_count?: number | null
          best_streak?: number | null
          current_streak?: number | null
          display_name?: string
          id?: string
          level?: number | null
          monthly_xp?: number | null
          rank_position?: number | null
          streak_days?: number | null
          total_score?: number | null
          total_sessions?: number | null
          total_xp?: number | null
          updated_at?: string | null
          user_id?: string | null
          weekly_score?: number | null
          weekly_xp?: number | null
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
      group_meditation_invitations: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          invited_by: string
          invited_email: string | null
          invited_user_id: string | null
          session_id: string
          status: string | null
          token: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          invited_by: string
          invited_email?: string | null
          invited_user_id?: string | null
          session_id: string
          status?: string | null
          token?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          invited_by?: string
          invited_email?: string | null
          invited_user_id?: string | null
          session_id?: string
          status?: string | null
          token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_meditation_invitations_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "group_meditation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      group_meditation_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          message_type: string | null
          session_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          message_type?: string | null
          session_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          message_type?: string | null
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_meditation_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "group_meditation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      group_meditation_participants: {
        Row: {
          avatar_url: string | null
          display_name: string | null
          id: string
          joined_at: string
          left_at: string | null
          meditation_duration_seconds: number | null
          metadata: Json | null
          mood_after: number | null
          mood_before: number | null
          session_id: string
          status: string
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          avatar_url?: string | null
          display_name?: string | null
          id?: string
          joined_at?: string
          left_at?: string | null
          meditation_duration_seconds?: number | null
          metadata?: Json | null
          mood_after?: number | null
          mood_before?: number | null
          session_id: string
          status?: string
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          avatar_url?: string | null
          display_name?: string | null
          id?: string
          joined_at?: string
          left_at?: string | null
          meditation_duration_seconds?: number | null
          metadata?: Json | null
          mood_after?: number | null
          mood_before?: number | null
          session_id?: string
          status?: string
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "group_meditation_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "group_meditation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      group_meditation_sessions: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number
          ended_at: string | null
          host_id: string
          id: string
          is_public: boolean | null
          join_code: string | null
          max_participants: number | null
          scheduled_at: string | null
          settings: Json | null
          started_at: string | null
          status: string
          technique: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes?: number
          ended_at?: string | null
          host_id: string
          id?: string
          is_public?: boolean | null
          join_code?: string | null
          max_participants?: number | null
          scheduled_at?: string | null
          settings?: Json | null
          started_at?: string | null
          status?: string
          technique?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number
          ended_at?: string | null
          host_id?: string
          id?: string
          is_public?: boolean | null
          join_code?: string | null
          max_participants?: number | null
          scheduled_at?: string | null
          settings?: Json | null
          started_at?: string | null
          status?: string
          technique?: string
          title?: string
          updated_at?: string
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
      group_session_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          label: string
          name: string
          order_index: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          label: string
          name: string
          order_index?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          label?: string
          name?: string
          order_index?: number | null
        }
        Relationships: []
      }
      group_session_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_hidden: boolean | null
          is_pinned: boolean | null
          message_type: string | null
          metadata: Json | null
          reply_to_id: string | null
          session_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_hidden?: boolean | null
          is_pinned?: boolean | null
          message_type?: string | null
          metadata?: Json | null
          reply_to_id?: string | null
          session_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_hidden?: boolean | null
          is_pinned?: boolean | null
          message_type?: string | null
          metadata?: Json | null
          reply_to_id?: string | null
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_session_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "group_session_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_session_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "group_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      group_session_participants: {
        Row: {
          created_at: string | null
          feedback: string | null
          id: string
          joined_at: string | null
          left_at: string | null
          mood_after: number | null
          mood_before: number | null
          rating: number | null
          role: string | null
          session_id: string
          status: string | null
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          created_at?: string | null
          feedback?: string | null
          id?: string
          joined_at?: string | null
          left_at?: string | null
          mood_after?: number | null
          mood_before?: number | null
          rating?: number | null
          role?: string | null
          session_id: string
          status?: string | null
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          created_at?: string | null
          feedback?: string | null
          id?: string
          joined_at?: string | null
          left_at?: string | null
          mood_after?: number | null
          mood_before?: number | null
          rating?: number | null
          role?: string | null
          session_id?: string
          status?: string | null
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "group_session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "group_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      group_session_reactions: {
        Row: {
          created_at: string | null
          emoji: string
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          emoji: string
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          emoji?: string
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_session_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "group_session_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      group_session_resources: {
        Row: {
          created_at: string | null
          description: string | null
          download_count: number | null
          id: string
          resource_type: string
          session_id: string
          title: string
          uploaded_by: string
          url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          id?: string
          resource_type: string
          session_id: string
          title: string
          uploaded_by: string
          url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          id?: string
          resource_type?: string
          session_id?: string
          title?: string
          uploaded_by?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_session_resources_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "group_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      group_sessions: {
        Row: {
          category: string
          cover_image: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          host_id: string
          id: string
          is_recurring: boolean | null
          max_participants: number | null
          meeting_url: string | null
          metadata: Json | null
          recording_url: string | null
          recurrence_rule: string | null
          scheduled_at: string
          session_type: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          xp_reward: number | null
        }
        Insert: {
          category?: string
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          host_id: string
          id?: string
          is_recurring?: boolean | null
          max_participants?: number | null
          meeting_url?: string | null
          metadata?: Json | null
          recording_url?: string | null
          recurrence_rule?: string | null
          scheduled_at: string
          session_type?: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          xp_reward?: number | null
        }
        Update: {
          category?: string
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          host_id?: string
          id?: string
          is_recurring?: boolean | null
          max_participants?: number | null
          meeting_url?: string | null
          metadata?: Json | null
          recording_url?: string | null
          recurrence_rule?: string | null
          scheduled_at?: string
          session_type?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          xp_reward?: number | null
        }
        Relationships: []
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
      guild_challenges: {
        Row: {
          challenge_type: string
          completed_at: string | null
          created_at: string
          current_value: number | null
          description: string | null
          expires_at: string
          guild_id: string
          id: string
          reward_description: string | null
          reward_xp: number | null
          status: string
          target_value: number
          title: string
        }
        Insert: {
          challenge_type: string
          completed_at?: string | null
          created_at?: string
          current_value?: number | null
          description?: string | null
          expires_at: string
          guild_id: string
          id?: string
          reward_description?: string | null
          reward_xp?: number | null
          status?: string
          target_value: number
          title: string
        }
        Update: {
          challenge_type?: string
          completed_at?: string | null
          created_at?: string
          current_value?: number | null
          description?: string | null
          expires_at?: string
          guild_id?: string
          id?: string
          reward_description?: string | null
          reward_xp?: number | null
          status?: string
          target_value?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "guild_challenges_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "music_guilds"
            referencedColumns: ["id"]
          },
        ]
      }
      guild_members: {
        Row: {
          contribution_xp: number | null
          guild_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          contribution_xp?: number | null
          guild_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          contribution_xp?: number | null
          guild_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guild_members_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "music_guilds"
            referencedColumns: ["id"]
          },
        ]
      }
      guild_messages: {
        Row: {
          created_at: string
          guild_id: string
          id: string
          message: string
          user_id: string
        }
        Insert: {
          created_at?: string
          guild_id: string
          id?: string
          message: string
          user_id: string
        }
        Update: {
          created_at?: string
          guild_id?: string
          id?: string
          message?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guild_messages_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "music_guilds"
            referencedColumns: ["id"]
          },
        ]
      }
      guilds: {
        Row: {
          banner_emoji: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          leader_id: string
          level: number | null
          max_members: number | null
          member_count: number | null
          name: string
          tags: string[] | null
          total_xp: number | null
        }
        Insert: {
          banner_emoji?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          leader_id: string
          level?: number | null
          max_members?: number | null
          member_count?: number | null
          name: string
          tags?: string[] | null
          total_xp?: number | null
        }
        Update: {
          banner_emoji?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          leader_id?: string
          level?: number | null
          max_members?: number | null
          member_count?: number | null
          name?: string
          tags?: string[] | null
          total_xp?: number | null
        }
        Relationships: []
      }
      health_data: {
        Row: {
          heart_rate: number | null
          hrv: number | null
          id: string
          provider: string | null
          recorded_at: string
          sleep_minutes: number | null
          steps: number | null
          stress_level: number | null
          synced_at: string | null
          user_id: string
        }
        Insert: {
          heart_rate?: number | null
          hrv?: number | null
          id?: string
          provider?: string | null
          recorded_at: string
          sleep_minutes?: number | null
          steps?: number | null
          stress_level?: number | null
          synced_at?: string | null
          user_id: string
        }
        Update: {
          heart_rate?: number | null
          hrv?: number | null
          id?: string
          provider?: string | null
          recorded_at?: string
          sleep_minutes?: number | null
          steps?: number | null
          stress_level?: number | null
          synced_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      honorary_titles: {
        Row: {
          awarded_at: string | null
          id: string
          season_id: string
          title: string
          user_id: string
        }
        Insert: {
          awarded_at?: string | null
          id?: string
          season_id: string
          title: string
          user_id: string
        }
        Update: {
          awarded_at?: string | null
          id?: string
          season_id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "honorary_titles_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "competitive_seasons"
            referencedColumns: ["id"]
          },
        ]
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
      idempotency_records: {
        Row: {
          completed_at: string | null
          created_at: string
          operation_key: string
          result: Json | null
          status: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          operation_key: string
          result?: Json | null
          status: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          operation_key?: string
          result?: Json | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      implicit_tracking: {
        Row: {
          created_at: string | null
          event_data: Json
          event_type: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_data?: Json
          event_type: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_data?: Json
          event_type?: string
          id?: string
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
      improvement_goals: {
        Row: {
          ai_analysis: Json | null
          completed_at: string | null
          created_at: string | null
          current_value: number | null
          description: string | null
          goal_type: string
          id: string
          improvement_score: number | null
          started_at: string | null
          status: string | null
          target_date: string | null
          target_value: number | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_analysis?: Json | null
          completed_at?: string | null
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          goal_type: string
          id?: string
          improvement_score?: number | null
          started_at?: string | null
          status?: string | null
          target_date?: string | null
          target_value?: number | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_analysis?: Json | null
          completed_at?: string | null
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          goal_type?: string
          id?: string
          improvement_score?: number | null
          started_at?: string | null
          status?: string | null
          target_date?: string | null
          target_value?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      improvement_logs: {
        Row: {
          ai_feedback: string | null
          created_at: string | null
          goal_id: string | null
          id: string
          metadata: Json | null
          new_value: number
          user_id: string
          value_change: number
        }
        Insert: {
          ai_feedback?: string | null
          created_at?: string | null
          goal_id?: string | null
          id?: string
          metadata?: Json | null
          new_value: number
          user_id: string
          value_change: number
        }
        Update: {
          ai_feedback?: string | null
          created_at?: string | null
          goal_id?: string | null
          id?: string
          metadata?: Json | null
          new_value?: number
          user_id?: string
          value_change?: number
        }
        Relationships: [
          {
            foreignKeyName: "improvement_logs_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "improvement_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      improvement_market_history: {
        Row: {
          avg_score: number
          goal_type: string
          id: string
          participants_count: number | null
          recorded_at: string | null
        }
        Insert: {
          avg_score: number
          goal_type: string
          id?: string
          participants_count?: number | null
          recorded_at?: string | null
        }
        Update: {
          avg_score?: number
          goal_type?: string
          id?: string
          participants_count?: number | null
          recorded_at?: string | null
        }
        Relationships: []
      }
      in_app_notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          message: string | null
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string | null
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string | null
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      incident_reports: {
        Row: {
          affected_systems: string[] | null
          business_impact_cost: number | null
          contributing_factors: string[] | null
          corrective_actions: string[] | null
          created_at: string | null
          downtime_minutes: number | null
          id: string
          impact_description: string | null
          incident_id: string
          lessons_learned: string[] | null
          post_mortem_template: string | null
          preventive_measures: string[] | null
          related_alert_ids: string[] | null
          related_escalation_ids: string[] | null
          resolved_at: string | null
          root_cause_analysis: string | null
          root_cause_confidence: number | null
          severity: string
          started_at: string
          status: string
          timeline: Json | null
          title: string
          updated_at: string | null
          users_affected: number | null
        }
        Insert: {
          affected_systems?: string[] | null
          business_impact_cost?: number | null
          contributing_factors?: string[] | null
          corrective_actions?: string[] | null
          created_at?: string | null
          downtime_minutes?: number | null
          id?: string
          impact_description?: string | null
          incident_id: string
          lessons_learned?: string[] | null
          post_mortem_template?: string | null
          preventive_measures?: string[] | null
          related_alert_ids?: string[] | null
          related_escalation_ids?: string[] | null
          resolved_at?: string | null
          root_cause_analysis?: string | null
          root_cause_confidence?: number | null
          severity: string
          started_at: string
          status?: string
          timeline?: Json | null
          title: string
          updated_at?: string | null
          users_affected?: number | null
        }
        Update: {
          affected_systems?: string[] | null
          business_impact_cost?: number | null
          contributing_factors?: string[] | null
          corrective_actions?: string[] | null
          created_at?: string | null
          downtime_minutes?: number | null
          id?: string
          impact_description?: string | null
          incident_id?: string
          lessons_learned?: string[] | null
          post_mortem_template?: string | null
          preventive_measures?: string[] | null
          related_alert_ids?: string[] | null
          related_escalation_ids?: string[] | null
          resolved_at?: string | null
          root_cause_analysis?: string | null
          root_cause_confidence?: number | null
          severity?: string
          started_at?: string
          status?: string
          timeline?: Json | null
          title?: string
          updated_at?: string | null
          users_affected?: number | null
        }
        Relationships: []
      }
      insight_feedback: {
        Row: {
          action_taken: string | null
          created_at: string | null
          feedback_text: string | null
          id: string
          insight_id: string
          rating: number
          user_id: string
          was_helpful: boolean | null
        }
        Insert: {
          action_taken?: string | null
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          insight_id: string
          rating: number
          user_id: string
          was_helpful?: boolean | null
        }
        Update: {
          action_taken?: string | null
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          insight_id?: string
          rating?: number
          user_id?: string
          was_helpful?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "insight_feedback_insight_id_fkey"
            columns: ["insight_id"]
            isOneToOne: false
            referencedRelation: "user_insights"
            referencedColumns: ["id"]
          },
        ]
      }
      insight_stats_cache: {
        Row: {
          created_at: string | null
          id: string
          last_updated: string | null
          stats_data: Json
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_updated?: string | null
          stats_data: Json
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_updated?: string | null
          stats_data?: Json
          user_id?: string
        }
        Relationships: []
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
      item_reviews: {
        Row: {
          created_at: string
          ease_factor_after: number | null
          ease_factor_before: number | null
          id: string
          interval_after: number | null
          interval_before: number | null
          item_code: string
          next_review_date: string | null
          quality: number
          response_time_ms: number | null
          session_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          ease_factor_after?: number | null
          ease_factor_before?: number | null
          id?: string
          interval_after?: number | null
          interval_before?: number | null
          item_code: string
          next_review_date?: string | null
          quality: number
          response_time_ms?: number | null
          session_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          ease_factor_after?: number | null
          ease_factor_before?: number | null
          id?: string
          interval_after?: number | null
          interval_before?: number | null
          item_code?: string
          next_review_date?: string | null
          quality?: number
          response_time_ms?: number | null
          session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "item_reviews_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "review_sessions"
            referencedColumns: ["id"]
          },
        ]
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
          is_favorite: boolean | null
          is_precious: boolean | null
          mode: string | null
          summary: string | null
          tags: string[] | null
          text_content: string | null
          transcript: string | null
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
          is_favorite?: boolean | null
          is_precious?: boolean | null
          mode?: string | null
          summary?: string | null
          tags?: string[] | null
          text_content?: string | null
          transcript?: string | null
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
          is_favorite?: boolean | null
          is_precious?: boolean | null
          mode?: string | null
          summary?: string | null
          tags?: string[] | null
          text_content?: string | null
          transcript?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      journal_notes: {
        Row: {
          created_at: string
          id: string
          is_archived: boolean | null
          is_favorite: boolean | null
          mode: string | null
          summary: string | null
          tags: string[] | null
          text: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_archived?: boolean | null
          is_favorite?: boolean | null
          mode?: string | null
          summary?: string | null
          tags?: string[] | null
          text: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_archived?: boolean | null
          is_favorite?: boolean | null
          mode?: string | null
          summary?: string | null
          tags?: string[] | null
          text?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      journal_prompts: {
        Row: {
          category: string
          created_at: string
          difficulty: string
          id: string
          is_active: boolean | null
          prompt_text: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          difficulty: string
          id?: string
          is_active?: boolean | null
          prompt_text: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          difficulty?: string
          id?: string
          is_active?: boolean | null
          prompt_text?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      journal_reminders: {
        Row: {
          created_at: string
          days_of_week: number[]
          id: string
          is_active: boolean | null
          message: string | null
          reminder_time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          days_of_week: number[]
          id?: string
          is_active?: boolean | null
          message?: string | null
          reminder_time: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          days_of_week?: number[]
          id?: string
          is_active?: boolean | null
          message?: string | null
          reminder_time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      journal_text: {
        Row: {
          created_at: string
          emo_vec: number[] | null
          emo_vec_encrypted: string | null
          id: string
          preview: string | null
          preview_encrypted: string | null
          styled_html: string | null
          styled_html_encrypted: string | null
          text_raw: string
          text_raw_encrypted: string | null
          ts: string
          updated_at: string
          user_hash: string | null
          user_id: string
          valence: number | null
        }
        Insert: {
          created_at?: string
          emo_vec?: number[] | null
          emo_vec_encrypted?: string | null
          id?: string
          preview?: string | null
          preview_encrypted?: string | null
          styled_html?: string | null
          styled_html_encrypted?: string | null
          text_raw: string
          text_raw_encrypted?: string | null
          ts?: string
          updated_at?: string
          user_hash?: string | null
          user_id: string
          valence?: number | null
        }
        Update: {
          created_at?: string
          emo_vec?: number[] | null
          emo_vec_encrypted?: string | null
          id?: string
          preview?: string | null
          preview_encrypted?: string | null
          styled_html?: string | null
          styled_html_encrypted?: string | null
          text_raw?: string
          text_raw_encrypted?: string | null
          ts?: string
          updated_at?: string
          user_hash?: string | null
          user_id?: string
          valence?: number | null
        }
        Relationships: []
      }
      journal_voice: {
        Row: {
          audio_url: string | null
          created_at: string
          crystal_meta: Json | null
          crystal_meta_encrypted: string | null
          emo_vec: number[] | null
          emo_vec_encrypted: string | null
          id: string
          pitch_avg: number | null
          summary_120: string | null
          summary_120_encrypted: string | null
          text_raw: string
          text_raw_encrypted: string | null
          ts: string
          updated_at: string
          user_hash: string | null
          user_id: string
          valence: number | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          crystal_meta?: Json | null
          crystal_meta_encrypted?: string | null
          emo_vec?: number[] | null
          emo_vec_encrypted?: string | null
          id?: string
          pitch_avg?: number | null
          summary_120?: string | null
          summary_120_encrypted?: string | null
          text_raw: string
          text_raw_encrypted?: string | null
          ts?: string
          updated_at?: string
          user_hash?: string | null
          user_id: string
          valence?: number | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          crystal_meta?: Json | null
          crystal_meta_encrypted?: string | null
          emo_vec?: number[] | null
          emo_vec_encrypted?: string | null
          id?: string
          pitch_avg?: number | null
          summary_120?: string | null
          summary_120_encrypted?: string | null
          text_raw?: string
          text_raw_encrypted?: string | null
          ts?: string
          updated_at?: string
          user_hash?: string | null
          user_id?: string
          valence?: number | null
        }
        Relationships: []
      }
      leaderboard_entries: {
        Row: {
          activities_completed: number | null
          avatar_url: string | null
          created_at: string
          display_name: string
          id: string
          last_activity_at: string | null
          level: number | null
          monthly_xp: number | null
          rank: number | null
          streak_days: number | null
          total_xp: number | null
          updated_at: string | null
          user_id: string
          weekly_xp: number | null
        }
        Insert: {
          activities_completed?: number | null
          avatar_url?: string | null
          created_at?: string
          display_name: string
          id?: string
          last_activity_at?: string | null
          level?: number | null
          monthly_xp?: number | null
          rank?: number | null
          streak_days?: number | null
          total_xp?: number | null
          updated_at?: string | null
          user_id: string
          weekly_xp?: number | null
        }
        Update: {
          activities_completed?: number | null
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id?: string
          last_activity_at?: string | null
          level?: number | null
          monthly_xp?: number | null
          rank?: number | null
          streak_days?: number | null
          total_xp?: number | null
          updated_at?: string | null
          user_id?: string
          weekly_xp?: number | null
        }
        Relationships: []
      }
      learning_analytics: {
        Row: {
          average_score: number | null
          created_at: string
          exams_completed: number | null
          id: string
          items_mastered: number | null
          items_reviewed: number | null
          predictions: Json | null
          streak_days: number | null
          strong_items: string[] | null
          total_study_time: number | null
          user_id: string
          weak_items: string[] | null
          week_start: string
        }
        Insert: {
          average_score?: number | null
          created_at?: string
          exams_completed?: number | null
          id?: string
          items_mastered?: number | null
          items_reviewed?: number | null
          predictions?: Json | null
          streak_days?: number | null
          strong_items?: string[] | null
          total_study_time?: number | null
          user_id: string
          weak_items?: string[] | null
          week_start: string
        }
        Update: {
          average_score?: number | null
          created_at?: string
          exams_completed?: number | null
          id?: string
          items_mastered?: number | null
          items_reviewed?: number | null
          predictions?: Json | null
          streak_days?: number | null
          strong_items?: string[] | null
          total_study_time?: number | null
          user_id?: string
          weak_items?: string[] | null
          week_start?: string
        }
        Relationships: []
      }
      learning_goals: {
        Row: {
          completed: boolean | null
          created_at: string | null
          current_value: number | null
          deadline: string | null
          goal_type: string | null
          id: string
          target_value: number | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          current_value?: number | null
          deadline?: string | null
          goal_type?: string | null
          id?: string
          target_value?: number | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          current_value?: number | null
          deadline?: string | null
          goal_type?: string | null
          id?: string
          target_value?: number | null
          title?: string
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
      manager_actions: {
        Row: {
          action_description: string
          action_type: string
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          manager_id: string
          org_id: string
          scheduled_at: string | null
          team_name: string
        }
        Insert: {
          action_description: string
          action_type: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          manager_id: string
          org_id: string
          scheduled_at?: string | null
          team_name: string
        }
        Update: {
          action_description?: string
          action_type?: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          manager_id?: string
          org_id?: string
          scheduled_at?: string | null
          team_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "manager_actions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_campaigns: {
        Row: {
          campaign_code: string
          campaign_name: string
          channel_id: string
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          purpose_id: string
          start_date: string
          status: string
          target_audience: Json | null
          updated_at: string
        }
        Insert: {
          campaign_code: string
          campaign_name: string
          channel_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          purpose_id: string
          start_date: string
          status?: string
          target_audience?: Json | null
          updated_at?: string
        }
        Update: {
          campaign_code?: string
          campaign_name?: string
          channel_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          purpose_id?: string
          start_date?: string
          status?: string
          target_audience?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_campaigns_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "consent_channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_campaigns_purpose_id_fkey"
            columns: ["purpose_id"]
            isOneToOne: false
            referencedRelation: "consent_purposes"
            referencedColumns: ["id"]
          },
        ]
      }
      match_chat_messages: {
        Row: {
          created_at: string | null
          id: string
          match_id: string
          message: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          match_id: string
          message: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          match_id?: string
          message?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_chat_messages_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "tournament_matches"
            referencedColumns: ["id"]
          },
        ]
      }
      match_predictions: {
        Row: {
          created_at: string | null
          id: string
          match_id: string
          predicted_winner: string
          reward_claimed: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          match_id: string
          predicted_winner: string
          reward_claimed?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          match_id?: string
          predicted_winner?: string
          reward_claimed?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_predictions_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "tournament_matches"
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
          ip_address: unknown
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
          ip_address?: unknown
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
          ip_address?: unknown
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
          {
            foreignKeyName: "med_mng_audio_access_logs_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "med_mng_view_library"
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
          ip_address: unknown
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
          ip_address?: unknown
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
          ip_address?: unknown
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
      med_mng_listening_modes: {
        Row: {
          created_at: string | null
          duration_minutes: number | null
          id: string
          is_active: boolean | null
          mode_config: Json | null
          mode_id: string
          started_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          mode_config?: Json | null
          mode_id: string
          started_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          mode_config?: Json | null
          mode_id?: string
          started_at?: string | null
          user_id?: string | null
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
          {
            foreignKeyName: "med_mng_listening_sessions_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "med_mng_view_library"
            referencedColumns: ["id"]
          },
        ]
      }
      med_mng_lyrics_access_logs: {
        Row: {
          created_at: string | null
          format: string
          id: string
          ip_address: unknown
          song_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          format: string
          id?: string
          ip_address?: unknown
          song_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          format?: string
          id?: string
          ip_address?: unknown
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
          {
            foreignKeyName: "med_mng_lyrics_access_logs_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "med_mng_view_library"
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
          request_ip: unknown
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
          request_ip?: unknown
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
          request_ip?: unknown
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
          {
            foreignKeyName: "med_mng_music_generation_logs_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "med_mng_view_library"
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
          {
            foreignKeyName: "med_mng_playlist_songs_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "med_mng_view_library"
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
      med_mng_recommendations: {
        Row: {
          content_id: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          priority: number | null
          reason: string | null
          recommendation_type: string | null
          user_id: string | null
        }
        Insert: {
          content_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          priority?: number | null
          reason?: string | null
          recommendation_type?: string | null
          user_id?: string | null
        }
        Update: {
          content_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          priority?: number | null
          reason?: string | null
          recommendation_type?: string | null
          user_id?: string | null
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
          {
            foreignKeyName: "med_mng_song_likes_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "med_mng_view_library"
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
          {
            foreignKeyName: "med_mng_synchronized_lyrics_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: true
            referencedRelation: "med_mng_view_library"
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
      med_mng_user_preferences: {
        Row: {
          created_at: string | null
          id: string
          learning_style: string | null
          medical_specialties: string[] | null
          preferred_genres: string[] | null
          preferred_moods: string[] | null
          study_schedule: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          learning_style?: string | null
          medical_specialties?: string[] | null
          preferred_genres?: string[] | null
          preferred_moods?: string[] | null
          study_schedule?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          learning_style?: string | null
          medical_specialties?: string[] | null
          preferred_genres?: string[] | null
          preferred_moods?: string[] | null
          study_schedule?: Json | null
          updated_at?: string | null
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
          {
            foreignKeyName: "med_mng_user_songs_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "med_mng_view_library"
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
      meditation_sessions: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          completed_duration: number | null
          config: Json | null
          created_at: string
          duration: number
          id: string
          mood_after: number | null
          mood_before: number | null
          mood_delta: number | null
          notes: string | null
          started_at: string
          technique: string
          updated_at: string
          user_id: string
          with_guidance: boolean | null
          with_music: boolean | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          completed_duration?: number | null
          config?: Json | null
          created_at?: string
          duration: number
          id?: string
          mood_after?: number | null
          mood_before?: number | null
          mood_delta?: number | null
          notes?: string | null
          started_at?: string
          technique: string
          updated_at?: string
          user_id: string
          with_guidance?: boolean | null
          with_music?: boolean | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          completed_duration?: number | null
          config?: Json | null
          created_at?: string
          duration?: number
          id?: string
          mood_after?: number | null
          mood_before?: number | null
          mood_delta?: number | null
          notes?: string | null
          started_at?: string
          technique?: string
          updated_at?: string
          user_id?: string
          with_guidance?: boolean | null
          with_music?: boolean | null
        }
        Relationships: []
      }
      mentor_sessions: {
        Row: {
          created_at: string
          duration: number | null
          feedback: string | null
          id: string
          mentor_id: string | null
          rating: number | null
          scheduled_at: string
          status: string | null
          student_id: string
          topic: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration?: number | null
          feedback?: string | null
          id?: string
          mentor_id?: string | null
          rating?: number | null
          scheduled_at: string
          status?: string | null
          student_id: string
          topic: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration?: number | null
          feedback?: string | null
          id?: string
          mentor_id?: string | null
          rating?: number | null
          scheduled_at?: string
          status?: string | null
          student_id?: string
          topic?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_sessions_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      mentors: {
        Row: {
          availability: string | null
          bio: string | null
          created_at: string
          expertise: string[] | null
          id: string
          is_active: boolean | null
          rating: number | null
          review_count: number | null
          specialty: string
          students_helped: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          availability?: string | null
          bio?: string | null
          created_at?: string
          expertise?: string[] | null
          id?: string
          is_active?: boolean | null
          rating?: number | null
          review_count?: number | null
          specialty: string
          students_helped?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          availability?: string | null
          bio?: string | null
          created_at?: string
          expertise?: string[] | null
          id?: string
          is_active?: boolean | null
          rating?: number | null
          review_count?: number | null
          specialty?: string
          students_helped?: number | null
          updated_at?: string
          user_id?: string
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
      ml_assignment_history: {
        Row: {
          alert_id: string | null
          alternative_suggestions: Json | null
          assigned_to: string | null
          assignment_method: string
          created_at: string | null
          feedback_comment: string | null
          feedback_score: number | null
          id: string
          ml_confidence: number | null
          ml_reasoning: Json | null
          resolution_time_minutes: number | null
          rule_id: string | null
          ticket_id: string | null
          was_successful: boolean | null
        }
        Insert: {
          alert_id?: string | null
          alternative_suggestions?: Json | null
          assigned_to?: string | null
          assignment_method: string
          created_at?: string | null
          feedback_comment?: string | null
          feedback_score?: number | null
          id?: string
          ml_confidence?: number | null
          ml_reasoning?: Json | null
          resolution_time_minutes?: number | null
          rule_id?: string | null
          ticket_id?: string | null
          was_successful?: boolean | null
        }
        Update: {
          alert_id?: string | null
          alternative_suggestions?: Json | null
          assigned_to?: string | null
          assignment_method?: string
          created_at?: string | null
          feedback_comment?: string | null
          feedback_score?: number | null
          id?: string
          ml_confidence?: number | null
          ml_reasoning?: Json | null
          resolution_time_minutes?: number | null
          rule_id?: string | null
          ticket_id?: string | null
          was_successful?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "ml_assignment_history_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "unified_alerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ml_assignment_history_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "team_member_skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ml_assignment_history_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "ml_assignment_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ml_assignment_history_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "auto_created_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      ml_assignment_rules: {
        Row: {
          alert_category: string | null
          alert_type: string
          auto_assign: boolean | null
          created_at: string | null
          created_by: string | null
          fallback_assignees: string[] | null
          id: string
          is_active: boolean | null
          matching_conditions: Json | null
          max_response_time_minutes: number | null
          ml_confidence_threshold: number | null
          preferred_assignees: string[] | null
          priority: number | null
          priority_level: string[] | null
          respect_availability: boolean | null
          respect_workload: boolean | null
          rule_name: string
          updated_at: string | null
          use_ml_recommendation: boolean | null
        }
        Insert: {
          alert_category?: string | null
          alert_type: string
          auto_assign?: boolean | null
          created_at?: string | null
          created_by?: string | null
          fallback_assignees?: string[] | null
          id?: string
          is_active?: boolean | null
          matching_conditions?: Json | null
          max_response_time_minutes?: number | null
          ml_confidence_threshold?: number | null
          preferred_assignees?: string[] | null
          priority?: number | null
          priority_level?: string[] | null
          respect_availability?: boolean | null
          respect_workload?: boolean | null
          rule_name: string
          updated_at?: string | null
          use_ml_recommendation?: boolean | null
        }
        Update: {
          alert_category?: string | null
          alert_type?: string
          auto_assign?: boolean | null
          created_at?: string | null
          created_by?: string | null
          fallback_assignees?: string[] | null
          id?: string
          is_active?: boolean | null
          matching_conditions?: Json | null
          max_response_time_minutes?: number | null
          ml_confidence_threshold?: number | null
          preferred_assignees?: string[] | null
          priority?: number | null
          priority_level?: string[] | null
          respect_availability?: boolean | null
          respect_workload?: boolean | null
          rule_name?: string
          updated_at?: string | null
          use_ml_recommendation?: boolean | null
        }
        Relationships: []
      }
      ml_predictions: {
        Row: {
          accuracy_score: number | null
          actual_outcome: Json | null
          confidence_score: number | null
          context: string | null
          created_at: string
          id: string
          model_version: string | null
          predicted_at: string
          prediction_data: Json
          prediction_type: string
        }
        Insert: {
          accuracy_score?: number | null
          actual_outcome?: Json | null
          confidence_score?: number | null
          context?: string | null
          created_at?: string
          id?: string
          model_version?: string | null
          predicted_at?: string
          prediction_data: Json
          prediction_type: string
        }
        Update: {
          accuracy_score?: number | null
          actual_outcome?: Json | null
          confidence_score?: number | null
          context?: string | null
          created_at?: string
          id?: string
          model_version?: string | null
          predicted_at?: string
          prediction_data?: Json
          prediction_type?: string
        }
        Relationships: []
      }
      module_connections: {
        Row: {
          connection_type: string
          created_at: string
          id: string
          metadata: Json | null
          source_module: string
          target_module: string
          weight: number | null
        }
        Insert: {
          connection_type: string
          created_at?: string
          id?: string
          metadata?: Json | null
          source_module: string
          target_module: string
          weight?: number | null
        }
        Update: {
          connection_type?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          source_module?: string
          target_module?: string
          weight?: number | null
        }
        Relationships: []
      }
      module_progress: {
        Row: {
          created_at: string
          id: string
          metadata: Json
          module_name: string
          total_xp: number
          unlocked_items: Json
          updated_at: string
          user_id: string
          user_level: number
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json
          module_name: string
          total_xp?: number
          unlocked_items?: Json
          updated_at?: string
          user_id: string
          user_level?: number
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json
          module_name?: string
          total_xp?: number
          unlocked_items?: Json
          updated_at?: string
          user_id?: string
          user_level?: number
        }
        Relationships: []
      }
      monitoring_events: {
        Row: {
          ai_analysis: Json | null
          context: string
          created_at: string
          event_type: string
          id: string
          message: string
          metadata: Json | null
          severity: string
          timestamp: string
          user_id: string | null
        }
        Insert: {
          ai_analysis?: Json | null
          context: string
          created_at?: string
          event_type: string
          id?: string
          message: string
          metadata?: Json | null
          severity: string
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          ai_analysis?: Json | null
          context?: string
          created_at?: string
          event_type?: string
          id?: string
          message?: string
          metadata?: Json | null
          severity?: string
          timestamp?: string
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
      monitoring_metrics: {
        Row: {
          id: string
          is_anomaly: boolean | null
          metadata: Json | null
          metric_name: string
          metric_unit: string | null
          metric_value: number
          recorded_at: string | null
          threshold_value: number | null
        }
        Insert: {
          id?: string
          is_anomaly?: boolean | null
          metadata?: Json | null
          metric_name: string
          metric_unit?: string | null
          metric_value: number
          recorded_at?: string | null
          threshold_value?: number | null
        }
        Update: {
          id?: string
          is_anomaly?: boolean | null
          metadata?: Json | null
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number
          recorded_at?: string | null
          threshold_value?: number | null
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
          {
            foreignKeyName: "mood_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_mixer_presets: {
        Row: {
          category: string | null
          components: Json
          created_at: string
          description: string | null
          id: string
          is_favorite: boolean | null
          name: string
          updated_at: string
          use_count: number | null
          user_id: string
        }
        Insert: {
          category?: string | null
          components?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_favorite?: boolean | null
          name: string
          updated_at?: string
          use_count?: number | null
          user_id: string
        }
        Update: {
          category?: string | null
          components?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_favorite?: boolean | null
          name?: string
          updated_at?: string
          use_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      mood_mixer_sessions: {
        Row: {
          activities_selected: string[] | null
          completed_at: string | null
          created_at: string
          duration_seconds: number | null
          id: string
          mood_after: string | null
          mood_before: string | null
          satisfaction_score: number | null
          user_id: string
        }
        Insert: {
          activities_selected?: string[] | null
          completed_at?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          mood_after?: string | null
          mood_before?: string | null
          satisfaction_score?: number | null
          user_id: string
        }
        Update: {
          activities_selected?: string[] | null
          completed_at?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          mood_after?: string | null
          mood_before?: string | null
          satisfaction_score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      mood_tracking: {
        Row: {
          context: string | null
          coping_strategies: Json | null
          created_at: string
          emotions: Json | null
          id: string
          mood_score: number
          notes: string | null
          triggers: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          context?: string | null
          coping_strategies?: Json | null
          created_at?: string
          emotions?: Json | null
          id?: string
          mood_score: number
          notes?: string | null
          triggers?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          context?: string | null
          coping_strategies?: Json | null
          created_at?: string
          emotions?: Json | null
          id?: string
          mood_score?: number
          notes?: string | null
          triggers?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      moods: {
        Row: {
          arousal: number
          context: Json | null
          created_at: string | null
          id: string
          note: string | null
          score: number | null
          tags: string[] | null
          ts: string | null
          user_id: string
          valence: number
        }
        Insert: {
          arousal: number
          context?: Json | null
          created_at?: string | null
          id?: string
          note?: string | null
          score?: number | null
          tags?: string[] | null
          ts?: string | null
          user_id: string
          valence: number
        }
        Update: {
          arousal?: number
          context?: Json | null
          created_at?: string | null
          id?: string
          note?: string | null
          score?: number | null
          tags?: string[] | null
          ts?: string | null
          user_id?: string
          valence?: number
        }
        Relationships: []
      }
      music_achievements: {
        Row: {
          category: string
          code: string
          created_at: string | null
          description: string
          icon: string
          id: string
          name: string
          requirement_type: string
          requirement_value: number
          tier: string
          xp_reward: number
        }
        Insert: {
          category: string
          code: string
          created_at?: string | null
          description: string
          icon: string
          id?: string
          name: string
          requirement_type: string
          requirement_value: number
          tier?: string
          xp_reward?: number
        }
        Update: {
          category?: string
          code?: string
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          name?: string
          requirement_type?: string
          requirement_value?: number
          tier?: string
          xp_reward?: number
        }
        Relationships: []
      }
      music_challenges: {
        Row: {
          challenge_type: string
          created_at: string
          creator_id: string
          creator_progress: number | null
          description: string | null
          end_date: string | null
          goal_value: number | null
          id: string
          participant_id: string | null
          participant_progress: number | null
          reward_points: number | null
          start_date: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          challenge_type?: string
          created_at?: string
          creator_id: string
          creator_progress?: number | null
          description?: string | null
          end_date?: string | null
          goal_value?: number | null
          id?: string
          participant_id?: string | null
          participant_progress?: number | null
          reward_points?: number | null
          start_date?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          challenge_type?: string
          created_at?: string
          creator_id?: string
          creator_progress?: number | null
          description?: string | null
          end_date?: string | null
          goal_value?: number | null
          id?: string
          participant_id?: string | null
          participant_progress?: number | null
          reward_points?: number | null
          start_date?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
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
      music_feedback: {
        Row: {
          audio_url: string | null
          created_at: string | null
          id: string
          item_code: string
          rating: number | null
          style: string | null
          user_id: string
        }
        Insert: {
          audio_url?: string | null
          created_at?: string | null
          id?: string
          item_code: string
          rating?: number | null
          style?: string | null
          user_id: string
        }
        Update: {
          audio_url?: string | null
          created_at?: string | null
          id?: string
          item_code?: string
          rating?: number | null
          style?: string | null
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
      music_friends: {
        Row: {
          created_at: string
          friend_id: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      music_generation_metrics: {
        Row: {
          api_response_time_ms: number | null
          audio_generated: boolean | null
          audio_url: string | null
          completed_at: string | null
          content_type: string
          created_at: string
          duration_seconds: number | null
          error_code: string | null
          error_message: string | null
          failed_at: string | null
          id: string
          initiated_at: string
          item_code: string
          polling_attempts: number | null
          rang: string
          status: string
          style: string
          track_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          api_response_time_ms?: number | null
          audio_generated?: boolean | null
          audio_url?: string | null
          completed_at?: string | null
          content_type: string
          created_at?: string
          duration_seconds?: number | null
          error_code?: string | null
          error_message?: string | null
          failed_at?: string | null
          id?: string
          initiated_at?: string
          item_code: string
          polling_attempts?: number | null
          rang: string
          status?: string
          style: string
          track_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          api_response_time_ms?: number | null
          audio_generated?: boolean | null
          audio_url?: string | null
          completed_at?: string | null
          content_type?: string
          created_at?: string
          duration_seconds?: number | null
          error_code?: string | null
          error_message?: string | null
          failed_at?: string | null
          id?: string
          initiated_at?: string
          item_code?: string
          polling_attempts?: number | null
          rang?: string
          status?: string
          style?: string
          track_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      music_generation_queue: {
        Row: {
          completed_at: string | null
          created_at: string
          emotion: string
          error_message: string | null
          generation_status: string | null
          id: string
          intensity: number
          max_retries: number
          metadata: Json | null
          mood: string | null
          retry_count: number
          started_at: string | null
          status: string
          track_id: string | null
          user_context: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          emotion: string
          error_message?: string | null
          generation_status?: string | null
          id?: string
          intensity?: number
          max_retries?: number
          metadata?: Json | null
          mood?: string | null
          retry_count?: number
          started_at?: string | null
          status?: string
          track_id?: string | null
          user_context?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          emotion?: string
          error_message?: string | null
          generation_status?: string | null
          id?: string
          intensity?: number
          max_retries?: number
          metadata?: Json | null
          mood?: string | null
          retry_count?: number
          started_at?: string | null
          status?: string
          track_id?: string | null
          user_context?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "music_generation_queue_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "generated_music_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      music_generation_sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          emotion_badge: string | null
          emotion_state: Json
          error_message: string | null
          id: string
          result: Json | null
          status: string
          suno_config: Json
          task_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          emotion_badge?: string | null
          emotion_state: Json
          error_message?: string | null
          id?: string
          result?: Json | null
          status?: string
          suno_config: Json
          task_id: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          emotion_badge?: string | null
          emotion_state?: Json
          error_message?: string | null
          id?: string
          result?: Json | null
          status?: string
          suno_config?: Json
          task_id?: string
          user_id?: string
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
      music_guilds: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_public: boolean | null
          max_members: number | null
          member_count: number | null
          music_genre: string | null
          name: string
          owner_id: string
          total_xp: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          max_members?: number | null
          member_count?: number | null
          music_genre?: string | null
          name: string
          owner_id: string
          total_xp?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          max_members?: number | null
          member_count?: number | null
          music_genre?: string | null
          name?: string
          owner_id?: string
          total_xp?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      music_history: {
        Row: {
          completion_rate: number | null
          device: string | null
          emotion: string | null
          id: string
          listen_duration: number | null
          metadata: Json | null
          mood: string | null
          played_at: string
          source: string | null
          track_artist: string | null
          track_duration: number | null
          track_id: string
          track_title: string | null
          track_url: string | null
          user_id: string
        }
        Insert: {
          completion_rate?: number | null
          device?: string | null
          emotion?: string | null
          id?: string
          listen_duration?: number | null
          metadata?: Json | null
          mood?: string | null
          played_at?: string
          source?: string | null
          track_artist?: string | null
          track_duration?: number | null
          track_id: string
          track_title?: string | null
          track_url?: string | null
          user_id: string
        }
        Update: {
          completion_rate?: number | null
          device?: string | null
          emotion?: string | null
          id?: string
          listen_duration?: number | null
          metadata?: Json | null
          mood?: string | null
          played_at?: string
          source?: string | null
          track_artist?: string | null
          track_duration?: number | null
          track_id?: string
          track_title?: string | null
          track_url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      music_journey_tracks: {
        Row: {
          created_at: string
          emotion_after: string | null
          emotion_level: string
          id: string
          is_completed: boolean | null
          journey_id: string
          played_at: string | null
          step_number: number
          track_id: string | null
          user_rating: number | null
        }
        Insert: {
          created_at?: string
          emotion_after?: string | null
          emotion_level: string
          id?: string
          is_completed?: boolean | null
          journey_id: string
          played_at?: string | null
          step_number: number
          track_id?: string | null
          user_rating?: number | null
        }
        Update: {
          created_at?: string
          emotion_after?: string | null
          emotion_level?: string
          id?: string
          is_completed?: boolean | null
          journey_id?: string
          played_at?: string | null
          step_number?: number
          track_id?: string | null
          user_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "music_journey_tracks_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "music_journeys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "music_journey_tracks_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "generated_music_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      music_journeys: {
        Row: {
          completed_at: string | null
          created_at: string
          current_step: number
          description: string | null
          emotion_start: string
          emotion_target: string
          id: string
          progress_percentage: number | null
          started_at: string
          status: string
          title: string
          total_steps: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_step?: number
          description?: string | null
          emotion_start: string
          emotion_target: string
          id?: string
          progress_percentage?: number | null
          started_at?: string
          status?: string
          title: string
          total_steps?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_step?: number
          description?: string | null
          emotion_start?: string
          emotion_target?: string
          id?: string
          progress_percentage?: number | null
          started_at?: string
          status?: string
          title?: string
          total_steps?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      music_leaderboard: {
        Row: {
          avatar_url: string | null
          display_name: string
          id: string
          last_updated: string | null
          monthly_rank: number | null
          monthly_score: number | null
          rank: number | null
          total_score: number | null
          user_id: string
          weekly_rank: number | null
          weekly_score: number | null
        }
        Insert: {
          avatar_url?: string | null
          display_name: string
          id?: string
          last_updated?: string | null
          monthly_rank?: number | null
          monthly_score?: number | null
          rank?: number | null
          total_score?: number | null
          user_id: string
          weekly_rank?: number | null
          weekly_score?: number | null
        }
        Update: {
          avatar_url?: string | null
          display_name?: string
          id?: string
          last_updated?: string | null
          monthly_rank?: number | null
          monthly_score?: number | null
          rank?: number | null
          total_score?: number | null
          user_id?: string
          weekly_rank?: number | null
          weekly_score?: number | null
        }
        Relationships: []
      }
      music_listening_sessions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          duration_seconds: number | null
          emotion_after: string | null
          emotion_before: string | null
          id: string
          metadata: Json | null
          session_type: string | null
          track_id: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          emotion_after?: string | null
          emotion_before?: string | null
          id?: string
          metadata?: Json | null
          session_type?: string | null
          track_id?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          emotion_after?: string | null
          emotion_before?: string | null
          id?: string
          metadata?: Json | null
          session_type?: string | null
          track_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      music_notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          is_read: boolean
          message: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          message?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          message?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      music_play_history: {
        Row: {
          completed: boolean | null
          duration_listened: number | null
          id: string
          metadata: Json | null
          mood_after: string | null
          mood_before: string | null
          played_at: string
          track_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          duration_listened?: number | null
          id?: string
          metadata?: Json | null
          mood_after?: string | null
          mood_before?: string | null
          played_at?: string
          track_id: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          duration_listened?: number | null
          id?: string
          metadata?: Json | null
          mood_after?: string | null
          mood_before?: string | null
          played_at?: string
          track_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "music_play_history_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "generated_music_tracks"
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
      music_quests: {
        Row: {
          category: string
          created_at: string | null
          description: string
          difficulty: string
          end_date: string | null
          id: string
          is_active: boolean | null
          max_progress: number
          points_reward: number
          quest_type: string
          start_date: string
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          difficulty: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          max_progress?: number
          points_reward?: number
          quest_type: string
          start_date?: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          difficulty?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          max_progress?: number
          points_reward?: number
          quest_type?: string
          start_date?: string
          title?: string
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
      music_therapy_tracks: {
        Row: {
          artist: string
          audio_url: string | null
          binaural_hz: number | null
          category: string
          cover_url: string | null
          created_at: string | null
          description: string | null
          duration_seconds: number
          frequency: string | null
          id: string
          is_premium: boolean | null
          play_count: number | null
          tags: string[] | null
          title: string
        }
        Insert: {
          artist?: string
          audio_url?: string | null
          binaural_hz?: number | null
          category: string
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          duration_seconds: number
          frequency?: string | null
          id?: string
          is_premium?: boolean | null
          play_count?: number | null
          tags?: string[] | null
          title: string
        }
        Update: {
          artist?: string
          audio_url?: string | null
          binaural_hz?: number | null
          category?: string
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          duration_seconds?: number
          frequency?: string | null
          id?: string
          is_premium?: boolean | null
          play_count?: number | null
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
      music_track_feedback: {
        Row: {
          context: Json | null
          created_at: string
          emotion_match: boolean | null
          feedback_type: string | null
          id: string
          notes: string | null
          rating: number | null
          session_id: string | null
          track_id: string
          user_id: string
        }
        Insert: {
          context?: Json | null
          created_at?: string
          emotion_match?: boolean | null
          feedback_type?: string | null
          id?: string
          notes?: string | null
          rating?: number | null
          session_id?: string | null
          track_id: string
          user_id: string
        }
        Update: {
          context?: Json | null
          created_at?: string
          emotion_match?: boolean | null
          feedback_type?: string | null
          id?: string
          notes?: string | null
          rating?: number | null
          session_id?: string | null
          track_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "music_track_feedback_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "music_generation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      music_uploads: {
        Row: {
          bit_rate: number | null
          channels: number | null
          duration: number | null
          file_size: number
          format: string | null
          id: string
          metadata: Json | null
          mime_type: string
          original_filename: string
          processed_at: string | null
          processing_error: string | null
          sample_rate: number | null
          status: string
          storage_path: string
          track_album: string | null
          track_artist: string | null
          track_genre: string | null
          track_title: string | null
          uploaded_at: string
          user_id: string
        }
        Insert: {
          bit_rate?: number | null
          channels?: number | null
          duration?: number | null
          file_size: number
          format?: string | null
          id?: string
          metadata?: Json | null
          mime_type: string
          original_filename: string
          processed_at?: string | null
          processing_error?: string | null
          sample_rate?: number | null
          status?: string
          storage_path: string
          track_album?: string | null
          track_artist?: string | null
          track_genre?: string | null
          track_title?: string | null
          uploaded_at?: string
          user_id: string
        }
        Update: {
          bit_rate?: number | null
          channels?: number | null
          duration?: number | null
          file_size?: number
          format?: string | null
          id?: string
          metadata?: Json | null
          mime_type?: string
          original_filename?: string
          processed_at?: string | null
          processing_error?: string | null
          sample_rate?: number | null
          status?: string
          storage_path?: string
          track_album?: string | null
          track_artist?: string | null
          track_genre?: string | null
          track_title?: string | null
          uploaded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean | null
          source: string | null
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean | null
          source?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean | null
          source?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      notification_filter_templates: {
        Row: {
          created_at: string | null
          description: string | null
          filters: Json
          id: string
          is_default: boolean | null
          is_shared: boolean | null
          name: string
          shared_with_team: boolean | null
          shared_with_users: string[] | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          filters: Json
          id?: string
          is_default?: boolean | null
          is_shared?: boolean | null
          name: string
          shared_with_team?: boolean | null
          shared_with_users?: string[] | null
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          filters?: Json
          id?: string
          is_default?: boolean | null
          is_shared?: boolean | null
          name?: string
          shared_with_team?: boolean | null
          shared_with_users?: string[] | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notification_history: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_content: string
          platform: string
          sent_at: string
          status: string
          template_id: string | null
          test_id: string | null
          test_name: string | null
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_content: string
          platform: string
          sent_at?: string
          status: string
          template_id?: string | null
          test_id?: string | null
          test_name?: string | null
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_content?: string
          platform?: string
          sent_at?: string
          status?: string
          template_id?: string | null
          test_id?: string | null
          test_name?: string | null
          user_id?: string
          webhook_url?: string | null
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
          created_at: string
          id: string
          is_default: boolean | null
          name: string
          platform: string
          template_content: string
          updated_at: string
          user_id: string
          variables: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          name: string
          platform: string
          template_content: string
          updated_at?: string
          user_id: string
          variables?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          name?: string
          platform?: string
          template_content?: string
          updated_at?: string
          user_id?: string
          variables?: Json | null
        }
        Relationships: []
      }
      notification_webhooks: {
        Row: {
          channel: string | null
          created_at: string | null
          enabled: boolean | null
          events: string[]
          id: string
          name: string
          updated_at: string | null
          webhook_type: string
          webhook_url: string
        }
        Insert: {
          channel?: string | null
          created_at?: string | null
          enabled?: boolean | null
          events?: string[]
          id?: string
          name: string
          updated_at?: string | null
          webhook_type: string
          webhook_url: string
        }
        Update: {
          channel?: string | null
          created_at?: string | null
          enabled?: boolean | null
          events?: string[]
          id?: string
          name?: string
          updated_at?: string | null
          webhook_type?: string
          webhook_url?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_link: string | null
          action_text: string | null
          action_url: string | null
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
          is_read: boolean | null
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
          action_url?: string | null
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
          is_read?: boolean | null
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
          action_url?: string | null
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
          is_read?: boolean | null
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
      nyvee_sessions: {
        Row: {
          assessment_results: Json | null
          completed_at: string | null
          created_at: string | null
          id: string
          session_data: Json
          user_id: string
        }
        Insert: {
          assessment_results?: Json | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          session_data?: Json
          user_id: string
        }
        Update: {
          assessment_results?: Json | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          session_data?: Json
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
      onboarding_progress: {
        Row: {
          completed_steps: string[] | null
          created_at: string | null
          current_step: number | null
          id: string
          is_active: boolean | null
          seen_tooltips: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_steps?: string[] | null
          created_at?: string | null
          current_step?: number | null
          id?: string
          is_active?: boolean | null
          seen_tooltips?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_steps?: string[] | null
          created_at?: string | null
          current_step?: number | null
          id?: string
          is_active?: boolean | null
          seen_tooltips?: string[] | null
          updated_at?: string | null
          user_id?: string
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
      org_access_codes: {
        Row: {
          code: string
          code_type: string
          created_at: string
          created_by: string | null
          current_uses: number | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          org_id: string
          updated_at: string
        }
        Insert: {
          code: string
          code_type?: string
          created_at?: string
          created_by?: string | null
          current_uses?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          org_id: string
          updated_at?: string
        }
        Update: {
          code?: string
          code_type?: string
          created_at?: string
          created_by?: string | null
          current_uses?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          org_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_access_codes_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
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
      org_daily_aggregates: {
        Row: {
          avg_duration_seconds: number | null
          created_at: string
          date: string
          id: string
          org_id: string
          sessions_by_hour: Json | null
          sessions_by_type: Json | null
          team_id: string | null
          total_sessions: number | null
          unique_users_hash_count: number | null
          updated_at: string
        }
        Insert: {
          avg_duration_seconds?: number | null
          created_at?: string
          date: string
          id?: string
          org_id: string
          sessions_by_hour?: Json | null
          sessions_by_type?: Json | null
          team_id?: string | null
          total_sessions?: number | null
          unique_users_hash_count?: number | null
          updated_at?: string
        }
        Update: {
          avg_duration_seconds?: number | null
          created_at?: string
          date?: string
          id?: string
          org_id?: string
          sessions_by_hour?: Json | null
          sessions_by_type?: Json | null
          team_id?: string | null
          total_sessions?: number | null
          unique_users_hash_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_daily_aggregates_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_ethical_disclaimers: {
        Row: {
          accepted_at: string
          accepted_by: string | null
          created_at: string
          disclaimer_version: string
          id: string
          ip_address: string | null
          org_id: string
        }
        Insert: {
          accepted_at?: string
          accepted_by?: string | null
          created_at?: string
          disclaimer_version?: string
          id?: string
          ip_address?: string | null
          org_id: string
        }
        Update: {
          accepted_at?: string
          accepted_by?: string | null
          created_at?: string
          disclaimer_version?: string
          id?: string
          ip_address?: string | null
          org_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_ethical_disclaimers_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
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
      org_monthly_reports: {
        Row: {
          created_at: string
          generated_at: string
          generated_by: string | null
          id: string
          month: number
          org_id: string
          report_data: Json
          status: string | null
          year: number
        }
        Insert: {
          created_at?: string
          generated_at?: string
          generated_by?: string | null
          id?: string
          month: number
          org_id: string
          report_data?: Json
          status?: string | null
          year: number
        }
        Update: {
          created_at?: string
          generated_at?: string
          generated_by?: string | null
          id?: string
          month?: number
          org_id?: string
          report_data?: Json
          status?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "org_monthly_reports_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_teams: {
        Row: {
          created_at: string
          description: string | null
          id: string
          manager_id: string | null
          name: string
          org_id: string
          settings: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          manager_id?: string | null
          name: string
          org_id: string
          settings?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          manager_id?: string | null
          name?: string
          org_id?: string
          settings?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_teams_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_time_aggregates: {
        Row: {
          aggregation_type: string | null
          block_distribution: Json | null
          cohort_size: number | null
          created_at: string | null
          department: string | null
          id: string
          metrics: Json
          org_id: string | null
          period_end: string
          period_start: string
          recommendations: Json | null
          risk_zones: Json | null
          team_id: string | null
        }
        Insert: {
          aggregation_type?: string | null
          block_distribution?: Json | null
          cohort_size?: number | null
          created_at?: string | null
          department?: string | null
          id?: string
          metrics?: Json
          org_id?: string | null
          period_end: string
          period_start: string
          recommendations?: Json | null
          risk_zones?: Json | null
          team_id?: string | null
        }
        Update: {
          aggregation_type?: string | null
          block_distribution?: Json | null
          cohort_size?: number | null
          created_at?: string | null
          department?: string | null
          id?: string
          metrics?: Json
          org_id?: string | null
          period_end?: string
          period_start?: string
          recommendations?: Json | null
          risk_zones?: Json | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "org_time_aggregates_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_time_scenarios: {
        Row: {
          configuration: Json
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          impact_analysis: Json | null
          is_active: boolean | null
          name: string
          org_id: string | null
          scenario_type: string | null
          updated_at: string | null
        }
        Insert: {
          configuration?: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          impact_analysis?: Json | null
          is_active?: boolean | null
          name: string
          org_id?: string | null
          scenario_type?: string | null
          updated_at?: string | null
        }
        Update: {
          configuration?: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          impact_analysis?: Json | null
          is_active?: boolean | null
          name?: string
          org_id?: string | null
          scenario_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "org_time_scenarios_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_weekly_aggregates: {
        Row: {
          adoption_rate: number | null
          created_at: string
          id: string
          most_used_features: Json | null
          org_id: string
          peak_usage_hours: Json | null
          sessions_by_type: Json | null
          team_id: string | null
          total_sessions: number | null
          trend_vs_previous_week: number | null
          unique_users_hash_count: number | null
          updated_at: string
          week_end: string
          week_start: string
        }
        Insert: {
          adoption_rate?: number | null
          created_at?: string
          id?: string
          most_used_features?: Json | null
          org_id: string
          peak_usage_hours?: Json | null
          sessions_by_type?: Json | null
          team_id?: string | null
          total_sessions?: number | null
          trend_vs_previous_week?: number | null
          unique_users_hash_count?: number | null
          updated_at?: string
          week_end: string
          week_start: string
        }
        Update: {
          adoption_rate?: number | null
          created_at?: string
          id?: string
          most_used_features?: Json | null
          org_id?: string
          peak_usage_hours?: Json | null
          sessions_by_type?: Json | null
          team_id?: string | null
          total_sessions?: number | null
          trend_vs_previous_week?: number | null
          unique_users_hash_count?: number | null
          updated_at?: string
          week_end?: string
          week_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_weekly_aggregates_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_wellness_events: {
        Row: {
          created_at: string
          created_by: string | null
          current_participants: number | null
          description: string | null
          duration_minutes: number | null
          event_date: string
          event_type: string
          id: string
          is_recurring: boolean | null
          max_participants: number | null
          org_id: string
          recurrence_rule: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          current_participants?: number | null
          description?: string | null
          duration_minutes?: number | null
          event_date: string
          event_type?: string
          id?: string
          is_recurring?: boolean | null
          max_participants?: number | null
          org_id: string
          recurrence_rule?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          current_participants?: number | null
          description?: string | null
          duration_minutes?: number | null
          event_date?: string
          event_type?: string
          id?: string
          is_recurring?: boolean | null
          max_participants?: number | null
          org_id?: string
          recurrence_rule?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_wellness_events_org_id_fkey"
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
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          access_code: string | null
          created_at: string
          description: string | null
          domain: string | null
          ethical_charter_accepted: boolean | null
          ethical_charter_accepted_at: string | null
          id: string
          industry: string | null
          logo_url: string | null
          max_users: number | null
          name: string
          org_type: string | null
          privacy_settings: Json | null
          settings: Json | null
          size_category: string | null
          subscription_plan: string | null
          updated_at: string
        }
        Insert: {
          access_code?: string | null
          created_at?: string
          description?: string | null
          domain?: string | null
          ethical_charter_accepted?: boolean | null
          ethical_charter_accepted_at?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          max_users?: number | null
          name: string
          org_type?: string | null
          privacy_settings?: Json | null
          settings?: Json | null
          size_category?: string | null
          subscription_plan?: string | null
          updated_at?: string
        }
        Update: {
          access_code?: string | null
          created_at?: string
          description?: string | null
          domain?: string | null
          ethical_charter_accepted?: boolean | null
          ethical_charter_accepted_at?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          max_users?: number | null
          name?: string
          org_type?: string | null
          privacy_settings?: Json | null
          settings?: Json | null
          size_category?: string | null
          subscription_plan?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      orgs: {
        Row: {
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          settings: Json | null
          subscription_plan: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          settings?: Json | null
          subscription_plan?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          settings?: Json | null
          subscription_plan?: string | null
          updated_at?: string | null
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
      page_notes: {
        Row: {
          color: string | null
          content: string
          created_at: string | null
          id: string
          is_pinned: boolean | null
          page_path: string
          tags: string[] | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          page_path: string
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          page_path?: string
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      parcours_presets: {
        Row: {
          created_at: string
          duration_max: number
          duration_min: number
          emotion_category: string
          id: string
          preset_config: Json
          preset_key: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration_max?: number
          duration_min?: number
          emotion_category: string
          id?: string
          preset_config: Json
          preset_key: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration_max?: number
          duration_min?: number
          emotion_category?: string
          id?: string
          preset_config?: Json
          preset_key?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      parcours_runs: {
        Row: {
          created_at: string
          ended_at: string | null
          id: string
          metadata: Json | null
          notes_encrypted: string | null
          preset_key: string
          started_at: string
          status: string
          suds_end: number | null
          suds_mid: number | null
          suds_start: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          notes_encrypted?: string | null
          preset_key: string
          started_at?: string
          status?: string
          suds_end?: number | null
          suds_mid?: number | null
          suds_start?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          notes_encrypted?: string | null
          preset_key?: string
          started_at?: string
          status?: string
          suds_end?: number | null
          suds_mid?: number | null
          suds_start?: number | null
          user_id?: string
        }
        Relationships: []
      }
      parcours_segments: {
        Row: {
          audio_url: string | null
          created_at: string
          end_seconds: number
          id: string
          lyrics: Json | null
          run_id: string
          segment_index: number
          start_seconds: number
          status: string
          storage_path: string | null
          stream_url: string | null
          suno_task_id: string | null
          title: string
          voiceover_script: string | null
          voiceover_url: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          end_seconds: number
          id?: string
          lyrics?: Json | null
          run_id: string
          segment_index: number
          start_seconds: number
          status?: string
          storage_path?: string | null
          stream_url?: string | null
          suno_task_id?: string | null
          title: string
          voiceover_script?: string | null
          voiceover_url?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          end_seconds?: number
          id?: string
          lyrics?: Json | null
          run_id?: string
          segment_index?: number
          start_seconds?: number
          status?: string
          storage_path?: string | null
          stream_url?: string | null
          suno_task_id?: string | null
          title?: string
          voiceover_script?: string | null
          voiceover_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parcours_segments_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "parcours_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      pdf_report_schedules: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          last_run_at: string | null
          next_run_at: string | null
          options: Json | null
          recipient_emails: string[]
          report_type: string
          schedule_cron: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_run_at?: string | null
          next_run_at?: string | null
          options?: Json | null
          recipient_emails: string[]
          report_type: string
          schedule_cron: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_run_at?: string | null
          next_run_at?: string | null
          options?: Json | null
          recipient_emails?: string[]
          report_type?: string
          schedule_cron?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pdf_reports: {
        Row: {
          created_at: string
          file_size: number | null
          file_url: string | null
          id: string
          metadata: Json | null
          report_type: string
          report_version: number
          score_global: number | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_size?: number | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          report_type: string
          report_version?: number
          score_global?: number | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_size?: number | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          report_type?: string
          report_version?: number
          score_global?: number | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      pdf_templates: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          primary_color: string | null
          sections: Json
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          primary_color?: string | null
          sections?: Json
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          primary_color?: string | null
          sections?: Json
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      pending_activations: {
        Row: {
          created_at: string | null
          email: string
          id: string
          order_data: Json | null
          order_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          order_data?: Json | null
          order_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          order_data?: Json | null
          order_id?: string
          status?: string | null
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
      performance_degradation_alerts: {
        Row: {
          acknowledged: boolean | null
          acknowledged_at: string | null
          category: string
          created_at: string | null
          current_period_end: string
          current_period_start: string
          current_score: number
          degradation_percentage: number
          dismissed: boolean | null
          dismissed_at: string | null
          id: string
          previous_period_end: string
          previous_period_start: string
          previous_score: number
          severity: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          category: string
          created_at?: string | null
          current_period_end: string
          current_period_start: string
          current_score: number
          degradation_percentage: number
          dismissed?: boolean | null
          dismissed_at?: string | null
          id?: string
          previous_period_end: string
          previous_period_start: string
          previous_score: number
          severity: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          category?: string
          created_at?: string | null
          current_period_end?: string
          current_period_start?: string
          current_score?: number
          degradation_percentage?: number
          dismissed?: boolean | null
          dismissed_at?: string | null
          id?: string
          previous_period_end?: string
          previous_period_start?: string
          previous_score?: number
          severity?: string
          updated_at?: string | null
          user_id?: string
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
      plan_sessions: {
        Row: {
          completed: boolean
          completed_date: string | null
          created_at: string
          duration_minutes: number
          id: string
          item_code: string | null
          notes: string | null
          plan_id: string
          scheduled_date: string
          title: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_date?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          item_code?: string | null
          notes?: string | null
          plan_id: string
          scheduled_date: string
          title: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_date?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          item_code?: string | null
          notes?: string | null
          plan_id?: string
          scheduled_date?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_sessions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "study_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      playlist_listen_stats: {
        Row: {
          completed: boolean | null
          duration_seconds: number | null
          id: string
          listened_at: string
          playlist_id: string
          track_index: number | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          duration_seconds?: number | null
          id?: string
          listened_at?: string
          playlist_id: string
          track_index?: number | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          duration_seconds?: number | null
          id?: string
          listened_at?: string
          playlist_id?: string
          track_index?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "playlist_listen_stats_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "automix_playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      playlist_tracks: {
        Row: {
          added_at: string
          id: string
          playlist_id: string
          position: number
          track_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          playlist_id: string
          position?: number
          track_id: string
        }
        Update: {
          added_at?: string
          id?: string
          playlist_id?: string
          position?: number
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlist_tracks_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "user_playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_tracks_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "generated_music_tracks"
            referencedColumns: ["id"]
          },
        ]
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
      policy_acceptances: {
        Row: {
          accepted_at: string
          id: string
          ip_address: string | null
          policy_id: string
          policy_version: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          accepted_at?: string
          id?: string
          ip_address?: string | null
          policy_id: string
          policy_version: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          accepted_at?: string
          id?: string
          ip_address?: string | null
          policy_id?: string
          policy_version?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "policy_acceptances_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "privacy_policies"
            referencedColumns: ["id"]
          },
        ]
      }
      policy_changes: {
        Row: {
          change_description: string | null
          change_type: string
          changed_at: string
          changed_by: string | null
          id: string
          policy_id: string
        }
        Insert: {
          change_description?: string | null
          change_type: string
          changed_at?: string
          changed_by?: string | null
          id?: string
          policy_id: string
        }
        Update: {
          change_description?: string | null
          change_type?: string
          changed_at?: string
          changed_by?: string | null
          id?: string
          policy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "policy_changes_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "privacy_policies"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reactions: {
        Row: {
          comment_id: string | null
          created_at: string | null
          id: string
          post_id: string | null
          reaction_type: string
          user_id: string
        }
        Insert: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          post_id?: string | null
          reaction_type: string
          user_id: string
        }
        Update: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          post_id?: string | null
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "community_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
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
      premium_rewards: {
        Row: {
          cost_points: number | null
          created_at: string
          data: Json
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          preview_url: string | null
          rarity: string
          required_level: number | null
          required_xp: number | null
          reward_type: string
        }
        Insert: {
          cost_points?: number | null
          created_at?: string
          data?: Json
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          preview_url?: string | null
          rarity?: string
          required_level?: number | null
          required_xp?: number | null
          reward_type: string
        }
        Update: {
          cost_points?: number | null
          created_at?: string
          data?: Json
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          preview_url?: string | null
          rarity?: string
          required_level?: number | null
          required_xp?: number | null
          reward_type?: string
        }
        Relationships: []
      }
      preset_likes: {
        Row: {
          created_at: string
          id: string
          preset_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          preset_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          preset_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "preset_likes_preset_id_fkey"
            columns: ["preset_id"]
            isOneToOne: false
            referencedRelation: "community_presets"
            referencedColumns: ["id"]
          },
        ]
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
      privacy_policies: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          effective_date: string
          id: string
          is_current: boolean
          status: string
          summary: string | null
          updated_at: string
          version: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          effective_date: string
          id?: string
          is_current?: boolean
          status?: string
          summary?: string | null
          updated_at?: string
          version: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          effective_date?: string
          id?: string
          is_current?: boolean
          status?: string
          summary?: string | null
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      product_module_mapping: {
        Row: {
          created_at: string | null
          id: string
          module_description: string | null
          module_name: string
          shopify_product_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          module_description?: string | null
          module_name: string
          shopify_product_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          module_description?: string | null
          module_name?: string
          shopify_product_id?: string
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
          language: string | null
          location: string | null
          name: string | null
          org_id: string | null
          phone: string | null
          preferences: Json | null
          role: string | null
          subscription_plan: string | null
          team_id: string | null
          updated_at: string | null
          user_role: Database["public"]["Enums"]["app_user_role"] | null
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
          language?: string | null
          location?: string | null
          name?: string | null
          org_id?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: string | null
          subscription_plan?: string | null
          team_id?: string | null
          updated_at?: string | null
          user_role?: Database["public"]["Enums"]["app_user_role"] | null
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
          language?: string | null
          location?: string | null
          name?: string | null
          org_id?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: string | null
          subscription_plan?: string | null
          team_id?: string | null
          updated_at?: string | null
          user_role?: Database["public"]["Enums"]["app_user_role"] | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      pseudonymization_keys: {
        Row: {
          algorithm: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          key_encrypted: string
          key_hash: string
          rotation_count: number
          rule_id: string
        }
        Insert: {
          algorithm: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_encrypted: string
          key_hash: string
          rotation_count?: number
          rule_id: string
        }
        Update: {
          algorithm?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_encrypted?: string
          key_hash?: string
          rotation_count?: number
          rule_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pseudonymization_keys_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "pseudonymization_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      pseudonymization_log: {
        Row: {
          data_type: string
          error_message: string | null
          field_name: string | null
          id: string
          ip_address: unknown
          operation: string
          performed_at: string
          performed_by: string | null
          records_affected: number | null
          rule_id: string | null
          success: boolean
          user_agent: string | null
        }
        Insert: {
          data_type: string
          error_message?: string | null
          field_name?: string | null
          id?: string
          ip_address?: unknown
          operation: string
          performed_at?: string
          performed_by?: string | null
          records_affected?: number | null
          rule_id?: string | null
          success: boolean
          user_agent?: string | null
        }
        Update: {
          data_type?: string
          error_message?: string | null
          field_name?: string | null
          id?: string
          ip_address?: unknown
          operation?: string
          performed_at?: string
          performed_by?: string | null
          records_affected?: number | null
          rule_id?: string | null
          success?: boolean
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pseudonymization_log_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "pseudonymization_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      pseudonymization_mapping: {
        Row: {
          accessed_count: number
          created_at: string
          encrypted_original: string
          id: string
          last_accessed_at: string | null
          original_hash: string
          pseudonymized_value: string
          rule_id: string
        }
        Insert: {
          accessed_count?: number
          created_at?: string
          encrypted_original: string
          id?: string
          last_accessed_at?: string | null
          original_hash: string
          pseudonymized_value: string
          rule_id: string
        }
        Update: {
          accessed_count?: number
          created_at?: string
          encrypted_original?: string
          id?: string
          last_accessed_at?: string | null
          original_hash?: string
          pseudonymized_value?: string
          rule_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pseudonymization_mapping_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "pseudonymization_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      pseudonymization_rules: {
        Row: {
          algorithm: string
          auto_apply: boolean
          created_at: string
          created_by: string | null
          data_type: string
          description: string | null
          field_name: string
          id: string
          is_active: boolean
          is_reversible: boolean
          retention_days: number | null
          updated_at: string
        }
        Insert: {
          algorithm: string
          auto_apply?: boolean
          created_at?: string
          created_by?: string | null
          data_type: string
          description?: string | null
          field_name: string
          id?: string
          is_active?: boolean
          is_reversible?: boolean
          retention_days?: number | null
          updated_at?: string
        }
        Update: {
          algorithm?: string
          auto_apply?: boolean
          created_at?: string
          created_by?: string | null
          data_type?: string
          description?: string | null
          field_name?: string
          id?: string
          is_active?: boolean
          is_reversible?: boolean
          retention_days?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      pseudonymization_stats: {
        Row: {
          avg_processing_time_ms: number | null
          date: string
          depseudonymized_count: number
          failed_count: number
          id: string
          pseudonymized_count: number
          rule_id: string
        }
        Insert: {
          avg_processing_time_ms?: number | null
          date?: string
          depseudonymized_count?: number
          failed_count?: number
          id?: string
          pseudonymized_count?: number
          rule_id: string
        }
        Update: {
          avg_processing_time_ms?: number | null
          date?: string
          depseudonymized_count?: number
          failed_count?: number
          id?: string
          pseudonymized_count?: number
          rule_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pseudonymization_stats_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "pseudonymization_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_history: {
        Row: {
          created_at: string | null
          currency: string | null
          id: string
          modules_activated: string[] | null
          order_data: Json | null
          order_id: string
          status: string | null
          total_amount: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          id?: string
          modules_activated?: string[] | null
          order_data?: Json | null
          order_id: string
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          id?: string
          modules_activated?: string[] | null
          order_data?: Json | null
          order_id?: string
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      push_notifications: {
        Row: {
          body: string
          created_at: string
          data: Json | null
          id: string
          notification_type: string
          read_at: string | null
          sent_at: string | null
          status: string
          title: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          data?: Json | null
          id?: string
          notification_type: string
          read_at?: string | null
          sent_at?: string | null
          status?: string
          title: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          data?: Json | null
          id?: string
          notification_type?: string
          read_at?: string | null
          sent_at?: string | null
          status?: string
          title?: string
          user_id?: string
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
      pwa_metrics: {
        Row: {
          browser: string | null
          cls: number | null
          connection_type: string | null
          created_at: string | null
          device_type: string | null
          fcp: number | null
          id: string
          inp: number | null
          install_date: string | null
          is_installed: boolean | null
          is_offline: boolean | null
          is_pwa: boolean | null
          lcp: number | null
          os: string | null
          page_views: number | null
          screen_height: number | null
          screen_width: number | null
          session_duration: number | null
          session_id: string
          ttfb: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          browser?: string | null
          cls?: number | null
          connection_type?: string | null
          created_at?: string | null
          device_type?: string | null
          fcp?: number | null
          id?: string
          inp?: number | null
          install_date?: string | null
          is_installed?: boolean | null
          is_offline?: boolean | null
          is_pwa?: boolean | null
          lcp?: number | null
          os?: string | null
          page_views?: number | null
          screen_height?: number | null
          screen_width?: number | null
          session_duration?: number | null
          session_id: string
          ttfb?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          browser?: string | null
          cls?: number | null
          connection_type?: string | null
          created_at?: string | null
          device_type?: string | null
          fcp?: number | null
          id?: string
          inp?: number | null
          install_date?: string | null
          is_installed?: boolean | null
          is_offline?: boolean | null
          is_pwa?: boolean | null
          lcp?: number | null
          os?: string | null
          page_views?: number | null
          screen_height?: number | null
          screen_width?: number | null
          session_duration?: number | null
          session_id?: string
          ttfb?: number | null
          updated_at?: string | null
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
      quality_alert_config: {
        Row: {
          created_at: string
          digest_day: number | null
          digest_enabled: boolean
          digest_frequency: string
          digest_time: string
          email_recipients: string[]
          id: string
          min_severity: string
          notification_frequency: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          digest_day?: number | null
          digest_enabled?: boolean
          digest_frequency?: string
          digest_time?: string
          email_recipients?: string[]
          id?: string
          min_severity?: string
          notification_frequency?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          digest_day?: number | null
          digest_enabled?: boolean
          digest_frequency?: string
          digest_time?: string
          email_recipients?: string[]
          id?: string
          min_severity?: string
          notification_frequency?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      quality_notifications: {
        Row: {
          created_at: string
          details: Json | null
          id: string
          message: string
          severity: string
          summary: string
          type: string
        }
        Insert: {
          created_at?: string
          details?: Json | null
          id?: string
          message: string
          severity: string
          summary: string
          type: string
        }
        Update: {
          created_at?: string
          details?: Json | null
          id?: string
          message?: string
          severity?: string
          summary?: string
          type?: string
        }
        Relationships: []
      }
      quiet_hours_settings: {
        Row: {
          created_at: string
          enabled: boolean | null
          end_utc: string | null
          id: string
          start_utc: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          enabled?: boolean | null
          end_utc?: string | null
          id?: string
          start_utc?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          enabled?: boolean | null
          end_utc?: string | null
          id?: string
          start_utc?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      quiz_results: {
        Row: {
          answers: Json | null
          correct_answers: number
          created_at: string
          id: string
          item_code: string
          item_title: string
          performance: Json | null
          score: number
          time_spent: number
          total_questions: number
          user_id: string | null
          wrong_answers: number
        }
        Insert: {
          answers?: Json | null
          correct_answers: number
          created_at?: string
          id?: string
          item_code: string
          item_title: string
          performance?: Json | null
          score: number
          time_spent?: number
          total_questions: number
          user_id?: string | null
          wrong_answers: number
        }
        Update: {
          answers?: Json | null
          correct_answers?: number
          created_at?: string
          id?: string
          item_code?: string
          item_title?: string
          performance?: Json | null
          score?: number
          time_spent?: number
          total_questions?: number
          user_id?: string | null
          wrong_answers?: number
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
      realtime_notifications: {
        Row: {
          action_url: string | null
          created_at: string
          expires_at: string | null
          id: string
          message: string
          metadata: Json | null
          read: boolean
          read_at: string | null
          severity: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          read?: boolean
          read_at?: string | null
          severity: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          read?: boolean
          read_at?: string | null
          severity?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      recommendation_alerts: {
        Row: {
          alert_triggered: boolean | null
          alert_triggered_at: string | null
          applied: boolean | null
          applied_at: string | null
          category: string
          created_at: string
          description: string
          dismissed: boolean | null
          dismissed_at: string | null
          first_seen_at: string
          historical_score: number
          id: string
          impact: string
          last_checked_at: string
          recommendation_id: string
          title: string
          user_id: string
        }
        Insert: {
          alert_triggered?: boolean | null
          alert_triggered_at?: string | null
          applied?: boolean | null
          applied_at?: string | null
          category: string
          created_at?: string
          description: string
          dismissed?: boolean | null
          dismissed_at?: string | null
          first_seen_at?: string
          historical_score: number
          id?: string
          impact: string
          last_checked_at?: string
          recommendation_id: string
          title: string
          user_id: string
        }
        Update: {
          alert_triggered?: boolean | null
          alert_triggered_at?: string | null
          applied?: boolean | null
          applied_at?: string | null
          category?: string
          created_at?: string
          description?: string
          dismissed?: boolean | null
          dismissed_at?: string | null
          first_seen_at?: string
          historical_score?: number
          id?: string
          impact?: string
          last_checked_at?: string
          recommendation_id?: string
          title?: string
          user_id?: string
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
      report_send_history: {
        Row: {
          error_message: string | null
          id: string
          recipient_emails: string[]
          report_data: Json | null
          scheduled_report_id: string | null
          sent_at: string | null
          status: string
        }
        Insert: {
          error_message?: string | null
          id?: string
          recipient_emails: string[]
          report_data?: Json | null
          scheduled_report_id?: string | null
          sent_at?: string | null
          status: string
        }
        Update: {
          error_message?: string | null
          id?: string
          recipient_emails?: string[]
          report_data?: Json | null
          scheduled_report_id?: string | null
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_send_history_scheduled_report_id_fkey"
            columns: ["scheduled_report_id"]
            isOneToOne: false
            referencedRelation: "scheduled_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      report_signatures: {
        Row: {
          certificate_id: string
          created_at: string
          id: string
          report_id: string
          signature_hash: string
          timestamp: string
          user_id: string | null
        }
        Insert: {
          certificate_id: string
          created_at?: string
          id?: string
          report_id: string
          signature_hash: string
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          certificate_id?: string
          created_at?: string
          id?: string
          report_id?: string
          signature_hash?: string
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      report_validations: {
        Row: {
          compliance_checks: Json
          created_at: string
          id: string
          immediate_actions: Json | null
          overall_assessment: string
          recommendations: Json
          report_id: string
          user_id: string | null
        }
        Insert: {
          compliance_checks: Json
          created_at?: string
          id?: string
          immediate_actions?: Json | null
          overall_assessment: string
          recommendations: Json
          report_id: string
          user_id?: string | null
        }
        Update: {
          compliance_checks?: Json
          created_at?: string
          id?: string
          immediate_actions?: Json | null
          overall_assessment?: string
          recommendations?: Json
          report_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      resource_bookmarks: {
        Row: {
          created_at: string
          id: string
          resource_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          resource_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          resource_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_bookmarks_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "shared_resources"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          likes_count: number | null
          resource_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          likes_count?: number | null
          resource_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          likes_count?: number | null
          resource_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_comments_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "shared_resources"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_likes: {
        Row: {
          created_at: string
          id: string
          resource_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          resource_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          resource_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_likes_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "shared_resources"
            referencedColumns: ["id"]
          },
        ]
      }
      retention_notifications: {
        Row: {
          acknowledged: boolean | null
          acknowledged_at: string | null
          entities_count: number
          entity_type: string
          expiration_date: string
          id: string
          notification_type: string
          sent_at: string
          user_id: string
        }
        Insert: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          entities_count?: number
          entity_type: string
          expiration_date: string
          id?: string
          notification_type: string
          sent_at?: string
          user_id: string
        }
        Update: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          entities_count?: number
          entity_type?: string
          expiration_date?: string
          id?: string
          notification_type?: string
          sent_at?: string
          user_id?: string
        }
        Relationships: []
      }
      review_sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          items_again: number
          items_correct: number
          items_reviewed: number
          session_type: string
          started_at: string
          total_time_seconds: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          items_again?: number
          items_correct?: number
          items_reviewed?: number
          session_type?: string
          started_at?: string
          total_time_seconds?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          items_again?: number
          items_correct?: number
          items_reviewed?: number
          session_type?: string
          started_at?: string
          total_time_seconds?: number | null
          user_id?: string
        }
        Relationships: []
      }
      revision_history: {
        Row: {
          created_at: string
          id: string
          item_code: string
          score: number
          session_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_code: string
          score?: number
          session_date?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_code?: string
          score?: number
          session_date?: string
          user_id?: string
        }
        Relationships: []
      }
      revision_plans: {
        Row: {
          completion_rate: number | null
          created_at: string | null
          daily_target: number | null
          estimated_duration_days: number | null
          id: string
          plan_name: string
          target_items: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completion_rate?: number | null
          created_at?: string | null
          daily_target?: number | null
          estimated_duration_days?: number | null
          id?: string
          plan_name: string
          target_items?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completion_rate?: number | null
          created_at?: string | null
          daily_target?: number | null
          estimated_duration_days?: number | null
          id?: string
          plan_name?: string
          target_items?: string[] | null
          updated_at?: string | null
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
      role_audit_logs: {
        Row: {
          action: string
          changed_at: string
          changed_by: string | null
          created_at: string
          id: string
          metadata: Json | null
          new_role: string | null
          old_role: string | null
          role: string
          user_id: string
        }
        Insert: {
          action: string
          changed_at?: string
          changed_by?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          new_role?: string | null
          old_role?: string | null
          role: string
          user_id: string
        }
        Update: {
          action?: string
          changed_at?: string
          changed_by?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          new_role?: string | null
          old_role?: string | null
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      room_members: {
        Row: {
          display_name: string | null
          id: string
          joined_at: string
          member_id: string | null
          preferences: Json | null
          role: string | null
          room_id: string
          user_id: string | null
        }
        Insert: {
          display_name?: string | null
          id?: string
          joined_at?: string
          member_id?: string | null
          preferences?: Json | null
          role?: string | null
          room_id: string
          user_id?: string | null
        }
        Update: {
          display_name?: string | null
          id?: string
          joined_at?: string
          member_id?: string | null
          preferences?: Json | null
          role?: string | null
          room_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_members_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "social_rooms"
            referencedColumns: ["id"]
          },
        ]
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
      saved_mood_mixes: {
        Row: {
          badge_color: string | null
          badge_name: string | null
          created_at: string | null
          emotions: Json
          id: string
          name: string
          user_id: string
        }
        Insert: {
          badge_color?: string | null
          badge_name?: string | null
          created_at?: string | null
          emotions: Json
          id?: string
          name: string
          user_id: string
        }
        Update: {
          badge_color?: string | null
          badge_name?: string | null
          created_at?: string | null
          emotions?: Json
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_searches: {
        Row: {
          created_at: string | null
          filters: Json | null
          id: string
          name: string | null
          query: string
          saved_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          filters?: Json | null
          id?: string
          name?: string | null
          query: string
          saved_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          filters?: Json | null
          id?: string
          name?: string | null
          query?: string
          saved_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      scan_history: {
        Row: {
          created_at: string
          dominant_emotion: string | null
          emotions: Json | null
          id: string
          intensity: number | null
          metadata: Json | null
          scan_data: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          dominant_emotion?: string | null
          emotions?: Json | null
          id?: string
          intensity?: number | null
          metadata?: Json | null
          scan_data: Json
          user_id: string
        }
        Update: {
          created_at?: string
          dominant_emotion?: string | null
          emotions?: Json | null
          id?: string
          intensity?: number | null
          metadata?: Json | null
          scan_data?: Json
          user_id?: string
        }
        Relationships: []
      }
      scheduled_reports: {
        Row: {
          created_at: string | null
          enabled: boolean | null
          id: string
          last_sent_at: string | null
          next_scheduled_at: string | null
          recipients: string[]
          report_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          last_sent_at?: string | null
          next_scheduled_at?: string | null
          recipients: string[]
          report_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          last_sent_at?: string | null
          next_scheduled_at?: string | null
          recipients?: string[]
          report_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      score_comparisons: {
        Row: {
          comparison_data: Json
          created_at: string
          id: string
          period_a_end: string
          period_a_start: string
          period_b_end: string
          period_b_start: string
          user_id: string
        }
        Insert: {
          comparison_data: Json
          created_at?: string
          id?: string
          period_a_end: string
          period_a_start: string
          period_b_end: string
          period_b_start: string
          user_id: string
        }
        Update: {
          comparison_data?: Json
          created_at?: string
          id?: string
          period_a_end?: string
          period_a_start?: string
          period_b_end?: string
          period_b_start?: string
          user_id?: string
        }
        Relationships: []
      }
      score_goals: {
        Row: {
          completed_at: string | null
          created_at: string
          current_value: number | null
          deadline: string | null
          goal_type: string
          id: string
          reward_claimed: boolean | null
          status: string | null
          target_value: number
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_value?: number | null
          deadline?: string | null
          goal_type: string
          id?: string
          reward_claimed?: boolean | null
          status?: string | null
          target_value: number
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_value?: number | null
          deadline?: string | null
          goal_type?: string
          id?: string
          reward_claimed?: boolean | null
          status?: string | null
          target_value?: number
          user_id?: string
        }
        Relationships: []
      }
      score_milestones: {
        Row: {
          id: string
          metadata: Json | null
          milestone_type: string
          milestone_value: number
          notified: boolean | null
          reached_at: string
          shared: boolean | null
          user_id: string
        }
        Insert: {
          id?: string
          metadata?: Json | null
          milestone_type: string
          milestone_value: number
          notified?: boolean | null
          reached_at?: string
          shared?: boolean | null
          user_id: string
        }
        Update: {
          id?: string
          metadata?: Json | null
          milestone_type?: string
          milestone_value?: number
          notified?: boolean | null
          reached_at?: string
          shared?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      screen_silk_sessions: {
        Row: {
          badge: string | null
          created_at: string | null
          duration_seconds: number | null
          hints: Json | null
          id: string
          session_id: string
          user_id: string
        }
        Insert: {
          badge?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          hints?: Json | null
          id?: string
          session_id: string
          user_id: string
        }
        Update: {
          badge?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          hints?: Json | null
          id?: string
          session_id?: string
          user_id?: string
        }
        Relationships: []
      }
      screen_silk_textures: {
        Row: {
          asset_url: string | null
          id: string
          name: string
          rarity: string | null
          texture_id: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          asset_url?: string | null
          id?: string
          name: string
          rarity?: string | null
          texture_id: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          asset_url?: string | null
          id?: string
          name?: string
          rarity?: string | null
          texture_id?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      search_history: {
        Row: {
          created_at: string | null
          filters: Json | null
          id: string
          query: string
          results_count: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          filters?: Json | null
          id?: string
          query: string
          results_count?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          filters?: Json | null
          id?: string
          query?: string
          results_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      season_rankings: {
        Row: {
          created_at: string | null
          id: string
          matches_played: number | null
          matches_won: number | null
          rank: number
          season_id: string
          total_xp: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          matches_played?: number | null
          matches_won?: number | null
          rank: number
          season_id: string
          total_xp?: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          matches_played?: number | null
          matches_won?: number | null
          rank?: number
          season_id?: string
          total_xp?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "season_rankings_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "competitive_seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      season_rewards: {
        Row: {
          created_at: string | null
          id: string
          rank_max: number | null
          rank_min: number
          reward_data: Json
          reward_type: string
          season_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          rank_max?: number | null
          rank_min: number
          reward_data: Json
          reward_type: string
          season_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          rank_max?: number | null
          rank_min?: number
          reward_data?: Json
          reward_type?: string
          season_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "season_rewards_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "competitive_seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      security_alerts: {
        Row: {
          affected_resource: string | null
          alert_type: string
          created_at: string
          description: string
          id: string
          metadata: Json | null
          recommendation: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          status: string
          title: string
        }
        Insert: {
          affected_resource?: string | null
          alert_type: string
          created_at?: string
          description: string
          id?: string
          metadata?: Json | null
          recommendation?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          status?: string
          title: string
        }
        Update: {
          affected_resource?: string | null
          alert_type?: string
          created_at?: string
          description?: string
          id?: string
          metadata?: Json | null
          recommendation?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          status?: string
          title?: string
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
          ip_address: unknown
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_details?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_details?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_corrections_history: {
        Row: {
          after_state: Json | null
          applied_at: string
          applied_by: string | null
          before_state: Json | null
          correction_applied: string
          correction_type: string
          id: string
          issue_description: string
          migration_file: string | null
          notes: string | null
          severity: string
          table_or_function_name: string
        }
        Insert: {
          after_state?: Json | null
          applied_at?: string
          applied_by?: string | null
          before_state?: Json | null
          correction_applied: string
          correction_type: string
          id?: string
          issue_description: string
          migration_file?: string | null
          notes?: string | null
          severity: string
          table_or_function_name: string
        }
        Update: {
          after_state?: Json | null
          applied_at?: string
          applied_by?: string | null
          before_state?: Json | null
          correction_applied?: string
          correction_type?: string
          id?: string
          issue_description?: string
          migration_file?: string | null
          notes?: string | null
          severity?: string
          table_or_function_name?: string
        }
        Relationships: []
      }
      security_documentation: {
        Row: {
          category: string
          documented_at: string | null
          id: number
          issue: string
          justification: string
          risk_level: string
          status: string
        }
        Insert: {
          category: string
          documented_at?: string | null
          id?: number
          issue: string
          justification: string
          risk_level: string
          status: string
        }
        Update: {
          category?: string
          documented_at?: string | null
          id?: number
          issue?: string
          justification?: string
          risk_level?: string
          status?: string
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
      security_manual_actions: {
        Row: {
          action_type: string
          completed: boolean | null
          created_at: string | null
          dashboard_url: string | null
          description: string
          id: string
          priority: string
        }
        Insert: {
          action_type: string
          completed?: boolean | null
          created_at?: string | null
          dashboard_url?: string | null
          description: string
          id?: string
          priority: string
        }
        Update: {
          action_type?: string
          completed?: boolean | null
          created_at?: string | null
          dashboard_url?: string | null
          description?: string
          id?: string
          priority?: string
        }
        Relationships: []
      }
      security_metrics_snapshots: {
        Row: {
          critical_issues: number
          functions_with_search_path: number
          high_issues: number
          id: string
          info_issues: number
          linter_issues: Json | null
          low_issues: number
          medium_issues: number
          recorded_at: string
          security_score: number
          tables_with_rls: number
          total_functions: number
          total_policies: number
          total_tables: number
        }
        Insert: {
          critical_issues?: number
          functions_with_search_path: number
          high_issues?: number
          id?: string
          info_issues?: number
          linter_issues?: Json | null
          low_issues?: number
          medium_issues?: number
          recorded_at?: string
          security_score: number
          tables_with_rls: number
          total_functions: number
          total_policies: number
          total_tables: number
        }
        Update: {
          critical_issues?: number
          functions_with_search_path?: number
          high_issues?: number
          id?: string
          info_issues?: number
          linter_issues?: Json | null
          low_issues?: number
          medium_issues?: number
          recorded_at?: string
          security_score?: number
          tables_with_rls?: number
          total_functions?: number
          total_policies?: number
          total_tables?: number
        }
        Relationships: []
      }
      security_notifications: {
        Row: {
          created_at: string | null
          details: Json | null
          expires_at: string | null
          id: string
          message: string
          read_by: string[] | null
          related_resource_id: string | null
          related_resource_type: string | null
          related_user_id: string | null
          severity: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          expires_at?: string | null
          id?: string
          message: string
          read_by?: string[] | null
          related_resource_id?: string | null
          related_resource_type?: string | null
          related_user_id?: string | null
          severity: string
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          expires_at?: string | null
          id?: string
          message?: string
          read_by?: string[] | null
          related_resource_id?: string | null
          related_resource_type?: string | null
          related_user_id?: string | null
          severity?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      session_emotions: {
        Row: {
          arousal: number | null
          context: Json | null
          created_at: string | null
          detected_at: string | null
          emotion: string
          id: string
          intensity: number | null
          session_id: string | null
          source: string | null
          user_id: string | null
          valence: number | null
        }
        Insert: {
          arousal?: number | null
          context?: Json | null
          created_at?: string | null
          detected_at?: string | null
          emotion: string
          id?: string
          intensity?: number | null
          session_id?: string | null
          source?: string | null
          user_id?: string | null
          valence?: number | null
        }
        Update: {
          arousal?: number | null
          context?: Json | null
          created_at?: string | null
          detected_at?: string | null
          emotion?: string
          id?: string
          intensity?: number | null
          session_id?: string | null
          source?: string | null
          user_id?: string | null
          valence?: number | null
        }
        Relationships: []
      }
      session_history: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          duration_seconds: number | null
          id: string
          metadata: Json | null
          module_type: string
          score: number | null
          session_data: Json | null
          started_at: string | null
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          metadata?: Json | null
          module_type: string
          score?: number | null
          session_data?: Json | null
          started_at?: string | null
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          metadata?: Json | null
          module_type?: string
          score?: number | null
          session_data?: Json | null
          started_at?: string | null
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          achievements_unlocked: string[] | null
          created_at: string
          duration_seconds: number | null
          ended_at: string | null
          id: string
          metadata: Json | null
          mood_after: number | null
          mood_before: number | null
          mood_delta: number | null
          session_type: string
          source_id: string | null
          started_at: string
          updated_at: string
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          achievements_unlocked?: string[] | null
          created_at?: string
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          mood_after?: number | null
          mood_before?: number | null
          mood_delta?: number | null
          session_type: string
          source_id?: string | null
          started_at?: string
          updated_at?: string
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          achievements_unlocked?: string[] | null
          created_at?: string
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          mood_after?: number | null
          mood_before?: number | null
          mood_delta?: number | null
          session_type?: string
          source_id?: string | null
          started_at?: string
          updated_at?: string
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: []
      }
      settings_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          enabled: boolean
          id: string
          notification_emails: string[]
          threshold_count: number
          threshold_duration_minutes: number
          updated_at: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          enabled?: boolean
          id?: string
          notification_emails?: string[]
          threshold_count?: number
          threshold_duration_minutes?: number
          updated_at?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          enabled?: boolean
          id?: string
          notification_emails?: string[]
          threshold_count?: number
          threshold_duration_minutes?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      seuil_events: {
        Row: {
          action_taken: string | null
          action_type: string | null
          created_at: string
          id: string
          notes: string | null
          session_completed: boolean | null
          threshold_level: number
          updated_at: string
          user_id: string
          zone: string
        }
        Insert: {
          action_taken?: string | null
          action_type?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          session_completed?: boolean | null
          threshold_level: number
          updated_at?: string
          user_id: string
          zone: string
        }
        Update: {
          action_taken?: string | null
          action_type?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          session_completed?: boolean | null
          threshold_level?: number
          updated_at?: string
          user_id?: string
          zone?: string
        }
        Relationships: []
      }
      share_audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          resource_id: string
          resource_type: string
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id: string
          resource_type: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string
          resource_type?: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      share_notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          metadata: Json | null
          notification_type: string
          read: boolean
          share_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          notification_type: string
          read?: boolean
          share_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          notification_type?: string
          read?: boolean
          share_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "share_notifications_share_id_fkey"
            columns: ["share_id"]
            isOneToOne: false
            referencedRelation: "sitemap_shares"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_playlists: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_public: boolean | null
          playlist_id: string
          qr_code_url: string | null
          share_token: string
          user_id: string
          view_count: number | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_public?: boolean | null
          playlist_id: string
          qr_code_url?: string | null
          share_token: string
          user_id: string
          view_count?: number | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_public?: boolean | null
          playlist_id?: string
          qr_code_url?: string | null
          share_token?: string
          user_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shared_playlists_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "automix_playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_resources: {
        Row: {
          author_id: string
          comments_count: number | null
          created_at: string
          description: string | null
          downloads_count: number | null
          id: string
          is_approved: boolean | null
          likes_count: number | null
          resource_type: string
          tags: string[] | null
          title: string
          updated_at: string
          url: string
          views_count: number | null
        }
        Insert: {
          author_id: string
          comments_count?: number | null
          created_at?: string
          description?: string | null
          downloads_count?: number | null
          id?: string
          is_approved?: boolean | null
          likes_count?: number | null
          resource_type?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          url: string
          views_count?: number | null
        }
        Update: {
          author_id?: string
          comments_count?: number | null
          created_at?: string
          description?: string | null
          downloads_count?: number | null
          id?: string
          is_approved?: boolean | null
          likes_count?: number | null
          resource_type?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          url?: string
          views_count?: number | null
        }
        Relationships: []
      }
      shopify_purchases: {
        Row: {
          activated_at: string | null
          created_at: string
          currency_code: string
          id: string
          order_id: string
          price_amount: number
          product_handle: string
          product_title: string
          quantity: number
          shopify_product_id: string
          updated_at: string
          user_id: string | null
          variant_id: string
          variant_title: string | null
        }
        Insert: {
          activated_at?: string | null
          created_at?: string
          currency_code?: string
          id?: string
          order_id: string
          price_amount: number
          product_handle: string
          product_title: string
          quantity?: number
          shopify_product_id: string
          updated_at?: string
          user_id?: string | null
          variant_id: string
          variant_title?: string | null
        }
        Update: {
          activated_at?: string | null
          created_at?: string
          currency_code?: string
          id?: string
          order_id?: string
          price_amount?: number
          product_handle?: string
          product_title?: string
          quantity?: number
          shopify_product_id?: string
          updated_at?: string
          user_id?: string | null
          variant_id?: string
          variant_title?: string | null
        }
        Relationships: []
      }
      sitemap_shares: {
        Row: {
          created_at: string
          id: string
          owner_id: string
          permission: Database["public"]["Enums"]["share_permission"]
          shared_with_email: string
          shared_with_user_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          owner_id: string
          permission?: Database["public"]["Enums"]["share_permission"]
          shared_with_email: string
          shared_with_user_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          owner_id?: string
          permission?: Database["public"]["Enums"]["share_permission"]
          shared_with_email?: string
          shared_with_user_id?: string | null
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
      social_room_breaks: {
        Row: {
          created_at: string
          created_by: string | null
          delivery_channel: string | null
          duration_minutes: number | null
          id: string
          invitees: Json | null
          remind_at: string | null
          room_id: string
          starts_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          delivery_channel?: string | null
          duration_minutes?: number | null
          id?: string
          invitees?: Json | null
          remind_at?: string | null
          room_id: string
          starts_at: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          delivery_channel?: string | null
          duration_minutes?: number | null
          id?: string
          invitees?: Json | null
          remind_at?: string | null
          room_id?: string
          starts_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_room_breaks_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "social_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      social_room_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          role: string | null
          room_ref: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          role?: string | null
          room_ref: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          role?: string | null
          room_ref?: string
        }
        Relationships: []
      }
      social_rooms: {
        Row: {
          allow_audio: boolean | null
          created_at: string
          description: string | null
          host_display_name: string | null
          host_id: string | null
          id: string
          invite_code: string | null
          is_private: boolean | null
          metadata: Json | null
          name: string
          soft_mode_enabled: boolean | null
          topic: string | null
          updated_at: string
        }
        Insert: {
          allow_audio?: boolean | null
          created_at?: string
          description?: string | null
          host_display_name?: string | null
          host_id?: string | null
          id?: string
          invite_code?: string | null
          is_private?: boolean | null
          metadata?: Json | null
          name: string
          soft_mode_enabled?: boolean | null
          topic?: string | null
          updated_at?: string
        }
        Update: {
          allow_audio?: boolean | null
          created_at?: string
          description?: string | null
          host_display_name?: string | null
          host_id?: string | null
          id?: string
          invite_code?: string | null
          is_private?: boolean | null
          metadata?: Json | null
          name?: string
          soft_mode_enabled?: boolean | null
          topic?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      special_badges: {
        Row: {
          category: string
          condition_type: string
          condition_value: number
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          rarity: string | null
          xp_reward: number | null
        }
        Insert: {
          category: string
          condition_type: string
          condition_value: number
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          rarity?: string | null
          xp_reward?: number | null
        }
        Update: {
          category?: string
          condition_type?: string
          condition_value?: number
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          rarity?: string | null
          xp_reward?: number | null
        }
        Relationships: []
      }
      srs_card_data: {
        Row: {
          card_id: string
          correct_count: number | null
          created_at: string | null
          ease_factor: number | null
          id: string
          interval_days: number | null
          last_reviewed: string | null
          next_review: string | null
          review_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          card_id: string
          correct_count?: number | null
          created_at?: string | null
          ease_factor?: number | null
          id?: string
          interval_days?: number | null
          last_reviewed?: string | null
          next_review?: string | null
          review_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          card_id?: string
          correct_count?: number | null
          created_at?: string | null
          ease_factor?: number | null
          id?: string
          interval_days?: number | null
          last_reviewed?: string | null
          next_review?: string | null
          review_count?: number | null
          updated_at?: string | null
          user_id?: string
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
      story_synth_sessions: {
        Row: {
          choices_made: Json | null
          completed_at: string | null
          created_at: string
          duration_seconds: number | null
          emotion_tags: string[] | null
          id: string
          is_favorite: boolean | null
          reading_duration_seconds: number | null
          story_content: string | null
          story_theme: string | null
          theme: string | null
          tone: string | null
          updated_at: string | null
          user_context: string | null
          user_id: string
        }
        Insert: {
          choices_made?: Json | null
          completed_at?: string | null
          created_at?: string
          duration_seconds?: number | null
          emotion_tags?: string[] | null
          id?: string
          is_favorite?: boolean | null
          reading_duration_seconds?: number | null
          story_content?: string | null
          story_theme?: string | null
          theme?: string | null
          tone?: string | null
          updated_at?: string | null
          user_context?: string | null
          user_id: string
        }
        Update: {
          choices_made?: Json | null
          completed_at?: string | null
          created_at?: string
          duration_seconds?: number | null
          emotion_tags?: string[] | null
          id?: string
          is_favorite?: boolean | null
          reading_duration_seconds?: number | null
          story_content?: string | null
          story_theme?: string | null
          theme?: string | null
          tone?: string | null
          updated_at?: string | null
          user_context?: string | null
          user_id?: string
        }
        Relationships: []
      }
      story_synth_stories: {
        Row: {
          audio_url: string | null
          content: string
          created_at: string | null
          duration_seconds: number | null
          id: string
          intentions: string[]
          is_favorite: boolean | null
          play_count: number | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          audio_url?: string | null
          content: string
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          intentions: string[]
          is_favorite?: boolean | null
          play_count?: number | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          audio_url?: string | null
          content?: string
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          intentions?: string[]
          is_favorite?: boolean | null
          play_count?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
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
      study_group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          role: string | null
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          role?: string | null
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      study_groups: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_public: boolean | null
          last_activity_at: string | null
          member_count: number | null
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          last_activity_at?: string | null
          member_count?: number | null
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          last_activity_at?: string | null
          member_count?: number | null
          name?: string
        }
        Relationships: []
      }
      study_plans: {
        Row: {
          created_at: string
          description: string | null
          id: string
          priority: string
          progress: number
          sessions_completed: number
          status: string
          target_date: string
          title: string
          total_sessions: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          priority?: string
          progress?: number
          sessions_completed?: number
          status?: string
          target_date: string
          title: string
          total_sessions?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          priority?: string
          progress?: number
          sessions_completed?: number
          status?: string
          target_date?: string
          title?: string
          total_sessions?: number
          updated_at?: string
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
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      suno_api_status: {
        Row: {
          consecutive_failures: number
          error_message: string | null
          id: string
          is_available: boolean
          last_check: string
          response_time_ms: number | null
        }
        Insert: {
          consecutive_failures?: number
          error_message?: string | null
          id?: string
          is_available?: boolean
          last_check?: string
          response_time_ms?: number | null
        }
        Update: {
          consecutive_failures?: number
          error_message?: string | null
          id?: string
          is_available?: boolean
          last_check?: string
          response_time_ms?: number | null
        }
        Relationships: []
      }
      suno_callbacks: {
        Row: {
          callback_type: string
          created_at: string | null
          id: string
          metadata: Json | null
          status: string | null
          task_id: string
        }
        Insert: {
          callback_type: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
          task_id: string
        }
        Update: {
          callback_type?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
          task_id?: string
        }
        Relationships: []
      }
      suno_generated_tracks: {
        Row: {
          audio_url: string
          category: string | null
          completed_at: string | null
          created_at: string
          duration: number | null
          expires_at: string | null
          generated_at: string | null
          id: string
          is_fallback: boolean | null
          model: string | null
          status: string | null
          task_id: string | null
          title: string
          user_id: string
          vinyl_id: string
        }
        Insert: {
          audio_url: string
          category?: string | null
          completed_at?: string | null
          created_at?: string
          duration?: number | null
          expires_at?: string | null
          generated_at?: string | null
          id?: string
          is_fallback?: boolean | null
          model?: string | null
          status?: string | null
          task_id?: string | null
          title: string
          user_id: string
          vinyl_id: string
        }
        Update: {
          audio_url?: string
          category?: string | null
          completed_at?: string | null
          created_at?: string
          duration?: number | null
          expires_at?: string | null
          generated_at?: string | null
          id?: string
          is_fallback?: boolean | null
          model?: string | null
          status?: string | null
          task_id?: string | null
          title?: string
          user_id?: string
          vinyl_id?: string
        }
        Relationships: []
      }
      system_health_metrics: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          metric_name: string
          metric_unit: string | null
          metric_value: number
          timestamp: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_unit?: string | null
          metric_value: number
          timestamp?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number
          timestamp?: string | null
        }
        Relationships: []
      }
      system_health_thresholds: {
        Row: {
          comparison_operator: string
          created_at: string | null
          critical_threshold: number
          description: string | null
          enabled: boolean | null
          id: string
          metric_name: string
          notification_channels: string[] | null
          updated_at: string | null
          warning_threshold: number
        }
        Insert: {
          comparison_operator: string
          created_at?: string | null
          critical_threshold: number
          description?: string | null
          enabled?: boolean | null
          id?: string
          metric_name: string
          notification_channels?: string[] | null
          updated_at?: string | null
          warning_threshold: number
        }
        Update: {
          comparison_operator?: string
          created_at?: string | null
          critical_threshold?: number
          description?: string | null
          enabled?: boolean | null
          id?: string
          metric_name?: string
          notification_channels?: string[] | null
          updated_at?: string | null
          warning_threshold?: number
        }
        Relationships: []
      }
      team_assessments: {
        Row: {
          can_show: boolean
          color_mood: string | null
          created_at: string | null
          hints: Json
          id: string
          org_id: string
          period_end: string
          period_start: string
          phrases: Json
          response_count: number
          team_name: string
          updated_at: string | null
        }
        Insert: {
          can_show?: boolean
          color_mood?: string | null
          created_at?: string | null
          hints?: Json
          id?: string
          org_id: string
          period_end: string
          period_start: string
          phrases?: Json
          response_count?: number
          team_name: string
          updated_at?: string | null
        }
        Update: {
          can_show?: boolean
          color_mood?: string | null
          created_at?: string | null
          hints?: Json
          id?: string
          org_id?: string
          period_end?: string
          period_start?: string
          phrases?: Json
          response_count?: number
          team_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_assessments_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      team_challenges: {
        Row: {
          created_at: string
          created_by: string
          current_value: number | null
          description: string | null
          ends_at: string
          goal_type: string
          goal_value: number
          id: string
          is_active: boolean | null
          name: string
          starts_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          current_value?: number | null
          description?: string | null
          ends_at: string
          goal_type: string
          goal_value: number
          id?: string
          is_active?: boolean | null
          name: string
          starts_at: string
        }
        Update: {
          created_at?: string
          created_by?: string
          current_value?: number | null
          description?: string | null
          ends_at?: string
          goal_type?: string
          goal_value?: number
          id?: string
          is_active?: boolean | null
          name?: string
          starts_at?: string
        }
        Relationships: []
      }
      team_member_skills: {
        Row: {
          availability_hours: Json | null
          created_at: string | null
          current_workload: number | null
          email: string
          id: string
          is_active: boolean | null
          max_concurrent_tickets: number | null
          name: string
          performance_score: number | null
          skills: Json
          specializations: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          availability_hours?: Json | null
          created_at?: string | null
          current_workload?: number | null
          email: string
          id?: string
          is_active?: boolean | null
          max_concurrent_tickets?: number | null
          name: string
          performance_score?: number | null
          skills?: Json
          specializations?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          availability_hours?: Json | null
          created_at?: string | null
          current_workload?: number | null
          email?: string
          id?: string
          is_active?: boolean | null
          max_concurrent_tickets?: number | null
          name?: string
          performance_score?: number | null
          skills?: Json
          specializations?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      team_session_chat: {
        Row: {
          created_at: string
          id: string
          message: string
          session_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          session_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_session_chat_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "focus_team_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      team_session_participants: {
        Row: {
          id: string
          is_active: boolean | null
          joined_at: string
          pomodoros_completed: number | null
          session_id: string
          user_id: string
        }
        Insert: {
          id?: string
          is_active?: boolean | null
          joined_at?: string
          pomodoros_completed?: number | null
          session_id: string
          user_id: string
        }
        Update: {
          id?: string
          is_active?: boolean | null
          joined_at?: string
          pomodoros_completed?: number | null
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "focus_team_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          id: string
          name: string
          org_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          org_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          org_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
        ]
      }
      template_application_history: {
        Row: {
          applied_at: string
          filters_applied: Json
          id: string
          results_count: number | null
          template_id: string
          user_id: string
        }
        Insert: {
          applied_at?: string
          filters_applied: Json
          id?: string
          results_count?: number | null
          template_id: string
          user_id: string
        }
        Update: {
          applied_at?: string
          filters_applied?: Json
          id?: string
          results_count?: number | null
          template_id?: string
          user_id?: string
        }
        Relationships: []
      }
      template_comments: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number | null
          template_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          template_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          template_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      template_favorites: {
        Row: {
          created_at: string
          id: string
          template_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          template_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          template_id?: string
          user_id?: string
        }
        Relationships: []
      }
      template_share_notifications: {
        Row: {
          created_at: string
          id: string
          message: string | null
          read: boolean
          recipient_user_id: string
          sender_user_id: string
          share_type: string
          template_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          read?: boolean
          recipient_user_id: string
          sender_user_id: string
          share_type: string
          template_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          read?: boolean
          recipient_user_id?: string
          sender_user_id?: string
          share_type?: string
          template_id?: string
        }
        Relationships: []
      }
      template_tags: {
        Row: {
          created_at: string
          id: string
          tag_name: string
          usage_count: number
        }
        Insert: {
          created_at?: string
          id?: string
          tag_name: string
          usage_count?: number
        }
        Update: {
          created_at?: string
          id?: string
          tag_name?: string
          usage_count?: number
        }
        Relationships: []
      }
      template_versions: {
        Row: {
          change_description: string | null
          config: Json
          created_at: string
          created_by: string | null
          id: string
          template_id: string | null
          version_number: number
        }
        Insert: {
          change_description?: string | null
          config: Json
          created_at?: string
          created_by?: string | null
          id?: string
          template_id?: string | null
          version_number: number
        }
        Update: {
          change_description?: string | null
          config?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          template_id?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "template_versions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "pdf_templates"
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
      ticket_integrations: {
        Row: {
          api_token: string
          api_url: string
          created_at: string | null
          created_by: string | null
          custom_fields: Json | null
          default_assignee: string | null
          id: string
          integration_type: string
          is_active: boolean | null
          name: string
          project_key: string
          updated_at: string | null
        }
        Insert: {
          api_token: string
          api_url: string
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          default_assignee?: string | null
          id?: string
          integration_type: string
          is_active?: boolean | null
          name: string
          project_key: string
          updated_at?: string | null
        }
        Update: {
          api_token?: string
          api_url?: string
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          default_assignee?: string | null
          id?: string
          integration_type?: string
          is_active?: boolean | null
          name?: string
          project_key?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      time_blocks: {
        Row: {
          block_type: Database["public"]["Enums"]["time_block_type"]
          created_at: string | null
          day_of_week: number | null
          duration_hours: number | null
          emotional_charge: number | null
          energy_level: number | null
          id: string
          is_ideal: boolean | null
          label: string | null
          metadata: Json | null
          notes: string | null
          start_hour: number | null
          updated_at: string | null
          user_id: string
          version_id: string | null
        }
        Insert: {
          block_type: Database["public"]["Enums"]["time_block_type"]
          created_at?: string | null
          day_of_week?: number | null
          duration_hours?: number | null
          emotional_charge?: number | null
          energy_level?: number | null
          id?: string
          is_ideal?: boolean | null
          label?: string | null
          metadata?: Json | null
          notes?: string | null
          start_hour?: number | null
          updated_at?: string | null
          user_id: string
          version_id?: string | null
        }
        Update: {
          block_type?: Database["public"]["Enums"]["time_block_type"]
          created_at?: string | null
          day_of_week?: number | null
          duration_hours?: number | null
          emotional_charge?: number | null
          energy_level?: number | null
          id?: string
          is_ideal?: boolean | null
          label?: string | null
          metadata?: Json | null
          notes?: string | null
          start_hour?: number | null
          updated_at?: string | null
          user_id?: string
          version_id?: string | null
        }
        Relationships: []
      }
      time_exchanges: {
        Row: {
          completed_at: string | null
          created_at: string | null
          exchange_for_offer_id: string | null
          feedback: string | null
          hours_exchanged: number
          id: string
          offer_id: string | null
          provider_id: string
          rating_given: number | null
          rating_received: number | null
          requester_id: string
          scheduled_at: string | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          exchange_for_offer_id?: string | null
          feedback?: string | null
          hours_exchanged: number
          id?: string
          offer_id?: string | null
          provider_id: string
          rating_given?: number | null
          rating_received?: number | null
          requester_id: string
          scheduled_at?: string | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          exchange_for_offer_id?: string | null
          feedback?: string | null
          hours_exchanged?: number
          id?: string
          offer_id?: string | null
          provider_id?: string
          rating_given?: number | null
          rating_received?: number | null
          requester_id?: string
          scheduled_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_exchanges_exchange_for_offer_id_fkey"
            columns: ["exchange_for_offer_id"]
            isOneToOne: false
            referencedRelation: "time_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_exchanges_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "time_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      time_insights: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          insight_type: string
          is_dismissed: boolean | null
          message: string
          severity: string | null
          user_id: string
          version_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          insight_type: string
          is_dismissed?: boolean | null
          message: string
          severity?: string | null
          user_id: string
          version_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          insight_type?: string
          is_dismissed?: boolean | null
          message?: string
          severity?: string | null
          user_id?: string
          version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_insights_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "time_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      time_market_rates: {
        Row: {
          category: string
          current_rate: number | null
          demand_index: number | null
          id: string
          supply_count: number | null
          trend: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          current_rate?: number | null
          demand_index?: number | null
          id?: string
          supply_count?: number | null
          trend?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          current_rate?: number | null
          demand_index?: number | null
          id?: string
          supply_count?: number | null
          trend?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      time_offers: {
        Row: {
          created_at: string | null
          description: string | null
          hours_available: number
          id: string
          rating: number | null
          reviews_count: number | null
          skill_category: string
          skill_name: string
          status: string | null
          time_value: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          hours_available?: number
          id?: string
          rating?: number | null
          reviews_count?: number | null
          skill_category: string
          skill_name: string
          status?: string | null
          time_value?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          hours_available?: number
          id?: string
          rating?: number | null
          reviews_count?: number | null
          skill_category?: string
          skill_name?: string
          status?: string | null
          time_value?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      time_versions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          insights: Json | null
          is_active: boolean | null
          name: string
          snapshot_data: Json | null
          updated_at: string | null
          user_id: string
          version_type: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          insights?: Json | null
          is_active?: boolean | null
          name: string
          snapshot_data?: Json | null
          updated_at?: string | null
          user_id: string
          version_type?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          insights?: Json | null
          is_active?: boolean | null
          name?: string
          snapshot_data?: Json | null
          updated_at?: string | null
          user_id?: string
          version_type?: string | null
        }
        Relationships: []
      }
      tournament_matches: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          match_number: number
          player1_id: string | null
          player1_score: number | null
          player2_id: string | null
          player2_score: number | null
          round_number: number
          scheduled_time: string | null
          started_at: string | null
          status: string
          tournament_id: string
          winner_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          match_number: number
          player1_id?: string | null
          player1_score?: number | null
          player2_id?: string | null
          player2_score?: number | null
          round_number: number
          scheduled_time?: string | null
          started_at?: string | null
          status?: string
          tournament_id: string
          winner_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          match_number?: number
          player1_id?: string | null
          player1_score?: number | null
          player2_id?: string | null
          player2_score?: number | null
          round_number?: number
          scheduled_time?: string | null
          started_at?: string | null
          status?: string
          tournament_id?: string
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_participants: {
        Row: {
          avatar_emoji: string | null
          current_round: number | null
          display_name: string
          id: string
          is_eliminated: boolean | null
          losses: number | null
          registered_at: string
          seed: number | null
          total_score: number | null
          tournament_id: string
          user_id: string
          wins: number | null
        }
        Insert: {
          avatar_emoji?: string | null
          current_round?: number | null
          display_name: string
          id?: string
          is_eliminated?: boolean | null
          losses?: number | null
          registered_at?: string
          seed?: number | null
          total_score?: number | null
          tournament_id: string
          user_id: string
          wins?: number | null
        }
        Update: {
          avatar_emoji?: string | null
          current_round?: number | null
          display_name?: string
          id?: string
          is_eliminated?: boolean | null
          losses?: number | null
          registered_at?: string
          seed?: number | null
          total_score?: number | null
          tournament_id?: string
          user_id?: string
          wins?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_participants_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_registrations: {
        Row: {
          id: string
          registration_date: string
          seed_position: number | null
          status: string
          tournament_id: string
          user_id: string
        }
        Insert: {
          id?: string
          registration_date?: string
          seed_position?: number | null
          status?: string
          tournament_id: string
          user_id: string
        }
        Update: {
          id?: string
          registration_date?: string
          seed_position?: number | null
          status?: string
          tournament_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_registrations_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_spectators: {
        Row: {
          id: string
          joined_at: string | null
          match_id: string | null
          tournament_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          match_id?: string | null
          tournament_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          match_id?: string | null
          tournament_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_spectators_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "tournament_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_spectators_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          bracket_data: Json | null
          created_at: string
          current_participants: number | null
          description: string | null
          end_date: string
          id: string
          max_participants: number | null
          name: string
          prize_pool: Json | null
          registration_end: string
          registration_start: string
          rules: Json | null
          start_date: string
          status: string
          tournament_type: string
          updated_at: string
        }
        Insert: {
          bracket_data?: Json | null
          created_at?: string
          current_participants?: number | null
          description?: string | null
          end_date: string
          id?: string
          max_participants?: number | null
          name: string
          prize_pool?: Json | null
          registration_end: string
          registration_start: string
          rules?: Json | null
          start_date: string
          status?: string
          tournament_type: string
          updated_at?: string
        }
        Update: {
          bracket_data?: Json | null
          created_at?: string
          current_participants?: number | null
          description?: string | null
          end_date?: string
          id?: string
          max_participants?: number | null
          name?: string
          prize_pool?: Json | null
          registration_end?: string
          registration_start?: string
          rules?: Json | null
          start_date?: string
          status?: string
          tournament_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      trust_profiles: {
        Row: {
          badges: Json | null
          created_at: string | null
          id: string
          level: string | null
          total_given: number | null
          total_received: number | null
          trust_score: number | null
          updated_at: string | null
          user_id: string
          verified_actions: number | null
        }
        Insert: {
          badges?: Json | null
          created_at?: string | null
          id?: string
          level?: string | null
          total_given?: number | null
          total_received?: number | null
          trust_score?: number | null
          updated_at?: string | null
          user_id: string
          verified_actions?: number | null
        }
        Update: {
          badges?: Json | null
          created_at?: string | null
          id?: string
          level?: string | null
          total_given?: number | null
          total_received?: number | null
          trust_score?: number | null
          updated_at?: string | null
          user_id?: string
          verified_actions?: number | null
        }
        Relationships: []
      }
      trust_projects: {
        Row: {
          backers_count: number | null
          category: string
          created_at: string | null
          creator_id: string
          description: string | null
          id: string
          status: string | null
          title: string
          trust_pool: number | null
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          backers_count?: number | null
          category: string
          created_at?: string | null
          creator_id: string
          description?: string | null
          id?: string
          status?: string | null
          title: string
          trust_pool?: number | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          backers_count?: number | null
          category?: string
          created_at?: string | null
          creator_id?: string
          description?: string | null
          id?: string
          status?: string | null
          title?: string
          trust_pool?: number | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      trust_transactions: {
        Row: {
          amount: number
          created_at: string | null
          from_user_id: string
          id: string
          reason: string | null
          to_project_id: string | null
          to_user_id: string | null
          transaction_type: string
          verified: boolean | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          from_user_id: string
          id?: string
          reason?: string | null
          to_project_id?: string | null
          to_user_id?: string | null
          transaction_type: string
          verified?: boolean | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          from_user_id?: string
          id?: string
          reason?: string | null
          to_project_id?: string | null
          to_user_id?: string | null
          transaction_type?: string
          verified?: boolean | null
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
      unified_alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          created_at: string | null
          cvss_score: number | null
          description: string | null
          escalation_history: Json | null
          escalation_level: number | null
          external_id: string
          id: string
          metadata: Json | null
          occurrence_count: number | null
          resolved_at: string | null
          severity: string
          source: string
          status: string | null
          title: string
          unified_score: number | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          created_at?: string | null
          cvss_score?: number | null
          description?: string | null
          escalation_history?: Json | null
          escalation_level?: number | null
          external_id: string
          id?: string
          metadata?: Json | null
          occurrence_count?: number | null
          resolved_at?: string | null
          severity: string
          source: string
          status?: string | null
          title: string
          unified_score?: number | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          created_at?: string | null
          cvss_score?: number | null
          description?: string | null
          escalation_history?: Json | null
          escalation_level?: number | null
          external_id?: string
          id?: string
          metadata?: Json | null
          occurrence_count?: number | null
          resolved_at?: string | null
          severity?: string
          source?: string
          status?: string | null
          title?: string
          unified_score?: number | null
          updated_at?: string | null
          url?: string | null
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
      user_activated_modules: {
        Row: {
          activated_via: string
          created_at: string
          expires_at: string | null
          id: string
          module_name: string
          module_path: string
          purchase_id: string | null
          user_id: string
        }
        Insert: {
          activated_via: string
          created_at?: string
          expires_at?: string | null
          id?: string
          module_name: string
          module_path: string
          purchase_id?: string | null
          user_id: string
        }
        Update: {
          activated_via?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          module_name?: string
          module_path?: string
          purchase_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activated_modules_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "shopify_purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          activity_data: Json | null
          activity_type: string
          created_at: string | null
          duration_seconds: number | null
          id: string
          user_id: string
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          user_id: string
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_activity_badges: {
        Row: {
          badge_id: string
          id: string
          shared: boolean | null
          unlocked_at: string
          user_id: string
        }
        Insert: {
          badge_id: string
          id?: string
          shared?: boolean | null
          unlocked_at?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          id?: string
          shared?: boolean | null
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "activity_badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_log: {
        Row: {
          activity_date: string
          activity_type: string
          count: number
          created_at: string
          duration_seconds: number | null
          id: string
          metadata: Json | null
          score: number | null
          user_id: string
        }
        Insert: {
          activity_date?: string
          activity_type: string
          count?: number
          created_at?: string
          duration_seconds?: number | null
          id?: string
          metadata?: Json | null
          score?: number | null
          user_id: string
        }
        Update: {
          activity_date?: string
          activity_type?: string
          count?: number
          created_at?: string
          duration_seconds?: number | null
          id?: string
          metadata?: Json | null
          score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_activity_logs: {
        Row: {
          activity_details: Json | null
          activity_type: string
          id: string
          ip_address: unknown
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
          ip_address?: unknown
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
          ip_address?: unknown
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
      user_badges: {
        Row: {
          badge_category: string | null
          badge_description: string | null
          badge_icon: string | null
          badge_id: string
          badge_name: string
          earned_at: string | null
          id: string
          progress: Json | null
          shared_on_social: boolean | null
          unlocked: boolean | null
          user_id: string | null
        }
        Insert: {
          badge_category?: string | null
          badge_description?: string | null
          badge_icon?: string | null
          badge_id: string
          badge_name: string
          earned_at?: string | null
          id?: string
          progress?: Json | null
          shared_on_social?: boolean | null
          unlocked?: boolean | null
          user_id?: string | null
        }
        Update: {
          badge_category?: string | null
          badge_description?: string | null
          badge_icon?: string | null
          badge_id?: string
          badge_name?: string
          earned_at?: string | null
          id?: string
          progress?: Json | null
          shared_on_social?: boolean | null
          unlocked?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_cart: {
        Row: {
          checkout_url: string | null
          id: string
          items: Json
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          checkout_url?: string | null
          id?: string
          items?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          checkout_url?: string | null
          id?: string
          items?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_challenges_progress: {
        Row: {
          challenge_id: string
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          progress: Json
          streak_days: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          progress?: Json
          streak_days?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          progress?: Json
          streak_days?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenges_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "daily_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_collections: {
        Row: {
          collection_id: string
          created_at: string | null
          id: string
          item_id: string
          metadata: Json | null
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          collection_id: string
          created_at?: string | null
          id?: string
          item_id: string
          metadata?: Json | null
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          collection_id?: string
          created_at?: string | null
          id?: string
          item_id?: string
          metadata?: Json | null
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_competence_mastery: {
        Row: {
          created_at: string
          id: string
          is_mastered: boolean | null
          item_code: string
          last_reviewed_at: string | null
          mastery_level: number | null
          notes: string | null
          objectif_id: string
          rang: string
          review_count: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_mastered?: boolean | null
          item_code: string
          last_reviewed_at?: string | null
          mastery_level?: number | null
          notes?: string | null
          objectif_id: string
          rang: string
          review_count?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_mastered?: boolean | null
          item_code?: string
          last_reviewed_at?: string | null
          mastery_level?: number | null
          notes?: string | null
          objectif_id?: string
          rang?: string
          review_count?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_competence_progress: {
        Row: {
          competence_id: string
          created_at: string
          id: string
          item_code: string
          mastered: boolean | null
          mastered_at: string | null
          rang: string
          updated_at: string
          user_id: string
        }
        Insert: {
          competence_id: string
          created_at?: string
          id?: string
          item_code: string
          mastered?: boolean | null
          mastered_at?: string | null
          rang: string
          updated_at?: string
          user_id: string
        }
        Update: {
          competence_id?: string
          created_at?: string
          id?: string
          item_code?: string
          mastered?: boolean | null
          mastered_at?: string | null
          rang?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_consent_preferences: {
        Row: {
          channel_id: string
          consent_date: string | null
          consent_given: boolean
          created_at: string
          id: string
          ip_address: unknown
          purpose_id: string
          source: string | null
          updated_at: string
          user_agent: string | null
          user_id: string
          withdrawal_date: string | null
        }
        Insert: {
          channel_id: string
          consent_date?: string | null
          consent_given?: boolean
          created_at?: string
          id?: string
          ip_address?: unknown
          purpose_id: string
          source?: string | null
          updated_at?: string
          user_agent?: string | null
          user_id: string
          withdrawal_date?: string | null
        }
        Update: {
          channel_id?: string
          consent_date?: string | null
          consent_given?: boolean
          created_at?: string
          id?: string
          ip_address?: unknown
          purpose_id?: string
          source?: string | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string
          withdrawal_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_consent_preferences_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "consent_channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_consent_preferences_purpose_id_fkey"
            columns: ["purpose_id"]
            isOneToOne: false
            referencedRelation: "consent_purposes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_context_preferences: {
        Row: {
          afternoon_mood: string | null
          created_at: string
          evening_mood: string | null
          feedback_summary: Json | null
          id: string
          morning_mood: string | null
          updated_at: string
          user_id: string
          weather_sensitivity: boolean | null
        }
        Insert: {
          afternoon_mood?: string | null
          created_at?: string
          evening_mood?: string | null
          feedback_summary?: Json | null
          id?: string
          morning_mood?: string | null
          updated_at?: string
          user_id: string
          weather_sensitivity?: boolean | null
        }
        Update: {
          afternoon_mood?: string | null
          created_at?: string
          evening_mood?: string | null
          feedback_summary?: Json | null
          id?: string
          morning_mood?: string | null
          updated_at?: string
          user_id?: string
          weather_sensitivity?: boolean | null
        }
        Relationships: []
      }
      user_duels: {
        Row: {
          challenged_id: string
          challenged_score: number | null
          challenger_id: string
          challenger_score: number | null
          completed_at: string | null
          created_at: string
          duel_type: string
          duration_hours: number
          id: string
          reward_xp: number | null
          started_at: string | null
          status: string
          winner_id: string | null
        }
        Insert: {
          challenged_id: string
          challenged_score?: number | null
          challenger_id: string
          challenger_score?: number | null
          completed_at?: string | null
          created_at?: string
          duel_type: string
          duration_hours?: number
          id?: string
          reward_xp?: number | null
          started_at?: string | null
          status: string
          winner_id?: string | null
        }
        Update: {
          challenged_id?: string
          challenged_score?: number | null
          challenger_id?: string
          challenger_score?: number | null
          completed_at?: string | null
          created_at?: string
          duel_type?: string
          duration_hours?: number
          id?: string
          reward_xp?: number | null
          started_at?: string | null
          status?: string
          winner_id?: string | null
        }
        Relationships: []
      }
      user_edn_favorites: {
        Row: {
          created_at: string
          id: string
          item_code: string
          item_title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_code: string
          item_title?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_code?: string
          item_title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_edn_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          item_code: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          item_code: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          item_code?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_edn_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          item_number: string
          last_reviewed_at: string | null
          notes: string | null
          score: number | null
          status: string
          time_spent_minutes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          item_number: string
          last_reviewed_at?: string | null
          notes?: string | null
          score?: number | null
          status?: string
          time_spent_minutes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          item_number?: string
          last_reviewed_at?: string | null
          notes?: string | null
          score?: number | null
          status?: string
          time_spent_minutes?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_emotional_energy: {
        Row: {
          created_at: string
          current_energy: number
          id: string
          last_refill_time: string
          max_energy: number
          total_energy_gained: number
          total_energy_spent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_energy?: number
          id?: string
          last_refill_time?: string
          max_energy?: number
          total_energy_gained?: number
          total_energy_spent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_energy?: number
          id?: string
          last_refill_time?: string
          max_energy?: number
          total_energy_gained?: number
          total_energy_spent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_favorite_activities: {
        Row: {
          activity_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          activity_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          activity_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorite_activities_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: []
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
      user_feature_tracking: {
        Row: {
          feature_key: string
          first_visited_at: string | null
          id: string
          is_dismissed: boolean | null
          last_visited_at: string | null
          user_id: string | null
          visit_count: number | null
        }
        Insert: {
          feature_key: string
          first_visited_at?: string | null
          id?: string
          is_dismissed?: boolean | null
          last_visited_at?: string | null
          user_id?: string | null
          visit_count?: number | null
        }
        Update: {
          feature_key?: string
          first_visited_at?: string | null
          id?: string
          is_dismissed?: boolean | null
          last_visited_at?: string | null
          user_id?: string | null
          visit_count?: number | null
        }
        Relationships: []
      }
      user_feature_usage: {
        Row: {
          feature_name: string
          first_used_at: string
          id: string
          last_used_at: string
          usage_count: number | null
          user_id: string
        }
        Insert: {
          feature_name: string
          first_used_at?: string
          id?: string
          last_used_at?: string
          usage_count?: number | null
          user_id: string
        }
        Update: {
          feature_name?: string
          first_used_at?: string
          id?: string
          last_used_at?: string
          usage_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_feedback: {
        Row: {
          context: string | null
          created_at: string
          email: string | null
          feedback_type: string
          id: string
          message: string
          rating: number | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          context?: string | null
          created_at?: string
          email?: string | null
          feedback_type?: string
          id?: string
          message: string
          rating?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          context?: string | null
          created_at?: string
          email?: string | null
          feedback_type?: string
          id?: string
          message?: string
          rating?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_follows: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      user_gamification_stats: {
        Row: {
          created_at: string
          id: string
          longest_streak: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          longest_streak?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          longest_streak?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_generated_music: {
        Row: {
          audio_url: string
          created_at: string
          id: string
          is_favorite: boolean | null
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
          is_favorite?: boolean | null
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
          is_favorite?: boolean | null
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
      user_global_state: {
        Row: {
          created_at: string | null
          id: string
          state: Json
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          state?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          state?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_goals: {
        Row: {
          category: string
          completed: boolean | null
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
          completed?: boolean | null
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
          completed?: boolean | null
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
      user_harmony_points: {
        Row: {
          created_at: string
          id: string
          lifetime_earned: number
          lifetime_spent: number
          total_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lifetime_earned?: number
          lifetime_spent?: number
          total_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lifetime_earned?: number
          lifetime_spent?: number
          total_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_hearts: {
        Row: {
          created_at: string
          hearts: number
          id: string
          last_refill_time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          hearts?: number
          id?: string
          last_refill_time?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          hearts?: number
          id?: string
          last_refill_time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_help_dismissals: {
        Row: {
          dismissed_at: string
          help_key: string
          id: string
          user_id: string
        }
        Insert: {
          dismissed_at?: string
          help_key: string
          id?: string
          user_id: string
        }
        Update: {
          dismissed_at?: string
          help_key?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_insights: {
        Row: {
          action_items: Json | null
          applied_at: string | null
          category: string | null
          confidence: number | null
          created_at: string | null
          description: string
          dismissed_at: string | null
          expires_at: string | null
          feedback_rating: number | null
          feedback_text: string | null
          id: string
          impact_score: number | null
          insight_type: string
          is_read: boolean | null
          priority: string
          reminded_at: string | null
          source_data: Json | null
          title: string
          user_id: string
        }
        Insert: {
          action_items?: Json | null
          applied_at?: string | null
          category?: string | null
          confidence?: number | null
          created_at?: string | null
          description: string
          dismissed_at?: string | null
          expires_at?: string | null
          feedback_rating?: number | null
          feedback_text?: string | null
          id?: string
          impact_score?: number | null
          insight_type: string
          is_read?: boolean | null
          priority?: string
          reminded_at?: string | null
          source_data?: Json | null
          title: string
          user_id: string
        }
        Update: {
          action_items?: Json | null
          applied_at?: string | null
          category?: string | null
          confidence?: number | null
          created_at?: string | null
          description?: string
          dismissed_at?: string | null
          expires_at?: string | null
          feedback_rating?: number | null
          feedback_text?: string | null
          id?: string
          impact_score?: number | null
          insight_type?: string
          is_read?: boolean | null
          priority?: string
          reminded_at?: string | null
          source_data?: Json | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      user_integration_tokens: {
        Row: {
          created_at: string | null
          encrypted_token: string
          id: string
          integration_name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          encrypted_token: string
          id?: string
          integration_name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          encrypted_token?: string
          id?: string
          integration_name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_item_progress: {
        Row: {
          correct_reviews: number
          created_at: string
          ease_factor: number
          id: string
          interval_days: number
          item_code: string
          last_review_date: string | null
          learning_state: string
          next_review_date: string
          repetitions: number
          total_reviews: number
          updated_at: string
          user_id: string
        }
        Insert: {
          correct_reviews?: number
          created_at?: string
          ease_factor?: number
          id?: string
          interval_days?: number
          item_code: string
          last_review_date?: string | null
          learning_state?: string
          next_review_date?: string
          repetitions?: number
          total_reviews?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          correct_reviews?: number
          created_at?: string
          ease_factor?: number
          id?: string
          interval_days?: number
          item_code?: string
          last_review_date?: string | null
          learning_state?: string
          next_review_date?: string
          repetitions?: number
          total_reviews?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_leaderboard: {
        Row: {
          created_at: string | null
          id: string
          last_updated: string | null
          monthly_badge: boolean | null
          pseudo_anonyme: string
          rank: number | null
          total_badges: number
          user_id: string
          zones_completed: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_updated?: string | null
          monthly_badge?: boolean | null
          pseudo_anonyme: string
          rank?: number | null
          total_badges?: number
          user_id: string
          zones_completed?: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          last_updated?: string | null
          monthly_badge?: boolean | null
          pseudo_anonyme?: string
          rank?: number | null
          total_badges?: number
          user_id?: string
          zones_completed?: Json
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
      user_metric_alerts: {
        Row: {
          acknowledged: boolean | null
          acknowledged_at: string | null
          alert_type: string
          created_at: string | null
          current_value: number
          id: string
          metadata: Json | null
          metric_name: string
          threshold_value: number
          triggered_at: string | null
          user_id: string
        }
        Insert: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          alert_type: string
          created_at?: string | null
          current_value: number
          id?: string
          metadata?: Json | null
          metric_name: string
          threshold_value: number
          triggered_at?: string | null
          user_id: string
        }
        Update: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          alert_type?: string
          created_at?: string | null
          current_value?: number
          id?: string
          metadata?: Json | null
          metric_name?: string
          threshold_value?: number
          triggered_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_modules: {
        Row: {
          activated_at: string | null
          activation_source: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          module_name: string
          order_id: string | null
          user_id: string
        }
        Insert: {
          activated_at?: string | null
          activation_source?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          module_name: string
          order_id?: string | null
          user_id: string
        }
        Update: {
          activated_at?: string | null
          activation_source?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          module_name?: string
          order_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_music_achievements: {
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
            foreignKeyName: "user_music_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "music_achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_music_consents: {
        Row: {
          camera_optin: boolean
          consent_date: string
          consent_version: string
          emotion_analysis_optin: boolean
          mic_optin: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          camera_optin?: boolean
          consent_date?: string
          consent_version?: string
          emotion_analysis_optin?: boolean
          mic_optin?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          camera_optin?: boolean
          consent_date?: string
          consent_version?: string
          emotion_analysis_optin?: boolean
          mic_optin?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_music_generations: {
        Row: {
          created_at: string | null
          emotion_badge: string | null
          emotion_state: Json
          id: string
          suno_config: Json | null
          task_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          emotion_badge?: string | null
          emotion_state: Json
          id?: string
          suno_config?: Json | null
          task_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          emotion_badge?: string | null
          emotion_state?: Json
          id?: string
          suno_config?: Json | null
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_music_generations_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "suno_callbacks"
            referencedColumns: ["task_id"]
          },
        ]
      }
      user_music_levels: {
        Row: {
          created_at: string | null
          current_xp: number
          id: string
          last_activity_date: string | null
          level: number
          streak_days: number
          total_listening_minutes: number
          total_sessions: number
          total_tracks_generated: number
          total_xp: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_xp?: number
          id?: string
          last_activity_date?: string | null
          level?: number
          streak_days?: number
          total_listening_minutes?: number
          total_sessions?: number
          total_tracks_generated?: number
          total_xp?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_xp?: number
          id?: string
          last_activity_date?: string | null
          level?: number
          streak_days?: number
          total_listening_minutes?: number
          total_sessions?: number
          total_tracks_generated?: number
          total_xp?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_music_preferences: {
        Row: {
          created_at: string | null
          favorite_genres: string[] | null
          favorite_moods: string[] | null
          id: string
          instrumental_preference: string | null
          last_played_emotion: string | null
          listening_contexts: string[] | null
          preferred_emotions: string[] | null
          preferred_energy_level: number | null
          preferred_tempos: Json | null
          total_plays: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          favorite_genres?: string[] | null
          favorite_moods?: string[] | null
          id?: string
          instrumental_preference?: string | null
          last_played_emotion?: string | null
          listening_contexts?: string[] | null
          preferred_emotions?: string[] | null
          preferred_energy_level?: number | null
          preferred_tempos?: Json | null
          total_plays?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          favorite_genres?: string[] | null
          favorite_moods?: string[] | null
          id?: string
          instrumental_preference?: string | null
          last_played_emotion?: string | null
          listening_contexts?: string[] | null
          preferred_emotions?: string[] | null
          preferred_energy_level?: number | null
          preferred_tempos?: Json | null
          total_plays?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_music_rewards: {
        Row: {
          expires_at: string | null
          id: string
          reward_code: string
          reward_name: string
          reward_type: string
          times_used: number | null
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          id?: string
          reward_code: string
          reward_name: string
          reward_type: string
          times_used?: number | null
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          expires_at?: string | null
          id?: string
          reward_code?: string
          reward_name?: string
          reward_type?: string
          times_used?: number | null
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_notification_settings: {
        Row: {
          created_at: string | null
          id: string
          preferences: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          preferences?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          preferences?: Json | null
          updated_at?: string | null
          user_id?: string
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
      user_onboarding: {
        Row: {
          completed_at: string | null
          completed_steps: Json | null
          created_at: string | null
          current_step: number | null
          id: string
          is_active: boolean | null
          is_seen: boolean | null
          last_state: string | null
          onboarding_completed: boolean | null
          preferred_deadline: string | null
          seen_tooltips: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_steps?: Json | null
          created_at?: string | null
          current_step?: number | null
          id?: string
          is_active?: boolean | null
          is_seen?: boolean | null
          last_state?: string | null
          onboarding_completed?: boolean | null
          preferred_deadline?: string | null
          seen_tooltips?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_steps?: Json | null
          created_at?: string | null
          current_step?: number | null
          id?: string
          is_active?: boolean | null
          is_seen?: boolean | null
          last_state?: string | null
          onboarding_completed?: boolean | null
          preferred_deadline?: string | null
          seen_tooltips?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_personalization: {
        Row: {
          created_at: string | null
          id: string
          settings: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          settings?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          settings?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_personalization_settings: {
        Row: {
          created_at: string | null
          id: string
          settings: Json
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          settings?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          settings?: Json
          updated_at?: string | null
          user_id?: string | null
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
          language: string | null
          medical_consents: Json | null
          nyvee_tutorial_seen: boolean | null
          preferences: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          language?: string | null
          medical_consents?: Json | null
          nyvee_tutorial_seen?: boolean | null
          preferences?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          language?: string | null
          medical_consents?: Json | null
          nyvee_tutorial_seen?: boolean | null
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
      user_premium_rewards: {
        Row: {
          id: string
          is_equipped: boolean | null
          reward_id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          id?: string
          is_equipped?: boolean | null
          reward_id: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          id?: string
          is_equipped?: boolean | null
          reward_id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_premium_rewards_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "premium_rewards"
            referencedColumns: ["id"]
          },
        ]
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
      user_quest_progress: {
        Row: {
          claimed: boolean
          claimed_at: string | null
          completed: boolean
          completed_at: string | null
          created_at: string
          current_progress: number
          id: string
          quest_id: string
          started_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          claimed?: boolean
          claimed_at?: string | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          current_progress?: number
          id?: string
          quest_id: string
          started_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          claimed?: boolean
          claimed_at?: string | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          current_progress?: number
          id?: string
          quest_id?: string
          started_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_quest_progress_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "wellness_quests"
            referencedColumns: ["id"]
          },
        ]
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
      user_reminders: {
        Row: {
          created_at: string | null
          days_of_week: number[] | null
          id: string
          is_active: boolean | null
          kind: string
          last_sent_at: string | null
          message: string | null
          time: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          days_of_week?: number[] | null
          id?: string
          is_active?: boolean | null
          kind: string
          last_sent_at?: string | null
          message?: string | null
          time: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          days_of_week?: number[] | null
          id?: string
          is_active?: boolean | null
          kind?: string
          last_sent_at?: string | null
          message?: string | null
          time?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_reports: {
        Row: {
          created_at: string | null
          highlights: Json | null
          id: string
          metrics: Json
          pdf_url: string | null
          period_end: string
          period_start: string
          recommendations: Json | null
          report_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          highlights?: Json | null
          id?: string
          metrics: Json
          pdf_url?: string | null
          period_end: string
          period_start: string
          recommendations?: Json | null
          report_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          highlights?: Json | null
          id?: string
          metrics?: Json
          pdf_url?: string | null
          period_end?: string
          period_start?: string
          recommendations?: Json | null
          report_type?: string
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
      user_roles: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_saved_searches: {
        Row: {
          id: string
          name: string | null
          query: string
          saved_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          name?: string | null
          query: string
          saved_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          query?: string
          saved_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_scores: {
        Row: {
          components: Json | null
          created_at: string
          emotional_score: number
          engagement_score: number
          id: string
          insights: Json | null
          resilience_score: number | null
          updated_at: string
          user_id: string
          week_number: number
          wellbeing_score: number
          year: number
        }
        Insert: {
          components?: Json | null
          created_at?: string
          emotional_score?: number
          engagement_score?: number
          id?: string
          insights?: Json | null
          resilience_score?: number | null
          updated_at?: string
          user_id: string
          week_number: number
          wellbeing_score?: number
          year: number
        }
        Update: {
          components?: Json | null
          created_at?: string
          emotional_score?: number
          engagement_score?: number
          id?: string
          insights?: Json | null
          resilience_score?: number | null
          updated_at?: string
          user_id?: string
          week_number?: number
          wellbeing_score?: number
          year?: number
        }
        Relationships: []
      }
      user_search_history: {
        Row: {
          id: string
          query: string
          searched_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          query: string
          searched_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          query?: string
          searched_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_season_rewards: {
        Row: {
          claimed_at: string | null
          id: string
          reward_id: string
          season_id: string
          user_id: string
        }
        Insert: {
          claimed_at?: string | null
          id?: string
          reward_id: string
          season_id: string
          user_id: string
        }
        Update: {
          claimed_at?: string | null
          id?: string
          reward_id?: string
          season_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_season_rewards_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "season_rewards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_season_rewards_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "competitive_seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          created_at: string | null
          id: string
          ip_address: unknown
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
          ip_address?: unknown
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
          ip_address?: unknown
          is_active?: boolean | null
          security_flags?: Json | null
          session_end?: string | null
          session_start?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          consent_anonymous_aggregation: boolean | null
          consent_cbi: boolean | null
          consent_cvsq: boolean | null
          consent_panas: boolean | null
          consent_swemwbs: boolean | null
          consent_uwes: boolean | null
          consent_who5: boolean | null
          created_at: string | null
          haptics_enabled: boolean | null
          high_contrast: boolean | null
          id: string
          journal_reminders: boolean | null
          key: string | null
          low_stim_mode: boolean | null
          nyvee_reminders: boolean | null
          onboarding_completed: boolean | null
          onboarding_step: number | null
          reminder_frequency: string | null
          screen_silk_reminders: boolean | null
          theme_palette: string | null
          tts_enabled: boolean | null
          updated_at: string | null
          user_id: string
          value: string | null
        }
        Insert: {
          consent_anonymous_aggregation?: boolean | null
          consent_cbi?: boolean | null
          consent_cvsq?: boolean | null
          consent_panas?: boolean | null
          consent_swemwbs?: boolean | null
          consent_uwes?: boolean | null
          consent_who5?: boolean | null
          created_at?: string | null
          haptics_enabled?: boolean | null
          high_contrast?: boolean | null
          id?: string
          journal_reminders?: boolean | null
          key?: string | null
          low_stim_mode?: boolean | null
          nyvee_reminders?: boolean | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          reminder_frequency?: string | null
          screen_silk_reminders?: boolean | null
          theme_palette?: string | null
          tts_enabled?: boolean | null
          updated_at?: string | null
          user_id: string
          value?: string | null
        }
        Update: {
          consent_anonymous_aggregation?: boolean | null
          consent_cbi?: boolean | null
          consent_cvsq?: boolean | null
          consent_panas?: boolean | null
          consent_swemwbs?: boolean | null
          consent_uwes?: boolean | null
          consent_who5?: boolean | null
          created_at?: string | null
          haptics_enabled?: boolean | null
          high_contrast?: boolean | null
          id?: string
          journal_reminders?: boolean | null
          key?: string | null
          low_stim_mode?: boolean | null
          nyvee_reminders?: boolean | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          reminder_frequency?: string | null
          screen_silk_reminders?: boolean | null
          theme_palette?: string | null
          tts_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string
          value?: string | null
        }
        Relationships: []
      }
      user_sitemap_data: {
        Row: {
          alert_thresholds: Json | null
          created_at: string | null
          favorites: string[] | null
          id: string
          last_synced_at: string | null
          navigation_paths: Json | null
          tags: Json | null
          updated_at: string | null
          user_id: string
          visit_stats: Json | null
        }
        Insert: {
          alert_thresholds?: Json | null
          created_at?: string | null
          favorites?: string[] | null
          id?: string
          last_synced_at?: string | null
          navigation_paths?: Json | null
          tags?: Json | null
          updated_at?: string | null
          user_id: string
          visit_stats?: Json | null
        }
        Update: {
          alert_thresholds?: Json | null
          created_at?: string | null
          favorites?: string[] | null
          id?: string
          last_synced_at?: string | null
          navigation_paths?: Json | null
          tags?: Json | null
          updated_at?: string | null
          user_id?: string
          visit_stats?: Json | null
        }
        Relationships: []
      }
      user_special_badges: {
        Row: {
          badge_id: string | null
          earned_at: string
          id: string
          shared: boolean | null
          user_id: string
        }
        Insert: {
          badge_id?: string | null
          earned_at?: string
          id?: string
          shared?: boolean | null
          user_id: string
        }
        Update: {
          badge_id?: string | null
          earned_at?: string
          id?: string
          shared?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_special_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "special_badges"
            referencedColumns: ["id"]
          },
        ]
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
      user_stats_consolidated: {
        Row: {
          best_streak: number | null
          boss_grit_sessions: number | null
          breathwork_sessions: number | null
          bubble_beat_sessions: number | null
          created_at: string | null
          current_level: number | null
          current_streak: number | null
          favorite_module: string | null
          flash_glow_sessions: number | null
          id: string
          journal_entries: number | null
          last_activity_date: string | null
          meditation_sessions: number | null
          mood_mixer_sessions: number | null
          story_synth_sessions: number | null
          total_minutes: number | null
          total_sessions: number | null
          total_xp: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          best_streak?: number | null
          boss_grit_sessions?: number | null
          breathwork_sessions?: number | null
          bubble_beat_sessions?: number | null
          created_at?: string | null
          current_level?: number | null
          current_streak?: number | null
          favorite_module?: string | null
          flash_glow_sessions?: number | null
          id?: string
          journal_entries?: number | null
          last_activity_date?: string | null
          meditation_sessions?: number | null
          mood_mixer_sessions?: number | null
          story_synth_sessions?: number | null
          total_minutes?: number | null
          total_sessions?: number | null
          total_xp?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          best_streak?: number | null
          boss_grit_sessions?: number | null
          breathwork_sessions?: number | null
          bubble_beat_sessions?: number | null
          created_at?: string | null
          current_level?: number | null
          current_streak?: number | null
          favorite_module?: string | null
          flash_glow_sessions?: number | null
          id?: string
          journal_entries?: number | null
          last_activity_date?: string | null
          meditation_sessions?: number | null
          mood_mixer_sessions?: number | null
          story_synth_sessions?: number | null
          total_minutes?: number | null
          total_sessions?: number | null
          total_xp?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_study_stats: {
        Row: {
          clinical_cases_completed: number | null
          created_at: string
          date: string
          exams_taken: number | null
          flashcards_reviewed: number | null
          id: string
          items_studied: number | null
          reviews_completed: number | null
          time_spent_minutes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          clinical_cases_completed?: number | null
          created_at?: string
          date?: string
          exams_taken?: number | null
          flashcards_reviewed?: number | null
          id?: string
          items_studied?: number | null
          reviews_completed?: number | null
          time_spent_minutes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          clinical_cases_completed?: number | null
          created_at?: string
          date?: string
          exams_taken?: number | null
          flashcards_reviewed?: number | null
          id?: string
          items_studied?: number | null
          reviews_completed?: number | null
          time_spent_minutes?: number | null
          updated_at?: string
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
      user_therapy_sessions: {
        Row: {
          completion_rate: number | null
          created_at: string | null
          duration_seconds: number | null
          ended_at: string | null
          id: string
          mood_after: number | null
          mood_before: number | null
          notes: string | null
          started_at: string | null
          track_id: string | null
          user_id: string
        }
        Insert: {
          completion_rate?: number | null
          created_at?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          started_at?: string | null
          track_id?: string | null
          user_id: string
        }
        Update: {
          completion_rate?: number | null
          created_at?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          started_at?: string | null
          track_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_therapy_sessions_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "music_therapy_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_unlocked_modules: {
        Row: {
          id: string
          module_name: string
          shopify_order_id: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          module_name: string
          shopify_order_id: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          module_name?: string
          shopify_order_id?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_vibes: {
        Row: {
          contributing_factors: Json | null
          created_at: string
          duration_hours: number | null
          id: string
          intensity: number
          recent_activities: string[] | null
          recommended_modules: string[] | null
          user_id: string
          vibe_type: string
        }
        Insert: {
          contributing_factors?: Json | null
          created_at?: string
          duration_hours?: number | null
          id?: string
          intensity?: number
          recent_activities?: string[] | null
          recommended_modules?: string[] | null
          user_id: string
          vibe_type?: string
        }
        Update: {
          contributing_factors?: Json | null
          created_at?: string
          duration_hours?: number | null
          id?: string
          intensity?: number
          recent_activities?: string[] | null
          recommended_modules?: string[] | null
          user_id?: string
          vibe_type?: string
        }
        Relationships: []
      }
      user_weekly_progress: {
        Row: {
          challenge_id: string
          completed: boolean | null
          completed_at: string | null
          created_at: string
          current_value: number | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          current_value?: number | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          current_value?: number | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_weekly_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "weekly_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_wellness_chests: {
        Row: {
          chest_type: string
          created_at: string
          id: string
          opened: boolean
          opened_at: string | null
          rewards: Json
          unlocked_at: string
          user_id: string
        }
        Insert: {
          chest_type: string
          created_at?: string
          id?: string
          opened?: boolean
          opened_at?: string | null
          rewards: Json
          unlocked_at?: string
          user_id: string
        }
        Update: {
          chest_type?: string
          created_at?: string
          id?: string
          opened?: boolean
          opened_at?: string | null
          rewards?: Json
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_wellness_streak: {
        Row: {
          created_at: string
          current_streak: number
          id: string
          last_checkin_date: string
          longest_streak: number
          streak_frozen_until: string | null
          total_checkins: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          id?: string
          last_checkin_date?: string
          longest_streak?: number
          streak_frozen_until?: string | null
          total_checkins?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          id?: string
          last_checkin_date?: string
          longest_streak?: number
          streak_frozen_until?: string | null
          total_checkins?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      violation_alerts: {
        Row: {
          alert_type: string
          confidence_score: number | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_dismissed: boolean | null
          is_read: boolean | null
          message: string
          predicted_impact: string | null
          recommendations: string[] | null
          risk_indicators: Json | null
          severity: string
          title: string
          triggered_at: string | null
        }
        Insert: {
          alert_type: string
          confidence_score?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          message: string
          predicted_impact?: string | null
          recommendations?: string[] | null
          risk_indicators?: Json | null
          severity: string
          title: string
          triggered_at?: string | null
        }
        Update: {
          alert_type?: string
          confidence_score?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          message?: string
          predicted_impact?: string | null
          recommendations?: string[] | null
          risk_indicators?: Json | null
          severity?: string
          title?: string
          triggered_at?: string | null
        }
        Relationships: []
      }
      visual_quality_reports: {
        Row: {
          accessibility_issues: Json | null
          analyzed_at: string | null
          changes: Json | null
          component_name: string
          design_consistency: number | null
          has_regressions: boolean | null
          id: string
          overall_score: number | null
          screenshot: string | null
        }
        Insert: {
          accessibility_issues?: Json | null
          analyzed_at?: string | null
          changes?: Json | null
          component_name: string
          design_consistency?: number | null
          has_regressions?: boolean | null
          id?: string
          overall_score?: number | null
          screenshot?: string | null
        }
        Update: {
          accessibility_issues?: Json | null
          analyzed_at?: string | null
          changes?: Json | null
          component_name?: string
          design_consistency?: number | null
          has_regressions?: boolean | null
          id?: string
          overall_score?: number | null
          screenshot?: string | null
        }
        Relationships: []
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
      voice_processing_jobs: {
        Row: {
          audio_url: string
          completed_at: string | null
          created_at: string
          emotion_analysis: Json | null
          entry_id: string | null
          id: string
          processing_error: string | null
          started_at: string
          status: string
          transcription: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          audio_url: string
          completed_at?: string | null
          created_at?: string
          emotion_analysis?: Json | null
          entry_id?: string | null
          id?: string
          processing_error?: string | null
          started_at?: string
          status?: string
          transcription?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          audio_url?: string
          completed_at?: string | null
          created_at?: string
          emotion_analysis?: Json | null
          entry_id?: string | null
          id?: string
          processing_error?: string | null
          started_at?: string
          status?: string
          transcription?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "voice_processing_jobs_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      vr_dome_sessions: {
        Row: {
          created_at: string
          group_sync_idx: number | null
          hr_mean: number | null
          hr_std: number | null
          id: string
          session_id: string
          synchrony_idx: number | null
          team_pa: number | null
          ts: string
          ts_join: string
          ts_leave: string | null
          user_id: string
          user_id_hash: string | null
          valence: number | null
          valence_avg: number | null
        }
        Insert: {
          created_at?: string
          group_sync_idx?: number | null
          hr_mean?: number | null
          hr_std?: number | null
          id?: string
          session_id: string
          synchrony_idx?: number | null
          team_pa?: number | null
          ts?: string
          ts_join?: string
          ts_leave?: string | null
          user_id: string
          user_id_hash?: string | null
          valence?: number | null
          valence_avg?: number | null
        }
        Update: {
          created_at?: string
          group_sync_idx?: number | null
          hr_mean?: number | null
          hr_std?: number | null
          id?: string
          session_id?: string
          synchrony_idx?: number | null
          team_pa?: number | null
          ts?: string
          ts_join?: string
          ts_leave?: string | null
          user_id?: string
          user_id_hash?: string | null
          valence?: number | null
          valence_avg?: number | null
        }
        Relationships: []
      }
      vr_nebula_sessions: {
        Row: {
          breathing_pattern: string | null
          client: string | null
          coherence_score: number | null
          created_at: string
          cycles_completed: number | null
          duration_s: number
          hrv_post: number | null
          hrv_pre: number | null
          id: string
          resp_rate_avg: number | null
          rmssd_delta: number | null
          scene: string | null
          ts_finish: string | null
          ts_start: string
          updated_at: string | null
          user_id: string
          user_id_hash: string | null
          vr_mode: boolean | null
        }
        Insert: {
          breathing_pattern?: string | null
          client?: string | null
          coherence_score?: number | null
          created_at?: string
          cycles_completed?: number | null
          duration_s: number
          hrv_post?: number | null
          hrv_pre?: number | null
          id?: string
          resp_rate_avg?: number | null
          rmssd_delta?: number | null
          scene?: string | null
          ts_finish?: string | null
          ts_start?: string
          updated_at?: string | null
          user_id: string
          user_id_hash?: string | null
          vr_mode?: boolean | null
        }
        Update: {
          breathing_pattern?: string | null
          client?: string | null
          coherence_score?: number | null
          created_at?: string
          cycles_completed?: number | null
          duration_s?: number
          hrv_post?: number | null
          hrv_pre?: number | null
          id?: string
          resp_rate_avg?: number | null
          rmssd_delta?: number | null
          scene?: string | null
          ts_finish?: string | null
          ts_start?: string
          updated_at?: string | null
          user_id?: string
          user_id_hash?: string | null
          vr_mode?: boolean | null
        }
        Relationships: []
      }
      vr_session_templates: {
        Row: {
          category: string
          created_at: string
          description: string | null
          difficulty: string
          duration: number
          environment_id: string | null
          id: string
          intensity: number | null
          is_active: boolean
          name: string
          popularity_score: number | null
          tags: string[] | null
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          difficulty?: string
          duration?: number
          environment_id?: string | null
          id?: string
          intensity?: number | null
          is_active?: boolean
          name: string
          popularity_score?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          difficulty?: string
          duration?: number
          environment_id?: string | null
          id?: string
          intensity?: number | null
          is_active?: boolean
          name?: string
          popularity_score?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string
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
      wearable_connections: {
        Row: {
          connected_at: string | null
          id: string
          is_active: boolean | null
          last_sync: string | null
          metadata: Json | null
          provider: string
          user_id: string
        }
        Insert: {
          connected_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          metadata?: Json | null
          provider: string
          user_id: string
        }
        Update: {
          connected_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          metadata?: Json | null
          provider?: string
          user_id?: string
        }
        Relationships: []
      }
      webhook_deliveries: {
        Row: {
          attempts: number
          created_at: string
          delivered_at: string | null
          error_message: string | null
          event_type: string
          http_status: number | null
          id: string
          max_attempts: number
          next_retry_at: string | null
          payload: Json
          response_body: string | null
          status: string
          updated_at: string
          webhook_id: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          event_type: string
          http_status?: number | null
          id?: string
          max_attempts?: number
          next_retry_at?: string | null
          payload: Json
          response_body?: string | null
          status?: string
          updated_at?: string
          webhook_id: string
        }
        Update: {
          attempts?: number
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          event_type?: string
          http_status?: number | null
          id?: string
          max_attempts?: number
          next_retry_at?: string | null
          payload?: Json
          response_body?: string | null
          status?: string
          updated_at?: string
          webhook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_deliveries_webhook_id_fkey"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "webhook_endpoints"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_endpoints: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          events: string[]
          headers: Json | null
          id: string
          is_active: boolean
          name: string
          retry_config: Json | null
          secret_key: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          events?: string[]
          headers?: Json | null
          id?: string
          is_active?: boolean
          name: string
          retry_config?: Json | null
          secret_key: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          events?: string[]
          headers?: Json | null
          id?: string
          is_active?: boolean
          name?: string
          retry_config?: Json | null
          secret_key?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string
          entity_id: string | null
          entity_type: string
          event_data: Json
          event_type: string
          id: string
          processed: boolean
          user_id: string | null
        }
        Insert: {
          created_at?: string
          entity_id?: string | null
          entity_type: string
          event_data: Json
          event_type: string
          id?: string
          processed?: boolean
          user_id?: string | null
        }
        Update: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          event_data?: Json
          event_type?: string
          id?: string
          processed?: boolean
          user_id?: string | null
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          created_at: string
          error_message: string | null
          event_type: string
          id: string
          payload: Json | null
          response_body: string | null
          status_code: number | null
          success: boolean | null
          webhook_id: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          event_type: string
          id?: string
          payload?: Json | null
          response_body?: string | null
          status_code?: number | null
          success?: boolean | null
          webhook_id?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          event_type?: string
          id?: string
          payload?: Json | null
          response_body?: string | null
          status_code?: number | null
          success?: boolean | null
          webhook_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webhook_logs_webhook_id_fkey"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "gdpr_webhooks"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_settings: {
        Row: {
          created_at: string
          discord_enabled: boolean | null
          discord_webhook_url: string | null
          id: string
          slack_enabled: boolean | null
          slack_webhook_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discord_enabled?: boolean | null
          discord_webhook_url?: string | null
          id?: string
          slack_enabled?: boolean | null
          slack_webhook_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          discord_enabled?: boolean | null
          discord_webhook_url?: string | null
          id?: string
          slack_enabled?: boolean | null
          slack_webhook_url?: string | null
          updated_at?: string
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
      weekly_challenges: {
        Row: {
          badge_reward: string | null
          challenge_type: string
          created_at: string
          description: string
          ends_at: string
          id: string
          is_active: boolean | null
          starts_at: string
          target_value: number
          title: string
          xp_reward: number | null
        }
        Insert: {
          badge_reward?: string | null
          challenge_type: string
          created_at?: string
          description: string
          ends_at: string
          id?: string
          is_active?: boolean | null
          starts_at: string
          target_value: number
          title: string
          xp_reward?: number | null
        }
        Update: {
          badge_reward?: string | null
          challenge_type?: string
          created_at?: string
          description?: string
          ends_at?: string
          id?: string
          is_active?: boolean | null
          starts_at?: string
          target_value?: number
          title?: string
          xp_reward?: number | null
        }
        Relationships: []
      }
      weekly_garden: {
        Row: {
          created_at: string | null
          id: string
          plant_state: Json | null
          rarity: number | null
          sky_state: Json | null
          user_id: string
          week_iso: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          plant_state?: Json | null
          rarity?: number | null
          sky_state?: Json | null
          user_id: string
          week_iso: string
        }
        Update: {
          created_at?: string | null
          id?: string
          plant_state?: Json | null
          rarity?: number | null
          sky_state?: Json | null
          user_id?: string
          week_iso?: string
        }
        Relationships: []
      }
      weekly_summary: {
        Row: {
          created_at: string | null
          helps: string[] | null
          hints: Json | null
          id: string
          season: string | null
          user_id: string
          verbal_week: string[] | null
          week_iso: string
        }
        Insert: {
          created_at?: string | null
          helps?: string[] | null
          hints?: Json | null
          id?: string
          season?: string | null
          user_id: string
          verbal_week?: string[] | null
          week_iso: string
        }
        Update: {
          created_at?: string | null
          helps?: string[] | null
          hints?: Json | null
          id?: string
          season?: string | null
          user_id?: string
          verbal_week?: string[] | null
          week_iso?: string
        }
        Relationships: []
      }
      wellness_quests: {
        Row: {
          active: boolean
          category: string
          created_at: string
          description: string
          end_date: string | null
          energy_reward: number
          harmony_points_reward: number
          id: string
          quest_type: string
          special_reward: Json | null
          start_date: string
          target_value: number
          title: string
        }
        Insert: {
          active?: boolean
          category: string
          created_at?: string
          description: string
          end_date?: string | null
          energy_reward?: number
          harmony_points_reward?: number
          id?: string
          quest_type: string
          special_reward?: Json | null
          start_date?: string
          target_value?: number
          title: string
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          description?: string
          end_date?: string | null
          energy_reward?: number
          harmony_points_reward?: number
          id?: string
          quest_type?: string
          special_reward?: Json | null
          start_date?: string
          target_value?: number
          title?: string
        }
        Relationships: []
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
      wholebody_scans: {
        Row: {
          body_region: string | null
          brain_scan_id: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          modality: string
          nifti_file_path: string | null
          original_file_path: string
          patient_id: string
          processing_error: string | null
          scan_date: string | null
          segmentation_model: string | null
          segmentation_status: string | null
          updated_at: string | null
        }
        Insert: {
          body_region?: string | null
          brain_scan_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          modality: string
          nifti_file_path?: string | null
          original_file_path: string
          patient_id: string
          processing_error?: string | null
          scan_date?: string | null
          segmentation_model?: string | null
          segmentation_status?: string | null
          updated_at?: string | null
        }
        Update: {
          body_region?: string | null
          brain_scan_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          modality?: string
          nifti_file_path?: string | null
          original_file_path?: string
          patient_id?: string
          processing_error?: string | null
          scan_date?: string | null
          segmentation_model?: string | null
          segmentation_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wholebody_scans_brain_scan_id_fkey"
            columns: ["brain_scan_id"]
            isOneToOne: false
            referencedRelation: "brain_scans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      ai_monitoring_stats: {
        Row: {
          alert_needed_errors: number | null
          critical_errors: number | null
          errors_last_24h: number | null
          errors_last_7d: number | null
          high_errors: number | null
          total_errors: number | null
          unique_categories: number | null
          unresolved_errors: number | null
          urgent_errors: number | null
        }
        Relationships: []
      }
      alert_analytics: {
        Row: {
          avg_resolution_time_minutes: number | null
          category: string | null
          category_count: number | null
          critical_count: number | null
          date: string | null
          high_count: number | null
          resolved_count: number | null
          total_alerts: number | null
          unresolved_count: number | null
          urgent_count: number | null
        }
        Relationships: []
      }
      dashboard_stats_cache: {
        Row: {
          activity_date: string | null
          chat_count: number | null
          journal_count: number | null
          last_activity_at: string | null
          meditation_count: number | null
          user_id: string | null
        }
        Relationships: []
      }
      edn_items_unified: {
        Row: {
          competences_count_rang_a: number | null
          competences_count_rang_b: number | null
          competences_count_total: number | null
          competences_oic_rang_a: Json | null
          competences_oic_rang_b: Json | null
          completeness_score: number | null
          created_at: string | null
          domaine_medical: string | null
          has_audio_ambiance: boolean | null
          has_paroles_musicales: boolean | null
          has_paroles_rang_a: boolean | null
          has_paroles_rang_ab: boolean | null
          has_paroles_rang_b: boolean | null
          has_quiz_questions: boolean | null
          has_scene_immersive: boolean | null
          has_tableau_rang_a: boolean | null
          has_tableau_rang_b: boolean | null
          has_visual_ambiance: boolean | null
          id: string | null
          is_validated: boolean | null
          item_code: string | null
          mots_cles: string[] | null
          niveau_complexite: string | null
          slug: string | null
          specialite: string | null
          status: string | null
          subtitle: string | null
          tags_medicaux: string[] | null
          title: string | null
          updated_at: string | null
          validation_date: string | null
        }
        Relationships: []
      }
      journal_text_decrypted: {
        Row: {
          emo_vec: number[] | null
          id: string | null
          preview: string | null
          styled_html: string | null
          text_raw: string | null
          ts: string | null
          user_hash: string | null
          user_id: string | null
          valence: number | null
        }
        Insert: {
          emo_vec?: never
          id?: string | null
          preview?: never
          styled_html?: never
          text_raw?: never
          ts?: string | null
          user_hash?: string | null
          user_id?: string | null
          valence?: number | null
        }
        Update: {
          emo_vec?: never
          id?: string | null
          preview?: never
          styled_html?: never
          text_raw?: never
          ts?: string | null
          user_hash?: string | null
          user_id?: string | null
          valence?: number | null
        }
        Relationships: []
      }
      journal_voice_decrypted: {
        Row: {
          audio_url: string | null
          crystal_meta: Json | null
          emo_vec: number[] | null
          id: string | null
          pitch_avg: number | null
          summary_120: string | null
          text_raw: string | null
          ts: string | null
          user_hash: string | null
          user_id: string | null
          valence: number | null
        }
        Insert: {
          audio_url?: string | null
          crystal_meta?: never
          emo_vec?: never
          id?: string | null
          pitch_avg?: number | null
          summary_120?: never
          text_raw?: never
          ts?: string | null
          user_hash?: string | null
          user_id?: string | null
          valence?: number | null
        }
        Update: {
          audio_url?: string | null
          crystal_meta?: never
          emo_vec?: never
          id?: string | null
          pitch_avg?: number | null
          summary_120?: never
          text_raw?: never
          ts?: string | null
          user_hash?: string | null
          user_id?: string | null
          valence?: number | null
        }
        Relationships: []
      }
      med_mng_view_library: {
        Row: {
          added_to_library_at: string | null
          created_at: string | null
          id: string | null
          is_liked: boolean | null
          meta: Json | null
          suno_audio_id: string | null
          title: string | null
          user_id: string | null
        }
        Relationships: []
      }
      profiles_public: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          id: string | null
          location: string | null
          name: string | null
          phone: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: never
          id?: string | null
          location?: string | null
          name?: string | null
          phone?: never
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: never
          id?: string | null
          location?: string | null
          name?: string | null
          phone?: never
          website?: string | null
        }
        Relationships: []
      }
      security_compliance_report: {
        Row: {
          compliance_pct: number | null
          compliant_count: number | null
          metric_name: string | null
          status: string | null
          total_count: number | null
        }
        Relationships: []
      }
      user_session_stats: {
        Row: {
          avg_duration: number | null
          avg_mood_impact: number | null
          last_session_at: string | null
          session_type: string | null
          sessions_last_30_days: number | null
          sessions_last_7_days: number | null
          total_duration: number | null
          total_sessions: number | null
          total_xp: number | null
          user_id: string | null
        }
        Relationships: []
      }
      user_weekly_dashboard: {
        Row: {
          assessments_count: number | null
          avg_coherence: number | null
          avg_hrv_delta: number | null
          breath_coherence: number | null
          breath_hrv: number | null
          breath_mood: number | null
          journal_text_count: number | null
          journal_voice_count: number | null
          last_activity_at: string | null
          refreshed_at: string | null
          user_id: string | null
          vr_sessions_count: number | null
          week_start: string | null
        }
        Relationships: []
      }
      v_oic_rubriques_summary: {
        Row: {
          item_parent: string | null
          nb_competences: number | null
          objectifs: string[] | null
          rang: string | null
          rubrique: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      accept_invitation:
        | { Args: { invitation_id: string }; Returns: boolean }
        | { Args: { invitation_token: string }; Returns: Json }
      archive_expired_data: {
        Args: { p_entity_type: string; p_retention_days: number }
        Returns: {
          archived_count: number
        }[]
      }
      audit_and_correct_edn_content: {
        Args: never
        Returns: {
          fixed_issues: Json
          updated_count: number
        }[]
      }
      audit_and_fix_edn_content: {
        Args: never
        Returns: {
          audit_report: Json
          updated_count: number
        }[]
      }
      audit_consent_compliance:
        | { Args: never; Returns: Json }
        | {
            Args: { p_user_id?: string }
            Returns: {
              consent_scope: string
              issues: string[]
              status: string
              user_email: string
              user_id: string
            }[]
          }
      audit_retention_compliance: { Args: never; Returns: Json }
      audit_security_compliance: { Args: never; Returns: Json }
      audit_tableau_duplicates: {
        Args: never
        Returns: {
          audit_type: string
          duplicate_content: string
          issue_description: string
          item_code_result: string
          recommendation: string
          severity: string
        }[]
      }
      audit_user_rights_compliance: { Args: never; Returns: Json }
      auto_security_maintenance: { Args: never; Returns: Json }
      backup_critical_data: { Args: never; Returns: undefined }
      calculate_buddy_compatibility: {
        Args: { user1_id: string; user2_id: string }
        Returns: number
      }
      calculate_completeness_score:
        | { Args: { item_data: Json }; Returns: number }
        | { Args: { item_id: string }; Returns: number }
      calculate_internal_level: {
        Args: { instrument_code: string; score: number }
        Returns: number
      }
      calculate_item_completeness_score:
        | { Args: { item_id: string }; Returns: number }
        | {
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
      calculate_next_audit_run: {
        Args: {
          p_day_of_month: number
          p_day_of_week: number
          p_frequency: string
          p_time_of_day: string
        }
        Returns: string
      }
      calculate_next_run: {
        Args: {
          p_day_of_month: number
          p_day_of_week: number
          p_frequency: string
          p_time: string
        }
        Returns: string
      }
      calculate_recommendation_impact: {
        Args: { rec_id: string }
        Returns: Json
      }
      calculate_risk_score: { Args: never; Returns: number }
      calculate_sla_metrics: { Args: never; Returns: undefined }
      calculate_streak_bonus: { Args: { streak_days: number }; Returns: number }
      calculate_trust_score: { Args: { profile_uuid: string }; Returns: number }
      calculate_user_learning_path: {
        Args: { p_user_id: string }
        Returns: Json
      }
      calculate_who5_score: { Args: { responses: Json }; Returns: number }
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
      check_recommendation_alerts: { Args: never; Returns: undefined }
      check_slow_generations: { Args: never; Returns: undefined }
      check_wellness_streak: {
        Args: { p_user_id: string }
        Returns: {
          current_streak: number
          streak_broken: boolean
        }[]
      }
      clean_corrupted_edn_items: { Args: never; Returns: number }
      clean_generic_lisa_content: {
        Args: never
        Returns: {
          affected_competences: Json
          cleaned_count: number
        }[]
      }
      cleanup_duplicates: { Args: never; Returns: Json }
      cleanup_expired_clinical_data: { Args: never; Returns: number }
      cleanup_expired_invitations: { Args: never; Returns: number }
      cleanup_expired_notifications: { Args: never; Returns: undefined }
      cleanup_expired_rate_limit_counters: { Args: never; Returns: number }
      cleanup_failed_generations: { Args: never; Returns: undefined }
      cleanup_old_audit_logs: { Args: never; Returns: undefined }
      cleanup_old_chat_logs: { Args: never; Returns: undefined }
      cleanup_old_imports: { Args: never; Returns: undefined }
      cleanup_old_integrity_reports: { Args: never; Returns: number }
      cleanup_old_logs: { Args: never; Returns: undefined }
      cleanup_old_monitoring_errors: { Args: never; Returns: undefined }
      cleanup_old_monitoring_events: { Args: never; Returns: undefined }
      cleanup_old_music_generations: { Args: never; Returns: undefined }
      cleanup_old_notifications: { Args: never; Returns: number }
      cleanup_old_operation_logs: { Args: never; Returns: undefined }
      cleanup_old_performance_metrics: { Args: never; Returns: undefined }
      cleanup_old_streaming_logs: { Args: never; Returns: undefined }
      cleanup_security_issues: { Args: never; Returns: Json }
      cleanup_security_scan_false_positives: { Args: never; Returns: number }
      complete_all_items_with_competences: {
        Args: never
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
        Args: never
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
      count_all_invitations: { Args: never; Returns: number }
      count_generic_lisa_content: {
        Args: never
        Returns: {
          sample_objectifs: Json
          total_count: number
        }[]
      }
      count_invitations_by_status: {
        Args: { status_param: Database["public"]["Enums"]["invitation_status"] }
        Returns: number
      }
      create_activity_log_cleanup_job: { Args: never; Returns: undefined }
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
      create_idempotency_table: { Args: never; Returns: undefined }
      create_notification_from_template: {
        Args: {
          target_user_id: string
          template_name: string
          template_variables?: Json
        }
        Returns: string
      }
      create_user_session:
        | {
            Args: { p_ip_address?: unknown; p_user_agent?: string }
            Returns: string
          }
        | { Args: { session_data: Json }; Returns: string }
      decrement_group_members: {
        Args: { group_id: string }
        Returns: undefined
      }
      decrement_participant_count: {
        Args: { session_id: string }
        Returns: undefined
      }
      decrement_post_comments: { Args: { post_id: string }; Returns: undefined }
      decrement_post_likes: { Args: { post_id: string }; Returns: undefined }
      decrement_preset_likes: {
        Args: { p_preset_id: string }
        Returns: undefined
      }
      decrypt_sensitive_data: {
        Args: { p_ciphertext: string; p_key_name?: string }
        Returns: string
      }
      detect_and_fix_redundancies: {
        Args: never
        Returns: {
          description: string
          fixed: boolean
          issue_type: string
          item_code: string
        }[]
      }
      detect_data_inconsistencies: { Args: never; Returns: Json }
      detect_edn_duplicates: { Args: never; Returns: Json }
      detect_score_drops: { Args: { p_audit_id: string }; Returns: undefined }
      emergency_security_cleanup: {
        Args: never
        Returns: {
          cleaned_column: string
          cleaned_table: string
          cleanup_type: string
          records_affected: number
        }[]
      }
      encrypt_sensitive_data: {
        Args: { p_key_name?: string; p_plaintext: string }
        Returns: string
      }
      enrich_edn_items_with_oic_competences: {
        Args: never
        Returns: {
          details: Json
          error_count: number
          processed_count: number
          success_count: number
        }[]
      }
      enrich_edn_items_with_oic_competences_fixed: {
        Args: never
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
      final_security_check: { Args: never; Returns: Json }
      fix_all_edn_items_complete_oic_correction: {
        Args: never
        Returns: {
          details: Json
          errors_count: number
          fixed_count: number
        }[]
      }
      fix_all_edn_items_complete_uness_correction: {
        Args: never
        Returns: {
          details: Json
          errors_count: number
          fixed_count: number
        }[]
      }
      fix_all_edn_items_complete_unique_content: {
        Args: never
        Returns: {
          details: Json
          updated_count: number
        }[]
      }
      fix_all_edn_items_simple_correction: {
        Args: never
        Returns: {
          details: Json
          errors_count: number
          fixed_count: number
        }[]
      }
      fix_all_edn_items_with_real_content: {
        Args: never
        Returns: {
          errors_count: number
          fixed_count: number
        }[]
      }
      fix_all_edn_items_with_real_oic_competences: {
        Args: never
        Returns: {
          details: Json
          errors_count: number
          fixed_count: number
        }[]
      }
      fix_all_edn_items_with_unique_content: {
        Args: never
        Returns: {
          details: Json
          error_count: number
          updated_count: number
        }[]
      }
      fix_competences_mapping_correct: {
        Args: never
        Returns: {
          details: Json
          total_competences_added: number
          updated_items: number
        }[]
      }
      fix_generic_content_and_complete_platform: {
        Args: never
        Returns: {
          details: Json
          fixed_count: number
        }[]
      }
      fix_stuck_track_audio: { Args: never; Returns: undefined }
      fusion_complete_finale: {
        Args: never
        Returns: {
          competences_oic_integrees: number
          details: Json
          items_backup_utilises: number
          items_traites: number
        }[]
      }
      generate_anonymous_pseudo: { Args: never; Returns: string }
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
      generate_master_content: { Args: { p_item_id: string }; Returns: Json }
      generate_security_audit_report: { Args: never; Returns: Json }
      generate_slug:
        | { Args: { input_text: string }; Returns: string }
        | { Args: { item_code: string; title: string }; Returns: string }
      generate_specific_content_all_items: {
        Args: never
        Returns: {
          updated_count: number
        }[]
      }
      get_active_pseudonymization_rules: {
        Args: { p_data_type?: string }
        Returns: {
          algorithm: string
          auto_apply: boolean
          data_type: string
          field_name: string
          id: string
          is_reversible: boolean
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
        Args: never
        Returns: {
          audio_url: string
          created_at: string
          generation_status: string
          id: string
          title: string
          user_id: string
        }[]
      }
      get_all_role_audit_logs:
        | {
            Args: never
            Returns: {
              changed_by: string
              changed_by_email: string
              created_at: string
              id: string
              new_role: string
              old_role: string
              reason: string
              user_email: string
              user_id: string
            }[]
          }
        | {
            Args: { p_limit?: number; p_offset?: number }
            Returns: {
              action: string
              created_at: string
              id: string
              performed_by: string
              performed_by_email: string
              reason: string
              role: string
              user_email: string
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
        Args: never
        Returns: {
          avg_completeness_score: number
          table_name: string
          total_rows: number
          valid_descriptions: number
          valid_titles: number
        }[]
      }
      get_category_effectiveness_scores: {
        Args: { p_user_id: string }
        Returns: {
          avg_impact_score: number
          avg_success_improvement: number
          category: string
          effectiveness_score: number
          total_applied: number
          total_measured: number
        }[]
      }
      get_competences_parsed: {
        Args: never
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
      get_cron_job_history: {
        Args: never
        Returns: {
          execution_count: number
          job_name: string
          last_run: string
          next_run: string
          status: string
        }[]
      }
      get_cron_jobs_list: {
        Args: never
        Returns: {
          active: boolean
          jobid: number
          jobname: string
          last_run: string
          schedule: string
        }[]
      }
      get_current_user_role: { Args: never; Returns: string }
      get_current_week_bounds: {
        Args: never
        Returns: {
          week_end: string
          week_start: string
        }[]
      }
      get_due_audit_schedules: {
        Args: never
        Returns: {
          frequency: string
          last_run: string
          schedule_id: string
          schedule_name: string
        }[]
      }
      get_edn_objectifs_rapport: {
        Args: never
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
      get_gamification_cron_history: {
        Args: never
        Returns: {
          end_time: string
          job_name: string
          jobid: number
          return_message: string
          start_time: string
          status: string
        }[]
      }
      get_gamification_cron_jobs: {
        Args: never
        Returns: {
          active: boolean
          database: string
          jobid: number
          jobname: string
          schedule: string
        }[]
      }
      get_highest_b2b_role: {
        Args: { _org_id: string; _user_id: string }
        Returns: Database["public"]["Enums"]["b2b_role"]
      }
      get_latest_compliance_audit: {
        Args: never
        Returns: {
          audit: Json
          categories: Json
          recommendations: Json
        }[]
      }
      get_latest_lyrics_texts: {
        Args: never
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
      get_latest_quality_metrics: { Args: never; Returns: Json }
      get_medical_dashboard_stats: { Args: never; Returns: Json }
      get_ml_assignment_recommendation: {
        Args: {
          p_alert_category: string
          p_alert_tags: string[]
          p_alert_type: string
          p_priority_level: string
        }
        Returns: {
          confidence_score: number
          member_id: string
          member_name: string
          reasoning: Json
        }[]
      }
      get_music_quota: {
        Args: { p_user_id?: string }
        Returns: {
          can_generate: boolean
          credits_used_this_period: number
          last_reset_at: string
          remaining_credits: number
          total_credits: number
        }[]
      }
      get_music_signed_url: {
        Args: { p_expires_in?: number; p_storage_path: string }
        Returns: string
      }
      get_oic_competences_rapport: {
        Args: never
        Returns: {
          competences_attendues: number
          competences_extraites: number
          completude_pct: number
          item_parent: string
          manquants: string[]
        }[]
      }
      get_oic_completion_dashboard: {
        Args: never
        Returns: {
          nb_empty: number
          nb_error: number
          nb_updated: number
          total: number
        }[]
      }
      get_oic_extraction_report: { Args: never; Returns: Json }
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
        Args: never
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
        Args: never
        Returns: {
          active_users: number
          total_content: number
          total_users: number
        }[]
      }
      get_platform_stats: {
        Args: never
        Returns: {
          metric: string
          unit: string
          value: string
        }[]
      }
      get_pseudonymization_statistics: {
        Args: { p_end_date?: string; p_rule_id?: string; p_start_date?: string }
        Returns: {
          avg_processing_time: number
          data_type: string
          field_name: string
          rule_id: string
          total_depseudonymized: number
          total_failed: number
          total_pseudonymized: number
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
      get_rls_policies: {
        Args: never
        Returns: {
          cmd: string
          policyname: string
          qual: string
          roles: string[]
          tablename: string
          with_check: string
        }[]
      }
      get_rls_table_summaries: {
        Args: never
        Returns: {
          commands: string[]
          policy_count: number
          tablename: string
        }[]
      }
      get_secure_platform_stats: {
        Args: never
        Returns: {
          metric: string
          unit: string
          value: string
        }[]
      }
      get_secure_user_count: { Args: never; Returns: number }
      get_security_headers: { Args: never; Returns: Json }
      get_security_recommendations: {
        Args: never
        Returns: {
          category: string
          issue: string
          priority: string
          recommendation: string
        }[]
      }
      get_security_status: { Args: never; Returns: Json }
      get_security_summary: {
        Args: never
        Returns: {
          description: string
          metric: string
          value: string
        }[]
      }
      get_security_violations_summary: {
        Args: never
        Returns: {
          finding_type: string
          last_detection: string
          severity: string
          unresolved_count: number
          violation_count: number
        }[]
      }
      get_system_health_status: { Args: never; Returns: Json }
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
        Args: never
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
        Args: never
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
      get_user_app_role: {
        Args: never
        Returns: Database["public"]["Enums"]["app_user_role"]
      }
      get_user_consent_status: {
        Args: { p_user_id: string }
        Returns: {
          channel_code: string
          channel_name: string
          consent_date: string
          consent_given: boolean
          last_updated: string
          purpose_code: string
          purpose_name: string
        }[]
      }
      get_user_dashboard_stats: {
        Args: { p_user_id: string }
        Returns: {
          chat_count: number
          journal_count: number
          last_activity_at: string
          meditation_count: number
        }[]
      }
      get_user_edn_progress_summary: {
        Args: { target_user_id: string }
        Returns: {
          average_score: number
          completed_items: number
          in_progress_items: number
          mastered_items: number
          not_started_items: number
          total_items: number
          total_time_spent: number
        }[]
      }
      get_user_favorites_count: {
        Args: { p_user_id?: string }
        Returns: number
      }
      get_user_ia_stats: { Args: { p_period_days?: number }; Returns: Json }
      get_user_listening_stats: {
        Args: { p_user_id: string }
        Returns: {
          streak_days: number
          top_emotion: string
          total_duration_seconds: number
          total_listens: number
          unique_tracks: number
        }[]
      }
      get_user_medical_stats: { Args: { p_user_id?: string }; Returns: Json }
      get_user_music_library: {
        Args: never
        Returns: {
          created_at: string
          id: string
          in_library: boolean
          title: string
        }[]
      }
      get_user_music_storage_usage: {
        Args: { p_user_id?: string }
        Returns: {
          avg_file_size_mb: number
          total_files: number
          total_size_bytes: number
          total_size_mb: number
        }[]
      }
      get_user_organization_role: { Args: { org_id: string }; Returns: string }
      get_user_progress: {
        Args: never
        Returns: {
          avg_points: number
          completed_challenges: number
          total_badges: number
          total_challenges: number
          user_id: string
        }[]
      }
      get_user_quota: {
        Args: { p_user_id?: string }
        Returns: {
          can_generate: boolean
          credits_used_this_period: number
          last_reset_at: string
          remaining_credits: number
          total_credits: number
        }[]
      }
      get_user_role_audit_history:
        | {
            Args: { p_user_id: string }
            Returns: {
              changed_by: string
              changed_by_email: string
              created_at: string
              id: string
              new_role: string
              old_role: string
              reason: string
            }[]
          }
        | {
            Args: { p_limit?: number; p_user_id: string }
            Returns: {
              action: string
              created_at: string
              id: string
              performed_by: string
              performed_by_email: string
              reason: string
              role: string
            }[]
          }
      get_user_statistics: { Args: { user_uuid: string }; Returns: Json }
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
      get_violation_stats: {
        Args: { days?: number }
        Returns: {
          avg_resolution_time: unknown
          critical_violations: number
          high_violations: number
          resolved_violations: number
          total_violations: number
          trend_direction: string
        }[]
      }
      get_webhook_statistics: {
        Args: { p_webhook_id?: string }
        Returns: {
          avg_delivery_time_seconds: number
          failed_deliveries: number
          pending_deliveries: number
          success_rate: number
          successful_deliveries: number
          total_deliveries: number
          webhook_id: string
          webhook_name: string
        }[]
      }
      get_webhooks_for_event: {
        Args: { p_event_type: string }
        Returns: {
          retry_config: Json
          webhook_headers: Json
          webhook_id: string
          webhook_secret: string
          webhook_url: string
        }[]
      }
      get_weekly_summary: { Args: { user_uuid: string }; Returns: Json }
      has_any_b2b_role: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
      has_b2b_role: {
        Args: {
          _org_id: string
          _role: Database["public"]["Enums"]["b2b_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_org_role: {
        Args: { _org_id: string; _role: string; _user_id: string }
        Returns: boolean
      }
      has_role:
        | {
            Args: {
              _role: Database["public"]["Enums"]["app_role"]
              _user_id: string
            }
            Returns: boolean
          }
        | { Args: { _role: string; _user_id: string }; Returns: boolean }
      has_sitemap_access:
        | {
            Args: {
              _min_permission?: Database["public"]["Enums"]["share_permission"]
              _target_user_id: string
              _user_id: string
            }
            Returns: boolean
          }
        | { Args: { p_user_id: string }; Returns: boolean }
        | {
            Args: { p_sitemap_id: string; p_user_id: string }
            Returns: boolean
          }
      increment_aura_interaction: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      increment_comment_likes: {
        Args: { comment_id: string }
        Returns: undefined
      }
      increment_group_members: {
        Args: { group_id: string }
        Returns: undefined
      }
      increment_house_light: {
        Args: { p_acts?: number; p_user_id: string }
        Returns: undefined
      }
      increment_music_usage: { Args: { user_uuid: string }; Returns: boolean }
      increment_participant_count: {
        Args: { session_id: string }
        Returns: undefined
      }
      increment_post_comments: { Args: { post_id: string }; Returns: undefined }
      increment_post_likes: { Args: { post_id: string }; Returns: undefined }
      increment_preset_likes: {
        Args: { p_preset_id: string }
        Returns: undefined
      }
      increment_preset_uses: {
        Args: { p_preset_id: string }
        Returns: undefined
      }
      increment_rate_limit_counter: {
        Args: {
          p_identifier: string
          p_max_requests: number
          p_window_duration_seconds: number
        }
        Returns: Json
      }
      increment_view_count: { Args: { content_id: string }; Returns: undefined }
      integrate_all_oic_competences_into_edn_items: {
        Args: never
        Returns: {
          integrated_competences: number
          processed_items: number
          rang_a_total: number
          rang_b_total: number
          success_details: Json
        }[]
      }
      integrate_oic_into_edn_items: {
        Args: never
        Returns: {
          details: Json
          error_count: number
          success_count: number
          updated_items: number
        }[]
      }
      is_admin: { Args: never; Returns: boolean }
      is_authenticated: { Args: never; Returns: boolean }
      is_manager_of_org: { Args: { p_org_id: string }; Returns: boolean }
      is_org_admin: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
      is_org_admin_or_manager: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
      is_org_member: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
      is_org_membership_admin: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
      is_org_membership_member: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
      is_owner: { Args: { resource_user_id: string }; Returns: boolean }
      is_room_host: {
        Args: { p_room_id: string; p_user_id: string }
        Returns: boolean
      }
      is_room_member: {
        Args: { p_room_id: string; p_user_id: string }
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
      log_ia_usage:
        | {
            Args: {
              p_credits_used?: number
              p_error_details?: string
              p_operation_type: string
              p_request_details?: Json
              p_response_status?: string
              p_response_time_ms?: number
              p_service_type: string
            }
            Returns: undefined
          }
        | {
            Args: {
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
      log_security_event:
        | {
            Args: { event_details?: Json; event_type: string }
            Returns: undefined
          }
        | {
            Args: {
              p_action: string
              p_finding_type?: string
              p_metadata?: Json
              p_record_id?: string
              p_severity?: string
              p_table_name?: string
            }
            Returns: string
          }
        | {
            Args: {
              p_event_details?: Json
              p_event_type: string
              p_ip_address?: unknown
              p_user_agent?: string
            }
            Returns: string
          }
        | {
            Args: {
              p_event_details?: Json
              p_event_type: string
              p_ip_address?: unknown
              p_user_agent?: string
              p_user_id?: string
            }
            Returns: undefined
          }
        | {
            Args: {
              p_event_details?: Json
              p_event_type: string
              p_ip_address?: unknown
              p_severity?: string
              p_user_agent?: string
              p_user_id?: string
            }
            Returns: undefined
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
      log_share_audit: {
        Args: {
          p_action: string
          p_details?: Json
          p_resource_id: string
          p_resource_type: string
        }
        Returns: undefined
      }
      mark_notification_as_read: {
        Args: { notification_id: string; user_id: string }
        Returns: undefined
      }
      mark_notifications_as_read: {
        Args: { notification_ids?: string[]; user_id_param: string }
        Returns: number
      }
      med_mng_add_song_to_playlist: {
        Args: { playlist_id: string; song_id: string }
        Returns: undefined
      }
      med_mng_add_to_library: { Args: { song_id: string }; Returns: undefined }
      med_mng_create_activity_log_cleanup_job: {
        Args: never
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
      med_mng_get_remaining_quota: { Args: never; Returns: number }
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
      med_mng_refresh_monthly_quota: { Args: never; Returns: undefined }
      med_mng_refund_credits: {
        Args: { p_credits: number; p_user_id: string }
        Returns: boolean
      }
      med_mng_remove_from_library: {
        Args: { song_id: string }
        Returns: undefined
      }
      med_mng_save_theme: { Args: { theme_json: Json }; Returns: undefined }
      med_mng_toggle_favorite: { Args: { song_id: string }; Returns: boolean }
      med_mng_toggle_like: { Args: { song_id: string }; Returns: boolean }
      med_mng_track_listening: {
        Args: { p_listen_duration?: number; p_song_id: string }
        Returns: undefined
      }
      merge_all_tables_into_complete: {
        Args: never
        Returns: {
          backup_items_restored: number
          integrated_competences: number
          processed_items: number
          total_unified_records: number
        }[]
      }
      migrate_edn_items_complete: {
        Args: never
        Returns: {
          details: Json
          error_count: number
          processed_count: number
          success_count: number
        }[]
      }
      migrate_edn_items_to_platform: {
        Args: never
        Returns: {
          details: Json
          error_count: number
          processed_count: number
          success_count: number
        }[]
      }
      organize_competences_by_item_and_rank: {
        Args: never
        Returns: {
          item_number: number
          rang_a_competences: Json
          rang_b_competences: Json
          total_rang_a: number
          total_rang_b: number
        }[]
      }
      panic_overlay_get_state: { Args: never; Returns: Json }
      refill_emotional_energy: { Args: never; Returns: undefined }
      refresh_analytics_dashboards: { Args: never; Returns: undefined }
      refresh_dashboard_stats: { Args: never; Returns: undefined }
      refresh_edn_items_unified: { Args: never; Returns: undefined }
      regenerate_hearts: { Args: never; Returns: undefined }
      reset_monthly_quotas: { Args: never; Returns: undefined }
      reset_monthly_scores: { Args: never; Returns: undefined }
      reset_weekly_scores: { Args: never; Returns: undefined }
      run_automated_completeness_audit: { Args: never; Returns: Json }
      run_security_health_check: { Args: never; Returns: Json }
      sanitize_user_input: { Args: { input_text: string }; Returns: string }
      scan_for_security_violations: {
        Args: never
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
        Args: never
        Returns: {
          check_name: string
          details: string
          severity: string
          status: string
        }[]
      }
      security_audit_summary: { Args: never; Returns: Json }
      security_validation_final: { Args: never; Returns: Json }
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
        SetofOptions: {
          from: "*"
          to: "user_privacy_preferences"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      share_filter_template:
        | {
            Args: {
              p_permission?: string
              p_shared_with_email?: string
              p_shared_with_user_id?: string
              p_template_id: string
            }
            Returns: string
          }
        | {
            Args: { template_id: string; user_emails: string[] }
            Returns: undefined
          }
      snapshot_aura_weekly: { Args: never; Returns: undefined }
      start_extraction_batch: {
        Args: {
          p_batch_type: string
          p_session_data?: Json
          p_total_items?: number
        }
        Returns: string
      }
      sync_oic_competences: { Args: never; Returns: undefined }
      track_user_activity: {
        Args: {
          p_activity_data?: Json
          p_activity_type: string
          p_duration_seconds?: number
          p_user_id: string
        }
        Returns: string
      }
      ultimate_security_validation: { Args: never; Returns: Json }
      unlock_story_fragment: {
        Args: { p_fragment_code: string; p_user_id: string }
        Returns: Json
      }
      update_all_edn_items_unique_content: {
        Args: never
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
        Args: never
        Returns: {
          item_code: string
          rang_a_count: number
          rang_b_count: number
          total_count: number
          updated: boolean
        }[]
      }
      update_edn_items_with_real_specific_content: {
        Args: never
        Returns: {
          details: Json
          updated_count: number
        }[]
      }
      update_edn_items_with_specific_content: {
        Args: never
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
      validate_campaign_consents: {
        Args: { p_campaign_id: string }
        Returns: {
          consent_scope: string
          has_consent: boolean
          user_email: string
          user_id: string
        }[]
      }
      validate_edn_item_data: { Args: { item_data: Json }; Returns: boolean }
      validate_music_lyrics: { Args: { lyrics_data: Json }; Returns: boolean }
      verify_competences_completeness: {
        Args: never
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
        Args: never
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
      verify_invitation_token: { Args: { token_param: string }; Returns: Json }
      verify_oic_data_integrity: {
        Args: never
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
      app_role: "admin" | "moderator" | "user" | "b2c"
      app_user_role: "user_b2c" | "user_b2b" | "manager_b2b" | "admin"
      b2b_role: "b2b_admin" | "b2b_manager" | "b2b_member" | "b2b_viewer"
      invitation_status: "pending" | "accepted" | "expired"
      share_permission: "viewer" | "editor" | "admin"
      time_block_type:
        | "creation"
        | "recovery"
        | "constraint"
        | "emotional"
        | "chosen"
        | "imposed"
        | "decision"
        | "urgency"
        | "routine"
        | "exposure"
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
      app_role: ["admin", "moderator", "user", "b2c"],
      app_user_role: ["user_b2c", "user_b2b", "manager_b2b", "admin"],
      b2b_role: ["b2b_admin", "b2b_manager", "b2b_member", "b2b_viewer"],
      invitation_status: ["pending", "accepted", "expired"],
      share_permission: ["viewer", "editor", "admin"],
      time_block_type: [
        "creation",
        "recovery",
        "constraint",
        "emotional",
        "chosen",
        "imposed",
        "decision",
        "urgency",
        "routine",
        "exposure",
      ],
    },
  },
} as const
