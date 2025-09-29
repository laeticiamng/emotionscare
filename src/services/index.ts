import { APIStatus, APIStatusItem } from '@/lib/api/status';

// Export the APIStatus class and types
export { APIStatus } from '@/lib/api/status';
export type { APIStatusItem } from '@/lib/api/status';

// Default services object that wraps APIStatus methods
const apiServices = {
  checkAllAPIs: () => APIStatus.checkAllAPIs(),
  getAPIConfiguration: () => APIStatus.getAPIConfiguration(),
  getAllAPIs: () => APIStatus.getAllAPIs(),
};

export default apiServices;