import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import "./App.css";
import LandingPage from "./components/LandingPage/LandingPage";
import { LoginForm } from "./components/Auth/LoginForm";
import { SignupForm } from "./components/Auth/SignupForm";

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: "#4a90e2",
    },
    background: {
      default: "#f5f5f5",
    },
  },
});

// Wrapper components to handle navigation after successful auth
const LoginFormWrapper = () => {
  const navigate = useNavigate();
  return <LoginForm onSuccess={() => navigate("/dashboard")} />;
};

const SignupFormWrapper = () => {
  const navigate = useNavigate();
  return <SignupForm onSuccess={() => navigate("/dashboard")} />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginFormWrapper />} />
            <Route path="/signup" element={<SignupFormWrapper />} />
            {/* Add a temporary dashboard route */}
            <Route
              path="/dashboard"
              element={<div>Dashboard (Coming Soon)</div>}
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
