import axios from "axios";

// const baseUrl = `${import.meta.env.VITE_API_URL}/api/jobs`;
const baseUrl = "http://localhost:5000/api/jobs"

const jobApiInstance = axios.create({
    baseURL: baseUrl
});

jobApiInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");

        if (token && token !== "null" && token !== "undefined") {
            config.headers.Authorization = `Bearer ${token.trim()}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const getJobStats = async () => {
    try {
        const response = await jobApiInstance.get("/stats");
        return response.data;
    } catch (error) {
        console.log(error)
        throw error
    }
};


export const InfiniteScroll = async (pageParam) => {
    try {
        const res = await jobApiInstance.get(`/alljobs?offset=${pageParam}&limit=10`);
        return res.data;
    } catch (error) {
        console.log(error)
    }

}


const createJob = async (jobdata) => {
    try {
        const response = await jobApiInstance.post('/createjob', jobdata);
        return response.data;
    } catch (error) {
        console.log(error)
        throw error
    }
}

const updateJobDetails = async (jobId, jobData) => {
    try {
        const response = await jobApiInstance.patch(`updatejob/${jobId}`, jobData);
        return response.data;
    } catch (error) {
        console.log(error)
        throw error
    }
}
const deleteJob = async (jobId) => {
    try {
        const response = await jobApiInstance.delete(`deletejob/${jobId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export { getJobStats, updateJobDetails, deleteJob, createJob, }