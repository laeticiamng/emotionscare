/// <reference types="react" />
/// <reference types="react-dom" />

declare module "*.tsx" {
  import React from 'react';
  const component: React.ComponentType<any>;
  export default component;
}

declare module "*.ts" {
  const content: any;
  export default content;
}

interface PushSubscriptionOptionsInit {
  userVisibleOnly?: boolean;
  applicationServerKey?: BufferSource | string | null;
}

interface PushManager {
  getSubscription(): Promise<PushSubscription | null>;
  subscribe(options?: PushSubscriptionOptionsInit): Promise<PushSubscription>;
  permissionState(options?: PushSubscriptionOptionsInit): Promise<PermissionState>;
}

interface ServiceWorkerRegistration {
  readonly pushManager: PushManager;
}