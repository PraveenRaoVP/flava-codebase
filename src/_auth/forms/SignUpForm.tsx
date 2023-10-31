"use client"
import * as z from "zod"
import React from 'react'
import { Button } from '@/components/ui/button'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useToast } from "@/components/ui/use-toast"


import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { SignUpValidation } from "@/lib/validation"
import Loader from "@/components/shared/Loader"
import { Link, useNavigate } from "react-router-dom"
import { useCreateUserAccountMutation, useSignInAccountMutation } from "@/lib/appwrite/react-query/queriesAndMutations"
import { useUserContext } from "@/context/authContext"

const SignUpForm = () => {

  const { toast } = useToast()

  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccountMutation();
  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccountMutation();
  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SignUpValidation>) => {
    //create user 
    const newUser = await createUserAccount(values);
    // console.log(newUser);
    if (!newUser) {
      toast({
        title: "Sign Up Failed. Please try again later.",
        description: "Please try again later.",
      })
      return;
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password
    });
    if(!session) {
      return toast({ title: "Something Went Wrong and Sign Up Failed. Please try again later." })
    } 

    const isLoggedIn = await checkAuthUser();
    if(isLoggedIn) {
      form.reset();
      navigate('/');
    } else{
       return toast({ title: "Login Failed. Please try again later." })
    }
  }


  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="Logo" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a new Account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-12">To use flæva, Please Enter your Details</p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="shad-button_primary" type="submit">
            {
              isCreatingAccount ? (
                <div className="flex-center gap-2"><Loader />Loading...</div>
              ) : "Sign Up"
            }
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">Already have an Account? <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">Sign In</Link></p>
        </form>
      </div>
    </Form>
  )
}

export default SignUpForm
