import { Navigate, Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import KumitePage from "@/pages/KumitePage";
import KataPage from "@/pages/KataPage";
import KataDisplay from "@/pages/KataComponents/VentanaKata";
import KumiteDisplay from "@/pages/KumiteComponents/VentanaKumite";
import { ConfigProvider } from "@/context/ConfigContext";

function App() {
  return (
    <ConfigProvider>
      <Routes>
        <Route element={<IndexPage />} path="/inicio" />
        <Route element={<KataPage />} path="/kata" />
        <Route element={<KumitePage />} path="/kumite" />
        <Route element={<KataDisplay />} path="/kata-display" />
        <Route element={<KumiteDisplay />} path="/kumite-display" />
        <Route element={<Navigate replace to="/inicio" />} path="*" />
        <Route element={<Navigate replace to="/inicio" />} path="/" />
      </Routes>
    </ConfigProvider>
  );
}

export default App;
