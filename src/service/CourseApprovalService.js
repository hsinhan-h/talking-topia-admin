import axios from 'axios';

const apiHost = import.meta.env.VITE_API_HOST;

export const CourseApprovalService = {
    async getCourseApprovalList() {
        return axios
            .get(`${apiHost}/api/CourseManagementApi/GetCourseApprovalList`)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.error('Error fetching course approval list: ', error);
            });
    },

    async getUnapprovedCourseQtyStartingFrom2024() {
        return axios
            .get(`${apiHost}/api/CourseManagementApi/GetUnapprovedCourseQtyStartingFrom2024`)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.error('Error fetching unapproved course quantity: ', error);
            });
    },

    async getApprovedCourseQtyStartingFrom2024() {
        return axios
            .get(`${apiHost}/api/CourseManagementApi/GetApprovedCourseQtyStartingFrom2024`)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.error('Error fetching approved course quantity: ', error);
            });
    },

    async getRejectedCourseQtyStartingFrom2024() {
        return axios
            .get(`${apiHost}/api/CourseManagementApi/GetRejectedCourseQtyStartingFrom2024`)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.error('Error fetching unapproved course quantity: ', error);
            });
    },

    async approveCourse(courseId, courseApprove) {
        return axios
            .put(`${apiHost}/api/CourseManagementApi/UpdateCoursesStatus`, { courseId, courseApprove })
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error approving course: ', error);
            });
    }
};
