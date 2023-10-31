import * as z from "zod";

export const SignUpValidation = z.object({
  name: z.string().min(2, { message: "Name must be atleast 2 characters" }).max(50, { message: "Name must be less than 50 characters" }),
  username: z.string().min(2, {
      message: "Password must be atleast 2 characters",
    }).max(50, {
      message: "Password must be less than 50 characters",
    }),
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password must be atleast 6 characters" }).max(50, { message: "Password must be less than 50 characters" }),
  });
