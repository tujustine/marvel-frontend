import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

import { BsBalloonHeart } from "react-icons/bs";
import { BsBalloonHeartFill } from "react-icons/bs";

import H2G2 from "../../assets/img/h2g2.jpg";

const Comic = ({ isLogin, favorites, setFavorites, setVisibleLogin }) => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [comic, setComic] = useState();
  const [character, setCharacter] = useState();

  const token = Cookies.get("userToken");

  useEffect(() => {
    const fetchComic = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/comic/${id}`
        );
        console.log(response.data);
        setComic(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response);
      }
    };
    fetchComic();
  }, [id]);

  return isLoading ? (
    <div className="loading-container rotating">
      <img src="" alt="chargement" />
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
            {/* </div> */}

            <button
              className="favorite-btn"
              onClick={(event) => {
                event.stopPropagation();
                if (isLogin) {
                  const newFavorites = [...favorites];
                  if (!favorites.includes(comic._id)) {
                    newFavorites.push(comic._id);
                    setFavorites(newFavorites);
                    axios.post(
                      `${import.meta.env.VITE_API_URL}/favorite`,
                      { comicOrCharacter: comic, type: "comic" },
                      { headers: { authorization: `Bearer ${token}` } }
                    );
                  } else {
                    const index = newFavorites.indexOf(comic._id);
                    if (index !== -1) {
                      newFavorites.splice(index, 1);
                      setFavorites(newFavorites);
                      axios.post(
                        `${import.meta.env.VITE_API_URL}/favorite`,
                        { comicOrCharacter: comic, type: "comic" },
                        { headers: { authorization: `Bearer ${token}` } }
                      );
                    }
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
              onClick={(event) => {
                event.stopPropagation();
                if (isLogin) {
                  const newFavorites = [...favorites];
                  if (!favorites.includes(comic._id)) {
                    newFavorites.push(comic._id);
                    setFavorites(newFavorites);
                    axios.post(
                      `${import.meta.env.VITE_API_URL}/favorite`,
                      { comicOrCharacter: comic, type: "comic" },
                      { headers: { authorization: `Bearer ${token}` } }
                    );
                  } else {
                    const index = newFavorites.indexOf(comic._id);
                    if (index !== -1) {
                      newFavorites.splice(index, 1);
                      setFavorites(newFavorites);
                      axios.post(
                        `${import.meta.env.VITE_API_URL}/favorite`,
                        { comicOrCharacter: comic, type: "comic" },
                        { headers: { authorization: `Bearer ${token}` } }
                      );
                    }
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
