import axios from "axios";

const getUserData = async () => {
  return axios
    .get("http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/accounts/")
    .then((response) => {
      return response.data;
    });
};

const register = async (first_name, last_name, phone, email, password) => {
  //Creating JSON object because on the backend JSON object is only accepted
  const user = {
    first_name,
    last_name,
    phone,
    email,
    password,
  };
  user.email_address = user.email;
  delete user.email;
  return axios
    .post(`http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/register/`, user)
    .then((response) => {
      //console.log(response)
      return response.data;
    })
    .catch((error) => {
      console.error("Error adding a new user:", error);
    });
};

const login = async (email, password) => {
  //Creating JSON object because on the backend JSON object is only accepted
  const user = {
    email,
    password,
  };
  user.email_address = user.email;
  delete user.email;
  return axios
    .post(`http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/login/`, user)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error logging: ", error);
    });
};

export const sendEmailToCustomerService = async (title, description) => {
  const user = {
    title,
    description,
  };

  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found in local storage");
    return;
  }

  return axios
    .post(
      `http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/sendemailtocustomerservice/`,
      user,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error logging: ", error);
      throw error;
    });
};

const userDataUpdate = async (first_name, last_name, email, phone) => {
  const user = {
    first_name,
    last_name,
    email,
    phone,
  };
  user.email_address = user.email;
  delete user.email;

  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found in local storage");
    return;
  }

  return axios
    .put(
      `http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/userdataupdate/`,
      user,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    )
    .then((response) => {
      if (response.data.status !== 200) {
        throw new Error(response.data.message || "Unknown error");
      }
      return response.data;
    })
    .catch((error) => {
      console.error("Error updating: ", error);
      throw error;
    });
};

const markUserAsDeleted = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found in local storage");
    return;
  }

  return axios
    .post(
      "http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/markuserasdeleted/",
      {},
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    )
    .then((response) => {
      if (response.data.status !== 200) {
        throw new Error(response.data.message || "Unknown error");
      }
      return response.data;
    })
    .catch((error) => {
      console.error("Error deleting an account: ", error);
      throw error;
    });
};

const verifyAccount = async (register_token) => {
  try {
    const user = {
      register_token,
    };
    const response = await axios.post(
      `http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/verifyaccount/`,
      user,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status !== 200 && response.data.status !== 400) {
      throw new Error(response.data.message || "Unknown error");
    }
    return response.data;
  } catch (error) {
    console.error("Error verifying an account: ", error);
    throw error;
  }
};

export default {
  getUserData,
  register,
  login,
  sendEmailToCustomerService,
  userDataUpdate,
  markUserAsDeleted,
  verifyAccount,
};
