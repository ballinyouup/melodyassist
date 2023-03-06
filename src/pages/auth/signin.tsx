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
      <div className="flex h-96 w-96 flex-col justify-between gap-4 rounded-lg bg-slate-700 p-12">
        <h1 className="text-center text-3xl font-bold text-white">
          Sign In Below
        </h1>
        <input
          type="text"
          placeholder="Enter Email"
          className="input-bordered input w-full max-w-xs"
        />
        <input
          type="password"
          placeholder="Enter Password"
          className="input-bordered input w-full max-w-xs"
        />
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              className="btn h-full w-full p-5"
              onClick={() =>
                void signIn(provider.id, {
                  callbackUrl: `/`,
                })
              }
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
