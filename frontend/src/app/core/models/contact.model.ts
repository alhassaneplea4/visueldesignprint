export interface Contact {
  id:        string;
  name:      string;
  phone:     string;
  email:     string;
  service:   string;
  message:   string;
  read:      boolean;
  createdAt: string;
}

export interface ContactPayload {
  name:    string;
  phone:   string;
  email:   string;
  service: string;
  message: string;
}
