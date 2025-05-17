export interface Application {
  name: string;
  description: string;
  url: string;
  icon: string;
  status_endpoint?: string;
}

export interface Config {
  require_passcode?: boolean;
  passcode?: string;
  apps: Application[];
}

export type Status = 'online' | 'offline' | 'loading';

export interface AppWithStatus extends Application {
  status: Status;
}

export interface StatusSummary {
  total: number;
  online: number;
  offline: number;
}
