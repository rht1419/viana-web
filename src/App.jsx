import React from "react";
import Routes from "./Routes";
import AuthProvider from "./contexts/AuthContext";
import ConfettiBackground from "./components/ConfettiBackground";

function App() {
  return (
    <AuthProvider>
      <ConfettiBackground />
      <Routes />
    </AuthProvider>
  );
}

export default App;