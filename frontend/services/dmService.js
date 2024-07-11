import axios from "axios";

export const addDM = async (dmData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in local storage");
      return;
    }

    const response = await axios.post(
      `http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/dm/`,
      dmData,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status !== 200) {
      throw new Error(response.data.message || "Unknown error");
    }
    return response.data;
  } catch (error) {
    console.error("Error verifying an account: ", error);
    throw error;
  }
};

export const getAllDMS = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in local storage");
      return;
    }

    const response = await axios.get(
      `http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/dms/`,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status !== 200) {
      throw new Error(response.data.message || "Unknown error");
    }
    return response.data.message;
  } catch (error) {
    console.error("Error fetching DMs: ", error);
    throw error;
  }
};

export const getSentDMS = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in local storage");
      return;
    }

    const response = await axios.get(
      `http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/sent_dms/`,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status !== 200) {
      throw new Error(response.data.message || "Unknown error");
    }
    return response.data.message;
  } catch (error) {
    console.error("Error fetching sent DMs: ", error);
    throw error;
  }
};



const deleteDM = async (customerId) => {
  try {
    const response = await axios.delete(
      `http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/dm/${customerId}`
    );

    if (response.status !== 200) {
      throw new Error(response.data.message || "Unknown error");
    }
    return response.data;
  } catch (error) {
    console.error("Error deleting a DM: ", error);
    throw error;
  }
};

const editDM = async (customerId, dmData) => {
  return axios
    .put(
      `http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/dm/${customerId}`,
      dmData
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error editing DM:", error);
    });
};

const getPercentageOfScheduledDMs = async () => {
  return axios
    .get(
      "http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/percentage_scheduled_dms"
    )
    .then((response) => {
      return response.data.percentage_scheduled;
    })
    .catch((error) => {
      console.error("Error fetching percentage of scheduled DMs:", error);
      return 0;
    });
};

export default {
  addDM,
  getAllDMS,
  deleteDM,
  editDM,
  getPercentageOfScheduledDMs,
  getSentDMS
};
