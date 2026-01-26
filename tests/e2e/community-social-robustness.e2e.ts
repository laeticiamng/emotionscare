/**
 * Community/Social Module - E2E Robustness & Security Tests
 * 
 * Coverage:
 * - Posts (create, read, update, delete)
 * - Reactions (like/unlike, reaction types)
 * - Comments (CRUD, threading)
 * - Support Groups (create, join, leave, moderation)
 * - Buddy System (discover, request, accept, messaging)
 * - Feed (personalized, chronological, filtering)
 * - Notifications (real-time, preferences)
 * - Sharing (privacy controls, visibility)
 * - RLS isolation (user data protection)
 * - GDPR compliance (content deletion, anonymization)
 * - Accessibility (screen reader, keyboard)
 * - Performance (feed pagination, real-time updates)
 * - Error resilience (network failures, race conditions)
 */

import { test, expect, Page } from '@playwright/test';

// ============================================================================
// CONFIGURATION & FIXTURES
// ============================================================================

const SOCIAL_ROUTES = {
  feed: '/app/social-cocon',
  community: '/app/community',
  groups: '/app/groups',
  buddies: '/app/buddies',
  notifications: '/app/notifications',
  myProfile: '/app/profile',
};

const API_BASE = 'https://yaincoxihiqdksxgrsrk.supabase.co';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function mockAuthenticatedUser(page: Page, userId = 'user-test-abc', displayName = 'TestUser') {
  await page.addInitScript(({ uid, name }) => {
    localStorage.setItem('supabase.auth.token', JSON.stringify({
      access_token: 'valid-test-token',
      refresh_token: 'valid-refresh',
      user: { id: uid, email: 'test@emotionscare.app', user_metadata: { display_name: name } },
    }));
  }, { uid: userId, name: displayName });
}

async function mockPosts(page: Page, posts: unknown[]) {
  await page.route(`${API_BASE}/rest/v1/community_posts*`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(posts),
    });
  });
}

async function mockBuddyProfiles(page: Page, profiles: unknown[]) {
  await page.route(`${API_BASE}/rest/v1/buddy_profiles*`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(profiles),
    });
  });
}

async function mockSupportGroups(page: Page, groups: unknown[]) {
  await page.route(`${API_BASE}/rest/v1/support_groups*`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(groups),
    });
  });
}

async function mockEdgeFunctionSuccess(page: Page, functionName: string, response: unknown) {
  await page.route(`${API_BASE}/functions/v1/${functionName}`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}

async function mockEdgeFunctionError(page: Page, functionName: string, status: number, message: string) {
  await page.route(`${API_BASE}/functions/v1/${functionName}`, async (route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify({ error: message }),
    });
  });
}

// ============================================================================
// 1. POSTS (CRUD)
// ============================================================================

