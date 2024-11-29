import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import H2G2 from "../../assets/img/h2g2.jpg";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { BsBalloonHeart } from "react-icons/bs";
import { BsBalloonHeartFill } from "react-icons/bs";

const Comics = () => {
  const [comics, setComics] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limitValues = [20, 60, 100];

  const paginationButtons = () => {
    const totalPages = Math.ceil(comics.count / limit);
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
        console.log(response.data);
        setComics(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response);
      }
    };
    fetchComics();
  }, [page, limit, search]);

  return isLoading ? (
    <div className="loading-container rotating">
      <img src="" alt="chargement" />
    </div>
  ) : (
    <div className="comics-container">
      <div className="comics-content">
        <h2>Comics</h2>
        <div className="limit">
          <span>Comic par page </span>
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
        <div className="all-comics">
          {comics.results.map((comic, index) => {
            const isDefaultImage =
              comic.thumbnail.path ===
                "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available" ||
              comic.thumbnail.path ===
                "http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708";

            return (
              <Link key={comic._id + index} to={`/comic/${comic._id}`}>
                <div className="one-comic">
                  <div
                    className="comic-pic-container"
                    style={{
                      backgroundImage: isDefaultImage
                        ? `url(${H2G2})`
                        : `url(${comic.thumbnail.path}.${comic.thumbnail.extension})`,
                    }}
                  ></div>

                  <button className="favorite-btn" onClick={() => {}}>
                    <BsBalloonHeart />
                  </button>
                  <h3 className="comics-name">{comic.title}</h3>
                  {comic.description && (
                    <p className="comic-description">{comic.description}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="pagination">{paginationButtons()}</div>
    </div>
  );
};

export default Comics;
