export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export type FilterStatus = 'all' | 'completed' | 'pending';