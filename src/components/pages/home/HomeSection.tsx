import React, { memo, useState, useMemo, Ref } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useGetStoresQuery } from '../../../app/services/appointments';
import * as VscIcons from 'react-icons/vsc'
import * as RiIcons from 'react-icons/ri'
import { Button } from '../../shared/Button';

function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const HomeSection = React.forwardRef((props, ref: Ref<HTMLDivElement>) => {
    console.log("rerendered home")
        const { data } = useGetStoresQuery();
        const history = useHistory();
        const stores = useMemo(() => 
        data ? data.filter(({ isQuickProfile }) => !isQuickProfile).map(({ id, name, location }) => ({ id, name, location })) : []
        , [data]);
        const [filterTerm, setFilterTerm] = useState('');

        const findRandomStore = () => {
            if (stores.length === 0){
                alert("There are no stores available right now");
                return;
            }
            const random = randomIntFromInterval(0, stores.length - 1);
            const selectedStore = stores[random];
            if (selectedStore === undefined){
                alert("There was a problem retrieving the store");
                return;
            }
            setTimeout(() => {
                history.push(`/store/${selectedStore.id}/createappointment`);
            }, 500)

        }

        return (
        <section id="home" className="font-roboto">
            <div className="mx-auto container px-10 flex" ref={ref}>
                <div className="lg:w-1/2 lg:ml-20 font-semibold z-10 py-20 lg:py-36">
                    <div className="mb-3">
                        <h1 className="font-black text-5xl mb-4 font-open-sans text-gray-900">
                            Schedule appointments <span className="text-green-500">faster</span> and <span className="text-green-500">around</span> your <span className="text-green-500">business hours</span>
                        </h1>
                        <p className="font-medium text-gray-500 w-3/4">
                            A web-based tool that makes it easier to manage appointments with your customers that is flexible and fast
                        </p>
                    </div>
                    <span className="text-gray-400">--- <span className="font-medium text-gray-400 inline-block px-2 text-sm">or</span> ---------------------</span>
                    <div className="mt-3">
                        <p className="font-medium text-gray-500">Are you a customer?</p>
                        <p className="font-medium text-gray-500">Search existing store</p>
                        <div>
                            <div className="relative w-min">
                                <input type="text" className="border border-gray-400 rounded-md h-11 w-52 p-2 focus:outline-none focus:border-green-500" value={filterTerm} onChange={(e) => setFilterTerm(e.target.value)} />
                                <div className="absolute w-full mt-1 rounded-lg text-xs bg-white flex flex-col">
                                    {filterTerm.length > 1 && 
                                    stores
                                    .filter(({name}) => name.toLocaleLowerCase().includes(filterTerm.toLocaleLowerCase()))
                                    .map(({name, id, location}, index, arr) => (index < 5 &&
                                    <Link tabIndex={0} to={`/store/${id}/createappointment`} key={id} className={`p-1 text-left hover:bg-green-50 focus:bg-green-50 focus:outline-none border border-gray-400 ${index === arr.length - 1 || index === 4? 'rounded-b-md' : ''} ${index !== 0? 'border-t-0': 'rounded-t-md'}`}>
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
                                    </Link>))}
                                </div>
                            </div>
                            
                        </div>
                        <Button 
                            className="mt-2 text-sm text-gray-500 hover:text-gray-900 focus:text-gray-900"
                            onClick={findRandomStore}
                            type="button"
                        >Find me a store</Button>
                    </div>
                </div>
                <div className="relative lg:w-1/2 min-h-full z-0 hidden lg:block rounded-2xl py-20 lg:py-36 bg-gradient-to-b from-greenfade">
                    <div className="absolute top-20 left-20 h-96 w-96 rounded-full border-2 border-dashed border-gray-500">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full border-2 border-gray-500" />
                    </div>
                    <div style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}} className="bg-gray-500 w-72 h-56 absolute transform rotate-12" />
                    <div style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}} className="bg-gray-800 w-72 h-56 absolute top-64 -left-4 lg:left-20" />
                </div>
            </div>
        </section>);
});

export default memo(HomeSection)