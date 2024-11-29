import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const Favorites = ({ isLogin, setVisibleLogin }) => {
  const navigate = useNavigate();
  const token = Cookies.get("userToken");
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/favorite`,
          {
            headers: {
              authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response.data);
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response);
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    if (isLogin) {
      setVisibleLogin(false);
      navigate("/favorites");
    } else {
      setVisibleLogin(true);
    }
  }, [isLogin, navigate, setVisibleLogin]);

  return isLoading ? (
    <div className="loading-container rotating">
      <img src="" alt="chargement" />
    </div>
  ) : (
    isLogin && (
      <>
        <div className="favorites-container">
          <h2>Mes favoris</h2>
          <div className="all-favorites"></div>
        </div>
      </>
    )
  );
};

export default Favorites;
