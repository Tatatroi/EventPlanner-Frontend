import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import HomePage from "./Components/HomePage";
import CreateEvent from "./Components/CreateEvent";
import EventDetails from "./Components/EventDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/create-event" element={<CreateEvent />} />
      <Route path="/event/:id" element={<EventDetails />} />
    </Routes>
  );
}

export default App;
