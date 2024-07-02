import { $authHost, $host } from "./index";

// Функция для создания новой должности
export const createJobTitle = async (jobTitle) => {
    const { data } = await $authHost.post('api/job-title', jobTitle);
    return data;
};

// Функция для получения списка всех должностей
export const fetchJobTitles = async () => {
    const { data } = await $host.get('api/job-title');
    return data;
};

// Функция для создания нового подразделения
export const createSubdivision = async (subdivision) => {
    const { data } = await $authHost.post('api/subdivision', subdivision);
    return data;
};

// Функция для получения списка всех подразделений
export const fetchSubdivision = async () => {
    const { data } = await $host.get('api/subdivision');
    return data;
};

// Функция для обновления данных о подразделении по его id
export const updateSubdivision = async (id, subdivision) => {
    const { data } = await $authHost.put(`api/subdivision/${id}`, subdivision);
    return data;
};

// Функция для удаления подразделения по его id
export const deleteSubdivision = async (id) => {
    const { data } = await $authHost.delete(`api/subdivision/${id}`);
    return data;
};

// Функция для создания нового сотрудника
export const createEmployee = async (employee) => {
    const { data } = await $authHost.post('api/employee', employee);
    return data;
};

// Функция для получения списка сотрудников с возможностью фильтрации по jobTitleId и awardId
export const fetchEmployees = async (jobTitleId, awardId, subdivisionId) => {
    const params = {};
    if (jobTitleId) params.jobTitleId = jobTitleId;
    if (awardId) params.awardId = awardId;
    if (subdivisionId) params.subdivisionId = subdivisionId;

    const { data } = await $host.get('api/employee', { params });
    return data;
};

// Функция для получения одного сотрудника по его id
export const fetchOneEmployee = async (id) => {
    const { data } = await $host.get(`api/employee/${id}`);
    return data;
};

// Функция для создания новой награды
export const createAward = async (award) => {
    const { data } = await $authHost.post('api/awards', award);
    return data;
};

// Функция для получения списка всех наград
export const fetchAwards = async () => {
    const { data } = await $host.get('api/awards');
    return data;
};

// Функция для удаления сотрудника по его id
export const deleteEmployee = async (id) => {
    const { data } = await $authHost.delete(`api/employee/${id}`);
    return data;
};

// Функция для удаления награды по её id
export const deleteAward = async (id) => {
    const { data } = await $authHost.delete(`api/awards/${id}`);
    return data;
};

// Функция для обновления данных о награде по её id
export const updateAward = async (id, award) => {
    const { data } = await $authHost.put(`api/awards/${id}`, award);
    return data;
};

// Функция для обновления данных о сотруднике по его id
export const updateEmployee = async (id, employee) => {
    const { data } = await $authHost.put(`api/employee/${id}`, employee);
    return data;
};

// Функция для обновления данных о должности по её id
export const updateJobTitle = async (id, jobTitle) => {
    const { data } = await $authHost.put(`api/job-title/${id}`, jobTitle);
    return data;
};

// Функция для удаления должности по её id
export const deleteJobTitle = async (id) => {
    const { data } = await $authHost.delete(`api/job-title/${id}`);
    return data;
};
