import { useQuery } from "react-query";
import axios from "axios";
import { SampleService } from "services";
import { useQueryClient, QueryClient } from "react-query";
const queryClient = new QueryClient();

/*const useSampleData = () => {
  return useQuery({ queryKey: ["repo-data"], queryFn: () => SampleService.getSampleData });
};

export default useSampleData;*/

/*export default function useSampleData() {
  return useQuery("repo-data",  () => SampleService.getSampleData );
};*/

export default function useSampleData() {
  return useQuery("repo-data", () =>
    axios
      .get("https://api.github.com/repos/tannerlinsley/react-query")
      .then((response) => response.data)
  );
}
