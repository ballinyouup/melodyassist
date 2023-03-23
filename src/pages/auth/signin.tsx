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
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const sessionClient = api.useContext();
  const [email, setEmail] = useState<string>();
  const router = useRouter();
  const [alert, setAlert] = useState<boolean>(Boolean(router.query.error));
  const handleSignIn = async (providerName: string) => {
    const result: SignInResponse | undefined = await signIn(providerName, {
      redirect: true,
      callbackUrl: "/generate",
    });
    if (result !== undefined && result.error) {
      toast.error("Error Signing In. Please try again");
      void sessionClient.invalidate();
    }
  };

  useEffect(() => {
    void sessionClient.invalidate();
  }, [sessionClient]);

  const providerImages: JSX.Element[] = [
    <img
      key={0}
      src="/email.png"
      className="mr-1 ml-1 w-6"
      alt="Email Sign In"
    />,
    <img
      key={1}
      src="/discordIconWhite.png"
      className="h-6"
      alt="Discord Sign In"
    />,
    <img key={2} src="/google.png" className="h-7 w-8" alt="Google Sign In" />,
  ];

  return (
    <div className="hero min-h-screen bg-base-200 ">
      <div className="hero-content w-96 flex-col">
        {alert && (
          <div className={`alert absolute top-10 w-80 bg-rose-900 text-white`}>
            <div>
              <button onClick={() => setAlert(!alert)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 flex-shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
              <span>{router.query.error ?? ""}</span>
            </div>
          </div>
        )}
        <div className="text-center lg:text-left">
          <Link
            href="/"
            className="btn-ghost btn h-full w-full p-4 text-3xl font-bold"
          >
            Melody Assist
          </Link>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-5 flex w-full flex-col justify-start gap-6">
              {providers &&
                Object.values(providers).map((provider, index) => (
                  <button
                    key={provider.name}
                    className="btn flex h-16 w-full flex-row justify-start gap-4 pl-20 font-poppins text-lg font-semibold"
                    onClick={
                      index === 0
                        ? () => void signIn(provider.id, { email: email })
                        : () => void handleSignIn(provider.id)
                    }
                  >
                    {providerImages[index]}
                    {provider.id}
                  </button>
                ))}
            </div>
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
