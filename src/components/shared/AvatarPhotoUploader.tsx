import React, { useEffect } from "react";

export interface PreviewFile extends File {
  preview?: any;
}
interface AvatarPhotoUploaderProps {
  name?: string;
  file?: PreviewFile;
  defaultImg?: any;
  handleFile: (file: PreviewFile, fileWithoutPreview: File) => void;
  className?: string;
}
// should be used in a Formik Form
const AvatarPhotoUploader: React.FC<AvatarPhotoUploaderProps> = ({
  name,
  file,
  defaultImg,
  handleFile,
  className,
}) => {


  const handleDrop = (e: React.DragEvent<HTMLInputElement>) => {
    const { files } = e.currentTarget;
    if (files) {
        try{
            handleFile({ ...files[0], preview: URL.createObjectURL(files[0])}, files[0]);
        }catch (err){
            alert('Something went wrong')
        }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
        try{
            handleFile({ ...files[0], preview: URL.createObjectURL(files[0])}, files[0])
        }catch (err){
            alert('Something went wrong')
        }
    }
  }

  useEffect(() => {
      // revoke data uris
      file && URL.revokeObjectURL(file.preview);
  }, [file])


  return (
    <div
      className={`w-24 h-24 relative rounded-3xl overflow-hidden ${className}`}
    >
      <div className="flex absolute w-full h-full text-center rounded-3xl bg-gray-400 opacity-0 transform scale-50 transition-transform duration-200 cursor-pointer hover:scale-100 hover:opacity-100">
        <input
          className="w-full h-full absolute opacity-0 z-10"
          type="file"
          name={name}
          accept="images/*"
          onChange={handleChange}
          onDrop={handleDrop}
        />
        <p className="m-auto text-white">Change Photo</p>
      </div>

      <img
        className="object-cover z-0 w-full"
        src={file ? file.preview : defaultImg}
        alt="user"
      />
    </div>
  );
};

export default AvatarPhotoUploader;
