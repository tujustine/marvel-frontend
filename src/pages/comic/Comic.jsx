import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Comic = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [comic, setComic] = useState();

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
    <div>
      <div>
        <h2>{comic.title}</h2>
        <p>{comic.description}</p>
        <img
          src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
          alt=""
        />
      </div>
    </div>
  );
};

export default Comic;
