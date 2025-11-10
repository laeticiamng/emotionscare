# 🏗️ VISUALISATION ARCHITECTURE - EmotionsCare

**Date**: 10 novembre 2025  
**Version**: RouterV2 2.1.0  

---

## 📊 VUE D'ENSEMBLE

<lov-mermaid>
graph TB
    subgraph "Frontend - React 18 + Vite"
        A[User Browser] --> B[RouterV2]
        B --> C{Guard System}
        C -->|Auth OK| D[Page Components]
        C -->|Auth KO| E[Login]
        D --> F[UI Components]
        F --> G[Design System]
    end
    
    subgraph "Backend - Supabase"
        H[Supabase Auth]
        I[Supabase DB]
        J[Edge Functions]
    end
    
    D --> H
    D --> I
    D --> J
    
    style A fill:#4CAF50
    style D fill:#2196F3
    style H fill:#FF9800
    style I fill:#9C27B0
    style J fill:#F44336
</lov-mermaid>

---

## 🔐 FLUX AUTHENTIFICATION

<lov-mermaid>
sequenceDiagram
    participant U as User
    participant R as Router
    participant AG as AuthGuard
    participant RG as RoleGuard
    participant MG as ModeGuard
    participant S as Supabase
    participant P as Page

    U->>R: Navigate to /app/scan
    R->>AG: Check Auth
    AG->>S: getSession()
    
    alt Not Authenticated
        S-->>AG: null session
        AG-->>R: Redirect /login
        R-->>U: Show Login Page
    else Authenticated
        S-->>AG: session + user
        AG->>RG: Check Role
        
        alt Wrong Role
            RG-->>R: Redirect /forbidden
            R-->>U: Show 403
        else Correct Role
            RG->>MG: Sync Mode
            MG->>MG: setUserMode(segment)
            MG->>P: Render Page
            P-->>U: Show Content
        end
    end
</lov-mermaid>

---

## 🗺️ ARCHITECTURE ROUTERV2

<lov-mermaid>
graph LR
    subgraph "Routes Registry"
        A[registry.ts<br/>81 routes]
        B[routes.config.ts<br/>ROUTES array]
        C[aliases.ts<br/>Legacy compat]
    end
    
    subgraph "Router Core"
        D[router.tsx<br/>Lazy imports]
        E[guards.tsx<br/>Auth/Role/Mode]
    end
    
    subgraph "Route Helpers"
        F[lib/routes.ts<br/>publicRoutes<br/>authRoutes<br/>b2cRoutes<br/>b2bRoutes]
    end
    
    A --> D
    B --> D
    C --> D
    E --> D
    D --> F
    
    style A fill:#4CAF50
    style D fill:#2196F3
    style E fill:#FF9800
    style F fill:#9C27B0
</lov-mermaid>

---

## 🎨 HIÉRARCHIE COMPOSANTS

<lov-mermaid>
graph TD
    A[App Root] --> B[AuthProvider]
    B --> C[UserModeProvider]
    C --> D[ThemeProvider]
    D --> E[RouterProvider]
    
    E --> F{Route Type}
    F -->|Public| G[Marketing Layout]
    F -->|Auth Required| H[App Layout]
    
    G --> I[Public Pages]
    H --> J{Role Check}
    
    J -->|Consumer| K[B2C Dashboard]
    J -->|Employee| L[B2B Collab]
    J -->|Manager| M[B2B RH]
    
    K --> N[Modules]
    N --> O[Scan]
    N --> P[Music]
    N --> Q[Coach]
    N --> R[Journal]
    
    style A fill:#4CAF50
    style B fill:#FF9800
    style C fill:#FF9800
    style E fill:#2196F3
    style K fill:#9C27B0
    style L fill:#9C27B0
    style M fill:#9C27B0
</lov-mermaid>

---

## 🔒 SYSTEM GUARDS

<lov-mermaid>
flowchart TD
    Start([User Request]) --> Route{Route Type?}
    
    Route -->|Public| Public[No Guard]
    Public --> Render[Render Page]
    
    Route -->|Protected| AuthG{AuthGuard}
    AuthG -->|Not Auth| Login[Redirect Login]
    AuthG -->|Auth OK| RoleG{RoleGuard}
    
    RoleG -->|No Role Check| ModeG[ModeGuard]
    RoleG -->|Role Check| RoleCheck{Role Match?}
    
    RoleCheck -->|No| Forbidden[Redirect 403]
    RoleCheck -->|Yes| ModeG
    
    ModeG --> SyncMode[Sync UserMode]
    SyncMode --> Render
    
    style Start fill:#4CAF50
    style AuthG fill:#FF9800
    style RoleG fill:#F44336
    style ModeG fill:#2196F3
    style Render fill:#9C27B0
