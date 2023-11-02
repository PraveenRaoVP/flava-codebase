
import { QueryClientProvider } from '@tanstack/react-query';
import { QueryClient } from "@tanstack/react-query";
import React from 'react'

// QueryClient is a react query provider that wraps the entire app. It is used for caching and fetching data from the appwrite server.
const queryClient = new QueryClient();

export const QueryProvider = ({ children }: { children: React.ReactNode}) => {
  return (
    <QueryClientProvider client={queryClient}>
      { children }
    </QueryClientProvider>
  )
}


