import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

// Components
import ScrollToTop from "../../components/ScrollToTop";

// Medias
import H2G2 from "../../assets/img/h2g2.jpg";
import loading from "../../assets/gif/55d95297d71f4-unscreen.gif";

// Icons
import { FaMagnifyingGlass } from "react-icons/fa6";
import { BsBalloonHeart } from "react-icons/bs";
import { BsBalloonHeartFill } from "react-icons/bs";

const Comics = ({ isLogin, setVisibleLogin }) => {
  const [comics, setComics] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [limit, setLimit] = useState(100);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);

  const token = Cookies.get("userToken");
  const limitValues = [20, 60, 100];

  const navigate = useNavigate();

  const paginationButtons = () => {
    const totalPages = Math.ceil(comics.count / limit);
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
    const newTotalPages = Math.ceil(comics.count / newLimit);
    if (page > newTotalPages) {
      setPage(1);
    }
  };

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/comics`,
          {
            params: {
              title: search,
              limit: limit,
              page: page,
            },
          }
        );
        // console.log(response.data);
        setComics(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response);
      }
    };
    fetchComics();

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
  }, [page, limit, search, token, isLogin]);

  return isLoading ? (
    <div className="loading-container">
      <img src={loading} alt="Chargement..." />
    </div>
  ) : (
    <div className="comics-container">
      <div className="comics-content">
        <h2>Comics</h2>
        <div className="search-container">
          <div className="search">
            <FaMagnifyingGlass style={{ color: "#BBBBBB" }} />
            <input
              type="text"
              placeholder="Recherche des comics"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
            />
          </div>
        </div>

        {comics.results.length === 0 ? (
          <div className="no-results">
            <p>Aucun résultat trouvé</p>
          </div>
        ) : (
          <>
            <div className="filters-container">
              <div className="pagination">{paginationButtons()}</div>
              <div className="limit">
                <span className="bold">Comic par page </span>
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
            <div className="all-comics">
              {comics.results.map((comic, index) => {
                const isDefaultImage =
                  comic.thumbnail.path ===
                    "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available" ||
                  comic.thumbnail.path ===
                    "http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708";

                return (
                  <div
                    className="one-comic"
                    key={comic._id + index}
                    onClick={() => navigate(`/comic/${comic._id}`)}
                  >
                    <div
                      className="comic-pic-container"
                      style={{
                        backgroundImage: isDefaultImage
                          ? `url(${H2G2})`
                          : `url(${comic.thumbnail.path}.${comic.thumbnail.extension})`,
                      }}
                    ></div>

                    <button
                      className="favorite-btn"
                      onClick={async (event) => {
                        event.stopPropagation();
                        if (isLogin) {
                          const newTab = [...favorites];
                          if (!favorites.includes(comic._id)) {
                            newTab.push(comic._id);
                          } else {
                            const index = newTab.indexOf(comic._id);
                            if (index !== -1) {
                              newTab.splice(index, 1);
                            }
                          }
                          setFavorites(newTab);

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
                      {!favorites.includes(comic._id) ? (
                        <BsBalloonHeart />
                      ) : (
                        <BsBalloonHeartFill className="fav-added" />
                      )}
                    </button>
                    <h3
                      className="comics-name"
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                    >
                      {comic.title}
                    </h3>
                    {comic.description && (
                      <p className="comic-description">{comic.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      <ScrollToTop />
    </div>
  );
};

export default Comics;
