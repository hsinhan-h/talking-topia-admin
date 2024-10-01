<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: '首頁',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: '會員系統',
        icon: 'pi pi-fw pi-briefcase',
        to: '/pages',
        items: [
            {
                label: '會員管理',
                icon: 'pi pi-fw pi-calendar-plus',
                to: '/pages/member-management'
            },
            {
                label: '訂單管理',
                icon: 'pi pi-fw pi-calendar-plus',
                to: '/pages/order-management'
            },
            {
                label: '評論管理',
                icon: 'pi pi-fw pi-calendar-plus',
                to: '/pages/comment-management'
            }
        ]
    },
    {
        label: '教師系統',
        icon: 'pi pi-fw pi-briefcase',
        to: '/pages',
        items: [
            {
                label: '教師管理',
                icon: 'pi pi-fw pi-calendar-plus',
                to: '/pages/tutor-management'
            },
            {
                label: '教師審核',
                icon: 'pi pi-fw pi-calendar-plus',
                to: '/pages/tutor-review'
            },
            {
                label: '課程審核',
                icon: 'pi pi-fw pi-calendar-plus',
                to: '/pages/course-review'
            }
        ]
    },

    {
        label: 'Get Started',
        items: [
            {
                label: 'Crud',
                icon: 'pi pi-fw pi-pencil',
                to: '/pages/crud'
            },
            {
                label: 'Documentation',
                icon: 'pi pi-fw pi-book',
                to: '/documentation'
            },
            {
                label: 'View Source',
                icon: 'pi pi-fw pi-github',
                url: 'https://github.com/primefaces/sakai-vue',
                target: '_blank'
            }
        ]
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
