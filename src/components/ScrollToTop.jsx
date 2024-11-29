import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTop = () => {
  const [displayScrollBtn, setDisplayScrollBtn] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setDisplayScrollBtn(true);
      } else {
        setDisplayScrollBtn(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {displayScrollBtn && (
        <button
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "white",
            color: "black",
            border: "none",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            fontSize: "25px",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FaArrowUp />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
