import axios from "axios";
import UseAuth from "./UseAuth";


const axiosSecure = axios.create({
  baseURL: 'http://localhost:9000',
  withCredentials: true
});

const useAxios = () => {
  const { logOut } = UseAuth()

  axiosSecure.interceptors.response.use((response) => {
    return response
  }, (error) => {


    if (error.status === 403 || error.status === 401) {
      logOut()
    }


    return Promise.reject(error.status)

  });


  return axiosSecure
}

export default useAxios