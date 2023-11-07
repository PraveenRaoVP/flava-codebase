import GridPostList from '@/components/shared/GridPostList';
import Loader from '@/components/shared/Loader';
import { useGetCurrentUser } from '@/lib/appwrite/react-query/queriesAndMutations'
import React from 'react'

const LikedPosts = () => {

  const{ data: currentUser } = useGetCurrentUser();

  if(!currentUser) {
    return(
      <div className="flex h-full w-full">
        <Loader />
      </div>
    )
  }

  return (
    <>
      {currentUser.liked.length === 0 && (
        <p>No Liked Posts</p>
      )}
      <GridPostList posts={currentUser.liked} showStats={false} />
    </>
  )
}

export default LikedPosts