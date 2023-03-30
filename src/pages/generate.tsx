/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import Layout from "./Layout";
import { signIn, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import Head from "next/head";
import AudioPlayer from "./components/Home/AudioPlayer";
import toast from "react-hot-toast";
import Upload from "./components/Generate/Upload";
import { Poppins } from "next/font/google";

interface UploadResponse {
  accountId: string;
  filePath: string;
  fileUrl: string;
}

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const Generate = () => {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      void signIn(undefined, { redirect: true, callbackUrl: "/generate" });
    },
  });
  const [faviconTheme, setFaviconTheme] = useState(false);
  const trpc = api.useContext();
  const [volume, setVolume] = useState<number>(80);
  const { data: userAudios } = api.audio.getAudio.useQuery(undefined, {
    queryKey: ["audio.getAudio", undefined],
  });
  const [timer, setTimer] = useState<number>(0);
  const [uploadData, setUploadData] = useState<UploadResponse | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const userData = api.account.getUserData.useQuery(undefined, {
    queryKey: ["account.getUserData", undefined],
  });
  const [audioLoading, setAudioLoading] = useState<boolean>(false);
  const { data: firstData } = api.audio.getPrediction.useQuery(undefined, {
    queryKey: ["audio.getPrediction", undefined],
  });
  const { data: audio } = api.audio.getPredictionData.useQuery(
    firstData?.id ?? "",
    {
      queryKey: ["audio.getPredictionData", firstData?.id ?? ""],
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
      setLoading(false);
      setAudioLoading(false);
    },
    onSettled: () => {
      setLoading(false);
      setAudioLoading(false);
    },
  });

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    setTimer(0);
    setLoading(true);
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value));
  };

  useEffect(() => {
    void trpc.invalidate();
  }, [trpc]);

  useEffect(() => {
    if (
      typeof audio === "object" &&
      audio !== null &&
      "accountId" in audio &&
      "filePath" in audio &&
      "fileUrl" in audio
    ) {
      setUploadData(audio);
    }
  }, [audio, uploadData]);

  useEffect(() => {
    if (uploadData && uploadData.fileUrl && uploadData.fileUrl) {
      createAudio({
        title: uploadData.filePath.split("/")[5] as string,
        content: uploadData.fileUrl,
      });
    }
    return setUploadData(undefined);
  }, [createAudio, uploadData]);

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

  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setFaviconTheme(true);
    } else {
      setFaviconTheme(false);
    }
  }, []);

  if (status === "loading") {
    return (
      <div className="h-screen w-full">
        <div
          role="status"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <svg
            aria-hidden="true"
            className="inline h-12 w-12 animate-spin fill-white text-gray-200 dark:text-gray-600"
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
      </div>
    );
  }

  return (
    <div className={`h-full w-full ${poppins.className}`}>
      <div className="flex flex-col items-center justify-center gap-2 md:flex-row md:flex-wrap md:items-start">
        <Upload />
        <div className="flex h-full w-full flex-col items-center text-neutral md:max-w-lg">
          <Head>
            <title>Melody Assist</title>
            <meta name="description" content="Level up your Music with AI" />
            {faviconTheme ? (
              <link rel="icon" href="/logo-dark.png" />
            ) : (
              <link rel="icon" href="/logo-light.png" />
            )}
          </Head>
          <div className="flex w-full flex-col items-start gap-5 rounded-lg bg-base-300 p-4 text-base-content sm:p-12">
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
          <div className="mt-2 mb-5 flex w-full flex-col gap-2">
            <div className="flex w-full flex-row items-center gap-4 rounded-xl bg-base-300 p-3">
              <button
                className={userData.data?.theme === "night" ? "" : "invert"}
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
            <div className="relative h-[520px] gap-1 overflow-y-auto rounded-xl bg-base-300 p-1">
              {(userAudios?.posts?.length as number) > 0 ? (
                userAudios?.posts.map((post) => {
                  return (
                    <div key={post.id}>
                      <AudioPlayer
                        url={post.content}
                        title={post.title}
                        createdAt={`${post.createdAt.toLocaleDateString()} ${post.createdAt.toLocaleTimeString()}`}
                        volume={volume}
                        audioId={post.id}
                        userImage={post.author.image as string}
                        userName={post.author.userName}
                      />
                    </div>
                  );
                })
              ) : (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl text-neutral-content">
                  <i>Empty</i>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout(Generate);
