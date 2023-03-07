import { useEffect } from "react";

const useDocTitle = (title) => {
  useEffect(() => {
    if (title) {
      document.title = `${title}`;
    } else {
      document.title = "J4F - ITBook | Book Store";
    }
  }, [title]);

  return null;
};

export default useDocTitle;
