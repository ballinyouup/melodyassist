import { useEffect, useState } from "react";
import Layout from "./Layout";
import { signIn, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import Head from "next/head";
import AudioPlayer from "./components/Home/AudioPlayer";

interface Prediction {
  completed_at?: string | null;
  created_at?: string;
  error?: string | null;
  id?: string;
  input?: { seed: string };
  logs?: string | null;
  metrics?: { [key: string]: string };
  output?: string | null;
  started_at?: string | null;
  status?: string;
  version?: string;
}

const Generate = () => {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      void signIn(undefined, { redirect: true, callbackUrl: "/" });
    },
  });
  const trpc = api.useContext();
  const { mutate: createAudio } = api.audio.createAudio.useMutation({
    onSuccess: () => {
      void trpc.audio.getAudio.invalidate();
      setPrediction(undefined);
    },
  });
  const { data: userAudios } = api.audio.getAudio.useQuery();
  const [timer, setTimer] = useState<number>(0);
  const [prediction, setPrediction] = useState<Prediction | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const userData = api.account.getUserData.useQuery();
  const [audioLoading, setAudioLoading] = useState<boolean>(false);
  const { data: firstData } = api.audio.getPrediction.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchInterval: 0,
    refetchOnMount: false,
    enabled: loading,
    onSuccess: () => {
      setLoading(false);
      setAudioLoading(true);
    },
  });
  const { data: audio } = api.audio.getPredictionData.useQuery(
    firstData?.id ?? "",
    {
      refetchOnWindowFocus: false,
      refetchInterval: 2000, // Fetch every 2 seconds
      enabled: audioLoading,
    }
  );

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    setTimer(0);
    setLoading(true);
    setPrediction(firstData);
  };

  useEffect(() => {
    if (audio && (audio.status === "succeeded" || audio.status === "failed")) {
      setLoading(false);
      setPrediction(audio);
      setAudioLoading(false);
    }
  }, [audio]);

  useEffect(() => {
    const seed = prediction?.logs?.split(" ")[2]?.split("ffmpeg")[0];
    if (typeof seed === "string" && typeof prediction?.output === "string") {
      createAudio({
        title: seed,
        content: prediction.output,
      });
    }
  }, [createAudio, prediction]);

  useEffect(() => {
    let intervalId: NodeJS.Timer | undefined;
    if (loading === true || audioLoading == true) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [audioLoading, loading, timer]);

  if (status === "loading") {
    return <>Loading...</>;
  }

  return (
    <>
      <div
        className="flex h-full w-full flex-col items-center text-neutral"
        data-theme={userData.data?.theme}
      >
        <Head>
          <title>Melody Assist</title>
          <meta name="description" content="Level up your Music with AI" />
          {userData.data?.theme === "winter" ? (
            <link rel="icon" href="/logo-dark.png" />
          ) : (
            <link rel="icon" href="/logo-light.png" />
          )}
        </Head>
        <div className="flex w-full max-w-md flex-col items-start gap-5 rounded-lg bg-gray-300 p-12">
          {timer > 5 && (
            <div className="alert w-fit shadow-lg">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="h-6 w-6 flex-shrink-0 stroke-info"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>
                  System booting up. System takes around 3 minutes to boot.
                </span>
              </div>
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-lg font-bold">Time Elapsed: {timer}</span>
          </div>
          <button
            className="btn-primary btn flex w-full max-w-sm items-center justify-center gap-4"
            disabled={audioLoading || loading}
            onClick={(e) => void handleSubmit(e)}
          >
            <span>Generate</span>
            {(loading || audioLoading) && (
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
            )}
          </button>
        </div>
        <div className="mt-20">
          {userAudios?.map((userAudio) => {
            return userAudio.posts.map((post) => (
              <div key={post.title}>
                <AudioPlayer
                  url={post.content}
                  title={post.title}
                  volume={80}
                />
              </div>
            ));
          })}
        </div>
      </div>
    </>
  );
};

export default Layout(Generate);
