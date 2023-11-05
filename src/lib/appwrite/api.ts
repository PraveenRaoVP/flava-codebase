"use client";

import { INewPost, INewUser, IUpdatePost } from "@/types";
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
export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== GET USER
  export async function getCurrentUser() {
    try {
      const currentAccount = await getAccount();
  
      if (!currentAccount) throw Error;
  
      const currentUser = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );
  
      if (!currentUser) throw Error;
  
      return currentUser.documents[0];
    } catch (error) {
      console.log(error);
      return null;
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

export function getFilePreview(fileId: string) {
    try {
        const fileUrl = storage.getFilePreview(
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

export async function likePost(postId: string, likesArray: string[]) {
    try {
        const updatedPost = await database.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            {
                likes: likesArray
            }
        )    
        if(!updatedPost){
            throw Error;
        }
        return updatedPost;
    } catch (error) {
        console.log(error)
    }
}

export async function savePost(postId: string, userId: string) {
    try {
        const updatedPost = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
                user: userId,
                post: postId
            }
        )    
        if(!updatedPost){
            throw Error;
        }
        return updatedPost;
    } catch (error) {
        console.log(error)
    }
}

export async function deleteSavedPost(savedRecordId: string) {
    try {
        const statusCode= await database.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            savedRecordId
        )    
        if(!statusCode){
            throw Error;
        }
        return { status: "ok" };
    } catch (error) {
        console.log(error)
    }
}

export async function getPostById(postId: string) {
    try {
        const post = await database.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        );
        return post;        
    } catch (error) {
        console.log(error)
    }
}

export async function updatePost(post: IUpdatePost) {
    const hasFileToUpdate = post.file.length > 0;
    try {
        let image = {
            imageUrl: post.imageUrl,
            imageId: post.imageId
        }

        if(hasFileToUpdate) {
            const uploadedFile = await uploadFile(post.file[0]);
            if (!uploadedFile) throw Error;
    
            const fileUrl = await getFilePreview(uploadedFile.$id);
            if (!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw Error;
            }
            image = {...image, imageUrl: fileUrl, imageId: uploadedFile.$id}
        }


        const tags = post.tags?.replace(/ /g, "").split(",") || [];

        const updatedPost = await database.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            post.postId,
            {
                caption: post.caption,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
                location: post.location,
                tags: tags,
            }
        );
        if (!updatedPost) {
            await deleteFile(post.imageId);
            throw Error;
        }
        return updatedPost;
    } catch (error) {
        console.log(error)
    }
}

export async function deletePost(postId: string, imageId: string) {
    if(!postId || !imageId) throw Error;
    try {
        await database.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )

        return { status: 'ok' };
    } catch (error) {
        console.log(error)
    }
}

export async function getInfinitePosts({ pageParam } : { pageParam : number}) {
    const queries: any[] = [
        Query.orderDesc('$updatedAt'), Query.limit(20)
    ];

    if(pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()));
    }

    try {
        const posts = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries
        )
        if(!posts){
            throw Error;
        }
        return posts;        
    } catch (error) {
        console.log(error)
    }
}

export async function searchPosts(searchTerm: string) {
    try {
        const posts = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,   
            [Query.search('caption', searchTerm)]   
        )
        if(!posts){
            throw Error;
        }
        return posts
    } catch (error) {
        console.log(error)
    }
}


export async function getUsers() {
    try {
        const users = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(10)]
        )
        if(!users){
            throw Error;
        }
        return users;
    } catch (error) {
        console.log(error);
    }
}
