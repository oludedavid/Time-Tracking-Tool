import axios, { AxiosRequestConfig } from "axios";
import { TFetchDataParam } from "@/types";

export async function fetchData({ url, token, headers = {} }: TFetchDataParam) {
  try {
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        ...headers,
      },
    };

    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
