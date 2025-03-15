import { useState } from "react";
import NavBar from "../components/NavBar";
import { SlCloudUpload } from "react-icons/sl";
import { RxCross2 } from "react-icons/rx";
import { BiSolidFilePdf } from "react-icons/bi";
import { ethers } from "ethers";
import certificate from "../../blockchain/Certificate.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader, RingLoader } from "react-spinners";
import { format } from "date-fns";

const VerifyPage = () => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fakeCert, setFakeCert] = useState(false);

  const RPC = import.meta.env.VITE_RPC_URL;
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const ABI = certificate.abi;

  const [ipfsHash, setIpfsHash] = useState("");
  const [certificateData, setCertificateData] = useState(null);

  const fetchCertificateData = async ({ ipfsHesh }) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(RPC);
      const contract = new ethers.Contract(contractAddress, ABI, provider);

      const result = await contract.getCertificate(ipfsHesh);

      if (result[0].length > 0) {
        setIsLoading(false);
        setIsVerified(true);
        setFakeCert(false);

        const data = {
          name: result[0],
          description: result[1],
          sender: result[2],
          timestamp: result[3].toNumber(),
        };

        setCertificateData(data);

        return data;
      } else {
        setIsLoading(false);
        setFakeCert(true);
        setCertificateData(null);
        console.log("Certificate not found");
      }
    } catch (error) {
      setIsLoading(false);
      setFakeCert(true);
      setCertificateData(null);
      console.log("Error fetching certificate data", error);
    }
  };

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

  const fetchData = async () => {
    setIsLoading(true);
    const ipfsHesh = await handleIPFS(selectedFile);
    const data = await fetchCertificateData({ ipfsHesh });
    setIpfsHash(ipfsHesh);
    setCertificateData(data);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setCertificateData(null);
    setIsVerified(false);
  };

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
  // =================================================================

  const handleIPFS = async (file) => {
    try {
      if (!file) {
        notify("Please select a file", "error");
        return null;
      }

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

      if (responseData.isDuplicate) {
        notify("File exists on IPFS", "success");
        return data;
      } else {
        notify("File does not exist on ipfs", "warning");
        return data;
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      notify("Error uploading to IPFS", "error");
      return null;
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-x-8">
        <NavBar templateSelected={false} />
        <div className="right flex flex-col md:flex-row justify-between gap-x-[2vw]">
          <div className="body w-full h-[88vh] md:w-[30vw] bg-dark rounded-xl p-8">
            <div className="title text-xl font-medium mb-12 mt-4 text-center">
              Upload your certificate to verify
            </div>
            <div
              className={`flex relative justify-center items-center w-full h-64 border-2 ${
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
                    onClick={handleReset}
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
            <button
              onClick={fetchData}
              className="text-sm font-bold mt-8 w-full bg-blue-200 duration-300 transition-all text-white py-4 rounded-lg hover:bg-blue-600"
            >
              {isLoading ? <ClipLoader size={18} color="white" /> : "Verify"}
            </button>
          </div>

          {/* ================================================================= */}

          <div className="body w-full h-[88vh] md:w-[42vw] my-4 md:my-0 bg-dark rounded-xl px-8">
            {selectedFile == null && (
              <div className="notConnected flex flex-col w-full h-[88vh] items-center justify-center ">
                <span className="text-3xl text-center">
                  Upload Required to Proceed
                </span>

                {isLoading ? (
                  <ClipLoader color="#52abd8" className="mt-6" />
                ) : (
                  <RingLoader color="#52abd8" className="mt-6" />
                )}
              </div>
            )}
            {selectedFile && certificateData === null && (
              <>
                {isLoading ? (
                  <div className="flex flex-col h-full justify-center items-center text-2xl">
                    Fetching Certificate Data ...
                    <ClipLoader color="#52ABD8" className="mt-6" />
                  </div>
                ) : (
                  <div className="flex flex-col h-full justify-center items-center text-2xl gap-y-2">
                    <h1> Proceed for Validation</h1>
                    <h1>
                      Click on <span className="text-blue-200">Verify</span> button
                    </h1>
                  </div>
                )}
              </>
            )}
            {selectedFile && certificateData !== null && (
              <div className="mainScreen">
                <div className="heading text-3xl font-semibold py-8 ">
                  Verification Status
                </div>
                {fakeCert || !isVerified ? (
                  <div className="unVerified">
                    <div className="text text-2xl font-semibold mt-8 text-center">
                      Certificate validation{" "}
                      <span className="text-red-500 text-center">failed</span>
                    </div>
                    <img
                      className="mt-8 w-[75%] mx-auto rounded-md"
                      src="public/9.png"
                      alt=""
                    />
                    <div className="userDetails text-xl my-12 mx-4 flex flex-col gap-y-4">
                      <div className="status mx-auto">
                        The certificate seems to be unverified or edited
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="status flex  flex-col">
                    <div className="text text-2xl font-semibold mt-8 mx-auto">
                      Certificate validation{" "}
                      <span className="text-grn">successful</span>
                    </div>
                    <img
                      className="mt-4 h-52 rounded-md mx-auto"
                      src={`https://olive-kind-hummingbird-960.mypinata.cloud/ipfs/${ipfsHash}`}
                      alt=""
                    />
                    <div className="userDetails text-xl my-12 mx-4 flex flex-col gap-y-4">
                      <div className="name">
                        Name:&nbsp;
                        <span className="text-lg font-normal ">
                          {certificateData.name}
                        </span>
                      </div>
                      <div className="name">
                        Details:&nbsp;
                        <span className="text-lg font-normal ">
                          {certificateData.description}
                        </span>
                      </div>
                      <div className="name">
                        Validator:&nbsp;
                        <span className="text-lg font-normal ">
                          {certificateData.sender}
                        </span>
                      </div>
                      <div className="name">
                        Date:&nbsp;
                        <span className="text-lg font-normal ">
                          {format(
                            certificateData.timestamp * 1000,
                            "dd/MM/yyyy"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default VerifyPage;

