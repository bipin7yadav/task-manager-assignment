import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../types';

interface TaskState {
  tasks: Task[];
}

const loadState = (): TaskState => {
  try {
    const state = localStorage.getItem('tasks');
    if (state === null) {
      return { tasks: [] };
    }
    return JSON.parse(state);
  } catch (err) {
    return { tasks: [] };
  }
};

const initialState: TaskState = loadState();

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
      localStorage.setItem('tasks', JSON.stringify(state));
    },
    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        localStorage.setItem('tasks', JSON.stringify(state));
      }
    },
    editTask: (state, action: PayloadAction<{ id: string; title: string; description: string }>) => {
      const task = state.tasks.find(t => t.id === action.payload.id);
      if (task) {
        task.title = action.payload.title;
        task.description = action.payload.description;
        localStorage.setItem('tasks', JSON.stringify(state));
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      localStorage.setItem('tasks', JSON.stringify(state));
    }
  }
});

export const { addTask, toggleTask, editTask, deleteTask } = taskSlice.actions;
export default taskSlice.reducer;