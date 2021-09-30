import React, { memo } from 'react'

const Instructions: React.FC = () => {
        return (
        <div className="h-full overflow-y-auto">
            <h3 className="font-oswald text-base">Instructions</h3>
            <ul className="font-roboto text-sm list-disc ml-4">
                <li>Click the scheduler to create an appointment</li>
                <li>You can click and drag the appointment block to reschedule</li>
                <li>If the owner of the store permits it, you may also resize the block to increase or decrease the duration of the appointment</li>
                <li>The shaded are on the scheduler are times that the owner has marked unavailable</li>
                <li>You will also see other appointments that have been scheduled which you can't schedule over</li>
                <li>When you are satisfied with the date, time, and duration of the appointment you can click accept to enter your email and have a link sent to you to view the status of your appointment</li>
            </ul>
        </div>);
}

export default memo(Instructions);