/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */
import Cookies from "js-cookie";

export interface Job {
    /** ID */
    id?: number;
    /**
     * Name
     * @minLength 1
     * @maxLength 100
     */
    name: string;
    /**
     * Info
     * @minLength 1
     */
    info: string;
    /**
     * Price
     * @min 0
     * @max 2147483647
     */
    price: number;
    /**
     * Image
     * @format uri
     * @minLength 1
     */
    image?: string | null;
    /** Status */
    status?: "visible" | "deleted";
}

export interface User {
    /**
     * Email адрес
     * @format email
     * @minLength 1
     * @maxLength 254
     */
    email: string;
    /**
     * Пароль
     * @minLength 1
     */
    password: string;
    firstName?: string;
    lastName?: string;
    /** Является ли пользователь менеджером? */
    is_staff?: boolean;
    /** Является ли пользователь админом? */
    is_superuser?: boolean;
}

import type {AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
    /** set parameter to `true` for call `securityWorker` for this request */
    secure?: boolean;
    /** request path */
    path: string;
    /** content type of request body */
    type?: ContentType;
    /** query params */
    query?: QueryParamsType;
    /** format of response (i.e. response.json() -> format: "json") */
    format?: ResponseType;
    /** request body */
    body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
    securityWorker?: (
        securityData: SecurityDataType | null,
    ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
    secure?: boolean;
    format?: ResponseType;
}

export enum ContentType {
    Json = "application/json",
    FormData = "multipart/form-data",
    UrlEncoded = "application/x-www-form-urlencoded",
    Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
    public instance: AxiosInstance;
    private securityData: SecurityDataType | null = null;
    private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
    private secure?: boolean;
    private format?: ResponseType;

    constructor({securityWorker, secure, format, ...axiosConfig}: ApiConfig<SecurityDataType> = {}) {
        this.instance = axios.create({...axiosConfig, baseURL: axiosConfig.baseURL || "http://localhost:8000/api"});
        this.secure = secure;
        this.format = format;
        this.securityWorker = securityWorker;
    }

    public setSecurityData = (data: SecurityDataType | null) => {
        this.securityData = data;
    };

    protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
        const method = params1.method || (params2 && params2.method);

        return {
            ...this.instance.defaults,
            ...params1,
            ...(params2 || {}),
            headers: {
                ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
                ...(params1.headers || {}),
                ...((params2 && params2.headers) || {}),
            },
        };
    }

    protected stringifyFormItem(formItem: unknown) {
        if (typeof formItem === "object" && formItem !== null) {
            return JSON.stringify(formItem);
        } else {
            return `${formItem}`;
        }
    }

    protected createFormData(input: Record<string, unknown>): FormData {
        if (input instanceof FormData) {
            return input;
        }
        return Object.keys(input || {}).reduce((formData, key) => {
            const property = input[key];
            const propertyContent: any[] = property instanceof Array ? property : [property];

            for (const formItem of propertyContent) {
                const isFileType = formItem instanceof Blob || formItem instanceof File;
                formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
            }

            return formData;
        }, new FormData());
    }

    public request = async <T = any, _E = any>({
                                                   secure,
                                                   path,
                                                   type,
                                                   query,
                                                   format,
                                                   body,
                                                   ...params
                                               }: FullRequestParams): Promise<AxiosResponse<T>> => {
        const csrfToken = Cookies.get('csrftoken');
        const secureParams =
            ((typeof secure === "boolean" ? secure : this.secure) &&
                this.securityWorker &&
                (await this.securityWorker(this.securityData))) ||
            {};
        const requestParams = this.mergeRequestParams(params, secureParams);
        const responseFormat = format || this.format || undefined;

        if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
            body = this.createFormData(body as Record<string, unknown>);
        }

        if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
            body = JSON.stringify(body);
        }

        return this.instance.request({
            ...requestParams,
            headers: {
                ...(requestParams.headers || {}),
                ...(type ? {"Content-Type": type} : {}),
                ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
            },
            params: query,
            responseType: responseFormat,
            data: body,
            url: path,
        });
    };
}

