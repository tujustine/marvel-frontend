import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import ScrollToTop from "../../components/ScrollToTop";

import { BsBalloonHeart } from "react-icons/bs";
import { BsBalloonHeartFill } from "react-icons/bs";

import H2G2 from "../../assets/img/h2g2.jpg";
import { FaMagnifyingGlass } from "react-icons/fa6";

const Personnages = ({ isLogin, setVisibleLogin, setRedirect }) => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [characterBody, setCharacterBody] = useState({});

  const navigate = useNavigate();

  const token = Cookies.get("userToken");
  const limitValues = [20, 60, 100];

  const paginationButtons = () => {
    const totalPages = Math.ceil(data.count / limit);
    const buttons = [];

    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          onClick={() => setPage(i)}
          className={page === i ? "active" : "desactivate"}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  const updateLimit = (newLimit) => {
    setLimit(newLimit);
    const newTotalPages = Math.ceil(data.count / newLimit);
    if (page > newTotalPages) {
      setPage(1);
    }
  };

  const handleFavorites = async (favBody) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/favorite`,
        favBody,
        {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
      // navigate(`/offer/${response.data._id}`);
      // console.log(response.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/characters`,
          {
            params: {
              name: search,
              limit: limit,
              page: page,
            },
          }
        );
        // console.log(response.data);
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response);
      }
    };
    fetchData();
  }, [page, limit, search]);

  return isLoading ? (
    <div className="loading-container rotating">
      <img src="" alt="chargement" />
    </div>
  ) : (
    <div className="characters-container">
      <div className="characters-content">
        <h2>Personnages</h2>
        <div className="limit">
          <span>Personnage par page </span>
          {limitValues.map((limitValue, index) => (
            <button
              key={limitValue + index}
              onClick={() => updateLimit(limitValue)}
              className={limit === limitValue ? "active" : "desactivate"}
            >
              {limitValue}
            </button>
          ))}
        </div>
        <div className="search-container">
          <FaMagnifyingGlass style={{ color: "#BBBBBB" }} />
          <input
            type="text"
            placeholder="Recherche des articles"
            name="search-articles"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
        </div>
        <div className="all-characters">
          {data.results.map((personnage, index) => {
            const isDefaultImage =
              personnage.thumbnail.path ===
                "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available" ||
              personnage.thumbnail.path ===
                "http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708";

            return (
              <div className="one-character" key={personnage._id + index}>
                <div
                  className="character-pic-container"
                  style={{
                    backgroundImage: isDefaultImage
                      ? `url(${H2G2})`
                      : `url(${personnage.thumbnail.path}.${personnage.thumbnail.extension})`,
                  }}
                ></div>

                {!favorites.includes(personnage._id) ? (
                  <button
                    className="favorite-btn"
                    onClick={() => {
                      if (isLogin) {
                        const newTab = [...favorites];
                        newTab.push(personnage._id);
                        setFavorites(newTab);

                        const newCharacterBody = { ...characterBody };
                        newCharacterBody.comicOrCharacter = personnage;
                        newCharacterBody.type = "character";
                        setCharacterBody(newCharacterBody);

                        // console.log(characterBody);

                        handleFavorites(characterBody);
                      } else {
                        setVisibleLogin(true);
                        setRedirect("/characters");
                      }
                    }}
                  >
                    <BsBalloonHeart />
                  </button>
                ) : (
                  <button
                    className="favorite-btn"
                    onClick={() => {
                      if (isLogin) {
                        const newTab = [...favorites];
                        const index = newTab.indexOf(personnage._id);
                        if (index !== -1) {
                          newTab.splice(index, 1);
                          setFavorites(newTab);
                        }
                      } else {
                        setVisibleLogin(true);
                        // setRedirect("/login");
                      }
                    }}
                  >
                    <BsBalloonHeartFill />
                  </button>
                )}

                <h3
                  className="characters-name"
                  onClick={() => {
                    navigate(`/character/${personnage._id}`);
                  }}
                >
                  {personnage.name}
                </h3>
                {personnage.description && (
                  <p className="character-description">
                    {personnage.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="pagination">{paginationButtons()}</div>
      <ScrollToTop />
    </div>
  );
};

export default Personnages;
