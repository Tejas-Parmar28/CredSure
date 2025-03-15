import {
  Drawer,
  Button,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";

import { useAtom } from "jotai";
import { logoItems } from "../../Atom/atom";

const LogoDrawer = ({ openLogo, setOpenLogo }) => {
  const [localOpenText, setLocalOpenText] = useState(openLogo);
  const [items, setItems] = useAtom(logoItems);

  useEffect(() => {
    setLocalOpenText(openLogo);
  }, [openLogo]);

  const handleClose = () => {
    setLocalOpenText(false);

    setTimeout(() => {
      setOpenLogo(false);
    }, 300);
  };

  const handleLogoUpload = (url) => () => {
    setItems([...items, url]);
    handleClose();
  };

  const medal1 =
    "https://assets-global.website-files.com/64c4b66a44c38c5fa4309e5a/65ca24e1c7ed3f25a75f8e39_medal.png";

  return (
    <div className="scrollbar">
      <Drawer
        className="overflow-scroll "
        placement="right"
        open={localOpenText}
        onClose={handleClose}
      >
        <div className="flex items-center justify-between px-4 pb-2">
          <Typography variant="h5" color="blue-gray">
            Select element
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
        <div className="px-3 flex flex-col gap-y-4 mx-auto">
          <img
            onClick={handleLogoUpload(
              "https://assets-global.website-files.com/64c4b66a44c38c5fa4309e5a/65ca24e1c7ed3f25a75f8e39_medal.png"
            )}
            className="rounded-md cursor-pointer"
            src="https://assets-global.website-files.com/64c4b66a44c38c5fa4309e5a/65ca24e1c7ed3f25a75f8e39_medal.png"
            alt=""
          />
          <img
            onClick={handleLogoUpload(
              "https://assets-global.website-files.com/64c4b66a44c38c5fa4309e5a/65ca28702899c8873f4b70a8_1.png  "
            )}
            className="rounded-md cursor-pointer"
            src=" https://assets-global.website-files.com/64c4b66a44c38c5fa4309e5a/65ca28702899c8873f4b70a8_1.png "
            alt=""
          />

          <img
            onClick={handleLogoUpload(
              " https://assets-global.website-files.com/64c4b66a44c38c5fa4309e5a/65ca28720dac03909b07c700_9.png "
            )}
            className="rounded-md cursor-pointer"
            src="https://assets-global.website-files.com/64c4b66a44c38c5fa4309e5a/65ca28720dac03909b07c700_9.png  "
            alt=""
          />

          <img
            onClick={handleLogoUpload(
              " https://assets-global.website-files.com/64c4b66a44c38c5fa4309e5a/65ca287053167a5fdb292a02_2.png "
            )}
            className="rounded-md cursor-pointer"
            src=" https://assets-global.website-files.com/64c4b66a44c38c5fa4309e5a/65ca287053167a5fdb292a02_2.png "
            alt=""
          />
          <img
            onClick={handleLogoUpload(
              " https://assets-global.website-files.com/64c4b66a44c38c5fa4309e5a/65ca2870abb87719f1f748f1_3.png "
            )}
            className="rounded-md cursor-pointer"
            src="https://assets-global.website-files.com/64c4b66a44c38c5fa4309e5a/65ca2870abb87719f1f748f1_3.png  "
            alt=""
          />
          <img
            onClick={handleLogoUpload(
              " https://assets-global.website-files.com/64c4b66a44c38c5fa4309e5a/65ca28702ddfdc2f0dfd4d3c_4.png "
            )}
            className="rounded-md cursor-pointer"
            src=" https://assets-global.website-files.com/64c4b66a44c38c5fa4309e5a/65ca28702ddfdc2f0dfd4d3c_4.png "
            alt=""
          />
          <img
            onClick={handleLogoUpload(
              "https://assets-global.website-files.com/64c4b66a44c38c5fa4309e5a/65ca287327a94379fb1b1117_ribon3-removebg-preview.png  "
            )}
            className="rounded-md cursor-pointer"
            src=" https://assets-global.website-files.com/64c4b66a44c38c5fa4309e5a/65ca287327a94379fb1b1117_ribon3-removebg-preview.png "
            alt=""
          />
          <img
            onClick={handleLogoUpload(
              " https://assets-global.website-files.com/64c4b66a44c38c5fa4309e5a/65ca2872b3fbb4c95432384e_10.png "
            )}
            className="rounded-md cursor-pointer"
            src="  https://assets-global.website-files.com/64c4b66a44c38c5fa4309e5a/65ca2872b3fbb4c95432384e_10.png"
            alt=""
          />
          <img
            onClick={handleLogoUpload(
              " https://assets-global.website-files.com/64c4b66a44c38c5fa4309e5a/65ca2871c0458e2f7867f154_7.png "
            )}
            className="rounded-md cursor-pointer"
            src=" https://assets-global.website-files.com/64c4b66a44c38c5fa4309e5a/65ca2871c0458e2f7867f154_7.png "
            alt=""
          />
          <img
            onClick={handleLogoUpload(
              " https://assets-global.website-files.com/64c4b66a44c38c5fa4309e5a/65ca2871fbd9a7a57f6ded2b_8.png "
            )}
            className="rounded-md cursor-pointer"
            src=" https://assets-global.website-files.com/64c4b66a44c38c5fa4309e5a/65ca2871fbd9a7a57f6ded2b_8.png "
            alt=""
          />
          <img
            onClick={handleLogoUpload(
              " https://assets-global.website-files.com/64c4b66a44c38c5fa4309e5a/65ca2871ee5183efd95ea96b_5.png "
            )}
            className="rounded-md cursor-pointer"
            src="  https://assets-global.website-files.com/64c4b66a44c38c5fa4309e5a/65ca2871ee5183efd95ea96b_5.png"
            alt=""
          />
        </div>
      </Drawer>
    </div>
  );
};

export default LogoDrawer;
