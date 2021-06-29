import React from 'react'
import DefaultProfilePhoto from '../../../assets/profile-picture.jpg'

const ProfileNav: React.FC = () => {
    return (
        <div>
            <img src={DefaultProfilePhoto} className="rounded-3xl w-10" alt="profile" />
        </div>
    )
}

export default ProfileNav
