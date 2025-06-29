export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          content: Json
          created_at: string
          id: string
          item_number: string
          title: string
          updated_at: string
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          item_number: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          item_number?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      edn_items_immersive: {
        Row: {
          audio_ambiance: Json | null
          created_at: string
          id: string
          interaction_config: Json | null
          item_code: string
          paroles_musicales: string[] | null
          pitch_intro: string | null
          quiz_questions: Json | null
          reward_messages: Json | null
          scene_immersive: Json | null
          slug: string
          subtitle: string | null
          tableau_rang_a: Json | null
          tableau_rang_b: Json | null
          title: string
          updated_at: string
          visual_ambiance: Json | null
        }
        Insert: {
          audio_ambiance?: Json | null
          created_at?: string
          id?: string
          interaction_config?: Json | null
          item_code: string
          paroles_musicales?: string[] | null
          pitch_intro?: string | null
          quiz_questions?: Json | null
          reward_messages?: Json | null
          scene_immersive?: Json | null
          slug: string
          subtitle?: string | null
          tableau_rang_a?: Json | null
          tableau_rang_b?: Json | null
          title: string
          updated_at?: string
          visual_ambiance?: Json | null
        }
        Update: {
          audio_ambiance?: Json | null
          created_at?: string
          id?: string
          interaction_config?: Json | null
          item_code?: string
          paroles_musicales?: string[] | null
          pitch_intro?: string | null
          quiz_questions?: Json | null
          reward_messages?: Json | null
          scene_immersive?: Json | null
          slug?: string
          subtitle?: string | null
          tableau_rang_a?: Json | null
          tableau_rang_b?: Json | null
          title?: string
          updated_at?: string
          visual_ambiance?: Json | null
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
      journal_entries: {
        Row: {
          ai_feedback: string | null
          content: string
          date: string
          id: string
          user_id: string
        }
        Insert: {
          ai_feedback?: string | null
          content: string
          date?: string
          id?: string
          user_id: string
        }
        Update: {
          ai_feedback?: string | null
          content?: string
          date?: string
          id?: string
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
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          department: string | null
          email: string | null
          emotional_score: number | null
          id: string
          job_title: string | null
          location: string | null
          name: string | null
          phone: string | null
          preferences: Json | null
          role: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          emotional_score?: number | null
          id: string
          job_title?: string | null
          location?: string | null
          name?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          emotional_score?: number | null
          id?: string
          job_title?: string | null
          location?: string | null
          name?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: string | null
          updated_at?: string | null
          website?: string | null
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
    }
    Views: {
      med_mng_view_library: {
        Row: {
          added_to_library_at: string | null
          created_at: string | null
          id: string | null
          is_liked: boolean | null
          meta: Json | null
          suno_audio_id: string | null
          title: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      accept_invitation: {
        Args: { token_param: string }
        Returns: boolean
      }
      count_all_invitations: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      count_invitations_by_status: {
        Args: { status_param: Database["public"]["Enums"]["invitation_status"] }
        Returns: number
      }
      create_activity_log_cleanup_job: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_notification_from_template: {
        Args: {
          template_name: string
          target_user_id: string
          template_variables?: Json
        }
        Returns: string
      }
      get_activity_stats: {
        Args: { p_start_date?: string; p_end_date?: string }
        Returns: {
          activity_type: string
          total_count: number
          percentage: number
        }[]
      }
      get_anonymous_activity_logs: {
        Args: {
          p_start_date?: string
          p_end_date?: string
          p_activity_type?: string
          p_search_term?: string
          p_page?: number
          p_page_size?: number
        }
        Returns: {
          id: string
          activity_type: string
          category: string
          count: number
          timestamp_day: string
        }[]
      }
      mark_notifications_as_read: {
        Args: { user_id_param: string; notification_ids?: string[] }
        Returns: number
      }
      med_mng_add_to_library: {
        Args: { song_id: string }
        Returns: undefined
      }
      med_mng_create_user_sub: {
        Args: {
          plan_name: string
          gateway_name: string
          subscription_id?: string
        }
        Returns: undefined
      }
      med_mng_get_remaining_quota: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      med_mng_refresh_monthly_quota: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      med_mng_remove_from_library: {
        Args: { song_id: string }
        Returns: undefined
      }
      med_mng_save_theme: {
        Args: { theme_json: Json }
        Returns: undefined
      }
      med_mng_toggle_like: {
        Args: { song_id: string }
        Returns: boolean
      }
      verify_invitation_token: {
        Args: { token_param: string }
        Returns: Json
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
