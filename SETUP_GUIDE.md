# 🚀 EmotionsCare - Guía de Configuración Completa

Esta guía te ayudará a configurar todas las funcionalidades de la plataforma EmotionsCare.

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
3. [Funcionalidades Implementadas](#funcionalidades-implementadas)
4. [Configuración por Servicio](#configuración-por-servicio)
5. [Despliegue](#despliegue)
6. [Solución de Problemas](#solución-de-problemas)

---

## Requisitos Previos

- Node.js 20.x o superior
- npm 9.x o superior
- Una cuenta de Supabase
- Cuentas en los servicios externos que desees usar

---

## Configuración de Variables de Entorno

1. Copia el archivo de ejemplo:
```bash
cp .env.example .env
```

2. Completa las variables según los servicios que quieras activar.

---

## Funcionalidades Implementadas

### ✅ Funcionalidades Principales Completadas

#### 1. 🧠 **Análisis Emocional en Tiempo Real (Hume AI)**
- **Estado**: ✅ Implementado
- **Archivos**:
  - `src/services/hume/stream.ts`
  - `src/hooks/useHumeStream.ts`
- **Descripción**: Análisis emocional en tiempo real usando WebSocket con Hume AI API

#### 2. 🎵 **Generación de Música Terapéutica (Suno AI)**
- **Estado**: ✅ Implementado
- **Archivos**:
  - `supabase/functions/suno-music/index.ts`
  - `supabase/functions/process-music-session/index.ts`
  - `src/services/b2c/musicService.ts`
- **Descripción**: Generación de música personalizada basada en emociones con polling y realtime

#### 3. 📝 **Journal con Múltiples Entradas**
- **Estado**: ✅ Implementado
- **Archivos**:
  - `supabase/functions/journal/index.ts`
  - `src/modules/journal/journalService.ts`
- **Descripción**: Sistema completo de journal con voz, texto, e insights

#### 4. 🎤 **Transcripción de Voz (Whisper API)**
- **Estado**: ✅ Implementado
- **Archivos**:
  - `supabase/functions/transcribe-audio/index.ts`
  - `src/components/journal/JournalVoiceRecorder.tsx`
- **Descripción**: Transcripción automática de audio a texto con análisis emocional integrado

#### 5. 📸 **Análisis de Imágenes (GPT-4 Vision)**
- **Estado**: ✅ Implementado
- **Archivos**:
  - `supabase/functions/analyze-image/index.ts`
  - `src/components/journal/JournalPhotoUpload.tsx`
- **Descripción**: Análisis emocional de imágenes con detección de sentimientos

#### 6. 📄 **Generación de Reportes PDF**
- **Estado**: ✅ Implementado
- **Archivos**:
  - `supabase/functions/html-to-pdf/index.ts`
  - `supabase/functions/ai-reports-generate/index.ts`
- **Descripción**: Generación de reportes en HTML/PDF con templates profesionales

#### 7. 🔔 **Notificaciones Push**
- **Estado**: ✅ Implementado
- **Archivos**:
  - `supabase/functions/push-notification/index.ts`
- **Descripción**: Sistema completo de push notifications con soporte FCM y Web Push API

#### 8. 📧 **Sistema de Emails**
- **Estado**: ✅ Implementado
- **Archivos**:
  - `supabase/functions/_shared/email-service.ts`
- **Descripción**: Envío de emails con soporte para Resend, SendGrid y AWS SES

---

## Configuración por Servicio

### 🧠 1. Hume AI - Análisis Emocional

**Variables requeridas:**
```bash
VITE_HUME_API_KEY=your_hume_api_key
HUME_API_KEY=your_hume_api_key  # Para edge functions
```

**Cómo obtener API Key:**
1. Regístrate en [Hume AI](https://beta.hume.ai/)
2. Ve a Settings > API Keys
3. Crea una nueva API key
4. Copia y pega en tu `.env`

**Uso:**
```typescript
import { useHumeStream } from '@/hooks/useHumeStream';

const { connect, currentEmotion, isConnected } = useHumeStream();

// Conectar
connect();

// Acceder a emociones en tiempo real
console.log(currentEmotion); // { valence, arousal, dominantEmotion, confidence }
```

---

### 🎵 2. Suno AI - Generación Musical

**Variables requeridas:**
```bash
VITE_SUNO_API_KEY=your_suno_api_key
SUNO_API_KEY=your_suno_api_key  # Para edge functions
```

**Cómo obtener API Key:**
1. Regístrate en [Suno AI](https://www.suno.ai/)
2. Contacta con su equipo para acceso API (actualmente en beta privada)
3. Una vez aprobado, obtendrás tu API key

**Uso:**
```typescript
import { musicService } from '@/services/b2c/musicService';

// Crear sesión de música
const session = await musicService.createMusicSession({
  preset_id: 'calm-meditation',
  metadata: { mood: 'calm', intensity: 0.7 }
});

// Polling para verificar cuando está lista
const completed = await musicService.pollSessionStatus(session.id);
console.log(completed.artifact_url); // URL del audio generado
```

---

### 🎤 3. Whisper API - Transcripción de Voz

**Variables requeridas:**
```bash
OPENAI_API_KEY=sk-...  # Mismo key usado para GPT-4 Vision
```

**Uso:**
La transcripción se integra automáticamente en el componente `JournalVoiceRecorder`. Los usuarios pueden:
1. Grabar audio desde el navegador
2. La edge function transcribe automáticamente con Whisper
3. Opcionalmente analiza el contenido emocional con GPT

**Edge Function:** `transcribe-audio`

---

### 📸 4. GPT-4 Vision - Análisis de Imágenes

**Variables requeridas:**
```bash
OPENAI_API_KEY=sk-...
```

**Cómo obtener API Key:**
1. Regístrate en [OpenAI Platform](https://platform.openai.com/)
2. Ve a API Keys
3. Crea una nueva key
4. Asegúrate de tener créditos en tu cuenta

**Uso:**
```typescript
// El componente JournalPhotoUpload maneja todo automáticamente
<JournalPhotoUpload
  enableAIAnalysis={true}
  onPhotoAdded={(url, analysis) => {
    console.log('Emociones detectadas:', analysis.emotions);
    console.log('Descripción:', analysis.description);
  }}
/>
```

**Edge Function:** `analyze-image`

---

### 📄 5. Generación de PDF

**Variables opcionales:**
```bash
PDFSHIFT_API_KEY=your_pdfshift_api_key  # Recomendado para producción
```

**Sin PDFShift:**
- Los reportes se generan en HTML
- Pueden ser impresos como PDF por el navegador

**Con PDFShift:**
1. Regístrate en [PDFShift](https://pdfshift.io/)
2. Obtén tu API key
3. Los reportes se generarán como PDF real

**Uso:**
```typescript
// Los reportes se generan automáticamente via edge function
const { data } = await supabase.functions.invoke('ai-reports-generate', {
  body: {
    type: 'weekly_summary',
    user_id: userId,
    period_start: '2025-01-01',
    period_end: '2025-01-07'
  }
});

console.log('Report URL:', data.report_url);
```

---

### 🔔 6. Notificaciones Push

**Opción A: Firebase Cloud Messaging (Recomendado para móviles)**

```bash
# Frontend
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc

# Backend
FIREBASE_FCM_API_KEY=your_fcm_server_key
```

**Configuración:**
1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Cloud Messaging
3. Descarga las credenciales
4. Obtén el Server Key desde Project Settings > Cloud Messaging

**Opción B: Web Push API (Recomendado para web)**

```bash
# Generar VAPID keys
npx web-push generate-vapid-keys

# Agregar a .env
VITE_VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
VAPID_SUBJECT=mailto:support@emotionscare.com
```

**Uso:**
```typescript
// Registrar dispositivo
await supabase.functions.invoke('push-notification', {
  body: {
    token: deviceToken,
    device_type: 'web'
  }
});

// Enviar notificación
await supabase.functions.invoke('push-notification', {
  body: {
    title: 'Nueva sesión disponible',
    body: 'Tu música terapéutica está lista',
    type: 'music_ready',
    click_action: '/music/sessions'
  }
});
```

---

### 📧 7. Sistema de Emails

**Opción A: Resend (Recomendado - más simple)**

```bash
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=noreply@emotionscare.com
```

1. Regístrate en [Resend](https://resend.com/)
2. Verifica tu dominio
3. Obtén tu API key

**Opción B: SendGrid**

```bash
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@emotionscare.com
```

1. Regístrate en [SendGrid](https://sendgrid.com/)
2. Verifica tu dominio sender
3. Crea una API key con permisos de envío

**Opción C: AWS SES**

```bash
EMAIL_PROVIDER=ses
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
EMAIL_FROM=noreply@emotionscare.com
```

**Uso automático:**
Los emails se envían automáticamente en estos casos:
- Invitaciones a organizaciones
- Alertas de auditoría
- Confirmaciones GDPR
- Reportes programados

---

## Despliegue

### Supabase Edge Functions

1. Instalar Supabase CLI:
```bash
npm install -g supabase
```

2. Login:
```bash
supabase login
```

3. Link a tu proyecto:
```bash
supabase link --project-ref your-project-ref
```

4. Deploy todas las edge functions:
```bash
supabase functions deploy transcribe-audio
supabase functions deploy analyze-image
supabase functions deploy process-music-session
supabase functions deploy html-to-pdf
supabase functions deploy push-notification
supabase functions deploy journal
supabase functions deploy suno-music
```

5. Configurar secrets:
```bash
# OpenAI
supabase secrets set OPENAI_API_KEY=sk-...

# Hume AI
supabase secrets set HUME_API_KEY=...

# Suno
supabase secrets set SUNO_API_KEY=...

# Email (Resend)
supabase secrets set RESEND_API_KEY=re_...
supabase secrets set EMAIL_FROM=noreply@emotionscare.com
supabase secrets set EMAIL_PROVIDER=resend

# Push Notifications (FCM)
supabase secrets set FIREBASE_FCM_API_KEY=...

# Push Notifications (Web Push)
supabase secrets set VAPID_PRIVATE_KEY=...
supabase secrets set VAPID_SUBJECT=mailto:support@emotionscare.com

# PDF Generation (opcional)
supabase secrets set PDFSHIFT_API_KEY=...

# Frontend URL
supabase secrets set FRONTEND_URL=https://app.emotionscare.com
```

### Frontend (Vercel / Netlify)

1. Build:
```bash
npm run build
```

2. Configurar variables de entorno en tu plataforma:
- Todas las variables que comienzan con `VITE_` deben estar configuradas
- Ejemplo en Vercel: Settings > Environment Variables

---

## Solución de Problemas

### ❌ Error: "OPENAI_API_KEY not configured"

**Solución:**
```bash
supabase secrets set OPENAI_API_KEY=sk-your-key-here
```

### ❌ Error: "Hume WebSocket connection failed"

**Causas posibles:**
1. API key inválida
2. Límite de rate excedido
3. Timeout (reconecta automáticamente)

**Solución:**
- Verifica que `VITE_HUME_API_KEY` esté correctamente configurada
- Revisa tu cuota en Hume AI dashboard

### ❌ Error: "Music generation timeout"

**Causas:**
- Suno API está tomando más de 5 minutos
- Problemas de red

**Solución:**
- La función tiene polling automático con 30 intentos
- Si falla, el usuario puede reintentar
- Considera aumentar `maxAttempts` en `musicService.pollSessionStatus()`

### ❌ Emails no se envían

**Verificar:**
```bash
# 1. Ver logs de edge function
supabase functions logs send-invitation

# 2. Verificar configuración
echo $RESEND_API_KEY  # o SENDGRID_API_KEY

# 3. Verificar dominio verificado en Resend/SendGrid
```

---

## 🎉 ¡Listo!

Tu plataforma EmotionsCare está ahora completamente configurada con:

- ✅ Análisis emocional en tiempo real
- ✅ Generación de música terapéutica
- ✅ Transcripción de voz
- ✅ Análisis de imágenes
- ✅ Generación de reportes PDF
- ✅ Notificaciones push
- ✅ Sistema de emails completo

## 📚 Recursos Adicionales

- [Documentación Supabase](https://supabase.com/docs)
- [Hume AI Docs](https://docs.hume.ai/)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Suno AI](https://www.suno.ai/)
- [Resend Docs](https://resend.com/docs)

---

## 🆘 Soporte

Si necesitas ayuda:
1. Revisa los logs de Supabase: `supabase functions logs <function-name>`
2. Revisa la consola del navegador para errores del frontend
3. Consulta este documento
4. Contacta al equipo de desarrollo

---

**Última actualización:** 2025-11-19
**Versión de la plataforma:** 1.2.0
**Estado:** ✅ Producción Ready
