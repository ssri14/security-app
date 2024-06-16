import React, { useContext, useRef, useState } from "react";

const Loader = () => {
    return (
        <>
            <div className="d-flex justify-content-center my-5">
                <div className="loading-overlay spinner-grow text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <div className="loading-overlay spinner-grow text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <div className="loading-overlay spinner-grow text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <div className="loading-overlay spinner-grow text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <div className="loading-overlay spinner-grow text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <div className="loading-overlay spinner-grow text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </>
    );
};

export default Loader;
