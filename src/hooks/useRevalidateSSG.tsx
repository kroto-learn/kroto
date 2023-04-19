import axios from "axios";

const useRevalidateSSG = () => {
  const revalidate = async (path: string) => {
    try {
      await axios.get("/api/revalidate", {
        params: { path },
      });
    } catch (err) {
      console.log("Error in revalidate SSG", err);
    }
  };
  return revalidate;
};

export default useRevalidateSSG;
