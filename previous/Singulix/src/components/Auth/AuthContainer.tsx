import React, { useState } from "react";
import { Box, Tabs, Tab, Container, Typography } from "@mui/material";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const AuthContainer: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleLoginSuccess = () => {
    // Handle successful login (e.g., redirect to dashboard)
    console.log("Login successful");
  };

  const handleSignupSuccess = () => {
    // Switch to login tab after successful signup
    setTabValue(0);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Welcome to Singulix
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary">
          Please sign in or create an account
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Login" />
          <Tab label="Sign Up" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <LoginForm onSuccess={handleLoginSuccess} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <SignupForm onSuccess={handleSignupSuccess} />
      </TabPanel>
    </Container>
  );
};
