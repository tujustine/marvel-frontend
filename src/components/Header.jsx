// import marvelLogo from "../assets/img/marvel-logo.png";
import marvelLogo from "../assets/img/marvel-logo-removebg.png";
import groot from "../assets/img/icons8-groot-48.png";
import spider from "../assets/img/icons8-spider-man-ancien-32.png";
import venom from "../assets/img/icons8-venom-(marvel-comics)-48.png";
import { MdOutlineMenu } from "react-icons/md";
import { MdClose } from "react-icons/md";

import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Header = ({
  isLogin,
  setIsLogin,
  setVisibleSignup,
  setVisibleLogin,
  setRedirect,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("userToken");
    setIsLogin(false);
    setVisibleLogin(false);
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

          {/* <Link to={"/favorites"}>Favoris</Link> */}
        </div>
        <div className="auth-links">
          {!isLogin ? (
            <>
              {/* <button
                className="inscription"
                onClick={() => {
                  setVisibleSignup(true);
                }}
              >
                S'inscrire
              </button> */}
              <Link
                className="connexion"
                onClick={() => {
                  setVisibleLogin(true);
                }}
              >
                <img src={spider} alt="" className="link-user-login" />
                <div>Se connecter / S'inscrire</div>
              </Link>
            </>
          ) : (
            <>
              <a className="connexion" onClick={handleLogout}>
                {" "}
                <img src={groot} alt="" className="link-user-login" />
                <div>Se déconnecter</div>
              </a>
            </>
          )}

          {/* <Link to={"/login"}>Se connecter</Link> */}
          {/* <Link to={"/signup"}>S'inscrire</Link> */}
        </div>
      </nav>
    </div>
  );
};

export default Header;
