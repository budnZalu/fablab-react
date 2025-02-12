import { mockJobs } from '../../data/mock';
import {dest_api} from "../../target_config.ts";

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

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const query = new URLSearchParams(params).toString();



        const response = await fetch(`${dest_api}/api/jobs?${query}`);

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
export const fetchJobById = async (id: string | undefined): Promise<Job | undefined> => {
    try {
        const response = await fetch(`${dest_api}/api/jobs/${id}`);

        if (!response.ok) {
            throw new Error('API error');
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.log('Error fetching job by id:', error);
        return mockJobs[parseInt(id as string) - 1];
    }
};
