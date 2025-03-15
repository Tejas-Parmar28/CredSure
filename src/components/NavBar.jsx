// `import { GoHomeFill } from "react-icons/go";
// import { FiUpload } from "react-icons/fi";
// import { GrDocumentVerified } from "react-icons/gr";
// import { useState, useEffect, useRef } from "react";
// import { FaAngleRight } from "react-icons/fa6";
// import { Link, NavLink, useLocation } from "react-router-dom";
// import { RxText } from "react-icons/rx";
// import { IoIosDocument } from "react-icons/io";
// import { MdDraw } from "react-icons/md";
// import LogoDrawer from "./Drawer/LogoDrawer";

// import { useAtom } from "jotai";
// import {
//   CanvasNav,
//   textAtom,
//   logoAtom,
//   drawAtom,
//   browseAtom,
//   logoItems,
// } from "../Atom/atom";

// const NavBar = ({ templateSelected }) => {
//   const [canvasNavState, setCanvasNavState] = useAtom(CanvasNav);
//   const [text, setText] = useAtom(textAtom);
//   const [logo, setLogo] = useAtom(logoAtom);
//   const [draw, setDraw] = useAtom(drawAtom);
//   const [browse, setBrowse] = useAtom(browseAtom);
//   const [item, setItem] = useAtom(logoItems);

//   const [active, setActive] = useState("");
//   const location = useLocation();

//   useEffect(() => {
//     const path = location.pathname;
//     setActive(path === "/" ? "home" : path.substring(1));
//   }, [location.pathname]);

//   // canvas active:
//   const [canvasActive, setCanvasActive] = useState();

//   const [openText, setOpenText] = useState(false);
//   const [openLogo, setOpenLogo] = useState(false);

//   const handleTextDrawer = () => {
//     setCanvasActive("text");
//     setText(true);
//     setLogo(false);
//     setDraw(false);
//     setBrowse(false);
//   };

//   const handleLogoDrawer = () => {
//     setCanvasActive("logo");
//     setLogo(true);
//     setText(false);
//     setDraw(false);
//     setBrowse(false);
//   };

//   const handleDraw = () => {
//     setCanvasActive("draw");
//     setDraw(true);
//     setText(false);
//     setLogo(false);
//     setBrowse(false);
//   };
//   const fileInputRef = useRef(null);
//   const url =
//     "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=1912&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

//   const handleBrowse = () => {
//     setCanvasActive("browse");
//     setBrowse(true);
//     setText(false);
//     setLogo(false);
//     setDraw(false);
//     fileInputRef.current.click();
//   };
//   const handleFileSelect = (event) => {
//     const fileInput = event.target;
//     const files = fileInput.files;

//     // console.log(files);
//   };

//   return (
//     <div>
//       <div className="nav md:h-[88vh] h-full md:w-[18vw] w-full bg-dark rounded-xl px-8 py-5 z-99 mb-6 md:mb-0 ">
//         <Link to="/">
//           <div className="logo p-2 cursor-pointer  rounded-full text-blue-200 text-center text-2xl font-black uppercase font-oswald ">
//             <img src="public/8.png" alt="" />
//           </div>
//         </Link>

//         <div className="splitter h-[0.5px] bg-overlay w-full mb-8 mt-6"></div>

//         <div className="options flex flex-col gap-y-2 text-md uppercase font-hind">
//           <NavLink to="/">
//             <div
//               className={` flex justify-between items-center rounded-full px-6 cursor-pointer ${
//                 active === "home" ? "bg-activeNav text-blue-200" : ""
//               }`}
//             >
//               <div className="div flex items-center gap-x-2 pt-4 pb-3 rounded-full">
//                 <GoHomeFill className="mb-1" />
//                 <div className="option">Home</div>
//               </div>
//               {active === "home" ? <FaAngleRight className="text-light" /> : ""}
//             </div>
//           </NavLink>

//           <NavLink to="/upload">
//             <div
//               className={` flex justify-between items-center rounded-full px-6 cursor-pointer ${
//                 active === "upload" ? "bg-activeNav text-blue-200" : ""
//               }`}
//             >
//               <div className="div flex items-center gap-x-2 pt-4 pb-3 rounded-full">
//                 <FiUpload className="mb-1" />
//                 <div className="option">Upload</div>
//               </div>
//               {active === "upload" ? (
//                 <FaAngleRight className="text-light" />
//               ) : (
//                 ""
//               )}
//             </div>
//           </NavLink>

