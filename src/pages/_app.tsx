import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "~/utils/api";
//import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "~/styles/globals.css";
import FaviconProvider from "./FaviconProvider";

export interface SessionType {
  session: Session | null;
}

const MyApp: AppType<SessionType> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider
      session={session}
      refetchOnWindowFocus={false}
      refetchInterval={0}
      refetchWhenOffline={false}
    >
      <FaviconProvider>
        <Component {...pageProps} />
      </FaviconProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
