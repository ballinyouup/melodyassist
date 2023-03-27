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
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

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
    <img key={0} src="/google.png" className="h-7 w-8" alt="Google Sign In" />,
    <img
      key={1}
      src="/discordIconWhite.png"
      className="h-6"
      alt="Discord Sign In"
    />,
    <img
      key={2}
      src="/email.png"
      className="mr-1 ml-1 w-6"
      alt="Email Sign In"
    />,
  ];

  return (
    <div className={`hero min-h-screen bg-white ${poppins.className}`}>
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
              <span>
                {router.query.error === "OAuthAccountNotLinked"
                  ? "Wrong Sign In Method"
                  : "Error Signing In"}
              </span>
            </div>
          </div>
        )}
        <div className="card w-full max-w-sm flex-shrink-0 bg-white shadow-2xl">
          <div className="card-body">
            <div className="text-center lg:text-left">
              <Link
                href="/"
                className="btn-ghost btn h-full w-full p-4 text-3xl font-bold text-black"
              >
                Melody Assist
              </Link>
            </div>

            <div className="mt-5 flex w-full flex-col justify-start gap-4">
              {providers &&
                Object.values(providers)
                  .reverse()
                  .map((provider, index) => (
                    <>
                      {index === 2 ? (
                        <>
                          <div className="divider text-black before:bg-gray-400 after:bg-gray-400">
                            OR
                          </div>
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text text-black">
                                Email
                              </span>
                            </label>
                            <input
                              type="email"
                              placeholder="email"
                              className="input bg-gray-100 border-black border-opacity-20 placeholder:text-gray-400 text-black"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                            <button
                              key={provider.name}
                              className="btn-ghost btn mt-5 flex h-16 w-full flex-row justify-start gap-4 bg-black pl-20 text-lg font-semibold text-white hover:bg-black hover:bg-opacity-70"
                              onClick={() =>
                                void signIn(provider.id, { email: email })
                              }
                            >
                              {providerImages[index]}
                              {provider.id}
                            </button>
                          </div>
                        </>
                      ) : (
                        <button
                          key={provider.name}
                          className="btn-ghost btn flex h-16 w-full flex-row justify-start gap-4 bg-black pl-20 text-lg font-semibold text-white hover:bg-black hover:bg-opacity-70"
                          onClick={() => void handleSignIn(provider.id)}
                        >
                          {providerImages[index]}
                          {provider.id}
                        </button>
                      )}
                    </>
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
