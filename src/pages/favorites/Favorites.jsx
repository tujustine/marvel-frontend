import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

import ScrollToTop from "../../components/ScrollToTop";

import { BsBalloonHeart } from "react-icons/bs";
import { BsBalloonHeartFill } from "react-icons/bs";

import loading from "../../assets/img/55d95297d71f4-unscreen.gif";
import H2G2 from "../../assets/img/h2g2.jpg";

const Favorites = ({ isLogin, setVisibleLogin, favorites, setFavorites }) => {
  const navigate = useNavigate();
  const token = Cookies.get("userToken");
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const handleFav = (type) => {
    const favoritesList = data.favorites.filter((fav) => fav.type === type);

    if (favoritesList.length === 0) {
      return <p className="no-results">Aucun favori</p>;
    }

    return (
      <div className="character-comic-carousel">
        {favoritesList.map((favorite) => {
          const isDefaultImage =
            favorite.comicOrCharacter.thumbnail.path ===
              "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available" ||
            favorite.comicOrCharacter.thumbnail.path ===
              "http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708";

          return (
            <div key={favorite._id} className="fav-img-container-wrap">
              <div className="fav-img-container">
                <img
                  src={
                    isDefaultImage
                      ? H2G2
                      : `${favorite.comicOrCharacter.thumbnail.path}.${favorite.comicOrCharacter.thumbnail.extension}`
                  }
                  alt={favorite.comicOrCharacter.name}
                />

                <button
                  className="favorite-btn"
                  onClick={async (event) => {
                    event.stopPropagation();
                    const newFavorites = [...favorites];
                    const favoriteId = favorite.comicOrCharacter._id;

                    if (!newFavorites.includes(favoriteId)) {
                      newFavorites.push(favoriteId);
                    } else {
                      const index = newFavorites.indexOf(favoriteId);
                      if (index !== -1) {
                        newFavorites.splice(index, 1);
                      }
                    }

                    setFavorites(newFavorites);

                    // mettre à jour l'état local data afin de supprimer les favoris en temps réel
                    setData((prevData) => ({
                      ...prevData,
                      favorites: prevData.favorites.filter(
                        (fav) => fav._id !== favorite._id
                      ),
                    }));

                    try {
                      await axios.post(
                        `${import.meta.env.VITE_API_URL}/favorite`,
                        {
                          comicOrCharacter: favorite.comicOrCharacter,
                          type: favorite.type,
                        },
                        { headers: { authorization: `Bearer ${token}` } }
                      );
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                >
                  {favorites.includes(favorite.comicOrCharacter._id) ? (
                    <BsBalloonHeartFill className="fav-added" />
                  ) : (
                    <BsBalloonHeart className="heart-icon" />
                  )}
                </button>
              </div>
              <h3 className="fav-comic-character-name">
                {type === "comic"
                  ? favorite.comicOrCharacter.title
                  : favorite.comicOrCharacter.name}
              </h3>
            </div>
          );
        })}
      </div>
    );
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
        console.clear();
        console.log(response.data);
        setData(response.data);

        // initialiser favorites avec les id des favoris
        // afin que si on recharge la page, la liste ne se vide pas
        const favoriteIds = response.data.favorites.map(
          (fav) => fav.comicOrCharacter._id
        );
        setFavorites(favoriteIds);

        setIsLoading(false);
      } catch (error) {
        console.log(error.response);
      }
    };

    if (isLogin) {
      setVisibleLogin(false);
      navigate("/favorites");
      fetchData();
    } else {
      setVisibleLogin(true);
    }
  }, [token, isLogin, navigate, setVisibleLogin, setFavorites]);

  return isLoading ? (
    <div className="loading-container">
      <img src={loading} alt="Chargement..." />
    </div>
  ) : (
    isLogin && (
      <div className="favorites-container">
        <h2>Mes favoris</h2>
        <div className="favorites-character-comic">
          <section className="carousel-section">
            <h3 className="carousel-title">Personnages</h3>
            {handleFav("character")}
          </section>
          <section className="carousel-section">
            <h3 className="carousel-title">Comics</h3>
            {handleFav("comic")}
          </section>
        </div>
        <ScrollToTop />
      </div>
    )
  );
};

export default Favorites;
