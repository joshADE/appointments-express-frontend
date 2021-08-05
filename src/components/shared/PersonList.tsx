import React from 'react'
import moment from 'moment'
import { UserAndRoleForStore } from '../../features/store/storeTypes';
import defaultPhoto from '../../assets/profile-picture.jpg'
interface PersonListProps {
    people: UserAndRoleForStore[];
}

const PersonList: React.FC<PersonListProps> = ({
    people
}) => {
        return (
        <div className="flex flex-wrap items-center">
            {people.map(({ user , createdAt}, index) => 
            <div
                key={user.id}
                className={`group w-max relative ${index > 0 ? "-ml-2" : ""} `}
            >
                <div
                    className="hidden group-hover:block absolute -top-16 text-xs w-24 bg-gray-800 text-white rounded-sm p-2 z-20"
                >{user.firstName} {user.lastName} <br /> Since: {moment(createdAt, "YYYY-MM-DD[T]HH:mm:ss").format("L")}</div>
                <img 
                    className="rounded-3xl w-8 ring-white ring-2 z-10" 
                    src={defaultPhoto} 
                    alt={user.firstName + " " + user.lastName}
                />
            </div>)
            }
        </div>);
}

export default PersonList