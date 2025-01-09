
import React from 'react';
import { useNavigate } from 'react-router-dom';

function SearchPage() {
    const history = useNavigate();

    return (
        <div>
            <h1>Search</h1>
            <p>This is the Search page. Placeholder for interactive elements based on the SVG layout.</p>
            <button onClick={() => navigate('/')}>Go to Welcome</button>
            <br/>
        </div>
    );
}

export default SearchPage;
