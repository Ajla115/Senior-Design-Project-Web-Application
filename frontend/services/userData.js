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

const changePassword = async (password, new_password, repeat_password) => {
  const user = {
    password,
    new_password,
    repeat_password
  }

  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found in local storage");
    return;
  }

  return axios
    .post(
      "http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/changepassword/",
      user, 
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
      console.error("Error deleting an account: ", error);
      throw error;
    });
};



const getTotalUsers = async () => {
  return axios
    .get('http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/totalUsers')
    .then((response) => {
      //console.log("Demo is ", response.data.message);
      return response.data.message;
    })
    .catch((error) => {
      console.error("Error fetching total users:", error);
      return 0; 
    });
};

const forgetPassword = async (email) => {
  const user = {
    email
  }
  return axios
    .post(
      "http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/forgetpassword/",
      user, )
    .then((response) => {
      if (response.data.status !== 200) {
        throw new Error(response.data.message || "Unknown error");
      }
      return response.data;
    })
    .catch((error) => {
      console.error("Error sending an email to reset account: ", error);
      throw error;
    });
};

const resetPassword = async (new_password, repeat_password, activation_token) => {
  const user = {
    new_password,
    repeat_password,
    activation_token
  }

  return axios
    .post(
      "http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/resetpassword/",
      user, )
    .then((response) => {
      if (response.data.status !== 200) {
        throw new Error(response.data.message || "Unknown error");
      }
      return response.data;
    })
    .catch((error) => {
      console.error("Error sending an email to reset account: ", error);
      throw error;
    });
};

const registerAdmin = async (first_name, last_name,  password, email, phone) => {
  const user = {
    first_name,
    last_name,
    password,
    email,
    phone
  };
  user.email_address = user.email;
  delete user.email;

  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found in local storage");
    return;
  }

  return axios
    .post(
      "http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/registeradmin/",
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
      console.error("Error adding an admin: ", error);
      throw error;
    });
};
  
const getAllAdmins = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found in local storage");
    return;
  }

  return axios
    .get(
      "http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/alladmins/",

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
      console.error("Error getting all admin accounts: ", error);
      throw error;
    });
};
  
const deleteAdmin = async (id) => {
  const user = {
    id
  }

  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found in local storage");
    return;
  }

  return axios
    .post(
      "http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/deleteadmin/",
      user, 
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",

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
      console.error("Error deleting an admin: ", error);
      throw error;
    });
};

const getActiveUsers = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found in local storage");
    return;
  }

  return axios
    .get(
      "http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/activeusers/",

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
      console.error("Error getting all user accounts: ", error);
      throw error;
    });
};
  
export default {
  getUserData,
  register,
  login,
  sendEmailToCustomerService,
  userDataUpdate,
  markUserAsDeleted,
  verifyAccount,
  changePassword,
  getTotalUsers,
  forgetPassword,
  resetPassword,
  registerAdmin,
  getAllAdmins,
  deleteAdmin,
  getActiveUsers
};
