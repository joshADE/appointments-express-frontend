import React, { memo } from 'react'
import { Button } from '../../shared/Button'


const HomeSection: React.FC = () => {
        return (
        <section id="home" className="mt-14 font-roboto">
            <div className="py-20 container mx-auto px-10 flex overflow-hidden">
                <div className="lg:w-1/2 lg:ml-20 font-semibold z-10">
                    <div className="md:w-3/4">
                        <h1 className="font-extrabold text-4xl">
                            Schedule appointments <span className="text-green-500">faster</span> and <span className="text-green-500">around</span> your <span className="text-green-500">business hours</span>
                        </h1>
                        <p className="text-lg text-gray-500">
                            A web-based tool that makes it easier to manage appointments with your customers that is flexible and fast
                        </p>
                    </div>
                    <span className="text-gray-500">---</span><span className="inline-block px-2 text-sm">or</span><span className="text-gray-500">---------------------</span>
                    <div>
                        <p className="text-lg text-gray-500">Are you a customer?</p>
                        <div>
                            <input type="text" className="border border-gray-400 rounded-md h-11 w-52 p-2 focus:outline-none mr-12 mb-5" />
                            <Button 
                                type="button"
                                onClick={() => {}}
                                className="w-40 h-11 font-roboto"
                            >Search existing store</Button>
                        </div>
                    </div>
                </div>
                <div className="absolute lg:relative w-1/2 h-1/2 z-0">
                    <div style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}} className="bg-gray-200 w-80 h-60 absolute transform rotate-12" />
                    <div style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}} className="bg-gray-800 w-80 h-60 absolute top-32 left-16" />
                </div>
            </div>
        </section>);
};

export default memo(HomeSection)