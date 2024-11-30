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
        <button onClick={scrollToTop} className="scroll-to-top">
          <FaArrowUp />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
