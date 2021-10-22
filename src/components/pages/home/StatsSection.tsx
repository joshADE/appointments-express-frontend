import React, { memo, Ref } from 'react'


const StatsSection = React.forwardRef((props, ref: Ref<HTMLDivElement>) => {
    console.log("rerendered stats")
        return (<div ref={ref} className="font-open-sans flex rounded-full container bg-white w-10/12 h-36 p-4 mx-auto divide-x-2 divide-green-700 divide-opacity-10 border-8 border-greenfade transform translate-y-1/2">
            <div className="w-1/3 rounded-l-3xl text-center">
                <div className="text-gray-900 text-4xl">30+</div>
                <div className="text-gray-500">Registered Users</div>
            </div>
            <div className="w-1/3 text-center">
                <div className="text-gray-900 text-4xl">30+</div>
                <div className="text-gray-500">Stores Created</div>
            </div>
            <div className="w-1/3 rounded-r-3xl text-center truncate">
                <div className="text-gray-900 text-4xl">30+</div>
                <div className="text-gray-500">Scheduled</div>
                <div className="text-gray-500">Appointments</div>
            </div>
        </div>);
});

export default memo(StatsSection);