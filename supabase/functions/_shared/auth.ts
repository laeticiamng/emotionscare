
export async function authorizeRole(req: Request, allowedRoles: string[]) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return { user: null, status: 401 };
    }

    // For now, we'll do a basic authorization check
    // In a real implementation, you'd verify the JWT token
    const token = authHeader.replace('Bearer ', '');
    
    // Mock user for development - replace with actual JWT verification
    const user = {
      id: 'mock-user-id',
      role: 'b2b_admin' // This should come from the JWT
    };

    if (!allowedRoles.includes(user.role)) {
      return { user: null, status: 403 };
    }

    return { user, status: 200 };
  } catch (error) {
    console.error('Authorization error:', error);
    return { user: null, status: 401 };
  }
}
