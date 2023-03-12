/* eslint-disable @next/next/no-img-element */
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import type { SignInResponse } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../server/auth";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const sessionClient = api.useContext();
  const router = useRouter();
  const handleSignIn = async (providerName: string) => {
    const result: SignInResponse | undefined = await signIn(providerName, {
      redirect: true,
    });
    if (result !== undefined && result.error) {
      toast.error("Error Signing In. Please try again");
      void sessionClient.invalidate();
      void router.push("/auth/error");
    }
  };

  useEffect(() => {
    void sessionClient.invalidate();
  }, [sessionClient]);
  return (
    <div className="hero min-h-screen bg-base-200 ">
      <div className="hero-content w-96 flex-col">
        <div className="text-center lg:text-left">
          <h1 className="text-3xl font-bold">Melody Assist</h1>
        </div>
        <div className="card w-full max-w-sm flex-shrink-0 bg-base-100 shadow-2xl">
          <div className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className="input-bordered input"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input-bordered input"
              />
              <label className="label">
                <a href="#" className="link-hover label-text-alt link">
                  Forgot password?
                </a>
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn-primary btn">Login</button>
            </div>
            {providers &&
              Object.values(providers).map((provider) => (
                <div key={provider.name}>
                  <button
                    className="btn h-full w-full p-5"
                    onClick={() => void handleSignIn(provider.id)}
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
