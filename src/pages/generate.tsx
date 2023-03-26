/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import Layout from "./Layout";
import { signIn, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import Head from "next/head";
import AudioPlayer from "./components/Home/AudioPlayer";
import AudioPlayerDisabled from "./components/Home/AudioPlayerDisabled";
import toast from "react-hot-toast";

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
      void signIn(undefined, { redirect: true, callbackUrl: "/generate" });
    },
  });
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const trpc = api.useContext();
  const [volume, setVolume] = useState<number>(80);
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
      refetchInterval: timer < 6 ? 1000 : 2000, // Fetch every 2 seconds
      enabled: audioLoading,
    }
  );

  const { mutate: createAudio } = api.audio.createAudio.useMutation({
    onError: () => {
      toast.error("Error Generating Audio");
    },
    onSuccess: async () => {
      await trpc.audio.getAudio.invalidate();
      toast.success("Successfully Generated Audio");
    },
    onSettled: () => {
      setLoading(false);
      setAudioLoading(false);
    },
  });
  const { mutate: deleteAllAudio } = api.audio.deleteAllAudio.useMutation({
    onSuccess: async () => {
      await trpc.audio.getAudio.invalidate();
      toast.success("Successfully deleted all audio");
    },
    onSettled: () => setDeleteLoading(false),
  });

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    setTimer(0);
    setLoading(true);
    setPrediction(firstData);
  };

  const handleDelete = () => {
    setDeleteLoading(true);
    deleteAllAudio();
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value));
  };

  useEffect(() => {
    void trpc.invalidate();
  }, [trpc]);

  useEffect(() => {
    if (audio && (audio.status === "succeeded" || audio.status === "failed")) {
      setPrediction(audio);
    }
  }, [audio]);

  useEffect(() => {
    const seed = prediction?.logs?.split(" ")[2]?.split("ffmpeg")[0];
    if (typeof seed === "string" && typeof prediction?.output === "string") {
      createAudio({
        title: seed,
        content: prediction?.output,
      });
    }
    return setPrediction(undefined);
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
    return (
      <div className="h-screen w-full" data-theme="winter">
        <input type="checkbox" id="my-modal-4" className="modal-toggle" />
        <label htmlFor="my-modal-4" className="modal cursor-pointer">
          <label
            className="modal-box relative flex w-fit flex-col items-center"
            htmlFor=""
          >
            <p className="pt-2">Are you sure you want to delete all audio?</p>
            <span className="py-2">
              <i>* Warning Audio cannot be recovered *</i>
            </span>
            <button className="btn-error btn-sm btn">Delete All Audio</button>
          </label>
        </label>
        <div
          className="flex h-screen w-full flex-col items-center text-neutral"
          data-theme="winter"
        >
          <Head>
            <title>Melody Assist</title>
            <meta name="description" content="Level up your Music with AI" />
            <link rel="icon" href="/logo-dark.png" />
          </Head>
          <div className="flex w-full max-w-md flex-col items-start gap-5 rounded-lg bg-base-300 p-4 text-base-content sm:p-12">
            <div className="flex flex-col">
              <span className="text-lg font-bold">Time Elapsed: 0</span>
            </div>
            <button className="btn-primary btn flex w-full items-center justify-center gap-4 md:max-w-sm">
              <span>Generate</span>
            </button>
          </div>
          <div className="mt-2 mb-5 flex w-full max-w-md flex-col gap-2">
            <div className="alert flex w-full flex-row flex-wrap items-center justify-center shadow-lg sm:w-full">
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
                <span className="text-base-content">
                  Audio Deletes after 1 hour.
                </span>
              </div>
              <div>
                <label
                  htmlFor="my-modal-4"
                  className="btn-primary btn-sm btn w-full"
                >
                  Delete All Audio
                </label>
              </div>
            </div>
            <div className="flex w-full flex-row items-center gap-4 rounded-xl p-3">
              <button
                className="invert"
                onClick={() => setVolume(volume === 0 ? 70 : 0)}
              >
                {volume === 0 ? (
                  <img
                    src="volume-mute.png"
                    alt="volume muted"
                    className="w-7"
                  />
                ) : (
                  <img src="audio.png" alt="audio button" className="w-8" />
                )}
              </button>
              <div className="w-full max-w-md">
                <div
                  className="tooltip tooltip-bottom tooltip-primary w-full"
                  data-tip={volume}
                >
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    className="range range-xs w-full"
                    onChange={handleVolumeChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label htmlFor="my-modal-4" className="modal cursor-pointer">
        <label
          className="modal-box relative flex w-fit flex-col items-center"
          htmlFor=""
        >
          <p className="pt-2">Are you sure you want to delete all audio?</p>
          <span className="py-2">
            <i>* Warning Audio cannot be recovered *</i>
          </span>
          <button
            className="btn-error btn-sm btn"
            disabled={deleteLoading}
            onClick={handleDelete}
          >
            Delete All Audio
            {deleteLoading && (
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
        </label>
      </label>
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
        <div className="flex w-full max-w-md flex-col items-start gap-5 rounded-lg bg-base-300 p-4 text-base-content sm:p-12">
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
                  System booting up. System takes around 3-5 minutes to boot.
                </span>
              </div>
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-lg font-bold">Time Elapsed: {timer}</span>
          </div>
          <button
            className="btn-primary btn flex w-full items-center justify-center gap-4 md:max-w-sm"
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
        <div className="mt-2 mb-5 flex w-full max-w-md flex-col gap-2">
          <div className="alert flex w-full flex-row flex-wrap items-center justify-center shadow-lg sm:w-full">
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
              <span className="text-base-content">
                Audio Deletes after 1 hour.
              </span>
            </div>
            <div>
              <label
                htmlFor="my-modal-4"
                className="btn-primary btn-sm btn w-full"
              >
                Delete All Audio
              </label>
            </div>
          </div>
          <div className="flex w-full flex-row items-center gap-4 rounded-xl p-3">
            <button
              className={userData.data?.theme === "night" ? "" : "invert"}
              onClick={() => setVolume(volume === 0 ? 70 : 0)}
            >
              {volume === 0 ? (
                <img src="volume-mute.png" alt="volume muted" className="w-7" />
              ) : (
                <img src="audio.png" alt="audio button" className="w-8" />
              )}
            </button>
            <div className="w-full max-w-md">
              <div
                className="tooltip tooltip-bottom tooltip-primary w-full"
                data-tip={volume}
              >
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  className="range range-xs w-full"
                  onChange={handleVolumeChange}
                />
              </div>
            </div>
          </div>
          <div className="relative h-[520px] gap-1 overflow-y-auto rounded-xl bg-base-300 p-1">
            {(userAudios?.posts?.length as number) > 0 &&
              userAudios?.posts.map((post) => {
                return (
                  <div key={post.id}>
                    {Date.now() - post.createdAt.getMilliseconds() > 3600000 ? (
                      <AudioPlayer
                        generatePage
                        url={post.content}
                        title={post.title}
                        createdAt={`Created At: ${post.createdAt.toLocaleDateString()} ${post.createdAt.toLocaleTimeString()}`}
                        volume={volume}
                      />
                    ) : (
                      <AudioPlayerDisabled
                        title={post.title}
                        audioId={post.id}
                      />
                    )}
                  </div>
                );
              })}
            {(userAudios?.posts?.length as number) === 0 && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl text-neutral-content">
                <i>Empty</i>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout(Generate);
