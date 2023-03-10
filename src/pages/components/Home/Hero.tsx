import { useState } from "react";
import { toast } from "react-hot-toast";

interface Prediction {
  completed_at: string | null;
  created_at: string;
  error: string | null;
  id: string;
  input: { seed: string };
  logs: string | null;
  metrics: { [key: string]: string };
  output: string | null;
  started_at: string | null;
  status: string; // Add this property to the interface
  version: string;
}

interface ErrorResponse {
  detail: string;
  status?: string;
  id?: string;
  output: string | null;
}
const sleep = (ms: number) =>
  new Promise((r) => {
    setTimeout(r, ms);
  });
const Hero: React.FC = () => {
  const [prediction, setPrediction] = useState<Prediction | undefined>();
  const [error, setError] = useState<ErrorResponse>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Add any additional properties of the request body here
      body: JSON.stringify({}),
    });
    const prediction = (await response.json()) as Prediction | ErrorResponse;
    if (response.status !== 201) {
      setError(prediction as ErrorResponse);
      return;
    }
    setPrediction(prediction as Prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      console.log("Fetching...");
      await sleep(1000);
      const response = await fetch(
        `/api/predictions/${prediction.id as string}`
      );
      const predictionResponse = (await response.json()) as
        | Prediction
        | ErrorResponse;
      if (response.status !== 200) {
        setError(predictionResponse as ErrorResponse);
        return;
      }
      setPrediction(predictionResponse as Prediction);
      if (
        predictionResponse.status === "succeeded" ||
        predictionResponse.status === "failed"
      ) {
        setLoading(false);
        break;
      }
    }
  };
  return (
    <div className="hero h-96 bg-base-200">
      <div className="hero-content">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">
            Elevate Your Creative Workflow with AI
          </h1>
          <p className="py-6">
            Access Free Audio Samples, Lyrics, and Cover Art to Create,
            Collaborate, and Share
          </p>
          {loading ? (
            <button
              className="btn-disabled btn-primary btn w-40"
              onClick={(e) => void handleSubmit(e)}
            >
              Generate
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="mr-2 inline h-4 w-4 animate-spin fill-white text-gray-200 dark:text-gray-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
            </button>
          ) : (
            <>
              <button
                className="btn-primary btn w-40"
                onClick={(e) => void handleSubmit(e)}
              >
                Generate
              </button>
              {prediction && <audio src={typeof prediction?.output === "string" ? prediction?.output: ""} controls></audio>}
            </>
          )}
          {error && toast.error(JSON.stringify(error.detail))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