//           <NavLink to="/verify">
//             <div
//               className={`flex justify-between items-center rounded-full px-6 cursor-pointer  ${
//                 active === "verify" ? "bg-activeNav text-blue-200" : ""
//               }`}
//             >
//               <div className="div flex items-center gap-x-2 pt-4 pb-3 rounded-full">
//                 <GrDocumentVerified className="mb-1" />
//                 <div className="option">Verify</div>
//               </div>
//               {active === "verify" ? (
//                 <FaAngleRight className="text-light" />
//               ) : (
//                 ""
//               )}
//             </div>
//           </NavLink>
//         </div>

//         {/* =======================  Canvas navs ========================== */}

//         {templateSelected ? (
//           <>
//             <div className="splitter h-[0.5px] bg-overlay w-full my-8"></div>
//             <div className="options flex flex-col gap-y-2 text-md uppercase font-hind">
//               <div
//                 onClick={handleTextDrawer}
//                 className={` flex justify-between items-center rounded-full px-6 cursor-pointer ${
//                   canvasActive === "text" || text == true
//                     ? "bg-activeNav text-blue-200"
//                     : ""
//                 }`}
//               >
//                 <div className="div flex items-center gap-x-2 pt-4 pb-3 rounded-full">
//                   {/* RxText component or icon */}
//                   <RxText className="mb-1" />
//                   <div className="option">Text</div>
//                 </div>
//                 {canvasActive === "text" || text == true ? (
//                   <FaAngleRight className="text-light" />
//                 ) : (
//                   ""
//                 )}
//               </div>

//               <div
//                 onClick={handleLogoDrawer}
//                 className={` flex justify-between items-center rounded-full px-6 cursor-pointer ${
//                   canvasActive === "logo" || logo == true
//                     ? "bg-activeNav text-blue-200"
//                     : ""
//                 }`}
//               >
//                 <div className="div flex items-center gap-x-2 pt-4 pb-3 rounded-full">
//                   <IoIosDocument className="mb-1" />
//                   <div className="option">Logo</div>
//                 </div>
//                 {canvasActive === "logo" || logo == true ? (
//                   <FaAngleRight className="text-light" />
//                 ) : (
//                   ""
//                 )}
//               </div>
//               {logo && <LogoDrawer openLogo={logo} setOpenLogo={setLogo} />}

//               <div
//                 onClick={handleDraw}
//                 className={`flex justify-between items-center rounded-full px-6 cursor-pointer  ${
//                   canvasActive === "draw" || draw == true
//                     ? "bg-activeNav text-blue-200"
//                     : ""
//                 }`}
//               >
//                 <div className="div flex items-center gap-x-2 pt-4 pb-3 rounded-full">
//                   <MdDraw className="mb-1" />
//                   <div className="option">Draw</div>
//                 </div>
//                 {canvasActive === "draw" || draw == true ? (
//                   <FaAngleRight className="text-light" />
//                 ) : (
//                   ""
//                 )}
//               </div>

//               <form action="">
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   accept="image/*"
//                   style={{ display: "none" }}
//                   onChange={handleFileSelect}
//                 />
//                 <div
//                   onClick={handleBrowse}
//                   className={` flex justify-between items-center rounded-full px-6 cursor-pointer ${
//                     canvasActive === "browse" || browse == true
//                       ? "bg-activeNav text-blue-200"
//                       : ""
//                   }`}
//                 >
//                   <div className="div flex items-center gap-x-2 pt-4 pb-3 rounded-full">
//                     <FiUpload className="mb-1" />
//                     <div className="option">Browse</div>
//                   </div>
//                   {canvasActive === "browse" || browse == true ? (
//                     <FaAngleRight className="text-light" />
//                   ) : (
//                     ""
//                   )}
//                 </div>
//               </form>
//             </div>
//           </>
//         ) : null}
//       </div>
//     </div>
//   );
// };

// export default NavBar;`

import { GoHomeFill } from "react-icons/go";
import { FiUpload } from "react-icons/fi";
import { GrDocumentVerified } from "react-icons/gr";
import { useState, useEffect, useRef } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { RxText } from "react-icons/rx";
import { IoIosDocument } from "react-icons/io";
import { MdDraw } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import LogoDrawer from "./Drawer/LogoDrawer";

import { useAtom } from "jotai";
import {
  CanvasNav,
  textAtom,
  logoAtom,
  drawAtom,
  browseAtom,
  logoItems,
} from "../Atom/atom";

