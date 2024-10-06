<script setup>
import { useLayout } from '@/layout/composables/layout';
import Menu from 'primevue/menu'; // 引入 PrimeVue 的 Menu 組件
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // 引入 Vue Router
import AppConfigurator from './AppConfigurator.vue';

const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout();
const router = useRouter();

// 定義下拉選單的項目
const menuItems = ref([
    {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => {
            /* 跳轉到個人資料頁面 */
        }
    },
    {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
            logout();
        }
    } // 登出功能
]);

// 登出功能
const logout = () => {
    localStorage.removeItem('token'); // 清除 token
    router.push('/auth/login'); // 跳轉到登入頁面
};
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="onMenuToggle">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <div><img src="/public/demo/images/TalkingTopia logo_final.png" class="responsive-logo" /></div>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
                <div class="relative">
                    <button
                        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                        type="button"
                        class="layout-topbar-action layout-topbar-action-highlight"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <AppConfigurator />
                </div>
            </div>

            <button
                class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
            >
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <!-- 下拉式選單觸發器 -->
            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action" @click="$refs.menu.toggle($event)">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>

                    <!-- PrimeVue 的 Menu 組件，下拉選單 -->
                    <Menu ref="menu" :model="menuItems" popup />
                </div>
            </div>
        </div>
    </div>
</template>
