import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({
  setIsLogin,
  visibleLogin,
  setVisibleLogin,
  setVisibleSignup,
  redirect,
  setRedirect,
}) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (event, key) => {
    const newObj = { ...userInfo };
    newObj[key] = event.target.value;
    setUserInfo(newObj);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/login`,
        userInfo
      );
      // console.log(response.data);
      Cookies.set("userToken", response.data.token, { expires: 7 });
      setIsLogin(true);
      setVisibleLogin(false);

      toast.success("C'est bon de vous revoir ! 🦸", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      if (redirect) {
        navigate("/favorites");
        setRedirect(false);
      } else {
        navigate("/");
      }
    } catch (error) {
      if (error.response.status === 400) {
        setErrorMessage("Identifiant ou mot de passe incorrect");
      } else {
        setErrorMessage("Une erreur est survenue, veuillez réessayer !");
      }
    }
  };

  useEffect(() => {
    if (visibleLogin) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [visibleLogin]);

  return (
    <>
      <div className="login-container">
        <div
          className="modal-root"
          onClick={() => {
            setVisibleLogin(false);
          }}
        >
          <div
            className="modal"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <h2 className="bold">Se connecter</h2>
            {errorMessage && <span className="error">{errorMessage}</span>}
            <form onSubmit={handleSubmit} className="login">
              <input
                placeholder="Adresse email"
                type="email"
                name="email"
                value={userInfo.email}
                onChange={(event) => {
                  handleInputChange(event, "email");
                }}
              />
              <input
                placeholder="Mot de passe"
                type="password"
                name="password"
                value={userInfo.password}
                onChange={(event) => {
                  handleInputChange(event, "password");
                }}
              />

              <button type="submit">Se connecter</button>
            </form>
            <Link
              className="redirection-signup bold"
              onClick={() => {
                setVisibleSignup(true);
                setVisibleLogin(false);
              }}
            >
              Pas encore de compte ? Inscris-toi !
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
