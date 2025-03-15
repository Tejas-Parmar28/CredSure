import {
  Drawer,
  Button,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";

const TextDrawer = ({ openText, setOpenText }) => {
  const [localOpenText, setLocalOpenText] = useState(openText);

  useEffect(() => {
    setLocalOpenText(openText);
  }, [openText]);

  const handleClose = () => {
    setLocalOpenText(false);

    setTimeout(() => {
      setOpenText(false);
    }, 300);
  };

  return (
    <Drawer
      className="overflow-scroll scrollbar"
      placement="right"
      open={localOpenText}
      onClose={handleClose}
    >
      <div className="flex items-center justify-between px-4 pb-2">
        <Typography variant="h5" color="blue-gray">
          Text
        </Typography>
        <IconButton variant="text" color="blue-gray" onClick={handleClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </IconButton>
      </div>

      <form className="flex flex-col gap-6 p-4">
        <Button>Add Text</Button>
        <div className="inputBox my-4">
          <input
            type="text"
            placeholder="First name"
            className="border w-full px-3 py-4 rounded-lg outline-none text-dark"
          />
        </div>
      </form>
    </Drawer>
  );
};

export default TextDrawer;
