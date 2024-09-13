import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    fetchFeedbackItems();
    fetchCategories();
  }, []);

  const fetchFeedbackItems = async () => {
    const response = await fetch('/api/feedback/list');
    const data = await response.json();
    setFeedbackItems(data.feedbackItems);
  };

  const fetchCategories = async () => {
    const response = await fetch('/api/admin/categories');
    const data = await response.json();
    setCategories(data);
  };

  const handleStatusChange = async (feedbackId, newStatus) => {
    try {
      const response = await fetch('/api/admin/feedback', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: feedbackId, status: newStatus }),
      });
      if (response.ok) {
        fetchFeedbackItems();
      }
    } catch (error) {
      console.error('Error updating feedback status:', error);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (confirm('Are you sure you want to delete this feedback?')) {
      try {
        const response = await fetch('/api/admin/feedback', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: feedbackId }),
        });
        if (response.ok) {
          fetchFeedbackItems();
        }
      } catch (error) {
        console.error('Error deleting feedback:', error);
      }
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName }),
      });
      if (response.ok) {
        setNewCategoryName('');
        fetchCategories();
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Manage Feedback</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Title</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedbackItems.map((item) => (
              <tr key={item.id}>
                <td className="border p-2">{item.title}</td>
                <td className="border p-2">
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    className="p-1 border rounded"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => handleDeleteFeedback(item.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Manage Categories</h2>
        <form onSubmit={handleAddCategory} className="mb-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New category name"
            className="p-2 border rounded mr-2"
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Add Category
          </button>
        </form>
        <ul className="list-disc pl-4">
          {categories.map((category) => (
            <li key={category.id}>{category.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}