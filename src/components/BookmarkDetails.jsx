import React, { useState } from 'react';

function BookmarkDetails({ urlDetails }) {
    return ( urlDetails && 
        <div>
            <h2>{urlDetails.title}</h2>
            <p>{urlDetails.description}</p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                {urlDetails.faviconUrl && <img src={urlDetails.faviconUrl} alt="Favicon" />}
                {urlDetails.imageUrl && <img src={urlDetails.imageUrl} alt={urlDetails.imageAlt ? urlDetails.imageAlt : 'Preview'} />}
            </div>
        </div>
    );
}

export default BookmarkDetails;
