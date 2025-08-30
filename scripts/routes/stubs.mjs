#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.join(__dirname, "ROUTES_MANIFEST.json");

function createPageStub(routePath, role) {
  const componentName = routePath === "/" ? "HomePage" : 
    routePath.split("/").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join("") + "Page";
  
  return `import { AsyncState } from "@/components/transverse/AsyncState";

export default function ${componentName}() {
  return (
    <main data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          ${routePath === "/" ? "Accueil" : routePath.split("/").pop()}
        </h1>
        <AsyncState.Content>
          <p className="text-muted-foreground">
            Page en cours de développement pour le rôle: ${role}
          </p>
        </AsyncState.Content>
      </div>
    </main>
  );
}
`;
}

function createStubs() {
  try {
    console.log("🔧 Creating page stubs...");
    
    const manifestContent = fs.readFileSync(manifestPath, "utf8");
    const manifest = JSON.parse(manifestContent);
    
    let created = 0;
    
    for (const route of manifest.routes) {
      const filePath = route.path === "/" ? 
        "src/pages/index.tsx" : 
        `src/pages${route.path}Page.tsx`;
      
      // Create directory if it doesn't exist
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Create file if it doesn't exist
      if (!fs.existsSync(filePath)) {
        const stubContent = createPageStub(route.path, route.role);
        fs.writeFileSync(filePath, stubContent);
        console.log(`✅ Created: ${filePath}`);
        created++;
      }
    }
    
    console.log(`🎉 Created ${created} page stubs`);
    
  } catch (error) {
    console.error("❌ Stub creation failed:", error.message);
    process.exit(1);
  }
}

createStubs();