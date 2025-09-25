import { RefObject, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";

type ConfirmDeleteProps = {
  isOpen: boolean;
  action: string;
  actionTitle: string;
  actionDescription: string;
  trigger?: React.ReactNode | string;
  onDelete: () => void;
  onCancel: () => void;
  onOpenChange: () => void;
};
const ConfirmDelete = ({
  isOpen,
  action,
  actionTitle,
  actionDescription,
  trigger,
  onDelete,
  onCancel,
  onOpenChange,
}: ConfirmDeleteProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const handleClose = () => {
    onCancel();
  };
  useOnClickOutside(ref as RefObject<HTMLElement>, handleClose);

  return (
    <>
      {trigger && (
        <button
          onClick={onOpenChange}
          className="px-2 py-[13.6px] font-bold text-[#ed4956] border-b dark:border-[#363636] border-solid"
        >
          {trigger}
        </button>
      )}

      {isOpen && (
        <div className="bg-black/50 fixed inset-0 z-[50] flex items-center justify-center">
          <div
            ref={ref}
            className="sm:max-w-[400px]  dark:!bg-[#262626] focus-visible:outline-none flex rounded-lg flex-col gap-y-0 border-none outline-none text-sm text-center"
          >
            <div className="mt-6 px-2 ">
              <h3 className="text-xl font-bold dark:text-white">
                {actionTitle}
              </h3>
              <p className="text-sm text-second-gray mt-1">
                {actionDescription}
              </p>
            </div>
            <button
              onClick={onDelete}
              className="px-2 py-[13.6px] mt-6 font-bold text-[#ed4956] border-y dark:border-[#363636] border-solid hover:bg-second-button-background transition-colors"
            >
              {action}
            </button>

            <button
              onClick={onCancel}
              className="px-2 py-[14px] hover:bg-second-button-background transition-colors rounded-b-lg"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmDelete;
