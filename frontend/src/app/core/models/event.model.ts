export type EventCategory =
  | 'Actualité'
  | 'Réalisation'
  | 'Promotion'
  | 'Nouveau service'
  | 'Événement';

export const EVENT_CATEGORIES: EventCategory[] = [
  'Actualité',
  'Réalisation',
  'Promotion',
  'Nouveau service',
  'Événement'
];

export interface VdpEvent {
  id        : string;
  title     : string;
  excerpt   : string;
  category  : EventCategory;
  date      : string;         // ISO date string "YYYY-MM-DD"
  image     : string;         // URL ou chemin /uploads/...
  createdAt : string;
  updatedAt?: string;
}

export interface EventsResponse {
  success: boolean;
  data   : VdpEvent[];
}

export interface EventResponse {
  success: boolean;
  data   : VdpEvent;
}

/** Payload pour créer / modifier un événement */
export interface EventPayload {
  title    : string;
  excerpt  : string;
  category : EventCategory;
  date     : string;
  image    : string;
}