/**
 * @title Snippets API
 * @version v1
 * @license BSD License
 * @termsOfService https://www.google.com/policies/terms/
 * @baseUrl http://localhost:8000/api
 * @contact <contact@snippets.local>
 *
 * Test description
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
    jobs = {
        /**
         * No description
         *
         * @tags jobs
         * @name JobsList
         * @request GET:/jobs/
         * @secure
         */
        jobsList: (query: { job_name: any },
                   params?: { job_name: any }) =>
            this.request<void, any>({
                path: `/jobs/`,
                method: "GET",
                query: query,
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags jobs
         * @name JobsCreate
         * @request POST:/jobs/
         * @secure
         */
        jobsCreate: (data: Job, params: RequestParams = {}) =>
            this.request<Job, any>({
                path: `/jobs/`,
                method: "POST",
                body: data,
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags jobs
         * @name JobsRead
         * @request GET:/jobs/{id}/
         * @secure
         */
        jobsRead: (id: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/jobs/${id}/`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags jobs
         * @name JobsUpdate
         * @request PUT:/jobs/{id}/
         * @secure
         */
        jobsUpdate: (id: string, data: Job, params: RequestParams = {}) =>
            this.request<Job, any>({
                path: `/jobs/${id}/`,
                method: "PUT",
                body: data,
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags jobs
         * @name JobsDelete
         * @request DELETE:/jobs/{id}/
         * @secure
         */
        jobsDelete: (id: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/jobs/${id}/`,
                method: "DELETE",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags jobs
         * @name JobsImageCreate
         * @request POST:/jobs/{id}/image/
         * @secure
         */
        jobsImageCreate: (id: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/jobs/${id}/image/`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags jobs
         * @name JobsPrintingCreate
         * @request POST:/jobs/{id}/printing/
         * @secure
         */
        jobsPrintingCreate: (id: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/jobs/${id}/printing/`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags jobs
         * @name JobsPrintingUpdate
         * @request PUT:/jobs/{id}/printing/
         * @secure
         */
        jobsPrintingUpdate: (id: string, params?: { duration: number }) =>
            this.request<void, any>({
                path: `/jobs/${id}/printing/`,
                method: "PUT",
                secure: false,
                body: params,
                ...params
            }),
        /**
         * No description
         *
         * @tags jobs
         * @name JobsPrintingDelete
         * @request DELETE:/jobs/{id}/printing/
         * @secure
         */
        jobsPrintingDelete: (id: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/jobs/${id}/printing/`,
                method: "DELETE",
                secure: true,
                ...params,
            }),
    };
    login = {
        /**
         * No description
         *
         * @tags login
         * @name LoginCreate
         * @request POST:/login/
         * @secure
         */
        loginCreate: (data: User, params: RequestParams = {}) =>
            this.request<User, any>({
                path: `/login/`,
                method: "POST",
                body: data,
                secure: true,
                format: "json",
                ...params,
            }),
    };
    logout = {
        /**
         * No description
         *
         * @tags logout
         * @name LogoutCreate
         * @request POST:/logout/
         * @secure
         */
        logoutCreate: (params: RequestParams = {}) =>
            this.request<User, any>({
                path: `/logout/`,
                method: "POST",
                secure: true,
                format: "json",
                withCredentials: true,
                ...params,
            }),
    };
    users = {
        usersCreate: (data: User, params: RequestParams = {}) =>
            this.request<User, any>({
                path: `/users/`,
                method: "POST",
                body: data,
                secure: true,
                format: "json",
                ...params,
            }),
        usersUpdate: (data: User, params: RequestParams = {}) =>
            this.request<User, any>({
                path: `/users/`,
                method: "PUT",
                body: data,
                secure: true,
                format: "json",
                ...params,
            }),
        currentUser: (params: RequestParams = {}) =>
            this.request<User, any>({
                path: `/current-user/`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),
    }
    printings = {
        /**
         * No description
         *
         * @tags printings
         * @name PrintingsList
         * @request GET:/printings/
         * @secure
         */
        printingsList: (params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/printings/`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags printings
         * @name PrintingsRead
         * @request GET:/printings/{id}/
         * @secure
         */
        printingsRead: (id: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/printings/${id}/`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags printings
         * @name PrintingsUpdate
         * @request PUT:/printings/{id}/
         * @secure
         */
        printingsUpdate: (id: string, params?: {
            total_price: number | null;
            author: string;
            name: string;
            status: "draft" | "deleted" | "complete" | "formed" | "rejected"
        }) =>
            this.request<void, any>({
                path: `/printings/${id}/`,
                method: "PUT",
                secure: true,
                body: params,
                ...params,
            }),

        /**
         * No description
         *
         * @tags printings
         * @name PrintingsDelete
         * @request DELETE:/printings/{id}/
         * @secure
         */
        printingsDelete: (id: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/printings/${id}/`,
                method: "DELETE",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags printings
         * @name PrintingsCompleteCreate
         * @request POST:/printings/{id}/complete/
         * @secure
         */
        printingsCompleteCreate: (id: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/printings/${id}/complete/`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags printings
         * @name PrintingsFormCreate
         * @request POST:/printings/{id}/form/
         * @secure
         */
        printingsFormCreate: (id: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/printings/${id}/form/`,
                method: "POST",
                secure: true,
                ...params,
            }),
    };
    user = {
        /**
         * @description Класс, описывающий методы работы с пользователями Осуществляет связь с таблицей пользователей в базе данных
         *
         * @tags user
         * @name UserList
         * @request GET:/user/
         * @secure
         */
        userList: (params: RequestParams = {}) =>
            this.request<User[], any>({
                path: `/user/`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Функция регистрации новых пользователей Если пользователя c указанным в request email ещё нет, в БД будет добавлен новый пользователь.
         *
         * @tags user
         * @name UserCreate
         * @request POST:/user/
         * @secure
         */
        userCreate: (data: User, params: RequestParams = {}) =>
            this.request<User, any>({
                path: `/user/`,
                method: "POST",
                body: data,
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Класс, описывающий методы работы с пользователями Осуществляет связь с таблицей пользователей в базе данных
         *
         * @tags user
         * @name UserRead
         * @request GET:/user/{id}/
         * @secure
         */
        userRead: (id: number, params: RequestParams = {}) =>
            this.request<User, any>({
                path: `/user/${id}/`,
                method: "GET",
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Класс, описывающий методы работы с пользователями Осуществляет связь с таблицей пользователей в базе данных
         *
         * @tags user
         * @name UserUpdate
         * @request PUT:/user/{id}/
         * @secure
         */
        userUpdate: (id: number, data: User, params: RequestParams = {}) =>
            this.request<User, any>({
                path: `/user/${id}/`,
                method: "PUT",
                body: data,
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Класс, описывающий методы работы с пользователями Осуществляет связь с таблицей пользователей в базе данных
         *
         * @tags user
         * @name UserPartialUpdate
         * @request PATCH:/user/{id}/
         * @secure
         */
        userPartialUpdate: (id: number, data: User, params: RequestParams = {}) =>
            this.request<User, any>({
                path: `/user/${id}/`,
                method: "PATCH",
                body: data,
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * @description Класс, описывающий методы работы с пользователями Осуществляет связь с таблицей пользователей в базе данных
         *
         * @tags user
         * @name UserDelete
         * @request DELETE:/user/{id}/
         * @secure
         */
        userDelete: (id: number, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/user/${id}/`,
                method: "DELETE",
                secure: true,
                ...params,
            }),
    };
    static jobs: {
        jobsDelete: (id: string, params?: RequestParams) => Promise<AxiosResponse<void>>;
        jobsPrintingCreate: (id: string, params?: RequestParams) => Promise<AxiosResponse<void>>;
        jobsPrintingDelete: (id: string, params?: RequestParams) => Promise<AxiosResponse<void>>;
        jobsPrintingUpdate: (id: string, params?: RequestParams) => Promise<AxiosResponse<void>>;
        jobsUpdate: (id: string, data: Job, params?: RequestParams) => Promise<AxiosResponse<Job>>;
        jobsList: (params?: { job_name: any }) => Promise<AxiosResponse<void>>;
        jobsRead: (id: string, params?: RequestParams) => Promise<AxiosResponse<void>>;
        jobsImageCreate: (id: string, params?: RequestParams) => Promise<AxiosResponse<void>>;
        jobsCreate: (data: Job, params?: RequestParams) => Promise<AxiosResponse<Job>>
    };
}
