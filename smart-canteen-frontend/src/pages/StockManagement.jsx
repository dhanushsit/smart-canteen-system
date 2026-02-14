import { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';
import { Package, Save, Edit, Trash2, Plus, X, Image as ImageIcon, Search, Clock } from 'lucide-react';

const StockManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'Fast Food',
        stock: '',
        image: '',
        meals: [] // Breakfast, Lunch, Dinner
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await getProducts();
            setProducts(response.data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            category: product.category,
            stock: product.stock,
            image: product.image || '',
            meals: product.meals || []
        });
        setShowModal(true);
    };

    const handleAdd = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            price: '',
            category: 'Fast Food',
            stock: '',
            image: '',
            meals: []
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await deleteProduct(id);
                fetchProducts();
            } catch (error) {
                alert("Failed to delete product");
            }
        }
    };

    const handleMealToggle = (meal) => {
        setFormData(prev => {
            const meals = prev.meals.includes(meal)
                ? prev.meals.filter(m => m !== meal)
                : [...prev.meals, meal];
            return { ...prev, meals };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, formData);
            } else {
                await createProduct(formData);
            }
            setShowModal(false);
            fetchProducts();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to save product");
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="container" style={{ textAlign: 'center', padding: '5rem' }}>
            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid', borderRadius: '50%', borderTopColor: 'transparent', margin: '0 auto' }}></div>
            <p style={{ marginTop: '1rem' }}>Loading inventory...</p>
        </div>
    );

    return (
        <div className="container">
            <header className="dashboard-header" style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <h1>Inventory Management</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage products, prices, stock, and meal schedules</p>
                </div>
                <button className="btn btn-primary" onClick={handleAdd} style={{ whiteSpace: 'nowrap' }}>
                    <Plus size={18} /> <span className="hide-mobile">Add New Item</span><span className="show-mobile">Add</span>
                </button>
            </header>

            <div style={{ marginBottom: '2rem' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '100%' }}>
                    <Search size={20} style={{
                        position: 'absolute',
                        left: '1.25rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--primary)',
                        zIndex: 1
                    }} />
                    <input
                        type="text"
                        placeholder="Search inventory items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1rem 1rem 1rem 3.5rem',
                            fontSize: '1rem',
                            borderRadius: '16px',
                            border: '1px solid var(--bg-accent)',
                            backgroundColor: 'var(--bg-secondary)',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                        }}
                    />
                </div>
            </div>

            <div className="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Meals</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.id} style={{ borderBottom: '1px solid var(--bg-accent)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--bg-accent)' }}>
                                            {product.image ? (
                                                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                                    <ImageIcon size={18} />
                                                </div>
                                            )}
                                        </div>
                                        <span style={{ fontWeight: '600' }}>{product.name}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', backgroundColor: 'var(--bg-accent)', fontSize: '0.75rem' }}>
                                        {product.category}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                        {(product.meals || []).map(m => (
                                            <span key={m} style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 'bold' }}>{m}</span>
                                        ))}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem', fontWeight: 'bold' }}>₹{product.price}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        fontWeight: 'bold',
                                        color: product.stock <= 5 ? 'var(--danger)' : product.stock <= 15 ? 'var(--warning)' : 'var(--success)'
                                    }}>
                                        {product.stock}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                                        <button className="btn icon-btn" onClick={() => handleEdit(product)} title="Edit"><Edit size={16} /></button>
                                        <button className="btn icon-btn" onClick={() => handleDelete(product.id)} style={{ color: 'var(--danger)' }} title="Delete"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <div className="card glass-morphism" style={{ width: '550px', maxWidth: '95%', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0 }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={() => setShowModal(false)} className="btn icon-btn"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label>Product Name</label>
                                    <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Masala Dosa" />
                                </div>
                                <div className="form-group">
                                    <label>Price (₹)</label>
                                    <input required type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Stock Quantity</label>
                                    <input required type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--bg-accent)', backgroundColor: 'var(--bg-primary)' }}>
                                        <option value="Starters">Starters</option>
                                        <option value="Main Course">Main Course</option>
                                        <option value="South Indian">South Indian</option>
                                        <option value="Snacks">Snacks</option>
                                        <option value="Beverages">Beverages</option>
                                        <option value="Desserts">Desserts</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Image URL</label>
                                    <input placeholder="https://image-url.com" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
                                </div>

                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                        <Clock size={16} /> Meal Assignments
                                    </label>
                                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                                        {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map(meal => (
                                            <label key={meal} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.meals.includes(meal)}
                                                    onChange={() => handleMealToggle(meal)}
                                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                                />
                                                {meal}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '2.5rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                                    <Save size={18} /> {editingProduct ? 'Update Inventory' : 'Add to Inventory'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StockManagement;
