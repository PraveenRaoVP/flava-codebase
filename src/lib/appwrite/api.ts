"use client";

import { INewPost, INewUser } from "@/types";
import { ID, Query } from "appwrite";
import { account, appwriteConfig, avatars, database, storage } from "./config";


// function to create a new user account by calling the Appwrite API
export async function createUserAccount(user: INewUser) {
    try {
        // create a new Appwrite account
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        // save the user to the database
        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl
        })

        return newUser;
    } catch (error) {
        console.log(error)
        return error
    }
}

// function to save a user to the database by calling the Appwrite API
export async function saveUserToDB(user: {
    accountId: string,
    email: string,
    name: string,
    imageUrl: URL,
    username?: string,
}) {
    try {
        // save the user to the database by creating a new document in the users collection
        const newUser = await database.createDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, ID.unique(), user);
        return newUser;
    } catch (error) {
        console.log(error)
    }
}

// function to sign in by calling the Appwrite API and creating a new email session
export async function signInAccount(user: {
    email: string, password: string
}) {
    try {
        const session = await account.createEmailSession(user.email, user.password);
        // console.log(session)
        return session
    } catch (error) {
        console.log(error)
    }

}

// function to get the current user by calling the Appwrite API and getting the current account
export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;
        // listDocuments returns a list of documents in the users collection
        const currentUser = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)] // this is the same as:
            //  [`accountId=${currentAccount.$id}`]
        );
        //    console.log(currentUser);
        if (!currentUser) throw Error
        return currentUser.documents[0];
    } catch (error) {
        console.log(error)
    }
}

// function to sign out by calling the Appwrite API and deleting the current session
export async function signOutAccount() {
    try {
        const session = await account.deleteSession("current");
        return session;
    } catch (error) {
        console.log(error)
    }
}

export async function createPost(post: INewPost) {
    try {
        const uploadedFile = await uploadFile(post.file[0]);
        if (!uploadedFile) throw Error;

        const fileUrl = await getFilePreview(uploadedFile.$id);
        if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        const tags = post.tags?.replace(/ /g, "").split(",") || [];

        const newPost = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                location: post.location,
                tags: tags,
            }
        );
        if (!newPost) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }
        return newPost;
    } catch (error) {
        console.log(error)
    }
}

export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );
        return uploadedFile
    } catch (error) {
        console.log(error);
    }
}

export async function getFilePreview(fileId: string) {
    try {
        const fileUrl = await storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            "top",
            100
        )
        if (!fileUrl) throw Error;
        return fileUrl;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId)
        return { status: "ok" };
    } catch (error) {
        console.log(error)
    }
}

export async function getRecentPosts() {
    const posts = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.orderDesc("$createdAt"), Query.limit(20)]
    )
    if(!posts){
        throw Error;
    }
    return posts;
}