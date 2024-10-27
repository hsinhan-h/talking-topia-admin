import axios from 'axios';

const apiHost = import.meta.env.VITE_API_HOST;

export const CourseApprovalService = {
    async getCourseApprovalList() {
        return axios
            .get(`${apiHost}/api/CourseManagementApiDapper/GetCourseApprovalList`)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.error('Error fetching course approval list: ', error);
            });
    },

    async getCourseQtyByCoursesStatus(coursesStatus, startFromCurrentMonth) {
        return axios
            .get(`${apiHost}/api/CourseManagementApiDapper/GetCourseQtyByCoursesStatus`, {
                params: {
                    coursesStatus: coursesStatus,
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

    async approveCourse(courseId, courseApprove) {
        return axios
            .put(`${apiHost}/api/CourseManagementApiDapper/UpdateCoursesStatus`, { courseId, courseApprove })
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error approving course: ', error);
            });
    }
};
