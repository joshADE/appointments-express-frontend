import React, { useState, useRef, useEffect, Ref, memo } from 'react'
import * as MdIcons from 'react-icons/md';
import defaultImage from '../../../assets/imageDefault.png';
import image0 from '../../../assets/image0.png';
import image1 from '../../../assets/image1.png';
import image2 from '../../../assets/image2.png';

const featureList = [
    { title: 'Calendar Scheduling', desc: 'A calendar that allows you to easily drag and drop appointmnets to reschedule', icon: <MdIcons.MdSchedule />, image: image0},
    { title: 'Role-Based Appointment Management', desc: 'Each user will have certain permission depending on the store', icon: <MdIcons.MdGroup />, image: image1},
    { title: 'Quick Profiles', desc: 'Easily setup a store based on a predefined profile with fields that you can selectively include', icon: <MdIcons.MdCheckBox />, image: image2}
]

const FeaturesSection = React.forwardRef((props, ref: Ref<HTMLDivElement>) => {
    console.log("rerendered featuers")
        const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(-1);
        const feautureContainerRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const eventListener = (e: MouseEvent) => {
                if (feautureContainerRef.current && !feautureContainerRef.current.contains(e.target as Node))
                    setSelectedFeatureIndex(-1);
            }

            document.addEventListener('mousedown', eventListener);
            return () => {document.removeEventListener('mousedown', eventListener); }
        },[])
        return (
            <section id="features" className="font-roboto">
                <div className="py-20 mx-auto container px-10 overflow-hidden" ref={ref}>
                    <h3 className="text-green-500 font-semibold text-sm text-center md:text-left">Features</h3>
                    <h2 className="font-extrabold text-4xl md:w-3/5 text-center md:text-left font-open-sans text-gray-900">Supports many feautures that you would expect from a regular appointment scheduler and more</h2>
                    <div className="flex flex-col justify-between md:flex-row mt-20">
                        <div className="flex lg:w-1/2 flex-col" ref={feautureContainerRef}>
                            {featureList.map((feature, index) => 
                            <button
                                key={index}
                                className={`mb-10 p-5 focus:outline-none flex items-center rounded-sm transition-shadow duration-300 ease-in ${selectedFeatureIndex === index? 'shadow-lg': ''}`}
                                onFocus={() => setSelectedFeatureIndex(index)}
                            >
                                <div className="text-green-500 text-2xl mr-4">
                                    {feature.icon}
                                </div>
                                <div className="text-left">
                                    <h5 className="text-2xl font-extrabold font-open-sans text-gray-900">{feature.title}</h5>
                                    <h6 className="text-base text-gray-500">{feature.desc}</h6>
                                </div>
                            </button>)}
                        </div>
                        <img className="max-w-lg object-cover object-left" src={selectedFeatureIndex === -1 ? defaultImage: featureList[selectedFeatureIndex].image} alt="screenshot of app" /> 
                    </div>
                </div>
            </section>
        );
});

export default memo(FeaturesSection);