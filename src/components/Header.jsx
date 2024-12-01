import marvelLogo from "../assets/img/marvel-logo-removebg.png";
import groot from "../assets/img/icons8-groot-48.png";
import spider from "../assets/img/icons8-spider-man-ancien-32.png";

import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const Header = ({ isLogin, setIsLogin, setVisibleLogin, setRedirect }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("userToken");
    setVisibleLogin(false);
    setIsLogin(false);

    toast.info("À bientôt, super-héros ! 👋", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    navigate("/");
  };

  return (
    <div className="header-container">
      <div className="header">
        <Link to={"/"}>
          <img src={marvelLogo} alt="logo" className="logo" />
        </Link>
      </div>
      <nav className="navLinks header">
        <div className="main-nav bold">
          <Link to={"/"}>Personnages</Link>
          <Link to={"/comics"}>Comics</Link>
          <a
            className="fav"
            onClick={() => {
              if (isLogin) {
                navigate("/favorites");
              } else {
                setVisibleLogin(true);
                setRedirect(true);
              }
            }}
          >
            Favoris
          </a>
        </div>
        <div className="auth-links">
          {!isLogin ? (
            <Link
              className="connexion"
              onClick={() => {
                setVisibleLogin(true);
              }}
            >
              <img src={spider} alt="" className="link-user-login" />
              <div>Se connecter / S'inscrire</div>
            </Link>
          ) : (
            <a className="connexion" onClick={handleLogout}>
              <img src={groot} alt="" className="link-user-login" />
              <div>Se déconnecter</div>
            </a>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;
