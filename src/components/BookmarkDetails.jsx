import React, { useState, useEffect } from 'react';





function BookmarkDetails({ url }) {

    const [details, setDetails] = useState(null);

    async function fetchData() {
        try {
            console.log(encodeURIComponent(url))
            const response = await fetch(`http://localhost:3001/fetch-url?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            setDetails(data);
        } catch (error) {
            console.error('Error fetching URL details:', error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [url]);

    if (!details) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>{details.title}</h2>
            <p>{details.description}</p>
            {details.imageUrl && <img src={details.imageUrl} alt={details.imageAlt ? details.imageAlt : 'Preview'} />}
            {details.faviconUrl && <img src={details.faviconUrl} alt="Favicon" />}
        </div>
    );
}

export default BookmarkDetails;
