"use client"
import * as z from "zod"
import React from 'react'
import { Link, useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"


import { Button } from '@/components/ui/button'
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input";
import Loader from "@/components/shared/Loader"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useUserContext } from "@/context/authContext"

import { SignInValidation } from "@/lib/validation"
import { useSignInAccountMutation } from "@/lib/appwrite/react-query/queriesAndMutations"

const SignInForm = () => {

  // toast hook
  const { toast } = useToast()

  // navigation hook
  const navigate = useNavigate();

  // context hooks - auth - user. Explanation: https://react-query.tanstack.com/guides/mutations
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const { mutateAsync: signInAccount  } = useSignInAccountMutation();

  // form hook - react-hook-form - zod - Explanation: https://react-hook-form.com/advanced-usage#SchemaValidation
  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SignInValidation>) => {  
    const session = await signInAccount({
      email: values.email,
      password: values.password
    });

    if(!session) {
      return toast({ title: "Login Failed. Please try again later." })
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
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Log In To Your Account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-12">Welcome Back! Please Enter Your Details.</p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
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
              isUserLoading ? (
                <div className="flex-center gap-2"><Loader />Loading...</div>
              ) : "Sign In"
            }
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">New to our crib? <Link to="/sign-up" className="text-primary-500 text-small-semibold ml-1">Sign Up</Link></p>
        </form>
      </div>
    </Form>
  )
}

export default SignInForm;
