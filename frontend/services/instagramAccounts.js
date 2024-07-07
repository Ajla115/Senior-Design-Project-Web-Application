import axios from "axios";

const getAccountData = async () => {
  //console.log("Beton");
  return axios
    .get("http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/accounts/")
    .then((response) => {
      return response.data;
    });
};

const getHashtagData = async () => {
  return axios
    .get("http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/hashtags/")
    .then((response) => {
      return response.data;
    });
};

const getAccountsPerHashtag = async (hashtagId) => {
  return axios
    .get(
      `http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/accountsperhashtag/${hashtagId}`
    )
    .then((response) => {
      return response.data;
    });
};

const getAccountDataPerHashtag = async (hashtagId) => {
  return axios
    .get(
      `http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/accountsdataperhashtag/${hashtagId}`
    )
    .then((response) => {
      return response.data;
    });
};

const deleteAccount = async (customerId) => {
  //console.log(customerId);
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

const deleteHashtag = async (hashtagId) => {
  //console.log(customerId);
  return axios
    .delete(
      `http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/hashtags/${hashtagId}`
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

const addHashtag = async (hashtag) => {
  return axios
    .post(`http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/hashtags/${hashtag}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error adding an hashtag to the database:", error);
    });
};

const getTotalAccounts = async () => {
  return axios
    .get('http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/all_accounts/total')
    .then((response) => {
      return response.data.message;
    })
    .catch((error) => {
      console.error("Error fetching total users:", error);
      return 0; 
    });
};

const getTotalHashtags = async () => {
  return axios
    .get('http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/all_hashtags/')
    .then((response) => {
      return response.data.message;
    })
    .catch((error) => {
      console.error("Error fetching number of hashtags:", error);
      return 0; 
    });
};



export default {
  getAccountData,
  getHashtagData,
  getAccountsPerHashtag,
  getAccountDataPerHashtag,
  deleteAccount,
  deleteHashtag,
  addAccount,
  addHashtag,
  getTotalAccounts,
  getTotalHashtags
};
