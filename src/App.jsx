import { useState, useEffect } from 'react';

export default function App() {
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    fetch('https://dummyjson.com/products?limit=5')
      .then((res) => res.json())
      .then((data) => {
        const commonItems = ['Chair', 'Table', 'Book', 'Chai', 'Notebook'];
        setProducts(
          (data.products || []).map((item, i) => ({
            ...item,
            title: commonItems[i] || item.title,
          }))
        );
      });
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    fetch('https://dummyjson.com/products/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
      .then((res) => res.json())
      .then((newProduct) => {
        setProducts([{ ...newProduct, title }, ...products]);
        setTitle('');
      });
  };

  const handleUpdate = (id) => {
    fetch(`https://dummyjson.com/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle }),
    })
      .then((res) => res.json())
      .then(() => {
        setProducts(
          products.map((item) =>
            item.id === id ? { ...item, title: editTitle } : item
          )
        );
        setEditingId(null);
      });
  };

  const handleDelete = (id) => {
    fetch(`https://dummyjson.com/products/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        setProducts(products.filter((item) => item.id !== id));
      });
  };

  return (
    <div className="max-w-md mx-auto p-6 font-sans">
      <h1 className="text-xl font-bold text-blue-600 mb-6">CRUD Test</h1>

      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 p-2 rounded flex-1 outline-none focus:border-blue-500"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
        >
          Add
        </button>
      </form>

      <ul className="divide-y divide-gray-200 border border-gray-200 rounded">
        {products.map((item) => (
          <li key={item.id} className="p-3 flex items-center justify-between gap-2">
            {editingId === item.id ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="border border-gray-300 p-1.5 rounded flex-1 outline-none focus:border-blue-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => handleUpdate(item.id)}
                  className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 font-medium"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="bg-gray-300 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-400 font-medium"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <span className="font-medium text-gray-900">{item.title}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(item.id);
                      setEditTitle(item.title);
                    }}
                    className="bg-amber-500 text-white px-3 py-1 rounded text-sm hover:bg-amber-600 font-medium"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
