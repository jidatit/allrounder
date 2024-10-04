import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Layout from "./UI Components/Layout";
import Blogs from "./pages/Blogs";
import TeamSportsCategory from "./pages/TeamSportsCategory";
import PostPage from "./pages/PostPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/Login";
import BlogPost from "./pages/BlogPost";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Homepage />} />
        <Route path="/blog" element={<Blogs />} />
        <Route path="/team-sport-category" element={<TeamSportsCategory />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/blog/:id" element={<BlogPost />} />
      </Route>
    </Routes>
  );
}

export default App;
