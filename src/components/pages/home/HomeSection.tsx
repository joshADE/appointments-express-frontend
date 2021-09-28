import React, { memo, useState, useMemo } from 'react'
import { useGetStoresQuery } from '../../../app/services/appointments';
import * as VscIcons from 'react-icons/vsc'
import * as RiIcons from 'react-icons/ri'


const HomeSection: React.FC = () => {
        const { data } = useGetStoresQuery();
        const stores = useMemo(() => 
        data ? data.filter(({ isQuickProfile }) => !isQuickProfile).map(({ id, name, location }) => ({ id, name, location })) : []
        , [data]);
        const [filterTerm, setFilterTerm] = useState('');

        return (
        <section id="home" className="mt-14 font-roboto">
            <div className="py-20 mx-auto container px-10 flex">
                <div className="lg:w-1/2 lg:ml-20 font-semibold z-10">
                    <div className="md:w-3/4 mb-3">
                        <h1 className="font-extrabold text-4xl mb-4">
                            Schedule appointments <span className="text-green-500">faster</span> and <span className="text-green-500">around</span> your <span className="text-green-500">business hours</span>
                        </h1>
                        <p className="text-lg text-gray-500">
                            A web-based tool that makes it easier to manage appointments with your customers that is flexible and fast
                        </p>
                    </div>
                    <span className="text-gray-500">---</span><span className="inline-block px-2 text-sm">or</span><span className="text-gray-500">---------------------</span>
                    <div className="mt-3">
                        <p className="text-lg text-gray-500">Are you a customer?</p>
                        <p className="text-lg text-gray-500">Search existing store</p>
                        <div>
                            <div className="relative w-min">
                                <input type="text" className="border border-gray-400 rounded-md h-11 w-52 p-2 focus:outline-none focus:border-green-500" value={filterTerm} onChange={(e) => setFilterTerm(e.target.value)} />
                                <div className="absolute w-full mt-1 rounded-lg text-xs bg-white flex flex-col">
                                    {filterTerm.length > 1 && 
                                    stores
                                    .filter(({name}) => name.toLocaleLowerCase().includes(filterTerm.toLocaleLowerCase()))
                                    .map(({name, id, location}, index, arr) => (index < 5 &&
                                    <button key={id} className={`p-1 text-left hover:bg-green-200 focus:outline-none border border-black ${index === arr.length - 1 || index === 4? 'rounded-b-lg' : ''} ${index !== 0? '': 'rounded-t-lg'}`}>
                                        <div className="flex">
                                            <RiIcons.RiStoreLine className="mr-2" />
                                            <span className="truncate">
                                                {name}
                                            </span>
                                        </div>
                                        <div className="flex">
                                            <VscIcons.VscLocation className="mr-2" />
                                            <span className="truncate">
                                                {location}
                                            </span>
                                        </div>
                                    </button>))}
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div className="absolute lg:relative lg:w-1/2 h-full z-0">
                    <div style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}} className="bg-gray-200 w-72 h-56 absolute transform rotate-12" />
                    <div style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}} className="bg-gray-800 w-72 h-56 absolute top-32 -left-4 lg:left-20" />
                </div>
            </div>
        </section>);
};

export default memo(HomeSection)