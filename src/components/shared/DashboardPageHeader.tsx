import React from 'react'
import ProfileNav from '../pages/auth/ProfileNav'

interface DashboardPageHeaderProps {
    title: string;
    description?: string;
}

const DashboardPageHeader: React.FC<DashboardPageHeaderProps> = ({ title, description}) => {
    return (
        <div className="flex justify-between">
            <div className="w-2/3">
                <h1
                    className="font-open-sans font-semibold text-xl mb-4"
                >{title}</h1>
                {description && <p
                    className="font-montserrat text-xs text-gray-500 w-10/12"
                >{description}</p>}
            </div>
            <div className="w-1/6">
                <ProfileNav />
            </div>
        </div>
    )
}

export default DashboardPageHeader
