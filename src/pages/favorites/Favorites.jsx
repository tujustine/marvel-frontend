import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const Favorites = ({ isLogin, setVisibleLogin }) => {
  const navigate = useNavigate();
  const token = Cookies.get("userToken");
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const handleFav = (type) => {
    let hasFavorites = false;
    const favoritesList = [];

    for (let i = 0; i < data.favorites.length; i++) {
      if (data.favorites[i].type === type) {
        hasFavorites = true;
        favoritesList.push(
          <div key={data.favorites[i]._id} className="favorite-item">
            <img
              src={`${data.favorites[i].comicOrCharacter.thumbnail.path}.${data.favorites[i].comicOrCharacter.thumbnail.extension}`}
              alt={data.favorites[i].comicOrCharacter.name}
            />
            <h4>{data.favorites[i].comicOrCharacter.name}</h4>
          </div>
        );
      }
    }

    if (!hasFavorites) {
      return <p>Vous n'avez pas de favoris.</p>;
    }

    return <div className="favorites-list">{favoritesList}</div>;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/favorite`,
          {
            headers: {
              authorization: `Bearer ${token}`,
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
      <div className="favorites-container">
        <h2>Mes favoris</h2>
        <h3>Personnages</h3>
        {handleFav("character")}
        <h3>Comics</h3>
        {handleFav("comic")}
      </div>
    )
  );
};

export default Favorites;
