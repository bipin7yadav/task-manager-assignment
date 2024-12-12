import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { addTask, toggleTask, deleteTask, editTask } from '../store/taskSlice.ts';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 


import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

const Index = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const [newTitle, setNewTitle] = useState(''); 
  const [newDescription, setNewDescription] = useState(''); 

  const handleAddTask = () => {
    if (newTitle.trim() && newDescription.trim()) {
      const newTask = {
        id: Date.now().toString(),
        title: newTitle,
        description: newDescription,
        completed: false,
      };
      dispatch(addTask(newTask));
      toast.success('Your new task has been created successfully.');
      setNewTitle('');
      setNewDescription('');
    } else {
      toast.error('Please provide both title and description!');
    }
  };

  const handleToggleTask = (id: string) => {
    dispatch(toggleTask(id));
    toast.info('Task status has been toggled.');
  };


  const handleDeleteTask = (id: string) => {
    dispatch(deleteTask(id));
    toast.success('Task deleted successfully.');
  };

  const handleEditTask = (id: string) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    if (taskToEdit) {
      setEditTaskId(id);
      setEditTitle(taskToEdit.title);
      setEditDescription(taskToEdit.description);
      setIsEditing(true);

      window.scrollTo(0, 0);
    }
  };

  const handleSaveEdit = () => {
    if (editTaskId) {
      dispatch(editTask({ id: editTaskId, title: editTitle, description: editDescription }));
      setIsEditing(false);
      setEditTaskId(null);
      setEditTitle('');
      setEditDescription('');
      toast.success('Task updated successfully.');
    }
  };



  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Task Manager</h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Task Title"
            className="p-2 border rounded w-full mb-2"
            value={isEditing ? editTitle : newTitle} 
            onChange={(e) => {
              if (isEditing) {
                setEditTitle(e.target.value);
              } else {
                setNewTitle(e.target.value);
              }
            }}
          />
          <textarea
            placeholder="Task Description"
            className="p-2 border rounded w-full mb-4"
            value={isEditing ? editDescription : newDescription} 
            onChange={(e) => {
              if (isEditing) {
                setEditDescription(e.target.value);
              } else {
                setNewDescription(e.target.value);
              }
            }}
          />
          {isEditing ? (
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              onClick={handleSaveEdit}
            >
              Save Changes
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              onClick={handleAddTask}
            >
              Add Task
            </button>
          )}
        </div>
        <div className="flex gap-2 mb-6">
          <button
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border border-blue-500'} hover:bg-blue-600 hover:text-white transition`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border border-blue-500'} hover:bg-blue-600 hover:text-white transition`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 rounded ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border border-blue-500'} hover:bg-blue-600 hover:text-white transition`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        <div className="grid gap-8">
          {filter !== 'completed' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Pending Tasks</h2>
              <ul>
                {pendingTasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex justify-between items-center mb-4 p-4 border rounded bg-white shadow-sm cursor-pointer"
                    onClick={() => handleToggleTask(task.id)}
                  >
                    <div className="flex flex-col">
                      <span className={`font-bold ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.title}</span>
                      <span className={`text-gray-500 text-sm ${task.completed ? 'line-through' : ''}`}>{task.description}</span>
                    </div>
                    <div className="flex gap-2">
                      <PencilIcon
                        className="h-5 w-5 text-yellow-500 cursor-pointer hover:text-yellow-600"
                        onClick={(e) => { e.stopPropagation(); handleEditTask(task.id); }}
                      />
                      <TrashIcon
                        className="h-5 w-5 text-red-500 cursor-pointer hover:text-red-600"
                        onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {filter !== 'pending' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Completed Tasks</h2>
              <ul>
                {completedTasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex justify-between items-center mb-4 p-4 border rounded bg-white shadow-sm cursor-pointer"
                    onClick={() => handleToggleTask(task.id)}
                  >
                    <div className="flex flex-col">
                      <span className={`font-bold ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.title}</span>
                      <span className={`text-gray-500 text-sm ${task.completed ? 'line-through' : ''}`}>{task.description}</span>
                    </div>
                    <div className="flex gap-2">
                      <PencilIcon
                        className="h-5 w-5 text-yellow-500 cursor-pointer hover:text-yellow-600"
                        onClick={(e) => { e.stopPropagation(); handleEditTask(task.id); }}
                      />
                      <TrashIcon
                        className="h-5 w-5 text-red-500 cursor-pointer hover:text-red-600"
                        onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Toast Container to show notifications */}
      <ToastContainer />
    </div>
  );
};

export default Index;