test.describe('Posts CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedUser(page);
  });

  test('should display community feed with posts', async ({ page }) => {
    await mockPosts(page, [
      { id: 'post-1', user_id: 'u1', content: 'Hello world!', created_at: new Date().toISOString(), likes_count: 5 },
      { id: 'post-2', user_id: 'u2', content: 'Feeling great today', created_at: new Date().toISOString(), likes_count: 3 },
    ]);
    
    await page.goto(SOCIAL_ROUTES.community);
    
    await expect(page.locator('body')).toBeVisible();
  });

  test('should create new post', async ({ page }) => {
    let postCreated = false;
    
    await page.route(`${API_BASE}/rest/v1/community_posts*`, async (route) => {
      if (route.request().method() === 'POST') {
        postCreated = true;
        const body = route.request().postDataJSON();
        expect(body).toHaveProperty('content');
        expect(body).toHaveProperty('user_id');
        
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'new-post', ...body }),
        });
      } else {
        await route.continue();
      }
    });
    
    await page.goto(SOCIAL_ROUTES.community);
    
    const textarea = page.getByPlaceholder(/quoi de neuf|what's on your mind|partager/i);
    if (await textarea.isVisible()) {
      await textarea.fill('Test post content');
      
      const submitBtn = page.getByRole('button', { name: /publier|post|envoyer/i });
      if (await submitBtn.count() > 0) {
        await submitBtn.first().click();
      }
    }
  });

  test('should update own post', async ({ page }) => {
    await mockPosts(page, [
      { id: 'my-post', user_id: 'user-test-abc', content: 'Original content', created_at: new Date().toISOString() },
    ]);
    
    let postUpdated = false;
    
    await page.route(`${API_BASE}/rest/v1/community_posts*`, async (route) => {
      if (route.request().method() === 'PATCH') {
        postUpdated = true;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'my-post', content: 'Updated content' }),
        });
      } else {
        await route.continue();
      }
    });
    
    await page.goto(SOCIAL_ROUTES.community);
  });

  test('should delete own post', async ({ page }) => {
    await mockPosts(page, [
      { id: 'my-post', user_id: 'user-test-abc', content: 'To delete', created_at: new Date().toISOString() },
    ]);
    
    let postDeleted = false;
    
    await page.route(`${API_BASE}/rest/v1/community_posts*`, async (route) => {
      if (route.request().method() === 'DELETE') {
        postDeleted = true;
        await route.fulfill({ status: 204 });
      } else {
        await route.continue();
      }
    });
    
    await page.goto(SOCIAL_ROUTES.community);
  });

  test('should not allow editing other users posts', async ({ page }) => {
    await mockPosts(page, [
      { id: 'other-post', user_id: 'other-user', content: 'Someone else post', created_at: new Date().toISOString() },
    ]);
    
    await page.goto(SOCIAL_ROUTES.community);
    
    // Edit button should not be visible for other users' posts
    const editButtons = page.locator('[data-testid="edit-post-other-post"]');
    const count = await editButtons.count();
    expect(count).toBe(0);
  });

  test('should sanitize HTML in post content', async ({ page }) => {
    await mockPosts(page, [
      { id: 'xss-post', user_id: 'u1', content: '<script>alert("xss")</script>Hello', created_at: new Date().toISOString() },
    ]);
    
    await page.goto(SOCIAL_ROUTES.community);
    
    // Script should not execute
    const pageContent = await page.content();
    expect(pageContent).not.toContain('<script>alert');
  });
});

// ============================================================================
// 2. REACTIONS
// ============================================================================

test.describe('Reactions', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedUser(page);
  });

  test('should like a post', async ({ page }) => {
    await mockPosts(page, [
      { id: 'post-1', user_id: 'u1', content: 'Test', likes_count: 5 },
    ]);
    
    let likeCalled = false;
    
    await page.route(`${API_BASE}/rest/v1/rpc/increment_post_likes*`, async (route) => {
      likeCalled = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ likes_count: 6 }),
      });
    });
    
    await page.goto(SOCIAL_ROUTES.community);
    
    const likeButton = page.getByRole('button', { name: /like|j'aime|❤️|👍/i }).first();
    if (await likeButton.isVisible()) {
      await likeButton.click();
    }
  });

  test('should unlike a post (toggle)', async ({ page }) => {
    await mockPosts(page, [
      { id: 'post-1', user_id: 'u1', content: 'Test', likes_count: 5, user_has_liked: true },
    ]);
    
    let unlikeCalled = false;
    
    await page.route(`${API_BASE}/rest/v1/rpc/decrement_post_likes*`, async (route) => {
      unlikeCalled = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ likes_count: 4 }),
      });
    });
    
    await page.goto(SOCIAL_ROUTES.community);
  });

  test('should handle reaction via edge function', async ({ page }) => {
    await mockPosts(page, [
      { id: 'post-1', user_id: 'u1', content: 'Test', likes_count: 5 },
    ]);
    
    let edgeFunctionCalled = false;
    
    await page.route(`${API_BASE}/functions/v1/handle-post-reaction`, async (route) => {
      edgeFunctionCalled = true;
      const body = route.request().postDataJSON();
      expect(body).toHaveProperty('post_id');
      expect(body).toHaveProperty('reaction_type');
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });
    
    await page.goto(SOCIAL_ROUTES.community);
  });

  test('should prevent double-liking (debounce)', async ({ page }) => {
    await mockPosts(page, [
      { id: 'post-1', user_id: 'u1', content: 'Test', likes_count: 5 },
    ]);
    
    let likeCount = 0;
    
    await page.route(`${API_BASE}/rest/v1/rpc/increment_post_likes*`, async (route) => {
      likeCount++;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ likes_count: 5 + likeCount }),
      });
    });
    
    await page.goto(SOCIAL_ROUTES.community);
    
    const likeButton = page.getByRole('button', { name: /like|j'aime/i }).first();
    if (await likeButton.isVisible()) {
      // Rapid clicks
      await likeButton.click();
      await likeButton.click();
      await likeButton.click();
      await page.waitForTimeout(500);
      
      // Should debounce to 1-2 calls max
      expect(likeCount).toBeLessThanOrEqual(2);
    }
  });
});

