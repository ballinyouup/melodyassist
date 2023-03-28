// Installed by "react-uploader".
import { Uploader } from "uploader";
import { UploadDropzone } from "react-uploader";
import { api } from "~/utils/api";
//import { useState } from "react";
import toast from "react-hot-toast";

// Initialize once (at the start of your app).
const uploader = Uploader({ apiKey: "public_W142hjQDqcpCu1uvNU2x5MZsYokh" }); 

const Upload = () => {
  const trpc = api.useContext();
  const uploadFile = api.audio.createAudio.useMutation({
    onSuccess: async () => {
      await trpc.audio.getAudio.invalidate();
      toast.success("Successfully uploaded file");
    },
  });
  return (
    <UploadDropzone
      uploader={uploader}
      options={{
        multi: false,
        maxFileCount: 1,
        mimeTypes: ["audio/mpeg"],
        editor: { images: { crop: false } },
        layout: "modal",
        showFinishButton: true,
        styles: {
          colors: {
            primary: "#377dff",
          },
        },
      }}
      onComplete={(files) =>
        files.map((x) =>
          uploadFile.mutate({
            title: x.originalFile.originalFileName as string,
            content: x.originalFile.fileUrl.split("?")[0] as string,
          })
        )
      }
      width={"100%"}
      height={"100%"}
      className="uploader bg-base-300 rounded-lg"
    />
  );
};

export default Upload;
