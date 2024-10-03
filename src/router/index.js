import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/pages/shippers',
                    name: 'shipper',
                    component: () => import('@/views/pages/Shippers.vue')
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: '/uikit/input',
                    name: 'input',
                    component: () => import('@/views/uikit/InputDoc.vue')
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/ButtonDoc.vue')
                },
                {
                    path: '/uikit/table',
                    name: 'table',
                    component: () => import('@/views/uikit/TableDoc.vue')
                },
                {
                    path: '/uikit/list',
                    name: 'list',
                    component: () => import('@/views/uikit/ListDoc.vue')
                },
                {
                    path: '/uikit/tree',
                    name: 'tree',
                    component: () => import('@/views/uikit/TreeDoc.vue')
                },
                {
                    path: '/uikit/panel',
                    name: 'panel',
                    component: () => import('@/views/uikit/PanelsDoc.vue')
                },

                {
                    path: '/uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/views/uikit/OverlayDoc.vue')
                },
                {
                    path: '/uikit/media',
                    name: 'media',
                    component: () => import('@/views/uikit/MediaDoc.vue')
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/MessagesDoc.vue')
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/FileDoc.vue')
                },
                {
                    path: '/uikit/menu',
                    name: 'menu',
                    component: () => import('@/views/uikit/MenuDoc.vue')
                },
                {
                    path: '/uikit/charts',
                    name: 'charts',
                    component: () => import('@/views/uikit/ChartDoc.vue')
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/MiscDoc.vue')
                },
                {
                    path: '/uikit/timeline',
                    name: 'timeline',
                    component: () => import('@/views/uikit/TimelineDoc.vue')
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/documentation',
                    name: 'documentation',
                    component: () => import('@/views/pages/Documentation.vue')
                },
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/TalkingTopiaDashboard.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/pages/member-management',
                    name: 'member-management',
                    component: () => import('@/views/pages/MemberManagement.vue')
                },
                {
                    path: '/pages/tutor-approval',
                    name: 'tutor-approval',
                    component: () => import('@/views/pages/TutorApproval.vue')
                },
                {
                    path: '/pages/course-management',
                    name: 'course-management',
                    component: () => import('@/views/pages/CourseManagement.vue')
                },
                {
                    path: '/pages/course-approval',
                    name: 'course-approval',
                    component: () => import('@/views/pages/CourseApproval.vue')
                },
                {
                    path: '/pages/order-management',
                    name: 'order-management',
                    component: () => import('@/views/pages/OrderManagement.vue')
                },
                {
                    path: '/pages/booking-management',
                    name: 'booking-management',
                    component: () => import('@/views/pages/BookingManagement.vue')
                },
                {
                    path: '/pages/comment-management',
                    name: 'comment-management',
                    component: () => import('@/views/pages/CommentManagement.vue')
                },
                {
                    path: '/pages/tutor-management',
                    name: 'tutor-management',
                    component: () => import('@/views/pages/TutorManagement.vue')
                },
                {
                    path: '/pages/course-review',
                    name: 'course-review',
                    component: () => import('@/views/pages/CourseReview.vue')
                },
                {
                    path: '/pages/tutor-review',
                    name: 'tutor-review',
                    component: () => import('@/views/pages/TutorReview.vue')
                }
            ]
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

export default router;
