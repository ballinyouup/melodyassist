import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "~/utils/api";
import { store } from "~/pages/store";
import { Provider } from "react-redux";
import { Analytics } from "@vercel/analytics/react";
//import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "~/styles/globals.css";
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
      <Provider store={store}>
        <Component {...pageProps} />
        <Analytics />
      </Provider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
