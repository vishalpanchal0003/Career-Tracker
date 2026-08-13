import axios from "axios";

const baseUrl = `${import.meta.env.VITE_API_URL}/api/jobs`;
const jobApiInstance = axios.create({
    baseURL: baseUrl,
    // withCredentials: true,
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


const getAllJob = async () => {
    try {
        const resposne = await jobApiInstance.get('/alljobs');
        return resposne.data
    } catch (error) {
        console.log(error)
        throw error

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

export { getJobStats, updateJobDetails, deleteJob, createJob, getAllJob }