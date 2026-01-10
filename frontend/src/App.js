import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Components/LoginPage";
import RegisterPage from "./Components/RegisterPage";
import HomePage from "./Components/HomePage";
import EventDetails from "./Components/EventDetails";
import InvitePeople from "./Components/InvitePeople";
import CreateEvent from "./Components/CreateEvent";
import EventPhotos from "./Components/EventPhotos";

function App() {
  return (
    <Routes>
      {/* root redirects to the login page */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/event/:id" element={<EventDetails />} />
      <Route path="/invite-people/:id" element={<InvitePeople/>} />
      <Route path="/create-event" element={<CreateEvent/>}/>
      <Route path="/event/:id/photos" element={<EventPhotos />} />
    </Routes>
  );
}

export default App;
