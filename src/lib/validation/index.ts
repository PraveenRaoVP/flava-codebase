import * as z from "zod";

export const SignUpValidation = z.object({
  name: z.string().min(2, { message: "Name must be atleast 2 characters" }).max(50, { message: "Name must be less than 50 characters" }),
  username: z.string().min(2, {
    message: "Username must be atleast 2 characters",
  }).max(50, {
    message: "Username must be less than 50 characters",
  }),
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password must be atleast 6 characters" }).max(50, { message: "Password must be less than 50 characters" }),
});

export const SignInValidation = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password must be atleast 6 characters" }).max(50, { message: "Password must be less than 50 characters" }),
});

export const PostValidation = z.object({
  caption: z.string().min(5).max(2200),
  file: z.custom<File[]>(),
  location: z.string().min(2).max(100),
  tags: z.string(),
});

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  username: z.string().min(2, { message: "Username must be atleast 2 characters" }).max(50, { message: "Username must be less than 50 characters" }),
  name: z.string().min(2, { message: "Name must be atleast 2 characters" }).max(50, { message: "Name must be less than 50 characters" }),
  email: z.string().email({ message: "Invalid email" }),
  bio: z.string()
})
