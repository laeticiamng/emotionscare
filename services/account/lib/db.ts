import { v4 as uuidv4 } from 'uuid';

export type ExportJob = {
  id: string;
  user_id_hash: string;
  status: 'pending' | 'ready' | 'error';
  file_url?: string;
  created_at: Date;
  finished_at?: Date;
};

export type DeleteRequest = {
  user_id_hash: string;
  requested_at: Date;
  purge_at: Date;
};

const exportJobs: ExportJob[] = [];
const deleteRequests: DeleteRequest[] = [];

export function createExportJob(userHash: string): ExportJob {
  const job: ExportJob = {
    id: uuidv4(),
    user_id_hash: userHash,
    status: 'pending',
    created_at: new Date()
  };
  exportJobs.push(job);
  return job;
}

export function findRecentJob(userHash: string): ExportJob | undefined {
  const since = Date.now() - 24 * 60 * 60 * 1000;
  return exportJobs.find(j => j.user_id_hash === userHash && j.created_at.getTime() > since && (j.status === 'pending' || j.status === 'ready'));
}

export function getJob(id: string): ExportJob | undefined {
  return exportJobs.find(j => j.id === id);
}

export function createDeleteRequest(userHash: string): DeleteRequest {
  const now = new Date();
  const req: DeleteRequest = {
    user_id_hash: userHash,
    requested_at: now,
    purge_at: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  };
  deleteRequests.push(req);
  return req;
}

export function getDeleteRequest(userHash: string): DeleteRequest | undefined {
  return deleteRequests.find(r => r.user_id_hash === userHash);
}

export function removeDeleteRequest(userHash: string) {
  const idx = deleteRequests.findIndex(r => r.user_id_hash === userHash);
  if (idx !== -1) deleteRequests.splice(idx, 1);
}

export function clear() {
  exportJobs.length = 0;
  deleteRequests.length = 0;
}
