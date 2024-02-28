import axios from "axios";

const getUserData = async () => {
  return axios.get("http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/accounts/").then((response) => {
    return response.data;
  });
};



const register = async () => {
  return axios.get("http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/register/").then((response) => {
    return response.data;
  });
};

export default { getUserData, register  };