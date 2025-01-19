import axios from 'axios'
import { useQuery } from 'react-query'

function UseJobs() {
  const { data: jobs = [] } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data } = await axios("http://localhost:9000/jobs");
      return data;
    },
  });


  return { jobs }


}

export default UseJobs