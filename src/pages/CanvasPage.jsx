import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Text, Rect, Transformer, Image } from "react-konva";
import { LuUndo2, LuRedo2 } from "react-icons/lu";
import jsPDF from "jspdf";
import medal from "../../public/assets/medal.png";
import { Button, Drawer, Radio, Space } from "antd";
import { BiBold } from "react-icons/bi";
import { FaItalic } from "react-icons/fa";
import { MdOutlineFormatUnderlined } from "react-icons/md";
import { BsFonts } from "react-icons/bs";
import { MdOutlineFormatStrikethrough } from "react-icons/md";
import { useAtom } from "jotai";

import Konva from "konva";

// ========================
import template1 from "../../public/assets/template1.png";
import {
  CanvasNav,
  browseAtom,
  drawAtom,
  logoAtom,
  textAtom,
  logoItems,
  hashAtom,
} from "../Atom/atom";

// ===========================

const CanvasPage = ({ download, setDownload }) => {
  const [contentState, setContentState] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [contentHistory, setContentHistory] = useState([]);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [isDoubleClick, setIsDoubleClick] = useState(false);
  const [updateNewText, setUpdateNewText] = useState(false);

  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontWeight, setFontWeight] = useState("300");
  const [textDecoration, setTextDecoration] = useState("none");
  const [isItalic, setIsItalic] = useState(false);
  const [color, setColor] = useState("black");
  const red = "#F44336";
  const blue = "#2196F3";
  const green = "#4CAF50";
  const yellow = "#FFEB3B";
  const grey = "#9E9E9E";

  const contentLayerRef = useRef();
  const transformerRef = useRef();
  const textRef = useRef();
  const imageRef = useRef();

  // ========= JOTAI ==========
  const [canvasNavState, setCanvasNavState] = useAtom(CanvasNav);
  const [text, setText] = useAtom(textAtom);
  const [logo, setLogo] = useAtom(logoAtom);
  const [draw, setDraw] = useAtom(drawAtom);
  const [browse, setBrowse] = useAtom(browseAtom);
  const [logoItem, setLogoItem] = useAtom(logoItems);
  const [ipfsHesh, setIpfsHesh] = useState("");
  const [detailsPopup, setDetailsPopup] = useState(false);
  const [hash, setHash] = useAtom(hashAtom);

  //Drawing on canvas
  const isDrawing = useRef(false);
  const lines = useRef([]);
  const [drawLayer, setDrawLayer] = useState(new Konva.Layer());
  const [drawnContent, setDrawnContent] = useState([]);

  const handleDrawing = () => {
    const newRect = {
      id: Date.now().toString(),
      x: Math.random() * 500,
      y: Math.random() * 500,
      width: 50,
      height: 50,
      fill: "red",
    };

    setDrawnContent((prevContent) => [...prevContent, newRect]);
  };
  const handleTransform = () => {
    const index = drawnContent.findIndex(
      (item) => item.id === selectedShape.id
    );
    const updatedContent = [...drawnContent];
    updatedContent[index] = {
      ...selectedShape.attrs,
      id: selectedShape.id,
    };
    setDrawnContent(updatedContent);
  };
  const handleShapeSelect = (e, shape) => {
    e.cancelBubble = true;
    setSelectedShape(shape);
    transformerRef.current.nodes([shape]);
  };

  const handleStageClick = () => {
    setSelectedShape(null);
    transformerRef.current.nodes([]);
  };

  useEffect(() => {
    console.log("drawnContent updated:", drawnContent);
    if (drawnContent.length > 0) {
      const layer = stageRef.current.findOne(".drawn-layer");
      layer.destroyChildren();

      drawnContent.forEach((item) => {
        const shape = (
          <Rect
            key={item.id}
            x={item.x}
            y={item.y}
            width={item.width}
            height={item.height}
            fill={item.fill}
            draggable
            onClick={(e) => handleShapeSelect(e, e.target)}
            onTransformEnd={handleTransform}
          />
        );
        layer.add(shape);
      });

      stageRef.current.batchDraw();
    }
  }, [drawnContent]);

  // =====
  useEffect(() => {
    if (draw) {
      stageRef.current.add(drawLayer);
    } else {
      drawLayer.destroy();
      setDrawLayer(new Konva.Layer());
    }
  }, [draw]);

  const handleMouseDown = (e) => {
    if (!draw) return;

    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    lines.current.push({
      tool: "pencil",
      points: [pos.x, pos.y],
      color,
    });
  };

  const handleMouseMove = (e) => {
    if (!draw || !isDrawing.current) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = lines.current[lines.current.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    drawLayer.destroyChildren();

    lines.current.forEach((line) => {
      const lineColor = line.color || color;
      const newLine = new Konva.Line({
        points: line.points,
        stroke: lineColor,
        strokeWidth: 5,
        lineCap: "round",
        lineJoin: "round",
      });

      drawLayer.add(newLine);
    });

    drawLayer.batchDraw();
  };

  const handleMouseUp = () => {
    if (!draw) return;

    isDrawing.current = false;
  };
  // ======================================== //

  useEffect(() => {
    if (download) {
      handleExportPNG();
      setDownload(false);
    }
  }, [download]);

  const backgroundImage = new window.Image();
  backgroundImage.crossOrigin = "Anonymous";
  backgroundImage.src = template1;
  // "https://plus.unsplash.com/premium_photo-1675695700239-44153e6bf430?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  useEffect(() => {
    backgroundImage.onload = () => {
      contentLayerRef.current.batchDraw();
    };
  }, []);

  useEffect(() => {
    if (selectedShape && selectedShape.getClassName() === "Text") {
      if (selectedShape instanceof Konva.Text) {
        selectedShape.setAttrs({
          fill: color,
          fontFamily: fontFamily,
          fontStyle: isItalic ? `${fontWeight} italic` : "normal",
          textDecoration: textDecoration,
        });

        contentLayerRef.current && contentLayerRef.current.batchDraw();
      }
    }
  }, [color, fontFamily, fontWeight, isItalic, selectedShape, textDecoration]);

  useEffect(() => {
    const initialImage = new window.Image();
    initialImage.crossOrigin = "Anonymous";
    initialImage.onload = () => {
      const textElementsJSX = textElements.map((textElement) => (
        <Text
          key={textElement.id}
          x={textElement.x}
          y={textElement.y}
          text={textElement.text}
          fontSize={textElement.fontSize}
          fill={textElement.color}
          fontFamily={textElement.fontFamily}
          fontStyle={`${
            textElement.isItalic
              ? `italic ${textElement.fontWeight}`
              : `${textElement.fontWeight}`
          } `}
          textDecoration={textElement.textDecoration}
          draggable
          onClick={handleShapeClick}
          onTap={handleDoubleTap}
          onDblTap={handleDoubleTap}
          editable
        />
      ));

      const logoItemsJSX = logoItem.map((item, index) => {
        const logoImage = new window.Image();
        logoImage.crossOrigin = "Anonymous";
        logoImage.src = item;
        return (
          <Image
            key={index}
            image={logoImage}
            x={300}
            y={100}
            width={200}
            height={200}
            draggable
            onClick={handleShapeClick}
            onTap={handleDoubleTap}
          />
        );
      });

      setContentState([...textElementsJSX, ...logoItemsJSX]);
    };

    initialImage.src = medal;

    imageRef.current = initialImage;

    if (selectedShape && transformerRef.current) {
      if (
        selectedShape &&
        (selectedShape.getClassName() === "Text" ||
          selectedShape.getClassName() === "Image")
      ) {
        transformerRef.current.nodes([selectedShape]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [
    selectedShape,
    color,
    fontWeight,
    setColor,
    isItalic,
    textDecoration,
    fontFamily,
    updateNewText,
    logoItem,
  ]);

  const handleUndo = () => {
    if (contentHistory.length > 1) {
      const newHistory = [...contentHistory];
      newHistory.pop();
      setContentHistory(newHistory);
      setContentState(newHistory[newHistory.length - 1]);
    }
  };

  const handleRedo = () => {
    if (contentHistory.length < contentState.length) {
      const newHistory = [
        ...contentHistory,
        contentState[contentHistory.length],
      ];
      setContentHistory(newHistory);
      setContentState(newHistory[newHistory.length - 1]);
    }
  };

  const handleZoomChange = (e) => {
    setZoomLevel(e.target.value);
  };

  const handleStageMouseDown = (e) => {
    if (e.target === e.target.getStage()) {
      if (transformerRef.current) {
        setTimeout(() => {
          transformerRef.current.nodes([]);
          transformerRef.current.getLayer().batchDraw();
        });
      }
      setSelectedShape(null);
    }
  };

  const handleShapeClick = (e) => {
    const clickedOnBackgroundImage =
      e.target.getClassName() === "Rect" && e.target.fillPatternImage();

    if (clickedOnBackgroundImage) {
      setSelectedShape(null);
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer().batchDraw();
    } else {
      setSelectedShape(e.target);

      // Check for double-click
      const timeThreshold = 300; // Set your preferred time threshold for double-click
      const currentTime = new Date();
      const clickTimeDifference = currentTime - lastClickTime;

      if (clickTimeDifference < timeThreshold) {
        handleDoubleTap(e);
      }

      setLastClickTime(currentTime);
    }
  };

  const handleDoubleTap = (e) => {
    setIsDoubleClick(true);
    setLogo(false);
    setDraw(false);
    setBrowse(false);
    setText(true);

    const shape = e.target;

    if (shape.getClassName() === "Text" || shape.getClassName() === "Image") {
      setSelectedShape(shape);

      if (transformerRef.current) {
        transformerRef.current.nodes([shape]);
        transformerRef.current.getLayer().batchDraw();
      }

      setOpen(true);
    }

    setTimeout(() => {
      setIsDoubleClick(false);
    }, 500);
  };
  // ============================================================== //
  const [downloadedDataURL, setDownloadedDataURL] = useState(null);
  const stageRef = useRef(null);

  const handleIPFS = async (imageDataURL) => {
    try {
      if (!imageDataURL) {
        console.error("Image data is missing");
        return null;
      }

      const fileData = new FormData();
      const blob = await (await fetch(imageDataURL)).blob();
      fileData.append("file", blob);

      const pinResponse = await fetch(
        "https://api.pinata.cloud/v1/ipfs/add",
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

      if (responseData.isDuplicate) {
        console.warn("File with the same hash already exists on IPFS");
        return null;
      } else {
        const ipfsHash = responseData.IpfsHash;
        return ipfsHash;
      }
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      return null;
    }
  };

  const handleExportPNG = async () => {
    try {
      // Ensure that stageRef.current is not null before calling getStage
      if (stageRef.current) {
        const stage = stageRef.current.getStage();
        const dataURL = stage.toDataURL({ pixelRatio: 2 });
        setDownloadedDataURL(dataURL);

        const downloadLink = document.createElement("a");
        downloadLink.href = dataURL;
        downloadLink.download = "certificate.png";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        const ipfsHash = await handleIPFS(dataURL);
        setHash(ipfsHash);

        setDetailsPopup(true);

        if (ipfsHash) {
          setHash(ipfsHash);

          console.log(ipfsHash);
          return ipfsHash;
        } else {
          console.error("Failed to upload image to IPFS");
        }
      }
    } catch (error) {
      console.error("Error exporting PNG and uploading to IPFS:", error);
    }
  };

  const handleTextChange = (e) => {
    e.preventDefault();
    if (selectedShape && selectedShape.getClassName() === "Text") {
      selectedShape.text(e.target.value);
      setContentState([...contentState]);
    }
  };

  // =======================  DRAWER ==========================
  const [open, setOpen] = useState(false);
  const [logoDrawer, setLogoDrawer] = useState(false);

  useEffect(() => {
    if (logo === true) {
      setLogoDrawer(true);
      setOpen(false);
    }
    if (logo === false) {
      setLogoDrawer(false);
    }
  }, [logo]);

  // ADD text
  const [textElements, setTextElements] = useState([
    {
      id: 0,
      text: "Name",
      fontFamily: "Lucida Calligraphy",
      fontWeight: "",
      textDecoration: "none",
      color: "black",
      x: 195,
      y: 145,
      fontSize: 32,
    },
    {
      id: 1,
      text: "Surname",
      fontFamily: "Lucida Calligraphy",
      fontWeight: "",
      textDecoration: "none",
      color: "black",
      x: 330,
      y: 145,
      fontSize: 32,
    },
    {
      id: 2,
      text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. ",
      fontFamily: "Arial",
      fontWeight: "",
      textDecoration: "none",
      color: "black",
      x: 145,
      y: 212,
      fontSize: 16,
      width: 200,
      wrap: "char",
    },
    {
      id: 3,
      text: "Lorem ipsum dolor sit.",
      fontFamily: "Arial",
      fontWeight: "",
      textDecoration: "none",
      color: "black",
      x: 260,
      y: 240,
      fontSize: 16,
      width: 200,
      wrap: "char",
    },
    {
      id: 4,
      text: "DATE",
      fontFamily: "Arial",
      fontWeight: "400",
      textDecoration: "none",
      color: "black",
      x: 170,
      y: 320,
      fontSize: 16,
      width: 200,
      wrap: "char",
    },
    {
      id: 4,
      text: "SIGN",
      fontFamily: "Arial",
      fontWeight: "400",
      textDecoration: "none",
      color: "black",
      x: 424,
      y: 320,
      fontSize: 16,
      width: 200,
      wrap: "char",
    },
  ]);

  const handleAddText = () => {
    const newTextElement = {
      id: textElements.length,
      text: "New Text",
      fontFamily: "Arial",
      fontWeight: "",
      textDecoration: "none",
      color: "black",
      x: 20 * (textElements.length + 1),
      y: 20 * (textElements.length + 1),
      fontSize: 20,
    };
    setTextElements([...textElements, newTextElement]);
    setUpdateNewText(true);
  };

  const removeAllStyles = () => {
    setFontWeight("300");
    setTextDecoration("none");
    setColor("black");
    setIsItalic(false);
  };

  return (
    <div className="relative body h-[74vh] w-[74vw] bg-dark rounded-xl px-8 flex gap-x-2  text-3xl gap-y-2 scrollbar items-center justify-center">
      <Stage
        width={678}
        height={396}
        ref={(node) => (stageRef.current = node)}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <Layer>
          <Rect
            width={678}
            height={408}
            fillPatternImage={backgroundImage}
            fillPatternScale={{
              x: 678 / backgroundImage.width,
              y: 396 / backgroundImage.height,
            }}
            fillPatternRepeat="no-repeat"
            shadowBlur={0}
            onClick={handleShapeClick}
            onTap={handleDoubleTap}
          />
        </Layer>
        <Layer scaleX={zoomLevel} scaleY={zoomLevel}>
          {contentState.map((shape, index) => (
            <React.Fragment key={index}>
              {React.cloneElement(shape, {
                ref: textRef,
                onDblTap: handleDoubleTap,
                onTap: handleDoubleTap,
                onClick: handleShapeClick,
              })}
            </React.Fragment>
          ))}
          {selectedShape && (
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox;
                }
                return newBox;
              }}
              draggable
            />
          )}
        </Layer>
      </Stage>

      <div className="zommAndUndo text-light bg-overlayLight/40 w-[28%] h-[6%] absolute bottom-0 right-0 mr-12 mb-6 rounded-full flex items-center">
        <div className="undoRedo flex text-xl gap-x-6 ml-4">
          <LuUndo2
            className="cursor-pointer rounded-full hover:bg-gray-500/15 p-1 text-[27px]"
            // onClick={handleUndo}
          />
          <LuRedo2
            className="cursor-pointer rounded-full hover:bg-gray-500/15 p-1 text-[27px]"
            // onClick={handleRedo}
          />
        </div>
        <div className="splitter mx-4 h-[75%] w-[0.5px] bg-gray-600"></div>
        <div className="zoomSlider mx-auto flex text-xs gap-x-2">
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.01"
            value={zoomLevel}
            onChange={handleZoomChange}
            className="cursor-pointer accent-grn outline-none border-0"
          />
          <div className="percent mr-4 cursor-default">{`${Math.round(
            zoomLevel * 100
          )}%`}</div>
        </div>
      </div>
      <div className="btn text-xs flex flex-col gap-y-8">
        {logo && (
          <>
            <div className="btn text-xs flex flex-col gap-y-8">
              <Drawer
                title="Edit Text"
                placement="right"
                closable={false}
                onClose={() => setLogoDrawer(false)}
                visible={open}
                width={275}
                style={{ backgroundColor: "#F9FCFB" }}
              >
                <button
                  onClick={handleAddText}
                  className="mb-4 bg-dark text-white text-center w-full py-3 rounded-lg"
                >
                  Add Text
                </button>
              </Drawer>
            </div>
          </>
        )}
        {/* <button onClick={handleExportPDF}>Export as PDF</button> */}
        {/* <button onClick={handleUndo}>Undo</button>
        <button onClick={handleRedo}>Redo</button> */}
        <div className="btn text-xs flex flex-col gap-y-8">
          {selectedShape && selectedShape.getClassName() === "Text" && (
            <div>
              <Drawer
                title="Edit Text"
                placement="right"
                closable={false}
                onClose={() => setOpen(false)}
                visible={open}
                width={275}
                style={{ backgroundColor: "#F9FCFB" }}
              >
                <button
                  onClick={handleAddText}
                  className="mb-4 bg-dark text-white text-center w-full py-3 rounded-lg"
                >
                  Add Text
                </button>
                <input
                  type="text"
                  placeholder="First Name"
                  value={selectedShape.text()}
                  onChange={handleTextChange}
                  className="border w-full px-3 py-4 rounded-lg outline-none text-dark"
                />
                <div className="fontWeight text-[14px]   font-medium flex gap-x-4 my-4 mt-6 items-center justify-between ">
                  <h1 className="text-xs ">Font:</h1>
                  <select
                    id="font"
                    className="border w-[70%] rounded-lg px-2 py-3 outline-none  "
                    name="font"
                    onChange={(e) => setFontFamily(e.target.value)}
                  >
                    <option value="arial">Arial</option>
                    <option value="poppins">Poppins</option>
                    <option value="inter">Inter</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Calibri">Calibri</option>
                    <option value="Lucida Calligraphy">Calligraphy</option>
                    <option value="oswald">oswald</option>
                    <option value="Times New Roman">Times New Roman</option>
                  </select>
                </div>
                <div className="fontWeight text-[14px]   font-medium flex gap-x-4 my-4 items-center justify-between">
                  <h1 className="text-xs "> Weight:</h1>
                  <select
                    id="cars"
                    className="border w-[70%] rounded-lg px-2 py-3 outline-none "
                    name="cars"
                    onChange={(e) => setFontWeight(e.target.value)}
                  >
                    <option value="400">Regular</option>
                    <option value="500">Medium</option>
                    <option value="200">Light</option>
                    <option value="600">Bold</option>
                    <option value="100">ExtraLight</option>
                    <option value="800">Extra Bold</option>
                  </select>
                </div>

                <div className="decoration flex  justify-around text-lg my-8 border w-full py-3 rounded-lg">
                  <button
                    onClick={() => setIsItalic(!isItalic)}
                    className="italic px-4 py-2 hover:bg-blue-gray-50 rounded-md"
                  >
                    <FaItalic />
                  </button>
                  <button
                    onClick={() => setTextDecoration("underline")}
                    className=" px-4 py-2 hover:bg-blue-gray-50 rounded-md"
                  >
                    <MdOutlineFormatUnderlined />
                  </button>
                  <button
                    onClick={() => setTextDecoration("line-through")}
                    className=" px-4 py-2 hover:bg-blue-gray-50 rounded-md"
                  >
                    <MdOutlineFormatStrikethrough />
                  </button>
                </div>

                <div className="colors">
                  <div className="basicColors">
                    <div className="flex gap-x-4">
                      <div
                        onClick={() => setColor(red)}
                        className="colorBox bg-red-500 rounded-lg cursor-pointer h-8 w-8"
                      ></div>
                      <div
                        onClick={() => setColor(blue)}
                        className="colorBox bg-blue-500 rounded-lg cursor-pointer h-8 w-8"
                      ></div>
                      <div
                        onClick={() => setColor(green)}
                        className="colorBox bg-green-500 rounded-lg cursor-pointer h-8 w-8"
                      ></div>
                      <div
                        onClick={() => setColor(yellow)}
                        className="colorBox bg-yellow-500 rounded-lg cursor-pointer h-8 w-8"
                      ></div>
                      <div
                        onClick={() => setColor(grey)}
                        className="colorBox bg-gray-500 rounded-lg cursor-pointer h-8 w-8"
                      ></div>
                    </div>
                    <button
                      onClick={removeAllStyles}
                      className="text-md hover:bg-red-600 duration-300 bg-gray-400 text-white text-center w-full py-3 rounded-lg my-6"
                    >
                      Remove all Styles
                    </button>
                  </div>
                </div>
              </Drawer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CanvasPage;