</lov-mermaid>

---

## 🗂️ STRUCTURE FICHIERS

<lov-mermaid>
graph TB
    subgraph "src/"
        A[components/]
        B[pages/]
        C[hooks/]
        D[contexts/]
        E[lib/]
        F[routerV2/]
    end
    
    A --> A1[ui/ - 130+ composants]
    A --> A2[layout/]
    A --> A3[error/]
    A --> A4[loading/]
    
    B --> B1[admin/]
    B --> B2[b2b/]
    B --> B3[legal/]
    B --> B4[unified/]
    B --> B5[150+ pages racine]
    
    C --> C1[useAuth]
    C --> C2[useUserMode]
    C --> C3[useRouter]
    
    D --> D1[AuthContext]
    D --> D2[UserModeContext]
    
    E --> E1[routes.ts]
    E --> E2[logger.ts]
    E --> E3[supabase.ts]
    
    F --> F1[registry.ts]
    F --> F2[router.tsx]
    F --> F3[guards.tsx]
    F --> F4[aliases.ts]
    
    style A fill:#4CAF50
    style B fill:#2196F3
    style D fill:#FF9800
    style F fill:#9C27B0
</lov-mermaid>

---

## 🎯 MAPPING ROLES/MODES

<lov-mermaid>
graph LR
    subgraph "Roles (DB)"
        R1[consumer]
        R2[employee]
        R3[manager]
        R4[admin]
    end
    
    subgraph "UserModes (Frontend)"
        M1[b2c]
        M2[b2b_user]
        M3[b2b_admin]
        M4[admin]
    end
    
    subgraph "Routes Segments"
        S1[/app/consumer/*]
        S2[/app/collab/*]
        S3[/app/rh/*]
        S4[/admin/*]
    end
    
    R1 -.->|⚠️ Incohérent| M1
    R2 -.->|⚠️ Incohérent| M2
    R3 --> M3
    R4 --> M4
    
    M1 --> S1
    M2 --> S2
    M3 --> S3
    M4 --> S4
    
    style R1 fill:#F44336
    style R2 fill:#F44336
    style M1 fill:#FF9800
    style M2 fill:#FF9800
    style S1 fill:#4CAF50
</lov-mermaid>

**⚠️ PROBLÈME IDENTIFIÉ**: Mappings incohérents entre guards.tsx et UserModeContext.tsx

---

## 📦 BUNDLE ARCHITECTURE

<lov-mermaid>
graph TD
    A[main.tsx] --> B[App Providers]
    B --> C[Router]
    C --> D{Code Split}
    
    D --> E[Public Chunk<br/>Home, About, Contact]
    D --> F[Auth Chunk<br/>Login, Signup]
    D --> G[B2C Chunk<br/>Dashboard, Scan, Music]
    D --> H[B2B Chunk<br/>Collab, RH, Reports]
    D --> I[Admin Chunk<br/>GDPR, Monitoring, Audit]
    
    E --> J[UI Components<br/>Shared Bundle]
    F --> J
    G --> J
    H --> J
    I --> J
    
    style A fill:#4CAF50
    style D fill:#2196F3
    style J fill:#9C27B0
</lov-mermaid>

---

## 🔄 LIFECYCLE PAGE

<lov-mermaid>
sequenceDiagram
    participant Router
    participant Guards
    participant Context
    participant Page
    participant Supabase
    
    Router->>Guards: Check Route
    Guards->>Context: Get Auth State
    Context->>Supabase: Verify Session
    Supabase-->>Context: Session Valid
    Context-->>Guards: User + Mode
    Guards->>Guards: Validate Role
    Guards->>Page: Lazy Load
    Page->>Page: usePageSEO()
    Page->>Page: data-testid="page-root"
    Page->>Supabase: Fetch Data
    Supabase-->>Page: Data Response
    Page-->>Router: Render Complete
</lov-mermaid>

---

## 🚦 ÉTATS SYSTÈME

<lov-mermaid>
stateDiagram-v2
    [*] --> Loading: App Start
    Loading --> Checking: Init Context
    Checking --> Anonymous: No Session
    Checking --> Authenticated: Session OK
    
    Anonymous --> Login: User Action
    Login --> Authenticating: Submit Creds
    Authenticating --> Authenticated: Success
    Authenticating --> LoginError: Failure
    LoginError --> Login: Retry
    
    Authenticated --> ModeSelection: First Time
    Authenticated --> Dashboard: Mode Set
    ModeSelection --> Dashboard: Mode Chosen
    
    Dashboard --> Module: Navigate
    Module --> Dashboard: Back
    
    Authenticated --> Logout: User Action
    Logout --> Anonymous: Session Clear
    
    Anonymous --> [*]
</lov-mermaid>

---

## 🎨 DESIGN SYSTEM FLOW

<lov-mermaid>
graph TD
    A[index.css<br/>CSS Variables HSL] --> B[tailwind.config.ts<br/>Extend Colors]
    B --> C[shadcn/ui Components<br/>130+ composants]
    C --> D[Page Components<br/>150+ pages]
    
    E[Theme Toggle] --> F{Theme Mode}
    F -->|Light| A
    F -->|Dark| A
    
    D --> G[Consistent Design]
    
    style A fill:#4CAF50
    style C fill:#2196F3
    style D fill:#9C27B0
</lov-mermaid>

---

## 📊 MÉTRIQUES TEMPS RÉEL

<lov-mermaid>
graph LR
    A[User Actions] --> B[Activity Logs]
    B --> C[Supabase DB]
    C --> D[Analytics Dashboard]
    
    E[API Calls] --> F[Edge Functions]
    F --> G[API Monitor]
    G --> H[Cost Tracking]
    
    I[Errors] --> J[Sentry]
    J --> K[Error Dashboard]
    
    D --> L[Admin RH]
    H --> L
    K --> L
    
    style A fill:#4CAF50
    style F fill:#FF9800
    style L fill:#2196F3
</lov-mermaid>

---

## 🔐 SÉCURITÉ LAYERS

<lov-mermaid>
graph TB
    subgraph "Frontend Security"
        A[CORS Whitelist<br/>*.emotionscare.ai]
        B[JWT Verification]
        C[Role-Based Access]
    end
    
    subgraph "Backend Security"
        D[Edge Functions<br/>CORS Helper]
        E[Supabase RLS<br/>Row Level Security]
        F[API Rate Limiting]
    end
    
    subgraph "Data Security"
        G[GDPR Compliance]
        H[Encrypted Storage]
        I[Audit Logs]
    end
    
    A --> D
    B --> E
    C --> E
    D --> F
    E --> G
    F --> H
    G --> I
    
    style A fill:#4CAF50
    style E fill:#FF9800
    style G fill:#2196F3
</lov-mermaid>

---

## 🧪 TESTING PYRAMID

<lov-mermaid>
graph TD
    A[E2E Tests<br/>Playwright<br/>67 pages] --> B[Integration Tests<br/>API + DB<br/>~40 tests]
    B --> C[Unit Tests<br/>Components + Hooks<br/>~200 tests]
    C --> D[Type Safety<br/>TypeScript Strict<br/>100% coverage]
    
    style A fill:#F44336
    style B fill:#FF9800
    style C fill:#4CAF50
    style D fill:#2196F3
</lov-mermaid>

---

## 🚀 DEPLOYMENT FLOW

<lov-mermaid>
graph LR
    A[Git Push] --> B{CI Pipeline}
    B --> C[npm run lint]
    B --> D[npm run test]
    B --> E[npm run build]
    
    C --> F{All Pass?}
    D --> F
    E --> F
    
    F -->|No| G[❌ Fail]
    F -->|Yes| H[Deploy Frontend<br/>Lovable]
    H --> I[Deploy Edge Functions<br/>Supabase]
    I --> J[✅ Live]
    
    style A fill:#4CAF50
    style F fill:#FF9800
    style J fill:#2196F3
</lov-mermaid>

---

**Rapport généré le**: 2025-11-10  
**Visualisations**: Mermaid.js  
**Prochaine màj**: Après corrections P0
