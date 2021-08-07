import React from 'react'
import { useAppSelector } from '../../../app/hooks'
import DefaultProfilePhoto from '../../../assets/profile-picture.jpg'

const ProfileNav: React.FC = () => {
    const avatarUrl = useAppSelector(state => state.auth.user?.avatarUrl);
    return (
        <div>
            <img src={avatarUrl ? avatarUrl: DefaultProfilePhoto} className="rounded-3xl w-10 h-10 object-cover" alt="profile" />
        </div>
    )
}

export default ProfileNav
