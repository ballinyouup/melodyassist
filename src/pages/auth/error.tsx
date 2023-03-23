import Link from "next/link";
import { useRouter } from "next/router";

function ErrorPage() {
  const router = useRouter();

  if (router.query.error === "Verification") {
    return (
      <div className="hero min-h-screen bg-base-200">
      <div className="hero-content w-96 flex-col">
        <div className="card w-full max-w-sm flex-shrink-0 bg-base-100 shadow-2xl">
          <div className="card-body">
            <div className="form-control flex flex-col items-center justify-center gap-4">
              <span className="font-semibold font-poppins text-xl">Error with Email Verification</span>
              <Link href="/" className="btn w-full">Click here to return home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content w-96 flex-col">
        <div className="card w-full max-w-sm flex-shrink-0 bg-base-100 shadow-2xl">
          <div className="card-body">
            <div className="form-control flex flex-col items-center justify-center gap-4">
              <span className="font-semibold font-poppins text-xl">Error Signing In</span>
              <Link href="/" className="btn w-full">Click here to return home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
