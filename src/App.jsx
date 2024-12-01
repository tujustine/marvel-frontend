import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";

// Pages
import Login from "./pages/authentification/Login";
import Signup from "./pages/authentification/Signup";
import Personnage from "./pages/characters/Personnage";
import Personnages from "./pages/characters/Personnages";
import Comic from "./pages/comics/Comic";
import Comics from "./pages/comics/Comics";
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
        setVisibleLogin={setVisibleLogin}
        setRedirect={setRedirect}
      />
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={
            <Personnages
              isLogin={isLogin}
              setVisibleLogin={setVisibleLogin}
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
            <Comics isLogin={isLogin} setVisibleLogin={setVisibleLogin} />
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
