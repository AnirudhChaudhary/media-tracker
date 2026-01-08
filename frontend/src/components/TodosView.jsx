import React, { useState, useEffect } from 'react';
import * as api from '../api/client';

const TodosView = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTodo, setNewTodo] = useState({ title: '', description: '', priority: 'medium', category: 'personal' });

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const data = await api.getTodos();
      setTodos(data);
    } catch (error) {
      console.error('Error loading todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;
    
    try {
      await api.addTodo(newTodo);
      setNewTodo({ title: '', description: '', priority: 'medium', category: 'personal' });
      setShowAddForm(false);
      loadTodos();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.updateTodo(id, { status: newStatus });
      loadTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteTodo(id);
      loadTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const columns = [
    { id: 'todo', title: 'To Do', bgColor: 'bg-gray-700' },
    { id: 'in-progress', title: 'In Progress', bgColor: 'bg-blue-700' },
    { id: 'done', title: 'Done', bgColor: 'bg-green-700' }
  ];

  const getTodosByStatus = (status) => todos.filter(todo => todo.status === status);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500';
      case 'medium': return 'border-yellow-500';
      case 'low': return 'border-green-500';
      default: return 'border-gray-500';
    }
  };

  if (loading) return <div className="text-center py-8">Loading todos...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Todos</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Add Todo
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <form onSubmit={handleAddTodo} className="space-y-4">
            <input
              type="text"
              placeholder="Todo title"
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              className="w-full p-2 bg-gray-700 rounded"
              required
            />
            <textarea
              placeholder="Description (optional)"
              value={newTodo.description}
              onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              className="w-full p-2 bg-gray-700 rounded h-20"
            />
            <div className="flex gap-4">
              <select
                value={newTodo.priority}
                onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value })}
                className="p-2 bg-gray-700 rounded"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <input
                type="text"
                placeholder="Category"
                value={newTodo.category}
                onChange={(e) => setNewTodo({ ...newTodo, category: e.target.value })}
                className="p-2 bg-gray-700 rounded"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(column => (
          <div key={column.id} className={`${column.bgColor} p-4 rounded-lg`}>
            <h3 className="font-semibold mb-4 text-center">{column.title}</h3>
            <div className="space-y-3">
              {getTodosByStatus(column.id).map(todo => (
                <div
                  key={todo.id}
                  className={`bg-gray-800 p-3 rounded border-l-4 ${getPriorityColor(todo.priority)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{todo.title}</h4>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      ×
                    </button>
                  </div>
                  {todo.description && (
                    <p className="text-sm text-gray-300 mb-2">{todo.description}</p>
                  )}
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span className="bg-gray-700 px-2 py-1 rounded">{todo.category}</span>
                    <span>{todo.priority}</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {columns.filter(col => col.id !== todo.status).map(col => (
                      <button
                        key={col.id}
                        onClick={() => handleStatusChange(todo.id, col.id)}
                        className="text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded"
                      >
                        → {col.title}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodosView;