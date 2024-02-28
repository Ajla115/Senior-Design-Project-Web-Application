import axios from "axios";

const getSampleData = async () => {
  return axios.get("https://api.github.com/repos/tannerlinsley/react-query").then((response) => {
    return response.data;
  });
};

export default { getSampleData };
