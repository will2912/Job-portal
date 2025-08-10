import { useSession } from "@clerk/clerk-react";
import { useState } from "react";

const useFetch = (cb) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const { session } = useSession();

  const fn = async (saveData, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const supabaseAccessToken = await session.getToken({ template: "supabase" });
      const response = await cb(supabaseAccessToken, options, saveData);
      setData(response);
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn };
};

    export default useFetch;
