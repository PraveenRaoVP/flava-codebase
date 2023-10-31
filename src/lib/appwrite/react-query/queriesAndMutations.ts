import {
    useQuery,
    useMutation,
    useInfiniteQuery,
    useQueryClient
} from "@tanstack/react-query";
import { createUserAccount, signInAccount } from "../api";
import { INewUser } from "@/types";

export const useCreateUserAccountMutation = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user),
    })
}

export const useSignInAccountMutation = () => {
    return useMutation({
        mutationFn: (user: { email: string, password: string }) => signInAccount(user),
    })
}
