import React, { useState } from 'react';

function BookMarkSearch({ searchQuery, setSearchQuery, handleSearchClick }) {

    const handleInputChange = (e) => {
        handleSearchClick(e.target.value)
    };

    return (
        <div className="flex justify-center items-center my-5 ">
            <div className="w-full max-w-xl">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder="Search..."
                    className="border border-gray-700 py-2 px-4 w-full outline-none rounded-xl"
                />
            </div>
        </div>
    );
};

export default BookMarkSearch;
