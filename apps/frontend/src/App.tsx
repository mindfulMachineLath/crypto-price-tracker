import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import Navigator from "./components/Navigator";
import CoinPrice from "./pages/CoinPrice";
import queryClient from "./queryClient";
import "./App.css";

function App() {
  return (
    <div className="h-full">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Navigator />
          <Routes>
            <Route path="/" element={<Navigate to="/ethereum" />} />
            <Route path="/:coinId" element={<CoinPrice />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
