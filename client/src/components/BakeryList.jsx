import React, { useEffect, useState } from 'react';

export default function BakeryList() {
    const [bakeries, setBakeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const backendHost = process.env.REACT_APP_BACKEND_HOST;
    useEffect(() => {
        // Fetch bakeries from the backend
        const fetchBakeries = async () => {
            try {
                const response = await fetch(`${backendHost}/api/bakeries`);
                const data = await response.json();
                setBakeries(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching bakeries:', err);
                setLoading(false);
            }
        };

        fetchBakeries();
    }, []);

    if (loading) {
        return <p>Loading bakeries...</p>;
    }

    if (bakeries.length === 0) {
        return <p>No bakeries available.</p>;
    }

    return (
        <div>
            <h1>Bakeries</h1>
            <div>
                {bakeries.map((bakery) => (
                    <div key={bakery._id} style={{ border: '1px solid black', marginBottom: '1rem', padding: '1rem' }}>
                        <h2>{bakery.name}</h2>
                        <img src={bakery.imageUrl} alt={bakery.name} style={{ maxWidth: '100%' }} />
                        <p>{bakery.description}</p>
                        <p>Rating: {bakery.rating}</p>
                        <h3>Products:</h3>
                        <ul>
                            {bakery.products.map((product) => (
                                <li key={product._id}>
                                    <strong>{product.name}</strong>: {product.description}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
