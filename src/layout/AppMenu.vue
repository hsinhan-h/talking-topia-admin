<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-compass', to: '/' }]
    },
    {
        label: '會員系統',
        icon: 'pi pi-fw pi-cog',
        to: '/pages',
        items: [
            {
                label: '會員資訊管理',
                icon: 'pi pi-fw pi-user-edit',
                to: '/pages/member-management'
            },
            {
                label: '教師申請審核',
                icon: 'pi pi-fw pi-eye',
                to: '/pages/tutor-approval'
            }
        ]
    },
    {
        label: '課程系統',
        icon: 'pi pi-fw pi-briefcase',
        to: '/pages',
        items: [
            {
                label: '課程資訊管理',
                icon: 'pi pi-fw pi-file-edit',
                to: '/pages/course-management'
            },
            {
                label: '課程上架審核',
                icon: 'pi pi-fw pi-eye',
                to: '/pages/course-approval'
            }
        ]
    },
    {
        label: '訂單及預約系統',
        icon: 'pi pi-fw pi-briefcase',
        to: '/pages',
        items: [
            {
                label: '訂單管理',
                icon: 'pi pi-fw pi-receipt',
                to: '/pages/order-management'
            },
            {
                label: '預約管理',
                icon: 'pi pi-fw pi-calendar-plus',
                to: '/pages/booking-management'
            }
        ]
    },
    {
        items: [{ label: '評論管理', icon: 'pi pi-fw pi-pen-to-square', to: '/pages/comment-management' }]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
