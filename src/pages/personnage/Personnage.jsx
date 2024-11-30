import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import Cookies from "js-cookie";

import { BsBalloonHeart } from "react-icons/bs";
import { BsBalloonHeartFill } from "react-icons/bs";

import H2G2 from "../../assets/img/h2g2.jpg";

import ScrollToTop from "../../components/ScrollToTop";

const Personnage = ({ isLogin, favorites, setFavorites, setVisibleLogin }) => {
  const { characterId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [character, setCharacter] = useState();
  const [comic, setComic] = useState();

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
      } catch (error) {
        console.log(error.response);
      }
    };
    fetchCharacter();
  }, [characterId]);

  return isLoading ? (
    <div className="loading-container rotating">
      <img src="" alt="chargement" />
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
            {/* </div> */}

            <button
              className="favorite-btn"
              onClick={(event) => {
                event.stopPropagation();
                if (isLogin) {
                  const newFavorites = [...favorites];
                  if (!favorites.includes(character._id)) {
                    newFavorites.push(character._id);
                    setFavorites(newFavorites);
                    axios.post(
                      `${import.meta.env.VITE_API_URL}/favorite`,
                      { comicOrCharacter: character, type: "character" },
                      { headers: { authorization: `Bearer ${token}` } }
                    );
                  } else {
                    const index = newFavorites.indexOf(character._id);
                    if (index !== -1) {
                      newFavorites.splice(index, 1);
                      setFavorites(newFavorites);
                      axios.post(
                        `${import.meta.env.VITE_API_URL}/favorite`,
                        { comicOrCharacter: character, type: "character" },
                        { headers: { authorization: `Bearer ${token}` } }
                      );
                    }
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
              onClick={(event) => {
                event.stopPropagation();
                if (isLogin) {
                  const newFavorites = [...favorites];
                  if (!favorites.includes(character._id)) {
                    newFavorites.push(character._id);
                    setFavorites(newFavorites);
                    axios.post(
                      `${import.meta.env.VITE_API_URL}/favorite`,
                      { comicOrCharacter: character, type: "character" },
                      { headers: { authorization: `Bearer ${token}` } }
                    );
                  } else {
                    const index = newFavorites.indexOf(character._id);
                    if (index !== -1) {
                      newFavorites.splice(index, 1);
                      setFavorites(newFavorites);
                      axios.post(
                        `${import.meta.env.VITE_API_URL}/favorite`,
                        { comicOrCharacter: character, type: "character" },
                        { headers: { authorization: `Bearer ${token}` } }
                      );
                    }
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

            {/* <h3 className="card-name">{character.name}</h3> */}
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
                <div className="each-character-comic" key={comic._id}>
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
                  <p>{comic.description}</p>
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
