import { useState, useEffect } from "react";
import { getProducts } from "../services/productService";
import api from "../services/api";
import FoodCard from "../components/FoodCard";
import { Search, Filter, Loader2, AlertCircle, Clock } from "lucide-react";

const Menu = () => {
    const [products, setProducts] = useState([]);
    const [settings, setSettings] = useState({ breakfast: true, lunch: true, dinner: true });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [prodRes, settingsRes] = await Promise.all([
                getProducts(),
                api.get('/settings')
            ]);
            setProducts(prodRes.data);
            setSettings(settingsRes.data);
        } catch (error) {
            console.error("Failed to fetch menu data", error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ["All", ...new Set(products.map((p) => p.category))];

    // Core Filtering Logic based on active meal settings
    const filteredProducts = products.filter((product) => {
        // 1. Check search term
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());

        // 2. Check category filter
        const matchesCategory = activeCategory === "All" || product.category === activeCategory;

        // 3. Check Timing/Meal constraints
        // If a product has meals defined, it must belong to AT LEAST ONE enabled meal type.
        // If no meals are defined, we show it by default (optional, user might want to hide untagged items)
        const productMeals = product.meals || [];

        // If the item isn't tagged as Breakfast, Lunch, Dinner, or Snacks, we show it (e.g. Beverages might be all-day)
        const mealSpecific = productMeals.some(m => ['Breakfast', 'Lunch', 'Dinner', 'Snacks'].includes(m));

        let matchesTiming = true;
        if (mealSpecific) {
            // Check if any of its tags correspond to an ENABLED global setting
            const isBreakfastOk = productMeals.includes('Breakfast') && settings.breakfast;
            const isLunchOk = productMeals.includes('Lunch') && settings.lunch;
            const isDinnerOk = productMeals.includes('Dinner') && settings.dinner;
            const isSnacksOk = productMeals.includes('Snacks') && settings.snacks;

            matchesTiming = isBreakfastOk || isLunchOk || isDinnerOk || isSnacksOk;
        }

        return matchesSearch && matchesCategory && matchesTiming;
    });

    if (loading) return (
        <div className="container" style={{ textAlign: 'center', padding: '5rem' }}>
            <Loader2 className="animate-spin" style={{ margin: '0 auto' }} size={40} />
            <p style={{ marginTop: '1rem' }}>Loading menu...</p>
        </div>
    );

    return (
        <div className="container">
            <header style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                        <h1>Our Menu</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Delicious meals, served straight to you</p>
                    </div>
                    {/* Active Sessions Indicators */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                    </div>
                </div>

                <div className="controls-grid" style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div className="search-bar" style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search for food..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--bg-accent)' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`btn ${activeCategory === cat ? "btn-primary" : "btn-secondary"}`}
                                onClick={() => setActiveCategory(cat)}
                                style={{ whiteSpace: 'nowrap', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {filteredProducts.length === 0 ? (
                <div className="card" style={{ padding: '4rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)' }}>
                    <AlertCircle size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                    <h3>No items available</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        It looks like there aren't any items matching your search or currently serving meal sessions.
                    </p>
                    <button onClick={() => { setSearchTerm(""); setActiveCategory("All") }} className="btn btn-primary" style={{ marginTop: '1rem' }}>Clear Filters</button>
                </div>
            ) : (
                <div className="menu-grid">
                    {filteredProducts.map((product) => (
                        <FoodCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Menu;
