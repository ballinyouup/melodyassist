import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "~/utils/api";
//import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "~/styles/globals.css";
import {
  QueryClientProvider,
  Hydrate,
  QueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
export interface SessionType {
  session: Session | null;
}

const MyApp: AppType<SessionType> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <SessionProvider
      session={session}
      refetchOnWindowFocus={false}
      refetchInterval={0}
      refetchWhenOffline={false}
    >
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps}>
          <Component {...pageProps} />
        </Hydrate>
      </QueryClientProvider>
      {/*<ReactQueryDevtools />*/}
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
