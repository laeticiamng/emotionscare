
/**
 * Service API complet pour EmotionsCare - Intégration Backend Production
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

class FullApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Ajouter le token d'authentification si disponible
    const token = localStorage.getItem('auth_token');
    if (token) {
      defaultOptions.headers = {
        ...defaultOptions.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // =================== AUTHENTICATION ===================
  
  async loginB2C(email: string, password: string) {
    return this.request('/auth/b2c/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async loginB2BUser(email: string, password: string, organizationCode?: string) {
    return this.request('/auth/b2b/user/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, organization_code: organizationCode }),
    });
  }

  async loginB2BAdmin(email: string, password: string, adminCode?: string) {
    return this.request('/auth/b2b/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, admin_code: adminCode }),
    });
  }

  async register(email: string, password: string, name: string, userType: 'b2c' | 'b2b') {
    const endpoint = userType === 'b2c' ? '/auth/b2c/register' : '/auth/b2b/user/register';
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async refreshToken(refreshToken: string) {
    return this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }

  // =================== DASHBOARD STATS ===================
  
  async getDashboardStats() {
    return this.request('/user/dashboard-stats');
  }

  async getAdminDashboardStats() {
    return this.request('/admin/analytics/overview');
  }

  // =================== JOURNAL ===================
  
  async getJournalEntries(params?: {
    page?: number;
    limit?: number;
    mood_min?: number;
    mood_max?: number;
    date_from?: string;
    date_to?: string;
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/journal/entries${queryString}`);
  }

  async createJournalEntry(content: string, moodScore?: number, tags?: string[]) {
    return this.request('/journal/entries', {
      method: 'POST',
      body: JSON.stringify({ 
        content, 
        mood_score: moodScore, 
        tags,
        is_private: true 
      }),
    });
  }

  async getJournalInsights(period?: string) {
    const queryString = period ? `?period=${period}` : '';
    return this.request(`/journal/insights${queryString}`);
  }

  // =================== GAMIFICATION ===================
  
  async getAchievements() {
    return this.request('/gamification/achievements');
  }

  async getLeaderboard(scope?: string, period?: string, teamId?: string) {
    const params = new URLSearchParams();
    if (scope) params.append('scope', scope);
    if (period) params.append('period', period);
    if (teamId) params.append('team_id', teamId);
    
    const queryString = params.toString() ? '?' + params.toString() : '';
    return this.request(`/gamification/leaderboard${queryString}`);
  }

  async getUserStats() {
    return this.request('/gamification/user-stats');
  }

  async checkProgress() {
    return this.request('/gamification/check-progress', { method: 'POST' });
  }

  // =================== SOCIAL/COCON ===================
  
  async getSocialGroups(params?: {
    type?: string;
    organization_only?: boolean;
    my_groups?: boolean;
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/social/groups${queryString}`);
  }

  async createSocialGroup(name: string, description: string, topic: string, isPrivate?: boolean) {
    return this.request('/social/groups', {
      method: 'POST',
      body: JSON.stringify({ 
        name, 
        description, 
        topic, 
        is_private: isPrivate 
      }),
    });
  }

  async joinSocialGroup(groupId: string, invitationCode?: string) {
    return this.request(`/social/groups/${groupId}/join`, {
      method: 'POST',
      body: JSON.stringify({ invitation_code: invitationCode }),
    });
  }

  async getSocialPosts(params?: {
    group_id?: string;
    feed_type?: string;
    page?: number;
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/social/posts${queryString}`);
  }

  async createSocialPost(content: string, groupId?: string, isAnonymous?: boolean) {
    return this.request('/social/posts', {
      method: 'POST',
      body: JSON.stringify({ 
        content, 
        group_id: groupId, 
        is_anonymous: isAnonymous 
      }),
    });
  }

  // =================== VR SESSIONS ===================
  
  async getVRTemplates() {
    return this.request('/vr/templates');
  }

  async createVRSession(templateName: string, stressLevelBefore?: number) {
    return this.request('/vr/sessions', {
      method: 'POST',
      body: JSON.stringify({ 
        template_name: templateName, 
        stress_level_before: stressLevelBefore 
      }),
    });
  }

  async completeVRSession(sessionId: string, data: {
    duration_minutes: number;
    stress_level_after?: number;
    satisfaction_score?: number;
    notes?: string;
  }) {
    return this.request(`/vr/sessions/${sessionId}/complete`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getVRSessions(page?: number) {
    const queryString = page ? `?page=${page}` : '';
    return this.request(`/vr/sessions${queryString}`);
  }

  // =================== ADMIN - TEAMS ===================
  
  async getTeams(params?: {
    page?: number;
    search?: string;
    department?: string;
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/admin/teams${queryString}`);
  }

  async createTeam(name: string, description?: string, adminId?: string, memberIds?: string[]) {
    return this.request('/admin/teams', {
      method: 'POST',
      body: JSON.stringify({ 
        name, 
        description, 
        admin_id: adminId, 
        member_ids: memberIds 
      }),
    });
  }

  async updateTeam(teamId: string, data: {
    name?: string;
    description?: string;
    admin_id?: string;
  }) {
    return this.request(`/admin/teams/${teamId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async addTeamMembers(teamId: string, userIds: string[], role?: string) {
    return this.request(`/admin/teams/${teamId}/members`, {
      method: 'POST',
      body: JSON.stringify({ user_ids: userIds, role }),
    });
  }

  // =================== ADMIN - USERS ===================
  
  async getUsers(params?: {
    page?: number;
    search?: string;
    role?: string;
    team_id?: string;
    active_only?: boolean;
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/admin/users${queryString}`);
  }

  async updateUser(userId: string, data: {
    role?: string;
    department?: string;
    position?: string;
    active?: boolean;
  }) {
    return this.request(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async inviteUsers(emails: string[], role: string, teamId?: string, customMessage?: string) {
    return this.request('/admin/users/invite', {
      method: 'POST',
      body: JSON.stringify({ 
        emails, 
        role, 
        team_id: teamId, 
        custom_message: customMessage 
      }),
    });
  }

  // =================== ADMIN - ANALYTICS ===================
  
  async getEmotionalTrends(params?: {
    period?: string;
    team_id?: string;
    department?: string;
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/admin/analytics/emotional-trends${queryString}`);
  }

  async getUsageStatistics(params?: {
    period?: string;
    feature?: string;
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/admin/analytics/usage-statistics${queryString}`);
  }

  async generateReport(reportType: string, parameters: any, format: string, recipients?: string[]) {
    return this.request('/admin/reports/generate', {
      method: 'POST',
      body: JSON.stringify({ 
        report_type: reportType, 
        parameters, 
        format, 
        recipients 
      }),
    });
  }

  // =================== NOTIFICATIONS ===================
  
  async getNotifications(params?: {
    unread_only?: boolean;
    category?: string;
    page?: number;
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/notifications/user${queryString}`);
  }

  async markNotificationAsRead(notificationId: string) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/mark-all-read', {
      method: 'PUT',
    });
  }

  // =================== ORGANIZATION ===================
  
  async getOrganization() {
    return this.request('/admin/organization');
  }

  async updateOrganization(data: {
    name?: string;
    settings?: any;
    subscription_plan?: string;
  }) {
    return this.request('/admin/organization', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // =================== HEALTH & MONITORING ===================
  
  async getHealth() {
    return this.request('/health');
  }

  async getMetrics() {
    return this.request('/metrics');
  }
}

// Instance singleton
export const fullApiService = new FullApiService();
export default fullApiService;
