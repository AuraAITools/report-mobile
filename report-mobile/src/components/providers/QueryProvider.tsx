import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 30000,
    },
  },
});

export default function QueryProvider({ children }: PropsWithChildren) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}