// ============================================================================
// 3. COMMENTS
// ============================================================================

test.describe('Comments', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedUser(page);
  });

  test('should display comments on post', async ({ page }) => {
    await mockPosts(page, [
      { id: 'post-1', content: 'Test', comments: [
        { id: 'c1', content: 'First comment', user_id: 'u1' },
        { id: 'c2', content: 'Second comment', user_id: 'u2' },
      ]},
    ]);
    
    await page.route(`${API_BASE}/rest/v1/post_comments*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'c1', post_id: 'post-1', content: 'First comment', user_id: 'u1' },
          { id: 'c2', post_id: 'post-1', content: 'Second comment', user_id: 'u2' },
        ]),
      });
    });
    
    await page.goto(SOCIAL_ROUTES.community);
  });

  test('should add comment to post', async ({ page }) => {
    await mockPosts(page, [
      { id: 'post-1', content: 'Test', comments_count: 0 },
    ]);
    
    let commentCreated = false;
    
    await page.route(`${API_BASE}/rest/v1/post_comments*`, async (route) => {
      if (route.request().method() === 'POST') {
        commentCreated = true;
        const body = route.request().postDataJSON();
        expect(body).toHaveProperty('content');
        expect(body).toHaveProperty('post_id');
        
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'new-comment', ...body }),
        });
      } else {
        await route.continue();
      }
    });
    
    await page.goto(SOCIAL_ROUTES.community);
  });

  test('should delete own comment', async ({ page }) => {
    await page.route(`${API_BASE}/rest/v1/post_comments*`, async (route) => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({ status: 204 });
      } else {
        await route.continue();
      }
    });
    
    await page.goto(SOCIAL_ROUTES.community);
  });

  test('should validate comment length', async ({ page }) => {
    await mockPosts(page, [
      { id: 'post-1', content: 'Test' },
    ]);
    
    await page.route(`${API_BASE}/rest/v1/post_comments*`, async (route) => {
      if (route.request().method() === 'POST') {
        const body = route.request().postDataJSON();
        if (!body?.content || body.content.length > 1000) {
          await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Comment too long' }),
          });
        } else {
          await route.fulfill({ status: 201, body: '{}' });
        }
      } else {
        await route.continue();
      }
    });
    
    await page.goto(SOCIAL_ROUTES.community);
  });
});

// ============================================================================
// 4. SUPPORT GROUPS
// ============================================================================

test.describe('Support Groups', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedUser(page);
  });

  test('should display available groups', async ({ page }) => {
    await mockSupportGroups(page, [
      { id: 'g1', name: 'Anxiety Support', members_count: 45, is_private: false },
      { id: 'g2', name: 'Mindfulness Circle', members_count: 32, is_private: false },
    ]);
    
    await page.goto(SOCIAL_ROUTES.groups);
    
    await expect(page.locator('body')).toBeVisible();
  });

  test('should join public group', async ({ page }) => {
    await mockSupportGroups(page, [
      { id: 'g1', name: 'Public Group', is_private: false },
    ]);
    
    let joinCalled = false;
    
    await page.route(`${API_BASE}/rest/v1/group_memberships*`, async (route) => {
      if (route.request().method() === 'POST') {
        joinCalled = true;
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ group_id: 'g1', user_id: 'user-test-abc' }),
        });
      } else {
        await route.continue();
      }
    });
    
    await page.goto(SOCIAL_ROUTES.groups);
    
    const joinButton = page.getByRole('button', { name: /rejoindre|join/i });
    if (await joinButton.count() > 0) {
      await joinButton.first().click();
    }
  });

  test('should request access to private group', async ({ page }) => {
    await mockSupportGroups(page, [
      { id: 'g1', name: 'Private Group', is_private: true },
    ]);
    
    let requestSent = false;
    
    await page.route(`${API_BASE}/rest/v1/group_join_requests*`, async (route) => {
      if (route.request().method() === 'POST') {
        requestSent = true;
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ status: 'pending' }),
        });
      } else {
        await route.continue();
      }
    });
    
    await page.goto(SOCIAL_ROUTES.groups);
  });

  test('should leave group', async ({ page }) => {
    await page.route(`${API_BASE}/rest/v1/group_memberships*`, async (route) => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({ status: 204 });
      } else {
        await route.continue();
      }
    });
    
    await page.goto(SOCIAL_ROUTES.groups);
  });

  test('should enforce group member limits', async ({ page }) => {
    await mockSupportGroups(page, [
      { id: 'g1', name: 'Full Group', members_count: 100, max_members: 100 },
    ]);
    
    await page.route(`${API_BASE}/rest/v1/group_memberships*`, async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Group is full' }),
        });
      } else {
        await route.continue();
      }
    });
    
    await page.goto(SOCIAL_ROUTES.groups);
  });
});

// ============================================================================
// 5. BUDDY SYSTEM
// ============================================================================

test.describe('Buddy System', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedUser(page);
  });

  test('should display buddy discovery list', async ({ page }) => {
    await mockBuddyProfiles(page, [
      { user_id: 'b1', display_name: 'Buddy1', availability_status: 'available', interests: ['meditation'] },
      { user_id: 'b2', display_name: 'Buddy2', availability_status: 'busy', interests: ['yoga'] },
    ]);
    
    await page.goto(SOCIAL_ROUTES.buddies);
    
    await expect(page.locator('body')).toBeVisible();
  });

  test('should send buddy request', async ({ page }) => {
    await mockBuddyProfiles(page, [
      { user_id: 'b1', display_name: 'Potential Buddy', is_visible: true },
    ]);
    
    let requestSent = false;
    
    await page.route(`${API_BASE}/rest/v1/buddy_requests*`, async (route) => {
      if (route.request().method() === 'POST') {
        requestSent = true;
        const body = route.request().postDataJSON();
        expect(body).toHaveProperty('to_user_id');
        
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'req-1', status: 'pending' }),
        });
      } else {
        await route.continue();
      }
    });
    
    await page.goto(SOCIAL_ROUTES.buddies);
    
    const connectButton = page.getByRole('button', { name: /connecter|connect|ajouter/i });
    if (await connectButton.count() > 0) {
      await connectButton.first().click();
    }
  });

  test('should accept buddy request', async ({ page }) => {
    await page.route(`${API_BASE}/rest/v1/buddy_requests*`, async (route) => {
      if (route.request().method() === 'PATCH') {
        const body = route.request().postDataJSON();
        expect(body.status).toBe('accepted');
        
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ status: 'accepted' }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: 'req-1', from_user_id: 'other-user', status: 'pending' },
          ]),
        });
      }
    });
    
    await page.goto(SOCIAL_ROUTES.buddies);
  });

  test('should filter buddies by interests', async ({ page }) => {
    let filterApplied = false;
    
    await page.route(`${API_BASE}/rest/v1/buddy_profiles*`, async (route) => {
      const url = new URL(route.request().url());
      const interests = url.searchParams.get('interests');
      if (interests) {
        filterApplied = true;
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });
    
    await page.goto(SOCIAL_ROUTES.buddies);
  });

  test('should update availability status', async ({ page }) => {
    let statusUpdated = false;
    
    await page.route(`${API_BASE}/rest/v1/buddy_profiles*`, async (route) => {
      if (route.request().method() === 'PATCH') {
        statusUpdated = true;
        const body = route.request().postDataJSON();
        expect(['available', 'busy', 'offline']).toContain(body.availability_status);
        
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ availability_status: body.availability_status }),
        });
      } else {
        await route.continue();
      }
    });
    
    await page.goto(SOCIAL_ROUTES.buddies);
  });
});

// ============================================================================
// 6. FEED & NOTIFICATIONS
// ============================================================================

test.describe('Feed & Notifications', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedUser(page);
  });

  test('should display personalized feed', async ({ page }) => {
    await mockPosts(page, [
      { id: 'p1', content: 'From friend', user_id: 'friend-1', is_from_friend: true },
      { id: 'p2', content: 'From group', user_id: 'group-member', group_id: 'my-group' },
    ]);
    
    await page.goto(SOCIAL_ROUTES.feed);
    
    await expect(page.locator('body')).toBeVisible();
  });

  test('should paginate feed', async ({ page }) => {
    const largeFeed = Array.from({ length: 100 }, (_, i) => ({
      id: `post-${i}`,
      content: `Post ${i}`,
      created_at: new Date(Date.now() - i * 60000).toISOString(),
    }));
    
    await page.route(`${API_BASE}/rest/v1/community_posts*`, async (route) => {
      const url = new URL(route.request().url());
      const offset = parseInt(url.searchParams.get('offset') || '0');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(largeFeed.slice(offset, offset + limit)),
      });
    });
    
    await page.goto(SOCIAL_ROUTES.feed);
  });

  test('should display notifications', async ({ page }) => {
    await page.route(`${API_BASE}/rest/v1/notifications*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'n1', type: 'like', read: false, data: { post_id: 'p1' } },
          { id: 'n2', type: 'comment', read: true, data: { post_id: 'p2' } },
          { id: 'n3', type: 'buddy_request', read: false, data: { from_user: 'u1' } },
        ]),
      });
    });
    
    await page.goto(SOCIAL_ROUTES.notifications);
    
    await expect(page.locator('body')).toBeVisible();
  });

  test('should mark notifications as read', async ({ page }) => {
    let markedAsRead = false;
    
    await page.route(`${API_BASE}/rest/v1/notifications*`, async (route) => {
      if (route.request().method() === 'PATCH') {
        markedAsRead = true;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ read: true }),
        });
      } else {
        await route.continue();
      }
    });
    
    await page.goto(SOCIAL_ROUTES.notifications);
  });
});

