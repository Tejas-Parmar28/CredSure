import { useState } from "react";
import NavBar from "../components/NavBar";
import { FaUser } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { ClipLoader, ScaleLoader } from "react-spinners";
import { FeaturedImageGallery } from "../components/Carousel";
import { SlCloudUpload } from "react-icons/sl";
import CanvasPage from "./CanvasPage";
import { RxCross2 } from "react-icons/rx";
import { BiSolidFilePdf } from "react-icons/bi";
import certificate from "../../blockchain/Certificate.json";

//toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";

import { useAtom } from "jotai";
import { hashAtom } from "../Atom/atom";

const UploadPage = () => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loader, setLoader] = useState(false);

  const [templateSelected, setTemplateSelected] = useState(false);

  const [download, setDownload] = useState(false);
  const [detailPopup, setDetailPopup] = useState(false);

  const [hash] = useAtom(hashAtom);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    handleFile(files[0]);
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    handleFile(files[0]);
  };

  const handleFile = (file) => {
    if (
      file &&
      (file.type === "image/png" || file.type === "application/pdf")
    ) {
      setSelectedFile(file);
    } else {
      alert("Please select a valid PNG or PDF file.");
    }
  };

  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [dropDown, setDropDown] = useState(false);

  //========== MetaMask Connect ========== //
  const [address, setAddress] = useState("");
  const [signer, setSigner] = useState(null);

  const metamaskConnect = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        setAddress(accounts[0]);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const connectedSigner = provider.getSigner();
        setSigner(connectedSigner);

        setIsWalletConnected(true);
      } else {
        alert("Please install MetaMask!");
      }
    } catch (err) {
      console.error(err);
      setIsWalletConnected(false);
    }
  };

  const metamaskDisconnect = () => {
    try {
      setIsWalletConnected(false);
      setAddress("");
    } catch (err) {
      console.log(err);
    }
  };

  // ========== IPFS Upload =========== //

  // TOASTIFY
  const notify = (message, type) => {
    toast(message, {
      type: type,
      position: "top-center",
      autoClose: 8000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };
  //======================== BLOCKCHAIN UPLOAD: ==============================//
  const [ipfs, setIpfs] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const RPC = import.meta.env.VITE_RPC_URL;
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  // const privateKey = import.meta.env.VITE_PRIVATE_KEY;
  const ABI = certificate.abi;

  const provider = new ethers.providers.JsonRpcProvider(RPC); //read
  // const wallet = new ethers.Wallet(privateKey, provider); //write

  async function AddCertificate({ uploadedIpfsHash }) {
    try {
      if (!signer) {
        notify("Please connect your wallet with MetaMask", "error");
        return;
      }

      const contract = new ethers.Contract(contractAddress, ABI, signer);

      const transactionData = await contract.populateTransaction.addCertificate(
        uploadedIpfsHash,
        name,
        description
      );

      const gasLimit = 200000;

      const transactionParameters = {
        to: contractAddress,
        gasLimit: ethers.utils.hexlify(gasLimit),
        data: transactionData.data,
      };

      const signedTransaction = await signer.sendTransaction(
        transactionParameters
      );

      notify("Certificate uploaded to blockchain", "success");

      setName("");
      setDescription("");
      setSelectedFile(null);
      setDetailPopup(false);
    } catch (error) {
      console.error(error);
      notify("Error uploading certificate to blockchain", "error");
    }
  }

  const handleIPFS = async (file) => {
    try {
      if (!file) {
        notify("Please select a file", "error");
        return null;
      }

      setIpfs(null);

      const fileData = new FormData();
      fileData.append("file", file);

      const pinResponse = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
            pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET,
          },
          body: fileData,
        }
      );

      const responseData = await pinResponse.json();
      const data = responseData.IpfsHash;

      console.log(responseData);

      if (responseData.isDuplicate) {
        notify("File with the same hash already exists on IPFS", "warning");
        return null;
      } else {
        const ipfsHash = responseData.IpfsHash;

        setIpfs(ipfsHash);

        notify("File uploaded to IPFS", "success");
        return data;
      }
    } catch (error) {
      console.error(error);
      notify("Error uploading to IPFS", "error");
      return null;
    }
  };

  const handleBlockchain = async (e) => {
    e.preventDefault();
    setLoader(true);

    try {
      const uploadedIpfsHash = await handleIPFS(selectedFile);

      if (uploadedIpfsHash !== null) {
        if (isWalletConnected) {
          await AddCertificate({ uploadedIpfsHash });
        } else {
          notify("Please connect your wallet with MetaMask", "error");
        }
      } else {
        notify("Error uploading to IPFS", "error");
      }
    } catch (error) {
      console.error(error);
      notify("Error uploading to IPFS", "error");
    } finally {
      setLoader(false);
    }
  };

  const handleBlockchainCanvas = async (e) => {
    e.preventDefault();
    setLoader(true);
    console.log(hash);
    console.log(name);
    console.log(description);

    try {
      const uploadedIpfsHash = hash;
      console.log(uploadedIpfsHash);

      if (uploadedIpfsHash !== null) {
        if (isWalletConnected) {
          await AddCertificate({ uploadedIpfsHash });
        } else {
          notify("Please connect your wallet with MetaMask", "error");
        }
      } else {
        notify("Error uploading to IPFS", "error");
      }
    } catch (error) {
      console.error(error);
      notify("Error uploading to IPFS", "error");
    } finally {
      setLoader(false);
    }
  };

  const handleUploadCanvas = () => {
    setDownload(true);
    setDetailPopup(true);
  };

  return (
    <div>
      {detailPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-white/20 z-50 flex items-center justify-center">
          <div className="popupContainer w-[36%] h-[50%] rounded-xl shadow-xl bg-dark flex flex-col">
            <div className="cross flex justify-between text-2xl text-light p-4">
              <div className="tempdiv ml-2">Enter details</div>
              <div className="">
                <RxCross2
                  onClick={() => setDetailPopup(false)}
                  className="cursor-pointer"
                />
              </div>
            </div>
            {/* ========================================= */}
            <div className="input px-16">
              {/* ============== Name input ======================= */}
              <div className="flex flex-col gap-y-1 mt-3">
                <label htmlFor="name" className="text-sm ml-1 font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter receiver's name"
                  className="w-full  rounded-md outline-none py-2 px-3 text-sm text-light bg-activeNav font-light "
                />
              </div>
              {/* ============== Description input ======================= */}
              <div className="flex flex-col gap-y-1 mt-6">
                <label
                  htmlFor="description"
                  className="text-sm ml-1 font-medium"
                >
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                  className="w-full  rounded-md outline-none py-2 px-3 text-sm text-light bg-activeNav font-light"
                />
              </div>
              <button
                onClick={handleBlockchainCanvas}
                className="text-sm font-bold my-10 w-full bg-blue-200 text-white py-4 rounded-lg hover:bg-green-600"
              >
                {loader ? <ClipLoader size={18} color="white" /> : "UPLOAD"}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="sm:flex gap-x-8  w-full gap-y-3 font-int">
        <NavBar templateSelected={templateSelected} />
        <div className="right flex w-full flex-col justify-between">
          <div className="upperNav w-full flex md:mb-0 mb-6 items-center justify-end h-[10vh] md:w-[74vw] bg-dark rounded-xl px-8">
            {isWalletConnected ? (
              <>
                {templateSelected == true && (
                  <div
                    onClick={handleUploadCanvas}
                    className="saveBtn mr-6 cursor-pointer text-blue-200 hover:bg-blue-200 hover:dark duration-300 hover:text-dark bg-transparent border border-blue-200 rounded-full  px-4 py-3"
                  >
                    Save & Upload
                  </div>
                )}

                <div className="flex flex-col">
                  <div
                    className={`relative w-[12rem] flex items-center justify-between bg-overlay h-12  ${
                      dropDown == true ? "rounded-t-xl" : "rounded-full"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="profile w-10 h-10 ml-1 bg-overlayLight rounded-full flex items-center justify-center">
                        <FaUser className="text-lg" />
                      </div>

                      <div className="font-oswald ml-2 overflow-hidden whitespace-nowrap max-w-[5.5rem] truncate">
                        {address}
                      </div>
                    </div>
                    <div
                      className="dropdown cursor-pointer mx-4 text-xl"
                      onClick={() => setDropDown(!dropDown)}
                    >
                      {dropDown == false ? (
                        <IoIosArrowDown />
                      ) : (
                        <IoIosArrowUp />
                      )}
                    </div>
                    {dropDown && (
                      <div
                        style={{ zIndex: 999 }}
                        className="dropdown absolute w-full bg-overlay rounded-b-xl top-12 "
                      >
                        <div className="items mt-3">
                          <div className="splitter h-[0.5px] w-full bg-overlayLight"></div>
                          <div className="changeWallet px-3 py-3 hover:bg-blue-200 hover:text-dark cursor-pointer duration-300 ">
                            Change account
                          </div>
                          <div className="splitter h-[0.5px] w-full bg-overlayLight"></div>
                          <div
                            onClick={metamaskDisconnect}
                            className="Logout px-3 py-3  hover:bg-blue hover:text-dark cursor-pointer rounded-b-xl duration-300"
                          >
                            Logout
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div onClick={metamaskConnect} className="">
                <button className="px-4 py-2 border border-blue-200 hover:bg-blue-200 hover:text-dark font-semibold  transition-all duration-300 text-blue-200 rounded-lg">
                  Connect
                </button>
              </div>
            )}
          </div>
          {templateSelected == false ? (
            <>
              {isWalletConnected == false && (
                <div className="body w-full h-[74vh] md:w-[74vw] bg-dark rounded-xl px-8 flex flex-col items-center justify-center text-3xl gap-y-2">
                  <span>Connect your wallet</span>
                  <span className="text-xl">To upload the certificate</span>
                  <ScaleLoader color="#52ABD8" className="mt-4" />
                </div>
              )}

              {isWalletConnected == true && (
                <div className=" flex flex-col md:flex-row justify-between">
                  <div className="hidden md:flex h-[74vh] md:w-[42vw] w-full bg-dark rounded-xl px-8  gap-x-2  text-3xl gap-y-2">
                    <div className="templateSelector flex flex-col w-full">
                      <div className="flex justify-between">
                        <div className="heading my-6 text-xl">
                          Select a template
                        </div>
                        <button
                          onClick={() => setTemplateSelected(true)}
                          className="text-sm font-bold text-blue-200 hover:text-dark hover:bg-blue-200 duration-300 px-4 py-1 border border-blue-200 my-4 rounded-lg"
                        >
                          Select
                        </button>
                      </div>
                      <FeaturedImageGallery />
                    </div>
                  </div>
                  <div className="body h-[74vh] md:w-[30vw] w-full my-4 md:my-0 bg-dark rounded-xl px-8 flex  flex-col gap-x-2  text-3xl gap-y-2">
                    <div className="heading text-lg mt-5 mb-2">
                      Else upload your certificate
                    </div>
                    {/* =========================== FILE UPLOAD  ============================= */}
                    <div
                      className={`flex relative justify-center items-center w-full h-52 border-2 ${
                        isDragActive ? "border" : "border-dashed"
                      }  rounded-lg p-5
                ${
                  isDragActive ? "bg-sky-50 border-sky-400" : "border-gray-300"
                }`}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                    >
                      <label
                        htmlFor="fileInput"
                        className={`text-sm ${
                          isDragActive ? "text-sky-800" : "text-gray-400"
                        }`}
                      >
                        {isDragActive
                          ? "Leave Your File Here"
                          : selectedFile == null && (
                              <div className="flex flex-col gap-y-2">
                                <SlCloudUpload className="text-6xl text-gray-400 mx-auto" />
                                <span className="text-xl text-center">
                                  Drag and drop or&nbsp;
                                  <span className="text-blue-200 hover:underline cursor-pointer">
                                    Browse
                                  </span>
                                </span>
                                <span className="text-[11px] font-thin text-center text-overlay  text-gray-400">
                                  Supported formats: png/pdf
                                </span>
                              </div>
                            )}
                      </label>
                      <input
                        type="file"
                        id="fileInput"
                        className="hidden"
                        onChange={handleFileInputChange}
                      />

                      {selectedFile && (
                        <div className="mt-3">
                          <div
                            onClick={() => setSelectedFile(null)}
                            className="absolute top-0 right-0 mt-3 mr-4 cursor-pointer"
                          >
                            <RxCross2 className="text-2xl" />
                          </div>
                          {selectedFile.type === "image/png" ? (
                            <img
                              src={URL.createObjectURL(selectedFile)}
                              alt={selectedFile.name}
                              className="max-h-32 mx-auto mb-2"
                            />
                          ) : selectedFile.type === "application/pdf" ? (
                            <div className="flex flex-col items-center">
                              <BiSolidFilePdf className="text-6xl text-red-500 mx-auto" />
                            </div>
                          ) : null}
                          <p className=" text-gray-700 mx-auto text-center text-xs mt-4">
                            {selectedFile.name}
                          </p>
                        </div>
                      )}
                    </div>
                    {/* ======================================================== */}

                    {/* ===================== Name input ======================= */}
                    <div className="flex flex-col gap-y-1 mt-3">
                      <label
                        htmlFor="name"
                        className="text-sm ml-1 font-medium"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Enter receiver's name"
                        className="w-full  rounded-md outline-none py-2 px-3 text-sm text-light bg-activeNav font-light "
                      />
                    </div>
                    {/* ============== Description input ======================= */}
                    <div className="flex flex-col gap-y-1 mt-2">
                      <label
                        htmlFor="description"
                        className="text-sm ml-1 font-medium"
                      >
                        Description
                      </label>
                      <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter description"
                        className="w-full  rounded-md outline-none py-2 px-3 text-sm text-light bg-activeNav font-light"
                      />
                    </div>
                    <button
                      onClick={handleBlockchain}
                      className="text-sm font-bold my-6 w-full bg-blue-200 text-white py-4 rounded-lg transition-all duration-300 hover:bg-blue-600"
                    >
                      {loader ? (
                        <ClipLoader size={18} color="white" />
                      ) : (
                        "UPLOAD"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <CanvasPage download={download} setDownload={setDownload} />
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UploadPage;
