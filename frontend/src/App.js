import React, { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DonatePage from "./components/DonatePage";
import DonorDashboard from "./components/DonorDashboard";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import CharityList from "./components/CharityList";
import AdminDashboard from "./components/AdminDashboard";
import CreateCharity from "./components/CreateCharity";
import CharityDashboardAdmin from "./components/CharityDashboardAdmin";
import CharityDashboard1 from "./components/CharityDashboard1";

const App = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/check_session")
      .then((r) => {
        if (r.ok) {
          return r.json();
        } else {
          return null;
        }
      })
      .then((data) => {
        setUser(data);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <NavBar user={user} setUser={setUser} />
      <Routes>
        {user ? (
          <>
            <Route path="/" element={<LandingPage user={user} />} />
            <Route path="/charities" element={<CharityList />} />
            <Route path="/donate/:charityId" element={<DonatePage />} />
            <Route path="/donor_dashboard" element={
              <DonorDashboard
                user={user}
                donations={user.donations}
                setUser={setUser}
              />
            } />
              {user.role === "charity" && (
              <Route
                path="/charity_dashboard"
                element={<CharityDashboard1 user={user} />}
              />
            )}
            <Route path="/admin_dashboard" element={<AdminDashboard user={user} />} />
            <Route path="/charitydashboard" element={<CharityDashboardAdmin user={user} />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<LoginPage setUser={setUser} />} />
            <Route path="/register" element={<RegisterPage />} />
          </>
        )}
        <Route path="/" element={<LandingPage />} />
        <Route path="/charities" element={<CharityList />} />
        <Route path="/create_charity" element={<CreateCharity />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
