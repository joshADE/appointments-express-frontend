import React from 'react'

const StepsSection: React.FC = () => {
        return (
            <section id="steps" className="font-roboto">
                <div className="py-20 mx-auto container px-10 overflow-hidden">
                    <h3 className="text-green-500 text-center font-semibold text-sm">Steps</h3>
                    <h2 className="text-center font-extrabold text-4xl">How do you use the app?</h2>
                    <div className="flex flex-col md:flex-row mt-20 justify-around">
                        <div className="lg:p-10 mb-10">
                            <h5 className="text-center font-semibold">Store Owners/Managers</h5>

                            <ol className="list-decimal p-10">
                                <li>Create a store by supplying details such as the name, location and minimum/maximum number of minutes of an appointment</li>
                                <li>Setup the hours for that store on a weekly basis</li>
                                <li>Add any closed days and times</li>
                                <li>(optional) Assign a manager for that store to manage appointment for you (the owner)</li>
                                <li>Create a link to the store so that your customers can initiate the appointment</li>
                                <li>Send this link to your customers</li>
                                <li>Once the customer has setup the appointment, you will see the appointment on you calendar where you can accept the appointment time or move it to another day/time</li>
                            </ol>
                            <span className="font-semibold">(Signup required)</span>
                        </div>
                        <div className="lg:p-10 mb-10">
                            <h5 className="text-center font-semibold">Store Customers</h5>

                            <ol className="list-decimal p-10">
                                <li>Create an appointment by going to the link provided by the store owner or alternatively use the search box above to search for a store</li>
                                <li>Fill in the appointment details such as the name, and description and use the interactive calendar to schedule the appointment</li>
                                <li>Once filled, the appointment details will be sent to the owner/manager of the store where they can approve of the time</li>
                                <li>When the store owner approves of the appointment, visit the store at the scheduled day and time</li>
                            </ol>
                            <span className="font-semibold">(No signup required, link to schedule appointment will be provided in email)</span>
                        </div>
                    </div>
                </div>
            </section>
        );
}

export default StepsSection