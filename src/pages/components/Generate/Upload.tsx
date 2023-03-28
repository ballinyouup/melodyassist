import { Uploader } from "uploader";
import { UploadDropzone } from "react-uploader";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { useState } from "react";

const uploader = Uploader({ apiKey: "public_W142hjQDqcpCu1uvNU2x5MZsYokh" });

const Upload: React.FC = () => {
  const trpc = api.useContext();
  const [uploadComplete, setUploadComplete] = useState(false);

  const uploadFile = api.audio.createAudio.useMutation({
    onSuccess: async () => {
      await trpc.audio.getAudio.invalidate();
      toast.success("Successfully uploaded file");
      setUploadComplete(true); // set state to true after upload is complete
    },
  });

  return (
    <>
      {!uploadComplete && ( // only render the UploadDropzone if upload is not complete
        <UploadDropzone
          uploader={uploader}
          options={{
            multi: false,
            maxFileCount: 1,
            mimeTypes: ["audio/mpeg"],
            editor: { images: { crop: false } },
            layout: "modal",
            showRemoveButton: true,
            showFinishButton: true,
            maxFileSizeBytes: 5242880,
            styles: {
              colors: {
                primary: "#377dff",
              },
            },
          }}
          onComplete={(files) => {
            files.map((x) =>
              uploadFile.mutate({
                title: x.originalFile.originalFileName as string,
                content: x.originalFile.fileUrl.split("?")[0] as string,
              })
            );
            setUploadComplete(true);
          }}
          width={"100%"}
          height={"100%"}
          className="uploader rounded-lg bg-base-300"
        />
      )}
      {uploadComplete && <Upload />}
    </>
  );
};

export default Upload;
