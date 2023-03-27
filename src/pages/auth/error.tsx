import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

function ErrorPage() {
  const router = useRouter();
  const trpc = api.useContext();
  useEffect(() => {
    void trpc.invalidate();
  }, [trpc]);
  if (router.query.error === "Verification") {
    return (
      <div className={`hero min-h-screen bg-base-200 ${poppins.className}`}>
        <div className="hero-content w-96 flex-col">
          <div className="card w-full max-w-sm flex-shrink-0 bg-base-100 shadow-2xl">
            <div className="card-body">
              <div className="form-control flex flex-col items-center justify-center gap-4">
                <span className="font-poppins text-xl font-semibold">
                  Error with Email Verification
                </span>
                <Link href="/auth/signin" className="btn w-full">
                  Return to Sign In Page
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`hero min-h-screen bg-base-200 ${poppins.className}`}>
      <div className="hero-content w-96 flex-col">
        <div className="card w-full max-w-sm flex-shrink-0 bg-base-100 shadow-2xl">
          <div className="card-body">
            <div className="form-control flex flex-col items-center justify-center gap-4">
              <span className="font-poppins text-xl font-semibold">
                Error Signing In
              </span>
              <Link href="/auth/signin" className="btn w-full">
                Return to Sign In Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
