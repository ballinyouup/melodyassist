import { useState } from "react";
import axios, { type AxiosResponse } from "axios";

interface IAudio {
  completed_at: null | string;
  created_at: string;
  error: null | string;
  id: string;
  input: {
    seed: string;
  };
  logs: null | string;
  metrics: Record<string, unknown>;
  output: null | string;
  started_at: null | string;
  status: string;
  version: string;
}

const apikey = "88c2e01e71137582c7855a1195f074f5d3bbd22b";

const useAudio = () => {
  const [data, setData] = useState<IAudio>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchData = async (url: string) => {
    setIsLoading(true);
    try {
      const response: AxiosResponse = await axios.post(
        url,
        {
          version:
            "0de4a5f14b9120ce02c590eb9cf6c94841569fafbc4be7ab37436ce738bcf49f",
          input: {
            seed: "-1",
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${apikey}`,
          },
        }
      );
      setData(response.data as IAudio);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err);
      setIsLoading(false);
    }
  };
  return { data, isLoading, error, fetchData };
};

export default useAudio;
