import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BsBalloonHeart } from "react-icons/bs";
import { BsBalloonHeartFill } from "react-icons/bs";

const Personnage = () => {
  const { characterId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [character, setCharacter] = useState();
  const [comic, setComic] = useState();

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
      <div>
        <h2
          className="character-name"
          style={{
            backgroundImage: `url(${character.thumbnail.path}.${character.thumbnail.extension})`,
          }}
        >
          {character.name}
        </h2>
        <p>{character.description}</p>
        <div className="character-pic-container2">
          <img
            src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
            alt={character.name}
            className="character-pic"
          />
          <BsBalloonHeart />
        </div>
        <p>Apparition dans...</p>
        <div>
          {comic.comics.map((comic) => {
            return (
              <React.Fragment key={comic._id}>
                <div>
                  <h2>{comic.title}</h2>
                  <img
                    src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                    alt=""
                  />
                  <p>{comic.description}</p>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Personnage;
