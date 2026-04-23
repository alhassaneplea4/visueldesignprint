export type LogAction =
  | 'LOGIN'
  | 'CREATE_EVENT' | 'UPDATE_EVENT' | 'DELETE_EVENT' | 'UPLOAD_IMAGE'
  | 'SUBMIT_CONTACT' | 'UPDATE_CONTACT' | 'DELETE_CONTACT'
  | 'CLEAR_LOGS';

export interface ActivityLog {
  id:        string;
  action:    LogAction;
  label:     string;
  user:      string;
  details:   Record<string, unknown> | null;
  createdAt: string;
}
