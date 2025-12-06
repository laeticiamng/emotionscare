// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PseudonymizeRequest {
  operation: 'pseudonymize' | 'depseudonymize' | 'rotate_key' | 'test';
  ruleId?: string;
  dataType?: string;
  fieldName?: string;
  value?: string;
  values?: string[];
}

// Algorithmes de pseudonymisation
class PseudonymizationService {
  private encoder = new TextEncoder();
  private decoder = new TextDecoder();

  // AES-256-GCM encryption (réversible)
  async aes256Encrypt(data: string, key: string): Promise<string> {
    try {
      const keyData = await this.deriveKey(key);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encodedData = this.encoder.encode(data);

      const encryptedData = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        keyData,
        encodedData
      );

      // Combiner IV + données chiffrées
      const combined = new Uint8Array(iv.length + encryptedData.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encryptedData), iv.length);

      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('AES encryption error:', error);
      throw new Error('Encryption failed');
    }
  }

  async aes256Decrypt(encryptedData: string, key: string): Promise<string> {
    try {
      const keyData = await this.deriveKey(key);
      const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
      
      const iv = combined.slice(0, 12);
      const data = combined.slice(12);

      const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        keyData,
        data
      );

      return this.decoder.decode(decryptedData);
    } catch (error) {
      console.error('AES decryption error:', error);
      throw new Error('Decryption failed');
    }
  }

  // HMAC-SHA256 (pseudo-réversible via mapping)
  async hmacHash(data: string, key: string): Promise<string> {
    const keyData = this.encoder.encode(key);
    const dataArray = this.encoder.encode(data);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, dataArray);
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  }

  // Format-Preserving Encryption (simple pour démo)
  async formatPreservingEncrypt(data: string, key: string): Promise<string> {
    // Pour email: preserve format xxx@xxx.com
    if (data.includes('@')) {
      const [local, domain] = data.split('@');
      const encryptedLocal = await this.tokenize(local, key);
      return `${encryptedLocal.substring(0, 8)}@${domain}`;
    }
    
    // Pour téléphone: preserve format
    if (/^\+?[\d\s-()]+$/.test(data)) {
      const digits = data.replace(/\D/g, '');
      const hash = await this.hmacHash(digits, key);
      const newDigits = hash.replace(/\D/g, '').substring(0, digits.length);
      return data.replace(/\d/g, () => newDigits[0] || '0');
    }

    // Défaut: tokenization
    return this.tokenize(data, key);
  }

  // Tokenization (réversible via mapping DB)
  async tokenize(data: string, key: string): Promise<string> {
    const hash = await this.hmacHash(data + key, 'tokenization');
    return 'TOK_' + hash.substring(0, 32).toUpperCase();
  }

  // Dérive une clé de chiffrement depuis une string
  private async deriveKey(password: string): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      this.encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: this.encoder.encode('emotionscare-pseudonymization-salt'),
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // Hash pour identifier les données
  async hashData(data: string): Promise<string> {
    const hashBuffer = await crypto.subtle.digest(
      'SHA-256',
      this.encoder.encode(data)
    );
    return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const body = await req.json() as PseudonymizeRequest;
    const service = new PseudonymizationService();
    const startTime = Date.now();

    console.log('Pseudonymization request:', {
      operation: body.operation,
      ruleId: body.ruleId,
      dataType: body.dataType
    });

    // Récupérer la règle
    let rule;
    if (body.ruleId) {
      const { data, error } = await supabase
        .from('pseudonymization_rules')
        .select('*')
        .eq('id', body.ruleId)
        .single();
      
      if (error || !data) throw new Error('Rule not found');
      rule = data;
    } else if (body.dataType && body.fieldName) {
      const { data, error } = await supabase
        .from('pseudonymization_rules')
        .select('*')
        .eq('data_type', body.dataType)
        .eq('field_name', body.fieldName)
        .eq('is_active', true)
        .single();
      
      if (error || !data) throw new Error('No active rule found for this data type');
      rule = data;
    } else {
      throw new Error('Must provide either ruleId or dataType+fieldName');
    }

    // Récupérer la clé de chiffrement
    const { data: keyData, error: keyError } = await supabase
      .from('pseudonymization_keys')
      .select('key_encrypted, algorithm')
      .eq('rule_id', rule.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (keyError || !keyData) {
      throw new Error('No active encryption key found for this rule');
    }

    const masterKey = Deno.env.get('PSEUDONYMIZATION_MASTER_KEY') || 'default-master-key-change-in-production';
    const encryptionKey = await service.aes256Decrypt(keyData.key_encrypted, masterKey);

    let result: any = {};

    switch (body.operation) {
      case 'pseudonymize': {
        if (!body.value && !body.values) {
          throw new Error('Value or values required for pseudonymization');
        }

        const valuesToProcess = body.values || [body.value];
        const results = [];

        for (const originalValue of valuesToProcess) {
          let pseudonymizedValue: string;
          const originalHash = await service.hashData(originalValue);

          // Vérifier si déjà pseudonymisé
          const { data: existing } = await supabase
            .from('pseudonymization_mapping')
            .select('pseudonymized_value')
            .eq('rule_id', rule.id)
            .eq('original_hash', originalHash)
            .single();

          if (existing) {
            pseudonymizedValue = existing.pseudonymized_value;
          } else {
            // Appliquer l'algorithme
            switch (rule.algorithm) {
              case 'aes256':
                pseudonymizedValue = await service.aes256Encrypt(originalValue, encryptionKey);
                break;
              case 'hmac':
                pseudonymizedValue = await service.hmacHash(originalValue, encryptionKey);
                break;
              case 'tokenization':
                pseudonymizedValue = await service.tokenize(originalValue, encryptionKey);
                break;
              case 'format_preserving':
                pseudonymizedValue = await service.formatPreservingEncrypt(originalValue, encryptionKey);
                break;
              default:
                throw new Error(`Unknown algorithm: ${rule.algorithm}`);
            }

            // Stocker le mapping si réversible
            if (rule.is_reversible) {
              const encryptedOriginal = await service.aes256Encrypt(originalValue, masterKey);
              await supabase
                .from('pseudonymization_mapping')
                .insert({
                  rule_id: rule.id,
                  original_hash: originalHash,
                  pseudonymized_value: pseudonymizedValue,
                  encrypted_original: encryptedOriginal
                });
            }
          }

          results.push({
            original: originalValue,
            pseudonymized: pseudonymizedValue
          });
        }

        result = body.values ? { results } : results[0];

        // Mettre à jour les stats
        const today = new Date().toISOString().split('T')[0];
        await supabase.rpc('upsert_pseudonymization_stats', {
          p_rule_id: rule.id,
          p_date: today,
          p_pseudonymized_count: valuesToProcess.length,
          p_processing_time: Date.now() - startTime
        }).catch(console.error);

        break;
      }

      case 'depseudonymize': {
        if (!rule.is_reversible) {
          throw new Error('This rule is not reversible');
        }

        if (!body.value && !body.values) {
          throw new Error('Value or values required for depseudonymization');
        }

        const valuesToProcess = body.values || [body.value];
        const results = [];

        for (const pseudonymizedValue of valuesToProcess) {
          // Chercher dans le mapping
          const { data: mapping, error: mappingError } = await supabase
            .from('pseudonymization_mapping')
            .select('encrypted_original')
            .eq('rule_id', rule.id)
            .eq('pseudonymized_value', pseudonymizedValue)
            .single();

          if (mappingError || !mapping) {
            throw new Error(`No mapping found for pseudonymized value`);
          }

          const originalValue = await service.aes256Decrypt(mapping.encrypted_original, masterKey);

          // Mettre à jour le compteur d'accès
          await supabase
            .from('pseudonymization_mapping')
            .update({
              accessed_count: supabase.sql`accessed_count + 1`,
              last_accessed_at: new Date().toISOString()
            })
            .eq('rule_id', rule.id)
            .eq('pseudonymized_value', pseudonymizedValue);

          results.push({
            pseudonymized: pseudonymizedValue,
            original: originalValue
          });
        }

        result = body.values ? { results } : results[0];

        // Mettre à jour les stats
        const today = new Date().toISOString().split('T')[0];
        await supabase.rpc('upsert_pseudonymization_stats', {
          p_rule_id: rule.id,
          p_date: today,
          p_depseudonymized_count: valuesToProcess.length,
          p_processing_time: Date.now() - startTime
        }).catch(console.error);

        break;
      }

      case 'rotate_key': {
        // Générer nouvelle clé
        const newKey = crypto.randomUUID() + crypto.randomUUID();
        const newKeyHash = await service.hashData(newKey);
        const newKeyEncrypted = await service.aes256Encrypt(newKey, masterKey);

        // Désactiver l'ancienne clé
        await supabase
          .from('pseudonymization_keys')
          .update({ is_active: false })
          .eq('rule_id', rule.id)
          .eq('is_active', true);

        // Créer la nouvelle clé
        const { data: newKeyData } = await supabase
          .from('pseudonymization_keys')
          .insert({
            rule_id: rule.id,
            key_hash: newKeyHash,
            key_encrypted: newKeyEncrypted,
            algorithm: rule.algorithm,
            rotation_count: (keyData as any).rotation_count + 1
          })
          .select()
          .single();

        result = { 
          success: true, 
          message: 'Key rotated successfully',
          newKeyId: newKeyData?.id
        };
        break;
      }

      case 'test': {
        // Test de pseudonymisation/dépseudonymisation
        const testValue = body.value || 'test@example.com';
        const pseudo = await service.aes256Encrypt(testValue, encryptionKey);
        const depseudo = await service.aes256Decrypt(pseudo, encryptionKey);

        result = {
          success: depseudo === testValue,
          original: testValue,
          pseudonymized: pseudo,
          recovered: depseudo,
          algorithm: rule.algorithm
        };
        break;
      }

      default:
        throw new Error(`Unknown operation: ${body.operation}`);
    }

    // Log l'opération
    const { data: userData } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    await supabase
      .from('pseudonymization_log')
      .insert({
        rule_id: rule.id,
        operation: body.operation,
        data_type: rule.data_type,
        field_name: rule.field_name,
        success: true,
        records_affected: body.values ? body.values.length : 1,
        performed_by: userData.user?.id,
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: req.headers.get('user-agent')
      });

    console.log('Pseudonymization completed:', {
      operation: body.operation,
      duration: Date.now() - startTime,
      success: true
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Pseudonymization error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Pseudonymization operation failed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
