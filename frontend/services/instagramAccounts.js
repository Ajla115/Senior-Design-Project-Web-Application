import axios from "axios";

const getAccountData = async () => {
  return axios
    .get("http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/accounts/")
    .then((response) => {
      return response.data;
    });
};

const deleteAccount = async (customerId) => {
  console.log(customerId);
  return axios
    .delete(
      `http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/accounts/${customerId}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error deleting resource:", error);
    });
};

const addAccount = async (username) => {
  return axios
    .post(
      `http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/accounts/${username}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error adding an username to the database:", error);
    });
};


export default { getAccountData, deleteAccount, addAccount };
