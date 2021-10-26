import React from 'react'
import { useAppSelector } from '../../../app/hooks';


const CustomerNav: React.FC = () => {
    const customer = useAppSelector(state => state.customerAuth.customer);
    return (
        <div className="flex items-center justify-end font-montserrat">
            {customer?
            <div className="mr-3">
                <div className="text-sm font-semibold">{customer.firstName} {customer.lastName}</div>
                <div className="text-xs font-thin text-gray-500">{customer.email}</div>
            </div>:
            <div className="mr-3">
                <div className="text-sm font-semibold">NA NA</div>
                <div className="text-xs font-thin text-gray-500">NA</div>
            </div>
            }
        </div>
    )
}

export default CustomerNav;