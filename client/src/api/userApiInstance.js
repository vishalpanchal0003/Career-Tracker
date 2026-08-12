import axios from "axios";

const baseUrl = "http://localhost:5000/api/auth";

const publicApi = axios.create({
  baseURL: baseUrl,
  // withCredentials: true,
});

const privateApi = axios.create({
  baseURL: baseUrl,
  // withCredentials: true,
});

privateApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token && token !== "undefined" && token !== "null") {
    config.headers.Authorization = `Bearer ${token.trim()}`;
  }

  return config;
});

export const register = async (userData) => {
  try {
    const response = await publicApi.post("/register", userData);
    return response.data;
  } catch (error) {
    console.log(error)
    throw error
  }
};

export const userProfile = async () => {
  try {
    const response = await privateApi.get('/userprofile');
    return response.data;
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const login = async (userData) => {
  try {
    const response = await privateApi.post("/login", userData);
    return response;
  } catch (error) {
    console.log(error)
    throw error
  }
};


export const logout = async () => {
  const response = await privateApi.get('/logout');
  return response.data
}

export const userDetailsUpdate = async (userData) => {
  const response = await privateApi.post('/updateprofile', userData);
  return response.data
}

export const updateUserPassword = async (userData) => {
  const response = await privateApi.post("/changepassword", userData)
  return response.data
}



export { privateApi };