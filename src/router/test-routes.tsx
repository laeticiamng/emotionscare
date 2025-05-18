
import React from 'react';
import { Route } from 'react-router-dom';
import TestContextAccess from '@/components/test/TestContextAccess';

/**
 * Test routes for development and debugging purposes
 * Can be added to main router for testing and removed for production
 */
export const testRoutes = [
  <Route key="test-contexts" path="/test/contexts" element={<TestContextAccess />} />,
];

export default testRoutes;
