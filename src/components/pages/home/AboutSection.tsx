import React, { memo, Ref } from 'react'
import image from '../../../assets/undraw_date_picker_gorr.svg'

const AboutSection = React.forwardRef((props, ref: Ref<HTMLDivElement>) => {
    console.log("rerendered about")
        return (
            <section id="about" className="font-roboto">
                <div ref={ref} className="py-20 mx-auto container px-10 overflow-hidden rounded-2xl bg-gradient-to-b from-greenfade">
                    <h3 className="text-green-500 text-center font-semibold text-sm">About</h3>
                    <h2 className="text-center font-black font-open-sans text-gray-900 text-4xl">What does the app do?</h2>
                    <h2 className="text-center font-black font-open-sans text-gray-900 text-4xl">And what is it for?</h2>
                    <div className="flex flex-col md:flex-row mt-20 justify-around items-center">
                        <img className="object-cover md:w-1/2 max-w-xs md:max-w-md" src={image} alt="person looking at calendar" />
                        <ul className="list-disc font-normal text-gray-700 md:w-1/2 p-10">
                            <li className="mb-5">
                                This app is an appointment schedulinging app that is designed to allow multiple people to manage appointments for a business and keep track of who is assigned to which customer 
                            </li>
                            <li className="mb-5">
                                It supports different roles from the owner of the store who creates the stores profile to the manager who has access to appointments
                            </li>
                            <li className="mb-5">
                                The app is meant for businesses who don’t have any tool to schedule appointments and need a solution that is fast, intuitive, and easy to use
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        );
});

export default memo(AboutSection);