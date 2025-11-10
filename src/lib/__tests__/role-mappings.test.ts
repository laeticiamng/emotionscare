import { describe, it, expect } from 'vitest';
import {
  roleToMode,
  modeToRole,
  normalizeRole,
  hasRolePermission,
  ROLE_TO_MODE,
  MODE_TO_ROLE,
} from '../role-mappings';

describe('role-mappings', () => {
  describe('ROLE_TO_MODE', () => {
    it('devrait mapper correctement consumer -> b2c', () => {
      expect(ROLE_TO_MODE.consumer).toBe('b2c');
    });

    it('devrait mapper correctement employee -> b2b_user', () => {
      expect(ROLE_TO_MODE.employee).toBe('b2b_user');
    });

    it('devrait mapper correctement manager -> b2b_admin', () => {
      expect(ROLE_TO_MODE.manager).toBe('b2b_admin');
    });

    it('devrait mapper correctement admin -> admin', () => {
      expect(ROLE_TO_MODE.admin).toBe('admin');
    });
  });

  describe('MODE_TO_ROLE', () => {
    it('devrait mapper correctement b2c -> consumer', () => {
      expect(MODE_TO_ROLE.b2c).toBe('consumer');
    });

    it('devrait mapper correctement b2b_user -> employee', () => {
      expect(MODE_TO_ROLE.b2b_user).toBe('employee');
    });

    it('devrait mapper correctement b2b_admin -> manager', () => {
      expect(MODE_TO_ROLE.b2b_admin).toBe('manager');
    });
  });

  describe('roleToMode', () => {
    it('devrait convertir role en mode', () => {
      expect(roleToMode('consumer')).toBe('b2c');
      expect(roleToMode('employee')).toBe('b2b_user');
      expect(roleToMode('manager')).toBe('b2b_admin');
    });

    it('devrait retourner null pour role null/undefined', () => {
      expect(roleToMode(null)).toBe(null);
      expect(roleToMode(undefined)).toBe(null);
    });
  });

  describe('modeToRole', () => {
    it('devrait convertir mode en role', () => {
      expect(modeToRole('b2c')).toBe('consumer');
      expect(modeToRole('b2b_user')).toBe('employee');
      expect(modeToRole('b2b_admin')).toBe('manager');
    });

    it('devrait retourner null pour mode null', () => {
      expect(modeToRole(null)).toBe(null);
    });
  });

  describe('normalizeRole', () => {
    it('devrait normaliser variantes consumer', () => {
      expect(normalizeRole('b2c')).toBe('consumer');
      expect(normalizeRole('user')).toBe('consumer');
      expect(normalizeRole('consumer')).toBe('consumer');
    });

    it('devrait normaliser variantes employee', () => {
      expect(normalizeRole('b2b_user')).toBe('employee');
      expect(normalizeRole('collab')).toBe('employee');
      expect(normalizeRole('employee')).toBe('employee');
    });

    it('devrait normaliser variantes manager', () => {
      expect(normalizeRole('b2b_admin')).toBe('manager');
      expect(normalizeRole('rh')).toBe('manager');
      expect(normalizeRole('org_admin')).toBe('manager');
      expect(normalizeRole('manager')).toBe('manager');
    });

    it('devrait retourner consumer par défaut', () => {
      expect(normalizeRole(null)).toBe('consumer');
      expect(normalizeRole('')).toBe('consumer');
      expect(normalizeRole('invalid')).toBe('consumer');
    });
  });

  describe('hasRolePermission', () => {
    it('admin devrait avoir toutes les permissions', () => {
      expect(hasRolePermission('admin', 'consumer')).toBe(true);
      expect(hasRolePermission('admin', 'employee')).toBe(true);
      expect(hasRolePermission('admin', 'manager')).toBe(true);
    });

    it('manager devrait avoir permissions employee et consumer', () => {
      expect(hasRolePermission('manager', 'consumer')).toBe(true);
      expect(hasRolePermission('manager', 'employee')).toBe(true);
      expect(hasRolePermission('manager', 'admin')).toBe(false);
    });

    it('consumer ne devrait avoir que ses permissions', () => {
      expect(hasRolePermission('consumer', 'consumer')).toBe(true);
      expect(hasRolePermission('consumer', 'employee')).toBe(false);
      expect(hasRolePermission('consumer', 'manager')).toBe(false);
    });
  });

  describe('Bidirectional mapping', () => {
    it('devrait être réversible role -> mode -> role', () => {
      const role = 'employee';
      const mode = roleToMode(role);
      const backToRole = modeToRole(mode);
      expect(backToRole).toBe(role);
    });

    it('devrait être réversible mode -> role -> mode', () => {
      const mode = 'b2b_admin';
      const role = modeToRole(mode);
      const backToMode = roleToMode(role!);
      expect(backToMode).toBe(mode);
    });
  });
});
