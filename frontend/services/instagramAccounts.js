import axios from "axios";

const getAccountData = async () => {
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

const deleteAccount2 = async (customerId) => {
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

const deleteAccount = async (customerId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found in local storage");
    throw new Error("No token found in local storage");
  }

  try {
    const response = await axios.delete(
      `http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/accounts/${customerId}`, 
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    console.log(response);

    if (response.data.status !== 200) {
      throw new Error(response.data.message || "Unknown error");
    }
    return response.data;
  } catch (error) {
    console.error("Error deleting an account: ", error);
    throw error;
  }
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
  
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found in local storage");
    return;
  }

  return axios
    .post(
      `http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/accounts/${username}`, {},
      
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    )
    .then((response) => {
      if (response.data.status !== 200 && response.data.status !== 400  ) {
        throw new Error(response.data.message || "Unknown error");
      }
      return response.data;
    })
    .catch((error) => {
      console.error("Error adding an account: ", error);
      throw error;
    });
};



const addHashtag = async (hashtag) => {
  try {
    const response = await axios.post(`http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/hashtags/${hashtag}`);
    console.log("Raja: ", response);
    if (response.status !== 200) {
      throw new Error(response.data.message || "Unknown error");
    }
    return response.data;
  } catch (error) {
    console.error("Error adding a hashtag to the database: ", error);
    throw error;
  }
};


// const addHashtag = async (hashtag) => {
//   try {
//     const response = await axios.post(`http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/hashtags/${hashtag}`);
//     return response;
//   } catch (error) {
//     console.error("Error adding a hashtag to the database:", error);
//     throw error;
//   }
// };

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
