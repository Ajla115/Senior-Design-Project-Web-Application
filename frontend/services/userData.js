import axios from "axios";

const getUserData = async () => {
  return axios
    .get("http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/accounts/")
    .then((response) => {
      return response.data;
    });
};

const register = async (first_name, last_name, email, password) => {
  //Creating JSON object because on the backend JSON object is only accepted
  const user = {
    first_name,
    last_name,
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
    description
  };

  const token = localStorage.getItem('token');

  if (!token) {
    console.error('No token found in local storage');
    return;
  }

  return axios
    .post(`http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/sendemailtocustomerservice/`, user, {
      headers: {
        'Authorization': `${token}`
      }
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error logging: ", error);
      throw error; 
    });
};


const changeData = async (first_name, last_name, email) => {
  //Creating JSON object because on the backend JSON object is only accepted
  const user = {
    first_name,
    last_name,
    email
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



export default { getUserData, register, login, sendEmailToCustomerService };
