import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import HomePage from "./Components/HomePage";
import MyProfile from "./Components/MyProfile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/profile" element={<MyProfile />} />

      <Route
        path="*"
        element={<div style={{ padding: 40 }}>No route matched. Try <a href="/">/</a> or <a href="/profile">/profile</a></div>}
      />
    </Routes>
  );
}

export default App;
