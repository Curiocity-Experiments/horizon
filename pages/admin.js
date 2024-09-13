import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, getDocs, updateDoc, deleteDoc, doc, addDoc } from 'firebase/firestore';

export default function AdminDashboard() {
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    fetchFeedbackItems();
    fetchCategories();
  }, []);

  const fetchFeedbackItems = async () => {
    const q = query(collection(db, 'feedback'));
    const querySnapshot = await getDocs(q);
    setFeedbackItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchCategories = async () => {
    const q = query(collection(db, 'categories'));
    const querySnapshot = await getDocs(q);
    setCategories(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleStatusChange = async (feedbackId, newStatus) => {
    try {
      await updateDoc(doc(db, 'feedback', feedbackId), { status: newStatus });
      fetchFeedbackItems();
    } catch (error) {
      console.error('Error updating feedback status:', error);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (confirm('Are you sure you want to delete this feedback?')) {
      try {
        await deleteDoc(doc(db, 'feedback', feedbackId));
        fetchFeedbackItems();
      } catch (error) {
        console.error('Error deleting feedback:', error);
      }
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'categories'), { name: newCategoryName });
      setNewCategoryName('');
      fetchCategories();
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