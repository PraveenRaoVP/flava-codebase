import Loader from '@/components/shared/Loader';
import UserCard from '@/components/shared/UserCard';
import { useUserContext } from '@/context/authContext';
import { useGetUsers } from '@/lib/appwrite/react-query/queriesAndMutations'
import React from 'react'

const AllUsers = () => {

  const { data: users, isPending: isUserLoading, isError: isErrorUser } = useGetUsers(); 
  const { user } = useUserContext();

  return (
    <div className='common-container'>
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {
          isUserLoading && !users ? (
            <Loader />
          ) : (
            <ul className="user-grid">
              {
                users?.documents.filter(item => item.$id !== user.id).map((item: any) => (
                  <li key={user.id} className="flex-1 min-w-[200px] w-full">
                    <UserCard user={item} />
                  </li>
                ))
              }
            </ul>
          )
        }
      </div>

    </div>
  )
}

export default AllUsers
