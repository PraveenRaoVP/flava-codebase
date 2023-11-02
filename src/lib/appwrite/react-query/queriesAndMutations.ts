import {
    useQuery,
    useMutation,
    useInfiniteQuery,
    useQueryClient
} from "@tanstack/react-query";
import { createPost, createUserAccount, getRecentPosts, signInAccount, signOutAccount } from "../api";
import { INewPost, INewUser } from "@/types";
import { QUERY_KEYS } from "./queryKeys";

// function to create a new user account by calling the Appwrite API using mutations. A mutation is a function that will make a request to the API and update the cache with the result.
export const useCreateUserAccountMutation = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user),
    })
}

// function to sign in by calling the Appwrite API and creating a new email session using mutations. A mutation is a function that will make a request to the API and update the cache with the result.
export const useSignInAccountMutation = () => {
    return useMutation({
        mutationFn: (user: { email: string, password: string }) => signInAccount(user),
    })
}

export const useSignOutAccountMutation = () => {
    return useMutation({
        mutationFn: signOutAccount,
    })
}

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post: INewPost) => createPost(post),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
            });
        },
    });
}

export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: () => getRecentPosts(),
    })
}