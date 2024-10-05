import axios from 'axios';

const apiHost = import.meta.env.VITE_API_HOST;

export const CourseApprovalService = {
    getCourseApprovalList() {
        return axios
            .get(`${apiHost}/api/CourseManagementApi/GetCourseApprovalList`)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.error('Error fetching course approval list: ', error);
            });
    },

    approveCourse(courseId, courseApprove) {
        return axios
            .put(`${apiHost}/api/CourseManagementApi/UpdateCoursesStatus`, { courseId, courseApprove })
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error approving course: ', error);
            });
    }
};
