export interface EventField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'select' | 'textarea';
  required: boolean;
  min?: number;
  max?: number;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
}

export interface Event {
  slug: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  status: 'open' | 'finished' | 'cancelled';
  badge?: string;
  image?: string;
  publishedDate?: string;
  fields: EventField[];
}