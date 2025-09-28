export interface APIStatusType {
  status: 'online' | 'offline' | 'degraded';
  lastCheck: Date;
  responseTime: number;
}

export class APIStatus {
  static async check(): Promise<APIStatusType> {
    try {
      const start = Date.now();
      const response = await fetch('/api/health');
      const responseTime = Date.now() - start;
      
      return {
        status: response.ok ? 'online' : 'degraded',
        lastCheck: new Date(),
        responseTime
      };
    } catch (error) {
      return {
        status: 'offline',
        lastCheck: new Date(),
        responseTime: 0
      };
    }
  }
}

export default APIStatus;