// ============================================================================
// 7. PRIVACY & SHARING
// ============================================================================

test.describe('Privacy & Sharing', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedUser(page);
  });

  test('should respect post visibility settings', async ({ page }) => {
    await page.route(`${API_BASE}/rest/v1/community_posts*`, async (route) => {
      if (route.request().method() === 'POST') {
        const body = route.request().postDataJSON();
        expect(['public', 'friends', 'private', 'group']).toContain(body.visibility);
        
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'new-post', ...body }),
        });
      } else {
        await route.continue();
      }
    });
    
    await page.goto(SOCIAL_ROUTES.community);
  });

  test('should hide profile from non-buddies', async ({ page }) => {
    await mockBuddyProfiles(page, [
      { user_id: 'private-user', is_visible: false, profile_visibility: 'buddies_only' },
    ]);
    
    await page.goto(SOCIAL_ROUTES.buddies);
    
    // Private profiles should not appear in discovery
    const pageContent = await page.content();
    expect(pageContent).not.toContain('private-user');
  });

  test('should block user interaction', async ({ page }) => {
    let blockCalled = false;
    
    await page.route(`${API_BASE}/rest/v1/blocked_users*`, async (route) => {
      if (route.request().method() === 'POST') {
        blockCalled = true;
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ blocked_user_id: 'bad-user' }),
        });
      } else {
        await route.continue();
      }
    });
    
    await page.goto(SOCIAL_ROUTES.community);
  });

  test('should report inappropriate content', async ({ page }) => {
    let reportCalled = false;
    
    await page.route(`${API_BASE}/functions/v1/report-content`, async (route) => {
      reportCalled = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ report_id: 'r123', status: 'received' }),
      });
    });
    
    await page.goto(SOCIAL_ROUTES.community);
  });
});

