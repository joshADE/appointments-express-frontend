import React from 'react'

interface DashboardPageHeaderProps {
    title: string;
    description: string;
}

const DashboardPageHeader: React.FC<DashboardPageHeaderProps> = ({ title, description}) => {
    return (
        <>
            <h1
                className="font-oswald font-semibold text-4xl mb-4"
            >{title}</h1>
            <p
                className="font-roboto text-sm text-gray-500 w-3/4"
            >{description}</p>
        </>
    )
}

export default DashboardPageHeader
