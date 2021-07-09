import React from 'react'


export const Left: React.FC = () => {
        return (<div className="bg-gray-300 w-full lg:w-1/2 h-1/4 lg:h-full overflow-hidden">
            <div className="relative top-1/4 left-1/2 transform -translate-x-1/2 w-1/2 h-1/2">
                <div style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}} className="bg-gray-400 w-48 h-40 absolute transform rotate-12" />
                <div style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}} className="bg-gray-800 w-48 h-40 absolute top-24 left-16" />
            </div>
        </div>);
}