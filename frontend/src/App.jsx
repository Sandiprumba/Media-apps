import { Routes, Route } from "react-router-dom";

import { Container } from "@chakra-ui/react";

import Header from "./components/Header.jsx";
import UserPage from "./pages/UserPage.jsx";
import PostPage from "./pages/PostPage.jsx";

function App() {
  return (
    <Container maxW="620px">
      <Header />
      <Routes>
        <Route path="/:username" element={<UserPage />} />
        <Route path="/:username/post/:pid" element={<PostPage />} />
      </Routes>
    </Container>
  );
}

export default App;
