import GridPostList from '@/components/shared/GridPostList';
import Loader from '@/components/shared/Loader';
import { useUserContext } from '@/context/authContext';
import { useGetCurrentUser } from '@/lib/appwrite/react-query/queriesAndMutations';
import { Models } from 'appwrite';
import React from 'react'

const Saved = () => {

  const { data: currentUser } = useGetCurrentUser();

  const savedPosts = currentUser?.save.map((savePost: Models.Document) => ({
    ...savePost?.post,
    creator: {
      imageUrl: currentUser?.imageUrl
    }
  })).reverse();
  // console.log(currentUser);

  return (
    <div className='saved-container'>
      <div className="flex gap-2 w-full max-w-5xl">
        <img src="/assets/icons/save.svg" height={36} width={36} alt="edit" className='invert-white' />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>
      {
        !currentUser ? (
          <Loader />
        ) : (
          <ul className="w-full flex justify-center max-w-5xl gap-9">
            {
              savedPosts.length === 0 ? (
                <p className="text-light-4">No Available Posts</p>
              ) : (
                <GridPostList posts={savedPosts} showStats={false} />
              )
            }
          </ul>
        )
      }
    </div>
  )
  // return (
  //   <div className="">saved</div>
  // )
}

export default Saved