import axios from 'axios';

const apiHost = import.meta.env.VITE_API_HOST;

export const CourseManagementService = {
    async getCourseManagementData() {
        return axios
            .get(`${apiHost}/api/CourseManagementApi/GetCourseManagementData`)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.error('Error fetching course management data: ', error);
            });
    },

    async getCourseQty(startFromCurrentMonth) {
        return axios
            .get(`${apiHost}/api/CourseManagementApi/GetCourseQty`, {
                params: {
                    startFromCurrentMonth: startFromCurrentMonth
                }
            })
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.error('Error fetching course quantity: ', error);
            });
    },

    async getCourseQtyByPublishingStatus(isPublished, startFromCurrentMonth) {
        return axios
            .get(`${apiHost}/api/CourseManagementApi/GetCourseQtyByPublishingStatus`, {
                params: {
                    isPublished: isPublished,
                    startFromCurrentMonth: startFromCurrentMonth
                }
            })
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.error('Error fetching course quantity: ', error);
            });
    },

    async enableCourse(courseId, courseEnable) {
        return axios
            .put(`${apiHost}/api/CourseManagementApi/UpdatePublishingStatus`, { courseId: courseId, isEnabled: courseEnable })
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error approving course: ', error);
            });
    },

    async updateCourseData(courseData) {
        console.log(courseData);
        return axios
            .put(`${apiHost}/api/CourseManagementApi/UpdateCourseInfo`, courseData)
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error approving course: ', error);
            });
    }
};
