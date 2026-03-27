// @ts-nocheck
#!/usr/bin/env tsx

/**
 * Script de validation de la navigation
 * Vérifie que chaque nœud a soit une action, soit des enfants
 * Exécuté en CI pour garantir qu'aucun bouton n'est jamais "mort"
 */

import { NAV_SCHEMA, findNavNode, getAllRoutes } from '../src/lib/nav-schema';
import { NavNode } from '../src/types/nav';

interface ValidationError {
  nodeId: string;
  type: 'NO_ACTION_OR_CHILDREN' | 'INVALID_ACTION' | 'CIRCULAR_REFERENCE' | 'MISSING_ROUTE';
  message: string;
  severity: 'error' | 'warning';
}

class NavValidator {
  private errors: ValidationError[] = [];
  private visited = new Set<string>();
  private allRoutes = new Set<string>();

  validate(): ValidationError[] {
    this.errors = [];
    this.visited.clear();
    
    console.log('🔍 Validation du schéma de navigation...');
    
    // Collecter toutes les routes définies
    this.collectRoutes();
    
    // Valider chaque nœud
    this.validateNodes(NAV_SCHEMA);
    
    // Validation globale
    this.validateGlobalConstraints();
    
    this.printResults();
    return this.errors;
  }

  private collectRoutes() {
    const routes = getAllRoutes();
    routes.forEach(route => this.allRoutes.add(route));
    console.log(`📍 ${routes.length} routes trouvées`);
  }

  private validateNodes(nodes: NavNode[], path: string[] = []) {
    for (const node of nodes) {
      this.validateSingleNode(node, path);
      
      if (node.children) {
        this.validateNodes(node.children, [...path, node.id]);
      }
    }
  }

  private validateSingleNode(node: NavNode, path: string[]) {
    const fullPath = [...path, node.id].join(' > ');
    
    // Vérifier les références circulaires
    if (this.visited.has(node.id)) {
      this.addError(node.id, 'CIRCULAR_REFERENCE', 
        `Référence circulaire détectée: ${fullPath}`, 'error');
      return;
    }
    
    this.visited.add(node.id);
    
    // Règle principale: chaque nœud doit avoir soit une action, soit des enfants
    const hasAction = Boolean(node.action);
    const hasChildren = Boolean(node.children && node.children.length > 0);
    
    if (!hasAction && !hasChildren) {
      this.addError(node.id, 'NO_ACTION_OR_CHILDREN',
        `Le nœud "${fullPath}" n'a ni action ni enfants. Il sera inutilisable.`, 'error');
    }
    
    // Valider l'action si présente
    if (node.action) {
      this.validateAction(node, fullPath);
    }
    
    // Valider la structure
    this.validateNodeStructure(node, fullPath);
  }

  private validateAction(node: NavNode, fullPath: string) {
    const action = node.action!;
    
    switch (action.type) {
      case 'route':
        if (!action.to) {
          this.addError(node.id, 'INVALID_ACTION',
            `Action route sans destination: ${fullPath}`, 'error');
        } else if (!action.to.startsWith('/')) {
          this.addError(node.id, 'INVALID_ACTION',
            `Route invalide (doit commencer par /): ${action.to} dans ${fullPath}`, 'warning');
        }
        break;
        
      case 'modal':
        if (!action.id) {
          this.addError(node.id, 'INVALID_ACTION',
            `Action modal sans ID: ${fullPath}`, 'error');
        }
        break;
        
      case 'mutation':
        if (!action.key) {
          this.addError(node.id, 'INVALID_ACTION',
            `Action mutation sans clé: ${fullPath}`, 'error');
        }
        break;
        
      case 'external':
        if (!action.href) {
          this.addError(node.id, 'INVALID_ACTION',
            `Action external sans href: ${fullPath}`, 'error');
        } else if (!this.isValidUrl(action.href)) {
          this.addError(node.id, 'INVALID_ACTION',
            `URL externe invalide: ${action.href} dans ${fullPath}`, 'warning');
        }
        break;
        
      case 'compose':
        if (!action.steps || action.steps.length === 0) {
          this.addError(node.id, 'INVALID_ACTION',
            `Action compose sans étapes: ${fullPath}`, 'error');
        }
        break;
        
      default:
        this.addError(node.id, 'INVALID_ACTION',
          `Type d'action inconnu: ${(action as any).type} dans ${fullPath}`, 'error');
    }
  }

  private validateNodeStructure(node: NavNode, fullPath: string) {
    // Vérifier les champs obligatoires
    if (!node.id) {
      this.addError('unknown', 'INVALID_ACTION',
        `Nœud sans ID dans ${fullPath}`, 'error');
    }
    
    if (!node.labelKey) {
      this.addError(node.id, 'INVALID_ACTION',
        `Nœud sans labelKey: ${fullPath}`, 'error');
    }
    
    // Vérifier la cohérence des gardes
    if (node.guard?.roles && node.guard?.requiresAuth === false) {
      this.addError(node.id, 'INVALID_ACTION',
        `Garde incohérente (rôles sans auth): ${fullPath}`, 'warning');
    }
  }

  private validateGlobalConstraints() {
    // Vérifier qu'il y a au moins une route d'accueil
    if (!this.allRoutes.has('/')) {
      this.addError('global', 'MISSING_ROUTE',
        'Aucune route racine (/) définie', 'error');
    }
    
    // Vérifier les doublons d'ID
    const allIds = new Set<string>();
    const findDuplicates = (nodes: NavNode[]) => {
      for (const node of nodes) {
        if (allIds.has(node.id)) {
          this.addError(node.id, 'CIRCULAR_REFERENCE',
            `ID dupliqué: ${node.id}`, 'error');
        }
        allIds.add(node.id);
        
        if (node.children) {
          findDuplicates(node.children);
        }
      }
    };
    
    findDuplicates(NAV_SCHEMA);
  }

  private addError(nodeId: string, type: ValidationError['type'], message: string, severity: ValidationError['severity']) {
    this.errors.push({ nodeId, type, message, severity });
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return url.startsWith('mailto:') || url.startsWith('tel:');
    }
  }

  private printResults() {
    const errorCount = this.errors.filter(e => e.severity === 'error').length;
    const warningCount = this.errors.filter(e => e.severity === 'warning').length;
    
    console.log('\n📊 Résultats de validation:');
    console.log(`   ✅ ${NAV_SCHEMA.length} nœuds racines analysés`);
    console.log(`   🔴 ${errorCount} erreurs`);
    console.log(`   🟡 ${warningCount} avertissements`);
    
    if (this.errors.length > 0) {
      console.log('\n📝 Détails:');
      for (const error of this.errors) {
        const emoji = error.severity === 'error' ? '🔴' : '🟡';
        console.log(`   ${emoji} [${error.nodeId}] ${error.message}`);
      }
    }
    
    if (errorCount === 0) {
      console.log('\n🎉 Schéma de navigation valide !');
    } else {
      console.log(`\n💥 ${errorCount} erreurs doivent être corrigées.`);
    }
  }
}

// Exécution du script
if (require.main === module) {
  const validator = new NavValidator();
  const errors = validator.validate();
  
  const errorCount = errors.filter(e => e.severity === 'error').length;
  process.exit(errorCount > 0 ? 1 : 0);
}

export { NavValidator };