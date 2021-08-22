import React from 'react'
import DashboardPageHeader from '../../shared/DashboardPageHeader';


const ManageAppointment: React.FC = () => {
        return (
        <div className="overflow-y-auto h-full w-11/12 font-roboto p-4">
            <DashboardPageHeader
                title="Appointments"
                description="Here are all you scheduled appointments. You can see more details about the event by clicking. Make sure to select a store first."
            />
            <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
                
            </div>
        </div>
        );
}

export default ManageAppointment;