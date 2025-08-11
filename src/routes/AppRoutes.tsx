import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Landing } from "../pages/Landing/Landing";
import { Home } from "../pages/Home/Home";
import { Splash } from "../pages/Splash/Splash";
import { Auth } from "../pages/Auth/Auth";
import { Withdraw } from "../pages/Withdraw/Withdraw";
import { Receive } from "../pages/Receive/Receive";
import { Settings } from "../pages/Settings/Settings";
import { Transactions } from "../pages/Transactions/Transactions";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/splash" element={<Splash />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/receive" element={<Receive />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
