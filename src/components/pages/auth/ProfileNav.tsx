import React from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../../app/hooks'
import DefaultProfilePhoto from '../../../assets/profile-picture.jpg'

const ProfileNav: React.FC = () => {
    const user = useAppSelector(state => state.auth.user);
    return (
        <div className="flex items-center justify-center font-montserrat">
            <Link to="/dashboard/account">
                <img src={user?.avatarUrl ? user.avatarUrl: DefaultProfilePhoto} className="rounded-3xl w-10 h-10 object-cover" alt="profile" />
            </Link>
            {user &&
            <Link to="/dashboard/account" className="ml-3 hidden lg:block">
                <div className="text-sm font-semibold">{user.firstName} {user.lastName}</div>
                <div className="text-xs font-thin text-gray-500">{user.email}</div>
            </Link>}
        </div>
    )
}

export default ProfileNav