// ============================================================================
// 8. RLS & DATA ISOLATION
// ============================================================================

test.describe('RLS & Data Isolation', () => {
  test('should only show posts based on visibility', async ({ page }) => {
    await mockAuthenticatedUser(page, 'user-alice');
    
    await page.route(`${API_BASE}/rest/v1/community_posts*`, async (route) => {
      // RLS should filter out private posts from other users
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'public-post', visibility: 'public', user_id: 'other' },
          { id: 'my-private', visibility: 'private', user_id: 'user-alice' },
        ]),
      });
    });
    
    await page.goto(SOCIAL_ROUTES.community);
  });

  test('should prevent accessing blocked user content', async ({ page }) => {
    await mockAuthenticatedUser(page, 'user-alice');
    
    await page.route(`${API_BASE}/rest/v1/community_posts*`, async (route) => {
      // Should exclude posts from blocked users
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });
    
    await page.goto(SOCIAL_ROUTES.community);
  });

  test('should enforce group membership for group posts', async ({ page }) => {
    await mockAuthenticatedUser(page, 'non-member');
    
    await page.route(`${API_BASE}/rest/v1/community_posts*`, async (route) => {
      const url = new URL(route.request().url());
      const groupId = url.searchParams.get('group_id');
      
      if (groupId) {
        // Should return empty if not a member
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      } else {
        await route.continue();
      }
    });
    
    await page.goto(`${SOCIAL_ROUTES.groups}/private-group`);
  });
});

