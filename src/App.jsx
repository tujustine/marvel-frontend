import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";

// Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Personnage from "./pages/personnage/Personnage";
import Personnages from "./pages/personnage/Personnages";
import Comic from "./pages/comic/Comic";
import Comics from "./pages/comic/Comics";
import Favorites from "./pages/favorites/Favorites";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [visibleSignup, setVisibleSignup] = useState(false);
  const [visibleLogin, setVisibleLogin] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (Cookies.get("userToken")) {
      setIsLogin(true);
    }
  }, []);

  return (
    <Router>
      <Header
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        setVisibleSignup={setVisibleSignup}
        setVisibleLogin={setVisibleLogin}
        setRedirect={setRedirect}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Personnages
              isLogin={isLogin}
              setVisibleLogin={setVisibleLogin}
              setRedirect={setRedirect}
              favorites={favorites}
              setFavorites={setFavorites}
            />
          }
        ></Route>
        <Route
          path="/character/:characterId"
          element={
            <Personnage
              isLogin={isLogin}
              favorites={favorites}
              setFavorites={setFavorites}
              setVisibleLogin={setVisibleLogin}
            />
          }
        ></Route>

        <Route
          path="/comics"
          element={
            <Comics
              isLogin={isLogin}
              setVisibleLogin={setVisibleLogin}
              setRedirect={setRedirect}
            />
          }
        ></Route>
        <Route path="/comics/:id" element={<Personnage />}></Route>
        <Route
          path="/comic/:id"
          element={
            <Comic
              isLogin={isLogin}
              favorites={favorites}
              setFavorites={setFavorites}
              setVisibleLogin={setVisibleLogin}
            />
          }
        ></Route>

        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>

        <Route
          path="/favorites"
          element={
            <Favorites
              isLogin={isLogin}
              setVisibleLogin={setVisibleLogin}
              favorites={favorites}
              setFavorites={setFavorites}
            />
          }
        ></Route>
      </Routes>
      {visibleSignup && !isLogin && (
        <Signup
          setIsLogin={setIsLogin}
          visibleSignup={visibleSignup}
          setVisibleSignup={setVisibleSignup}
          setVisibleLogin={setVisibleLogin}
          redirect={redirect}
          setRedirect={setRedirect}
        />
      )}
      {visibleLogin && !isLogin && (
        <Login
          setIsLogin={setIsLogin}
          visibleLogin={visibleLogin}
          setVisibleLogin={setVisibleLogin}
          setVisibleSignup={setVisibleSignup}
          redirect={redirect}
          setRedirect={setRedirect}
        />
      )}
      <Footer />
    </Router>
  );
}

export default App;
