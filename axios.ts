import axios, { InternalAxiosRequestConfig } from "axios";
import { calculateDatesDifference } from "./src/utils/dates";

type StoredToken = { dateCreated: string | null; token?: string };
const initialToken: StoredToken = { dateCreated: null, token: undefined };

const safeParse = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
};

const getStoredToken = (): StoredToken => {
  return safeParse<StoredToken>(sessionStorage.getItem('Token'), initialToken);
};

const setStoredToken = (token: string) => {
  const tokenData: StoredToken = { token, dateCreated: new Date().toISOString() };
  sessionStorage.setItem('Token', JSON.stringify(tokenData));
};

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API,
});

const refreshToken = async () => {
  const axiosClientRefresh = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { 'Content-Type': 'application/json' }
  });

  const secretKey = import.meta.env.VITE_HANDSHAKE_SECRET;
  const stored = getStoredToken();
  if (!stored.token) {
    return;
  }

  const tokenRequest = { token: stored.token, secretKey };

  try {
    const response = await axiosClientRefresh.post(`/JWTSecurity/RefreshToken`, tokenRequest);
    setStoredToken(response.data);
  } catch (error) {
    console.error(error);
  }
};

axiosClient.interceptors.request.use(
  async function (config: InternalAxiosRequestConfig & { metadata?: any }) {
    config.metadata = { startTime: Date.now() };

    let tokenData = getStoredToken();

    if (tokenData.dateCreated) {
      const tokenDate = new Date(tokenData.dateCreated);
      const now = new Date();
      const minutesDifference = calculateDatesDifference(now, tokenDate, 'minutes');

      if (minutesDifference >= 1380) {
        await refreshToken();
        tokenData = getStoredToken();
      }
    }

    if (tokenData.token) {
      (config.headers as any).Authorization = `Bearer ${tokenData.token}`;
    } else {
      delete (config.headers as any).Authorization;
    }

    return config;
  },
  function (error: any) {
    return Promise.reject(error);
  }
);

export default axiosClient;