const NavBar = ({ templateSelected }) => {
  const [canvasNavState, setCanvasNavState] = useAtom(CanvasNav);
  const [text, setText] = useAtom(textAtom);
  const [logo, setLogo] = useAtom(logoAtom);
  const [draw, setDraw] = useAtom(drawAtom);
  const [browse, setBrowse] = useAtom(browseAtom);
  const [item, setItem] = useAtom(logoItems);

  const [active, setActive] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname;
    setActive(path === "/" ? "home" : path.substring(1));
  }, [location.pathname]);

  const [canvasActive, setCanvasActive] = useState();
  const fileInputRef = useRef(null);

  const handleLogout = () => {
    // Clear authentication data (adjust as needed)
    localStorage.removeItem("authToken"); // Example: Remove token from storage
    sessionStorage.clear(); // Clear session data
    navigate("/login"); // Redirect to login page
  };

  return (
    <div>
      <div className="nav md:h-[88vh] h-full md:w-[18vw] w-full bg-dark rounded-xl px-8 py-5 z-99 mb-6 md:mb-0">
        <Link to="/">
          <div className="logo p-2 cursor-pointer rounded-full text-blue-200 text-center text-2xl font-black uppercase font-oswald">
            <img src="public/8.png" alt="Logo" />
          </div>
        </Link>

        <div className="splitter h-[0.5px] bg-overlay w-full mb-8 mt-6"></div>

        <div className="options flex flex-col gap-y-2 text-md uppercase font-hind">
          <NavLink to="/">
            <div className={`flex justify-between items-center rounded-full px-6 cursor-pointer ${active === "home" ? "bg-activeNav text-blue-200" : ""}`}>
              <div className="div flex items-center gap-x-2 pt-4 pb-3 rounded-full">
                <GoHomeFill className="mb-1" />
                <div className="option">Home</div>
              </div>
              {active === "home" && <FaAngleRight className="text-light" />}
            </div>
          </NavLink>

          <NavLink to="/upload">
            <div className={`flex justify-between items-center rounded-full px-6 cursor-pointer ${active === "upload" ? "bg-activeNav text-blue-200" : ""}`}>
              <div className="div flex items-center gap-x-2 pt-4 pb-3 rounded-full">
                <FiUpload className="mb-1" />
                <div className="option">Upload</div>
              </div>
              {active === "upload" && <FaAngleRight className="text-light" />}
            </div>
          </NavLink>

          <NavLink to="/verify">
            <div className={`flex justify-between items-center rounded-full px-6 cursor-pointer ${active === "verify" ? "bg-activeNav text-blue-200" : ""}`}>
              <div className="div flex items-center gap-x-2 pt-4 pb-3 rounded-full">
                <GrDocumentVerified className="mb-1" />
                <div className="option">Verify</div>
              </div>
              {active === "verify" && <FaAngleRight className="text-light" />}
            </div>
          </NavLink>
        </div>

        {templateSelected && (
          <>
            <div className="splitter h-[0.5px] bg-overlay w-full my-8"></div>
            <div className="options flex flex-col gap-y-2 text-md uppercase font-hind">
              <div className="flex justify-between items-center rounded-full px-6 cursor-pointer" onClick={() => setText(true)}>
                <div className="div flex items-center gap-x-2 pt-4 pb-3 rounded-full">
                  <RxText className="mb-1" />
                  <div className="option">Text</div>
                </div>
              </div>

              <div className="flex justify-between items-center rounded-full px-6 cursor-pointer" onClick={() => setLogo(true)}>
                <div className="div flex items-center gap-x-2 pt-4 pb-3 rounded-full">
                  <IoIosDocument className="mb-1" />
                  <div className="option">Logo</div>
                </div>
              </div>

              {logo && <LogoDrawer openLogo={logo} setOpenLogo={setLogo} />}

              <div className="flex justify-between items-center rounded-full px-6 cursor-pointer" onClick={() => setDraw(true)}>
                <div className="div flex items-center gap-x-2 pt-4 pb-3 rounded-full">
                  <MdDraw className="mb-1" />
                  <div className="option">Draw</div>
                </div>
              </div>

              <form>
                <input type="file" ref={fileInputRef} accept="image/*" style={{ display: "none" }} />
                <div className="flex justify-between items-center rounded-full px-6 cursor-pointer" onClick={() => fileInputRef.current.click()}>
                  <div className="div flex items-center gap-x-2 pt-4 pb-3 rounded-full">
                    <FiUpload className="mb-1" />
                    <div className="option">Browse</div>
                  </div>
                </div>
              </form>
            </div>
          </>
        )}


        <div className="splitter h-[0.5px] bg-overlay w-full my-8"></div>

        {/* Logout Button at the bottom */}
        <div className="mt-auto"></div>
        <div className="flex justify-between items-center rounded-full px-6 cursor-pointer bg-red-500 text-white" onClick={handleLogout}>
          <div className="div flex items-center gap-x-2 pt-4 pb-3 rounded-full">
            <FiLogOut className="mb-1" />
            <div className="option">Logout</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
