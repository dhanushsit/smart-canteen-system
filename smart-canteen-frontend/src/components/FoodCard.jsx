import { Plus, Zap, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import api from '../services/api';

const FoodCard = ({ product }) => {
    const { addToCart } = useCart();

    const isOutOfStock = product.stock <= 0;
    const isSnack = product.category === 'Snacks';

    return (
        <div className={`card food-card animate-scale-up ${isOutOfStock ? 'out-of-stock' : ''}`}>
            <div className="food-image" style={{ position: 'relative' }}>
                <img src={product.image || `https://source.unsplash.com/random/300x200/?${product.category},food`}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isOutOfStock ? 0.5 : 1 }}
                    onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.style.backgroundColor = '#e2e8f0' }}
                />

                {!isOutOfStock && (
                    <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: 'rgba(16, 185, 129, 0.9)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '20px',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        backdropFilter: 'blur(4px)'
                    }}>
                        <Zap size={10} fill="white" /> LIVE
                    </div>
                )}



                {isOutOfStock && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.6)', color: 'var(--danger)', fontWeight: 'bold' }}>
                        OUT OF STOCK
                    </div>
                )}
            </div>

            <div className="food-details">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 className="food-title">{product.name}</h3>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{product.category}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem', height: '2.5rem', overflow: 'hidden' }}>{product.description}</p>

                <div className="food-meta" style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="price-tag">₹{product.price}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            className="add-btn"
                            onClick={() => addToCart(product)}
                            title="Add to Cart"
                            disabled={isOutOfStock}
                            style={{ backgroundColor: isOutOfStock ? 'var(--bg-accent)' : '' }}
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodCard;
