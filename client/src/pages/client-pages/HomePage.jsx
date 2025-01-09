import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();
    const [bakeries, setBakeries] = useState([]);
    const [filteredBakeries, setFilteredBakeries] = useState([]);
    const [search, setSearch] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [ratingFilter, setRatingFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const backendHost = process.env.REACT_APP_BACKEND_HOST;
    // Fetch bakeries from the backend
    useEffect(() => {
        const fetchBakeries = async () => {
            try {
                const response = await fetch(`${backendHost}/api/bakeries`); // Adjust endpoint if necessary
                const data = await response.json();
                setBakeries(data);
                setFilteredBakeries(data); // Initially display all bakeries
                setLoading(false);
            } catch (err) {
                console.error('Error fetching bakeries:', err);
                setLoading(false);
            }
        };

        fetchBakeries();
    }, []);

    // Handle filter changes
    const handleSearchChange = (e) => setSearch(e.target.value.toLowerCase());
    const handleLocationChange = (e) => setLocationFilter(e.target.value.toLowerCase());
    const handleRatingChange = (e) => setRatingFilter(e.target.value);

    // Filter bakeries whenever a filter changes
    useEffect(() => {
        const filtered = bakeries.filter((bakery) => {
            const matchesSearch =
                bakery.name.toLowerCase().includes(search) ||
                bakery.description.toLowerCase().includes(search);
            const matchesLocation = locationFilter
                ? bakery.location.toLowerCase().includes(locationFilter)
                : true;
            const matchesRating = ratingFilter
                ? parseFloat(bakery.rating) >= parseFloat(ratingFilter)
                : true;

            return matchesSearch && matchesLocation && matchesRating;
        });

        setFilteredBakeries(filtered);
    }, [search, locationFilter, ratingFilter, bakeries]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-700 text-xl">Loading bakeries...</p>
            </div>
        );
    }

    if (bakeries.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-700 text-xl">No bakeries available.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-8 py-12">
            <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">Our Bakeries</h1>

            {/* Filter Section */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                    type="text"
                    placeholder="Search by name or description..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full py-3 px-4 rounded-md border border-gray-300 bg-gray-100 text-gray-800 placeholder-gray-500"
                />
                <input
                    type="text"
                    placeholder="Filter by location..."
                    value={locationFilter}
                    onChange={handleLocationChange}
                    className="w-full py-3 px-4 rounded-md border border-gray-300 bg-gray-100 text-gray-800 placeholder-gray-500"
                />
                <select
                    value={ratingFilter}
                    onChange={handleRatingChange}
                    className="w-full py-3 px-4 rounded-md border border-gray-300 bg-gray-100 text-gray-800"
                >
                    <option value="">Filter by rating</option>
                    <option value="4">4 Stars & Above</option>
                    <option value="3">3 Stars & Above</option>
                    <option value="2">2 Stars & Above</option>
                    <option value="1">1 Star & Above</option>
                </select>
            </div>

            {/* Bakery Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredBakeries.map((bakery) => (
                    <div
                        key={bakery._id}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105"
                    >
                        <div className="h-64 overflow-hidden">
                            <img
                                src={bakery.imageUrl}
                                alt={bakery.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                                {bakery.name}
                            </h2>
                            <p className="text-gray-600 mb-6 line-clamp-3">{bakery.description}</p>
                            <button
                                onClick={() => navigate(`/bakery-details/${bakery._id}`)}
                                className="w-full bg-gray-800 text-white py-3 rounded-md hover:bg-gray-700 transition-colors"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HomePage;