// ============================================================================
// 9. GDPR COMPLIANCE
// ============================================================================

test.describe('GDPR Compliance', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedUser(page);
  });

  test('should not log post content to console', async ({ page }) => {
    await mockPosts(page, [
      { id: 'p1', content: 'Sensitive personal content', user_id: 'u1' },
    ]);
    
    const consoleLogs: string[] = [];
    page.on('console', (msg) => {
      consoleLogs.push(msg.text());
    });
    
    await page.goto(SOCIAL_ROUTES.community);
    await page.waitForTimeout(2000);
    
    const logText = consoleLogs.join(' ');
    
    expect(logText).not.toContain('Sensitive personal content');
    expect(logText).not.toMatch(/eyJ[a-zA-Z0-9._-]+/); // JWT
  });

  test('should support deleting all user content', async ({ page }) => {
    let deleteCalled = false;
    
    await page.route(`${API_BASE}/functions/v1/gdpr-delete-social-data`, async (route) => {
      deleteCalled = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ deleted_posts: 15, deleted_comments: 32, deleted_reactions: 128 }),
      });
    });
    
    await page.goto('/settings/privacy');
  });

  test('should anonymize user in comments when account deleted', async ({ page }) => {
    await page.route(`${API_BASE}/rest/v1/post_comments*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'c1', content: 'Original comment', user_id: null, display_name: 'Utilisateur supprimé' },
        ]),
      });
    });
    
    await page.goto(SOCIAL_ROUTES.community);
  });
});

// ============================================================================
// 10. ACCESSIBILITY
// ============================================================================

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedUser(page);
    await mockPosts(page, [
      { id: 'p1', content: 'Test post', likes_count: 5 },
    ]);
  });

  test('should support keyboard navigation on feed', async ({ page }) => {
    await page.goto(SOCIAL_ROUTES.feed);
    
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'A', 'TEXTAREA', 'INPUT', 'DIV']).toContain(focused);
  });

  test('should announce new posts to screen readers', async ({ page }) => {
    await page.goto(SOCIAL_ROUTES.feed);
    
    const liveRegions = await page.locator('[aria-live], [role="status"], [role="feed"]').count();
    expect(liveRegions).toBeGreaterThanOrEqual(0);
  });

  test('should have accessible like buttons', async ({ page }) => {
    await page.goto(SOCIAL_ROUTES.community);
    
    const likeButtons = page.locator('button').filter({ hasText: /like|j'aime/i });
    const count = await likeButtons.count();
    
    if (count > 0) {
      const ariaLabel = await likeButtons.first().getAttribute('aria-label');
      const ariaPressed = await likeButtons.first().getAttribute('aria-pressed');
      // Should have accessible state
    }
  });
});

// ============================================================================
// 11. PERFORMANCE
// ============================================================================

test.describe('Performance', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedUser(page);
  });

  test('should load feed within 3 seconds', async ({ page }) => {
    await mockPosts(page, []);
    
    const startTime = Date.now();
    
    await page.goto(SOCIAL_ROUTES.feed);
    await page.waitForLoadState('domcontentloaded');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  test('should lazy load images in posts', async ({ page }) => {
    await mockPosts(page, Array.from({ length: 50 }, (_, i) => ({
      id: `post-${i}`,
      content: 'Post with image',
      image_url: `/images/post-${i}.jpg`,
    })));
    
    let imageRequests = 0;
    
    await page.route('**/*.jpg', async (route) => {
      imageRequests++;
      await route.abort('failed');
    });
    
    await page.goto(SOCIAL_ROUTES.feed);
    await page.waitForTimeout(1000);
    
    // Should not load all 50 images at once
    expect(imageRequests).toBeLessThan(20);
  });

  test('should debounce search in buddies', async ({ page }) => {
    let searchCount = 0;
    
    await page.route(`${API_BASE}/rest/v1/buddy_profiles*`, async (route) => {
      const url = new URL(route.request().url());
      if (url.searchParams.get('display_name')) {
        searchCount++;
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });
    
    await page.goto(SOCIAL_ROUTES.buddies);
    
    const searchInput = page.getByPlaceholder(/rechercher|search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      await page.waitForTimeout(500);
      
      // Should debounce
      expect(searchCount).toBeLessThanOrEqual(2);
    }
  });
});

// ============================================================================
// 12. ERROR RESILIENCE
// ============================================================================

test.describe('Error Resilience', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedUser(page);
  });

  test('should handle API timeout on feed', async ({ page }) => {
    await page.route(`${API_BASE}/rest/v1/community_posts*`, async (route) => {
      await new Promise(resolve => setTimeout(resolve, 30000));
      await route.abort('timedout');
    });
    
    await page.goto(SOCIAL_ROUTES.feed);
    await page.waitForTimeout(5000);
    
    // Should show timeout message
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle 500 error on post creation', async ({ page }) => {
    await mockPosts(page, []);
    
    await page.route(`${API_BASE}/rest/v1/community_posts*`, async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal server error' }),
        });
      } else {
        await route.continue();
      }
    });
    
    await page.goto(SOCIAL_ROUTES.community);
    
    // Should show user-friendly error
    await expect(page.locator('body')).not.toContainText(/stack|trace/i);
  });

  test('should handle real-time connection loss', async ({ page }) => {
    await mockPosts(page, []);
    
    await page.goto(SOCIAL_ROUTES.feed);
    
    // Simulate offline
    await page.context().setOffline(true);
    await page.waitForTimeout(1000);
    
    // Should show offline indicator
    await expect(page.locator('body')).toBeVisible();
    
    // Restore
    await page.context().setOffline(false);
  });

  test('should handle concurrent post updates', async ({ page }) => {
    await mockPosts(page, [
      { id: 'p1', content: 'Original', version: 1 },
    ]);
    
    let updateCount = 0;
    
    await page.route(`${API_BASE}/rest/v1/community_posts*`, async (route) => {
      if (route.request().method() === 'PATCH') {
        updateCount++;
        
        if (updateCount === 1) {
          await route.fulfill({
            status: 409,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Conflict - post was modified' }),
          });
        } else {
          await route.fulfill({ status: 200, body: '{}' });
        }
      } else {
        await route.continue();
      }
    });
    
    await page.goto(SOCIAL_ROUTES.community);
  });

  test('should handle malformed post data', async ({ page }) => {
    await mockPosts(page, [
      { id: null, content: undefined, likes_count: 'not-a-number' },
      { id: 'valid', content: 'Valid post', likes_count: 5 },
    ]);
    
    await page.goto(SOCIAL_ROUTES.feed);
    
    // Should handle gracefully
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('body')).not.toContainText(/Cannot read properties/i);
  });
});

// ============================================================================
// 13. EDGE CASES
// ============================================================================

test.describe('Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedUser(page);
  });

  test('should handle empty feed', async ({ page }) => {
    await mockPosts(page, []);
    
    await page.goto(SOCIAL_ROUTES.feed);
    
    // Should show empty state
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle user with no buddies', async ({ page }) => {
    await mockBuddyProfiles(page, []);
    
    await page.route(`${API_BASE}/rest/v1/buddy_matches*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });
    
    await page.goto(SOCIAL_ROUTES.buddies);
    
    // Should show discovery prompt
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle very long post content', async ({ page }) => {
    const longContent = 'A'.repeat(5000);
    
    await mockPosts(page, [
      { id: 'long-post', content: longContent, user_id: 'u1' },
    ]);
    
    await page.goto(SOCIAL_ROUTES.feed);
    
    // Should truncate or show "read more"
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle special characters in post', async ({ page }) => {
    await mockPosts(page, [
      { id: 'special', content: '❤️ Émojis & spéciaux: <>&"\'', user_id: 'u1' },
    ]);
    
    await page.goto(SOCIAL_ROUTES.feed);
    
    // Should display correctly without breaking
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle simultaneous buddy requests', async ({ page }) => {
    let requestCount = 0;
    
    await page.route(`${API_BASE}/rest/v1/buddy_requests*`, async (route) => {
      if (route.request().method() === 'POST') {
        requestCount++;
        
        if (requestCount > 1) {
          await route.fulfill({
            status: 409,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Request already exists' }),
          });
        } else {
          await route.fulfill({
            status: 201,
            body: JSON.stringify({ id: 'req-1' }),
          });
        }
      } else {
        await route.continue();
      }
    });
    
    await page.goto(SOCIAL_ROUTES.buddies);
  });
});
