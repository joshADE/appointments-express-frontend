import React from 'react'
import moment from 'moment'
import { UserAndRoleForStore } from '../../features/store/storeTypes';
import defaultPhoto from '../../assets/profile-picture.jpg'
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
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
                className={`w-max ${index > 0 ? "-ml-2" : ""} `}
            >
                <Tippy
                    arrow
                    interactive
                    hideOnClick={false}
                    content={
                        <div className="w-40">
                            <span>{user.firstName} {user.lastName}</span>
                            <br />
                            <span>Since: {moment(createdAt, "YYYY-MM-DD[T]HH:mm:ss").format("L")}</span>
                            <br />
                            <div>
                            {render && render(userAndRoleForStore)}
                            </div>
                        </div>
                    }
                >
                    <img 
                        className="rounded-3xl w-8 h-8 object-cover ring-white ring-2 z-10" 
                        src={user.avatarUrl? user.avatarUrl : defaultPhoto} 
                        alt={user.firstName + " " + user.lastName}
                    />
                </Tippy>
            </div>)
            })}
        </div>);
}

export default PersonList