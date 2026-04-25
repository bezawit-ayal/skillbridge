import React from 'react';
import MapPage from './MapPage';

const TrackingPage = () => {
    return (
        <div className="h-screen w-full">
            <MapPage />
            <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-accent/20 border border-accent text-accent px-6 py-2 rounded-full font-bold z-50">
                LIVE TRACKING MODE
            </div>
        </div>
    );
};

export default TrackingPage;
