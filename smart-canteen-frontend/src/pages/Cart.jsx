import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ArrowLeft, ArrowRight, CreditCard } from "lucide-react";
import OrderCard from "../components/OrderCard";

const Cart = () => {
    const { cart, total, removeFromCart, updateQuantity, clearCart } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        navigate('/payment');
    };

    if (cart.length === 0) {
        return (
            <div className="container" style={{ textAlign: "center", paddingTop: "4rem" }}>
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.5 }}>🛒</div>
                <h2>Your Cart is Empty</h2>
                <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
                    Looks like you haven't added anything yet.
                </p>
                <button className="btn btn-primary" onClick={() => navigate("/menu")}>
                    <ArrowLeft size={18} />
                    Back to Menu
                </button>
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: "800px" }}>
            <h1 style={{ marginBottom: "2rem" }}>Shopping Cart</h1>

            <div className="cart-list">
                {cart.map((item, index) => (
                    <OrderCard
                        key={item.id || index}
                        item={item}
                        onRemove={removeFromCart}
                        onUpdate={updateQuantity}
                    />
                ))}
            </div>

            <div className="card cart-summary" style={{ marginTop: "2rem", border: '2px solid var(--primary-light)' }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem", fontSize: "1.2rem", fontWeight: "bold", color: 'var(--primary)' }}>
                    <span>Total</span>
                    <span>₹{total}</span>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                    <button
                        className="btn"
                        style={{ flex: 1, border: "1px solid var(--text-secondary)" }}
                        onClick={clearCart}
                    >
                        Clear
                    </button>
                    <button
                        className="btn btn-primary"
                        style={{
                            flex: 2,
                            padding: '1rem',
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                            color: 'white',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)'
                        }}
                        onClick={handleCheckout}
                    >
                        Proceed to Checkout <ArrowRight size={18} />
                    </button>
                </div>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <CreditCard size={14} /> Direct UPI payment via QR code
                </div>
            </div>
        </div>
    );
};

export default Cart;
