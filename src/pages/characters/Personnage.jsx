import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";
import Cookies from "js-cookie";

// Icons
import { BsBalloonHeart } from "react-icons/bs";
import { BsBalloonHeartFill } from "react-icons/bs";

// Medias
import H2G2 from "../../assets/img/h2g2.jpg";
import loading from "../../assets/gif/55d95297d71f4-unscreen.gif";

// Components
import ScrollToTop from "../../components/ScrollToTop";

const Personnage = ({ isLogin, favorites, setFavorites, setVisibleLogin }) => {
  const { characterId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [character, setCharacter] = useState();
  const [comic, setComic] = useState();

  const navigate = useNavigate();

  const token = Cookies.get("userToken");

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/character/${characterId}`
        );

        const responseComic = await axios.get(
          `${import.meta.env.VITE_API_URL}/comics/${characterId}`
        );
        // console.log(response.data);
        console.log(responseComic.data);
        setCharacter(response.data);
        setComic(responseComic.data);
        setIsLoading(false);

        if (Cookies.get("userToken")) {
          const favoritesResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/favorite`,
            {
              headers: {
                authorization: `Bearer ${Cookies.get("userToken")}`,
              },
            }
          );

          const favoriteIds = favoritesResponse.data.favorites
            .filter((fav) => fav.type === "character")
            .map((fav) => fav.comicOrCharacter._id);
          setFavorites(favoriteIds);
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.log(error.response);
      }
    };

    fetchCharacter();
  }, [characterId, setFavorites]);

  return isLoading ? (
    <div className="loading-container">
      <img src={loading} alt="Chargement..." />
    </div>
  ) : (
    <div className="character-container">
      <h2
        className="character-name"
        style={{
          backgroundImage: `url(${character.thumbnail.path}.${character.thumbnail.extension})`,
        }}
      >
        {character.name}
      </h2>

      <div className="credit-card-container">
        <div className="card-content">
          <div className="card-front">
            <div className="card-image">
              <img
                src={
                  character.thumbnail.path ===
                  "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available"
                    ? H2G2
                    : `${character.thumbnail.path}.${character.thumbnail.extension}`
                }
                alt={character.name}
              />
            </div>

            <button
              className="favorite-btn"
              onClick={async (event) => {
                event.stopPropagation();

                if (isLogin) {
                  const newFavorites = [...favorites];
                  if (!favorites.includes(character._id)) {
                    newFavorites.push(character._id);
                  } else {
                    const index = newFavorites.indexOf(character._id);
                    if (index !== -1) {
                      newFavorites.splice(index, 1);
                    }
                  }
                  setFavorites(newFavorites);

                  try {
                    await axios.post(
                      `${import.meta.env.VITE_API_URL}/favorite`,
                      { comicOrCharacter: character, type: "character" },
                      { headers: { authorization: `Bearer ${token}` } }
                    );
                  } catch (error) {
                    console.log(error);
                  }
                } else {
                  setVisibleLogin(true);
                }
              }}
            >
              {favorites.includes(character._id) ? (
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
                  if (!favorites.includes(character._id)) {
                    newFavorites.push(character._id);
                  } else {
                    const index = newFavorites.indexOf(character._id);
                    if (index !== -1) {
                      newFavorites.splice(index, 1);
                    }
                  }
                  setFavorites(newFavorites);

                  try {
                    await axios.post(
                      `${import.meta.env.VITE_API_URL}/favorite`,
                      { comicOrCharacter: character, type: "character" },
                      { headers: { authorization: `Bearer ${token}` } }
                    );
                  } catch (error) {
                    console.log(error);
                  }
                } else {
                  setVisibleLogin(true);
                }
              }}
            >
              {favorites.includes(character._id) ? (
                <BsBalloonHeartFill className="fav-added" />
              ) : (
                <BsBalloonHeart className="heart-icon" />
              )}
            </button>

            <p className="card-description">{character.description}</p>
            <div className="card-footer">
              <span className="card-id">ID: {characterId}</span>
            </div>
          </div>
        </div>
      </div>

      <section className="infinite-carousel">
        <h3 className="carousel-title bold">Vu dans...</h3>
        <Marquee gradient={true} speed={60} pauseOnHover={true} play={true}>
          <div className="carousel-container">
            {comic.comics.map((comic) => {
              const isDefaultImage =
                comic.thumbnail.path ===
                  "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available" ||
                comic.thumbnail.path ===
                  "http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708";

              return (
                <div
                  className="each-character-comic"
                  key={comic._id}
                  onClick={() => {
                    navigate(`/comic/${comic._id}`);
                  }}
                >
                  <h3 className="comic-title">{comic.title}</h3>
                  <div className="comic-img-each-character-container">
                    <img
                      src={
                        isDefaultImage
                          ? H2G2
                          : `${comic.thumbnail.path}.${comic.thumbnail.extension}`
                      }
                      alt=""
                    />
                  </div>
                </div>
              );
            })}
            {comic.comics.map((comic) => {
              const isDefaultImage =
                comic.thumbnail.path ===
                  "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available" ||
                comic.thumbnail.path ===
                  "http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708";

              return (
                <div
                  className="each-character-comic"
                  key={comic._id}
                  onClick={() => {
                    navigate(`/comic/${comic._id}`);
                  }}
                >
                  <h2>{comic.title}</h2>
                  <div className="comic-img-each-character-container">
                    <img
                      src={
                        isDefaultImage
                          ? H2G2
                          : `${comic.thumbnail.path}.${comic.thumbnail.extension}`
                      }
                      alt=""
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Marquee>
      </section>
      <ScrollToTop />
    </div>
  );
};

export default Personnage;
