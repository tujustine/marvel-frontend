import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

// Icons
import { BsBalloonHeart } from "react-icons/bs";
import { BsBalloonHeartFill } from "react-icons/bs";

// Medias
import H2G2 from "../../assets/img/h2g2.jpg";
import loading from "../../assets/gif/55d95297d71f4-unscreen.gif";

const Comic = ({ isLogin, favorites, setFavorites, setVisibleLogin }) => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [comic, setComic] = useState();

  const token = Cookies.get("userToken");

  useEffect(() => {
    const fetchComic = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/comic/${id}`
        );
        // console.clear();
        // console.log(response.data);
        setComic(response.data);
        setIsLoading(false);

        if (isLogin && token) {
          const favoritesResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/favorite`,
            {
              headers: { authorization: `Bearer ${token}` },
            }
          );

          const favoriteIds = favoritesResponse.data.favorites
            .filter((fav) => fav.type === "comic")
            .map((fav) => fav.comicOrCharacter._id);
          setFavorites(favoriteIds);
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.log(error.response);
      }
    };

    fetchComic();
  }, [id, isLogin, token, setFavorites]);

  return isLoading ? (
    <div className="loading-container">
      <img src={loading} alt="Chargement..." />
    </div>
  ) : (
    <div className="comic-container">
      <h2
        className="comic-name"
        style={{
          backgroundImage: `url(${comic.thumbnail.path}.${comic.thumbnail.extension})`,
        }}
      >
        {comic.title}
      </h2>

      <div className="credit-card-container">
        <div className="card-content">
          <div className="card-front">
            <div className="card-image">
              <img
                src={
                  comic.thumbnail.path ===
                  "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available"
                    ? H2G2
                    : `${comic.thumbnail.path}.${comic.thumbnail.extension}`
                }
                alt={comic.title}
              />
            </div>

            <button
              className="favorite-btn"
              onClick={async (event) => {
                event.stopPropagation();
                if (isLogin) {
                  const newFavorites = [...favorites];
                  if (!favorites.includes(comic._id)) {
                    newFavorites.push(comic._id);
                  } else {
                    const index = newFavorites.indexOf(comic._id);
                    if (index !== -1) {
                      newFavorites.splice(index, 1);
                    }
                  }
                  setFavorites(newFavorites);

                  try {
                    await axios.post(
                      `${import.meta.env.VITE_API_URL}/favorite`,
                      { comicOrCharacter: comic, type: "comic" },
                      {
                        headers: {
                          authorization: `Bearer ${token}`,
                        },
                      }
                    );
                  } catch (error) {
                    console.log(error);
                  }
                } else {
                  setVisibleLogin(true);
                }
              }}
            >
              {favorites.includes(comic._id) ? (
                <BsBalloonHeartFill className="fav-added" />
              ) : (
                <BsBalloonHeart className="heart-icon" />
              )}
            </button>
          </div>

          <div className="card-back">
            <button
              className="favorite-btn"
              onClick={async (event) => {
                event.stopPropagation();
                if (isLogin) {
                  const newFavorites = [...favorites];
                  if (!favorites.includes(comic._id)) {
                    newFavorites.push(comic._id);
                  } else {
                    const index = newFavorites.indexOf(comic._id);
                    if (index !== -1) {
                      newFavorites.splice(index, 1);
                    }
                  }
                  setFavorites(newFavorites);

                  try {
                    await axios.post(
                      `${import.meta.env.VITE_API_URL}/favorite`,
                      { comicOrCharacter: comic, type: "comic" },
                      {
                        headers: {
                          authorization: `Bearer ${token}`,
                        },
                      }
                    );
                  } catch (error) {
                    console.log(error);
                  }
                } else {
                  setVisibleLogin(true);
                }
              }}
            >
              {favorites.includes(comic._id) ? (
                <BsBalloonHeartFill className="fav-added" />
              ) : (
                <BsBalloonHeart className="heart-icon" />
              )}
            </button>

            <p className="card-description">{comic.description}</p>
            <div className="card-footer">
              <span className="card-id">ID: {id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comic;
