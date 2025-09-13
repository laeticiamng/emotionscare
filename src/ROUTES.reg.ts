export type RouteDef = { id: string; path: string; component: string };
const routes: Record<string, RouteDef> = {
  // ⚠️ existants : ne rien modifier
};

export function addRoute(def: RouteDef) {
  if (routes[def.id]) throw new Error(`Route ${def.id} existe déjà`);
  routes[def.id] = def;
}

export function getRoutes() {
  return Object.values(routes);
}

export default routes;

// Routes initiales
addRoute({ id: "flash-glow", path: "/modules/flash-glow", component: "FlashGlowPage" });
