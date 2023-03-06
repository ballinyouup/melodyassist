/* eslint-disable @next/next/no-img-element */
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../server/auth";

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col gap-4 bg-slate-700 w-96 h-96 justify-between p-12 rounded-lg">
        <h1 className="text-center text-3xl text-white font-bold">Sign In Below</h1>
        <input type="text" placeholder="Enter Email" className="input input-bordered w-full max-w-xs" />
        <input type="password" placeholder="Enter Password" className="input input-bordered w-full max-w-xs" />
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              className="btn h-full w-full p-5"
              onClick={() => void signIn(provider.id)}
            >
              <img
                src="/discord-logo-white.svg"
                width={125}
                alt="Discord Sign In"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: "/" } };
  }
  const providers = await getProviders();
  return {
    props: { providers: providers ?? [] },
  };
}
