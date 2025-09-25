import { PreviewMediaPost } from "./PreviewMediaPost";
import StepControl from "./StepControl";
import { Media } from "./type";

type PreviewPostProps = {
  step: number;
  imageUrls: Media[];
  onSetStep: (step: number) => void;
  onSetFiles: (files: FileList | null) => void;
};
const PreviewPost = ({
  step,
  onSetStep,
  imageUrls,
  onSetFiles,
}: PreviewPostProps) => {
  return (
    <div className="w-full md:max-w-[400px]  ">
      {imageUrls.length > 0 && (
        <StepControl
          step={step}
          title="Preview"
          onSetStep={onSetStep}
          onSetFiles={onSetFiles}
        ></StepControl>
      )}
      <PreviewMediaPost imageUrls={imageUrls} onSetStep={onSetStep} />
    </div>
  );
};

export default PreviewPost;
