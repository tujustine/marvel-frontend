import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import ScrollToTop from "../../components/ScrollToTop";

import { BsBalloonHeart } from "react-icons/bs";
import { BsBalloonHeartFill } from "react-icons/bs";
import { FaMagnifyingGlass } from "react-icons/fa6";

import H2G2 from "../../assets/img/h2g2.jpg";
import loading from "../../assets/img/loading-animations-preloader-gifs-ui-ux-effects-32.gif";

const Personnages = ({
  isLogin,
  setVisibleLogin,
  setRedirect,
  favorites,
  setFavorites,
}) => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [limit, setLimit] = useState(100);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  // const [favorites, setFavorites] = useState([]);

  const navigate = useNavigate();

  const token = Cookies.get("userToken");
  const limitValues = [20, 60, 100];

  const paginationButtons = () => {
    const totalPages = Math.ceil(data.count / limit);
    const buttons = [];
    const maxVisibleButtons = 5;

    let startPage = Math.max(1, page - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          onClick={() => setPage(i)}
          className={`pagination-button ${page === i ? "active" : ""}`}
          key={i}
        >
          {i}
        </button>
      );
    }

    // ajout de ...
    if (startPage > 1) {
      buttons.unshift(<span key="start-ellipsis">...</span>);
      buttons.unshift(
        <button
          onClick={() => setPage(1)}
          className="pagination-button"
          key={1}
        >
          1
        </button>
      );
    }
    if (endPage < totalPages) {
      buttons.push(<span key="end-ellipsis">...</span>);
      buttons.push(
        <button
          onClick={() => setPage(totalPages)}
          className="pagination-button"
          key={totalPages}
        >
          {totalPages}
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

        if (!isLogin) {
          setFavorites([]);
        }
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchData();

    const fetchFavorites = async () => {
      if (isLogin && token) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/favorite`,
            {
              headers: { authorization: `Bearer ${token}` },
            }
          );
          const favoriteIds = response.data.favorites.map(
            (fav) => fav.comicOrCharacter._id
          );
          setFavorites(favoriteIds);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchFavorites();
  }, [page, limit, search, isLogin, token, setFavorites]);

  // console.clear();

  return isLoading ? (
    <div className="loading-container">
      <div className="loading-round">
        <img src={loading} alt="Chargement..." />
      </div>
    </div>
  ) : (
    <div className="characters-container">
      <h2>Personnages</h2>
      <div className="search-container ">
        <div className="search">
          <FaMagnifyingGlass style={{ color: "#BBBBBB" }} />
          <input
            type="text"
            placeholder="Recherche des personnages"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
        </div>
      </div>

      {data.results.length === 0 ? (
        <div className="no-results">
          <p>Aucun résultat trouvé</p>
        </div>
      ) : (
        <>
          <div className="filters-container">
            <div className="pagination">{paginationButtons()}</div>
            <div className="limit">
              <span className="bold">Personnage par page </span>
              {limitValues.map((limitValue, index) => (
                <button
                  key={limitValue + index}
                  className={limit === limitValue ? "active" : "desactivate"}
                  onClick={() => updateLimit(limitValue)}
                >
                  {limitValue}
                </button>
              ))}
            </div>
          </div>
          <div className="all-characters">
            {data.results.map((personnage, index) => {
              const isDefaultImage =
                personnage.thumbnail.path ===
                  "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available" ||
                personnage.thumbnail.path ===
                  "http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708";

              return (
                <div
                  className="one-character"
                  key={personnage._id + index}
                  onClick={() => navigate(`/character/${personnage._id}`)}
                >
                  <div
                    className="character-pic-container"
                    style={{
                      backgroundImage: isDefaultImage
                        ? `url(${H2G2})`
                        : `url(${personnage.thumbnail.path}.${personnage.thumbnail.extension})`,
                    }}
                  ></div>
                  <button
                    className="favorite-btn"
                    onClick={async (event) => {
                      event.stopPropagation();
                      if (isLogin) {
                        const newTab = [...favorites];
                        if (!favorites.includes(personnage._id)) {
                          newTab.push(personnage._id);
                          setFavorites(newTab);
                          const comicOrCharacter = personnage;
                          const type = "character";

                          try {
                            await axios.post(
                              `${import.meta.env.VITE_API_URL}/favorite`,
                              { comicOrCharacter, type },
                              {
                                headers: { authorization: `Bearer ${token}` },
                              }
                            );
                          } catch (error) {
                            console.log(error);
                          }
                        } else {
                          const index = newTab.indexOf(personnage._id);
                          if (index !== -1) {
                            newTab.splice(index, 1);
                            setFavorites(newTab);

                            const comicOrCharacter = personnage;
                            const type = "character";

                            try {
                              await axios.post(
                                `${import.meta.env.VITE_API_URL}/favorite`,
                                { comicOrCharacter, type },
                                {
                                  headers: {
                                    authorization: `Bearer ${token}`,
                                  },
                                }
                              );
                            } catch (error) {
                              console.log(error);
                            }
                          }
                        }
                      } else {
                        setVisibleLogin(true);
                      }
                    }}
                  >
                    {!favorites.includes(personnage._id) ? (
                      <BsBalloonHeart />
                    ) : (
                      <BsBalloonHeartFill className="fav-added" />
                    )}
                  </button>

                  <h3
                    className="characters-name"
                    onClick={(event) => {
                      event.stopPropagation();
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
        </>
      )}
      <ScrollToTop />
    </div>
  );
};

export default Personnages;
