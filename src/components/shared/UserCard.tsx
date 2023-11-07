import { Models } from 'appwrite'
import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'

type UserCardProps = {
    user: Models.Document
}

const UserCard = ({ user }: UserCardProps) => {

    const handleFollow = () => {
        console.log('followed')
    }

    return (
        <Link to={`/profile/${user.$id}`} className='user-card'>
            <img src={user.imageUrl || "/assets/icons/profile-placeholder.svg"} alt="Creator" className="rounded-full w-14 h-14" />
            <div className="flex-center flex-col gap-1">
                <p className="base-medium text-light-1 line-clamp-1 text-center">{user.name}</p>
                <p className="small-regular text-light-3 line-clamp-1 text-center">@{user.username}</p>
            </div>
            <Button type="button" size="sm" className='shad-button_primary px-5 z-10' onClick={handleFollow}>Follow</Button>
        </Link>
    )
}

export default UserCard