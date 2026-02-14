import { Trash2 } from "lucide-react";

const OrderCard = ({ item, onRemove, onUpdate }) => {
    return (
        <div className="card glass-morphism cart-item" style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1rem',
            padding: '1rem',
            alignItems: 'center'
        }}>
            {/* Left Section: Image + Details */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                flex: '1 1 200px',
                minWidth: '200px'
            }}>
                <div style={{
                    width: '70px',
                    height: '70px',
                    flexShrink: 0,
                    backgroundColor: 'var(--bg-accent)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden'
                }}>
                    <img
                        src={item.image || `https://source.unsplash.com/random/100x100/?${item.category},food`}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none' }}
                    />
                </div>
                <div style={{ flex: 1, minWidth: '100px' }}>
                    <h4 style={{ margin: 0, marginBottom: '0.25rem', fontSize: '1rem' }}>{item.name}</h4>
                    <div className="price" style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.95rem' }}>
                        ₹{item.price} each
                    </div>
                </div>
            </div>

            {/* Right Section: Controls */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
                flex: '1 1 auto',
                minWidth: '200px'
            }}>
                {/* Quantity Controls */}
                <div className="quantity-controls" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    backgroundColor: 'var(--bg-accent)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-md)'
                }}>
                    <button
                        className="btn icon-btn"
                        style={{
                            padding: '0.4rem',
                            width: '32px',
                            height: '32px',
                            border: '1px solid var(--primary)',
                            backgroundColor: 'var(--bg-secondary)',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onClick={() => onUpdate(item.id, -1)}
                    >−</button>
                    <span style={{
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        minWidth: '20px',
                        textAlign: 'center'
                    }}>{item.quantity}</span>
                    <button
                        className="btn icon-btn"
                        style={{
                            padding: '0.4rem',
                            width: '32px',
                            height: '32px',
                            border: '1px solid var(--primary)',
                            backgroundColor: 'var(--bg-secondary)',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onClick={() => onUpdate(item.id, 1)}
                    >+</button>
                </div>

                {/* Total Price */}
                <div style={{
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    minWidth: '70px',
                    textAlign: 'right',
                    color: 'var(--text-primary)'
                }}>
                    ₹{item.price * item.quantity}
                </div>

                {/* Delete Button */}
                <button
                    className="btn icon-btn delete-btn"
                    style={{
                        color: 'var(--danger)',
                        padding: '0.5rem',
                        border: '1px solid var(--danger)',
                        borderRadius: 'var(--radius-md)'
                    }}
                    onClick={() => onRemove(item.id)}
                    title="Remove item"
                >
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    );
};

export default OrderCard;
