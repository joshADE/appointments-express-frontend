import React from 'react'
import moment from 'moment'
import { UserAndRoleForStore } from '../../features/store/storeTypes';
import defaultPhoto from '../../assets/profile-picture.jpg'
interface PersonListProps {
    people: UserAndRoleForStore[];
    render?: (userAndRoleForStore: UserAndRoleForStore) => JSX.Element
}

const PersonList: React.FC<PersonListProps> = ({
    people,
    render
}) => {
        return (
        <div className="flex flex-wrap items-center">
            {people.map((userAndRoleForStore, index) => {
                const { user , createdAt } = userAndRoleForStore;
            return (<div
                key={user.id}
                className={`group w-max relative ${index > 0 ? "-ml-2" : ""} `}
            >
                <div
                    className="hidden group-hover:block absolute -top-16 text-xs w-24 bg-gray-800 text-white rounded-sm p-2 z-20"
                >
                    <span>{user.firstName} {user.lastName}</span>
                    <br />
                    <span>Since: {moment(createdAt, "YYYY-MM-DD[T]HH:mm:ss").format("L")}</span>
                    <br />
                    {render && render(userAndRoleForStore)}
                </div>
                <img 
                    className="rounded-3xl w-8 h-8 object-cover ring-white ring-2 z-10" 
                    src={user.avatarUrl? user.avatarUrl : defaultPhoto} 
                    alt={user.firstName + " " + user.lastName}
                />
            </div>)
            })}
        </div>);
}

export default PersonList