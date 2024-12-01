import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = ({
  setIsLogin,
  visibleSignup,
  setVisibleSignup,
  setVisibleLogin,
  redirect,
  setRedirect,
}) => {
  const navigate = useNavigate();
  const [missingParametersMessage, setMissingParametersMessage] =
    useState(null);
  const [existingEmail, setExistingEmail] = useState(null);
  const [otherError, setOtherError] = useState(null);

  const [userInfo, setUserInfo] = useState({
    username: "",
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
    setMissingParametersMessage(null);
    setExistingEmail(null);
    setOtherError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/signup`,
        userInfo
      );
      // console.log(response.data);
      Cookies.set("userToken", response.data.token, { expires: 7 });
      setIsLogin(true);
      setVisibleSignup(false);

      toast.success("Bienvenue au SHIELD 🦸👋", {
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
      if (error.response.status === 409) {
        setExistingEmail("Cette adresse email est déjà utilisée");
      } else if (
        (error.response.data.message === "Enter a username 😾" ||
          error.response.data.message === "Enter a password 😾" ||
          error.response.data.message === "Enter an email 😾") &&
        error.response.status === 400
      ) {
        setMissingParametersMessage("Veuillez remplir tous les champs");
      } else {
        setOtherError("Une erreur est survenue, veuillez réessayer !");
      }
    }
  };

  useEffect(() => {
    if (visibleSignup) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [visibleSignup]);

  return (
    <>
      <div className="signup-container">
        <div
          className="modal-root"
          onClick={() => {
            setVisibleSignup(false);
          }}
        >
          <div
            className="modal"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <h2>S'inscrire</h2>
            {otherError && <span className="error">{otherError}</span>}

            <form onSubmit={handleSubmit} className="signup">
              {missingParametersMessage && userInfo.username === "" && (
                <span className="error">{missingParametersMessage}</span>
              )}
              <input
                placeholder="Nom d'utilisateur"
                type="text"
                name="username"
                value={userInfo.username}
                onChange={(event) => {
                  handleInputChange(event, "username");
                }}
              />

              {existingEmail && <span className="error">{existingEmail}</span>}
              {/* {missingParametersMessage && userInfo.email === "" && (
                <span className="error">{missingParametersMessage}</span>
              )} */}
              <input
                placeholder="Email"
                type="email"
                name="email"
                value={userInfo.email}
                onChange={(event) => {
                  handleInputChange(event, "email");
                }}
              />

              {missingParametersMessage && userInfo.password === "" && (
                <span className="error">{missingParametersMessage}</span>
              )}
              <input
                placeholder="Mot de passe"
                type="password"
                name="username"
                value={userInfo.password}
                onChange={(event) => {
                  handleInputChange(event, "password");
                }}
              />

              <button type="submit">S'inscrire</button>
            </form>
            <Link
              className="redirection-login bold"
              onClick={() => {
                setVisibleSignup(false);
                setVisibleLogin(true);
              }}
            >
              Tu as déjà un compte ? Connecte-toi !
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
