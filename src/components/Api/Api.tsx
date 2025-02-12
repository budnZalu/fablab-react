import { mockJobs } from '../../data/mock';

interface Job {
    id: string;
    name: string;
    price: number;
    image: string;
    info: string;
}

interface jobParams {
    job_name?: string;
}

// Функция для получения всех работ
export const fetchJobs = async (searchQuery: string = ""): Promise<Job[]> => {
    try {
        const params: jobParams = {};

        if (searchQuery) {
            params.job_name = searchQuery;
        }

        const query = new URLSearchParams(params).toString();

        const response = await fetch(`/api/jobs?${query}`);

        if (!response.ok) {
            throw new Error('API error');
        }

        const data = await response.json();
        return data.jobs;
    } catch (error) {
        console.log('Error fetching jobs:', error);
        return mockJobs.filter((job) => job.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
};

// Функция для получения работы по id
export const fetchJobById = async (id: string): Promise<Job | undefined> => {
    try {
        const response = await fetch(`/api/jobs/${id}`);

        if (!response.ok) {
            throw new Error('API error');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error fetching job by id:', error);
        return mockJobs[parseInt(id) - 1];
    }
};
