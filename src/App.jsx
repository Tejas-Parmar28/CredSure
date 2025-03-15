import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import VerifyPage from "./pages/VerifyPage";

const App = () => {
  return (
    <div className="md:p-10 p-4 font-hind font-medium">
      <Routes>
        <Route path="/" element={<HomePage />} exact></Route>
        <Route path="/upload" element={<UploadPage />} exact></Route>
        <Route path="/verify" element={<VerifyPage />} exact></Route>
      </Routes>
    </div>
  );
};

export default App;
