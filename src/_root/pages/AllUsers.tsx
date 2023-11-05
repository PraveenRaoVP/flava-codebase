import Loader from '@/components/shared/Loader';
import UserCard from '@/components/shared/UserCard';
import { useGetUsers } from '@/lib/appwrite/react-query/queriesAndMutations'
import React from 'react'

const AllUsers = () => {

  const { data: users, isPending: isUserLoading, isError: isErrorUser } = useGetUsers(); 

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
                users?.documents.map((user: any) => (
                  <li key={user?.id} className="flex-1 min-w-[200px] w-full">
                    <UserCard user={user} />
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
