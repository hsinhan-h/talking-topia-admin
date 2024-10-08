<script setup>
import axios from '@/axios'; // 使用您之前設定好的 Axios
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // 使用 Vue Router 進行頁面導航

// 定義變數
const email = ref('');
const password = ref('');
const checked = ref(false); // "Remember me" checkbox
const error = ref(null);
const loading = ref(false);

const router = useRouter(); // 初始化 router 用於頁面重定向

// 登入方法
const login = async () => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_BUILD}/api/auth/login`, {
            username: email.value,
            password: password.value
        });

        // 將 JWT Token 儲存到 localStorage
        localStorage.setItem('token', response.data.body.token);

        // 登入成功，跳轉到後台頁面
        await router.push('/');
    } catch (err) {
        // 處理錯誤，例如帳號或密碼錯誤
        error.value = err.response ? err.response.data.errMsg : '登入失敗，請稍後再試。';
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="container px-5">
        <div class="row">
            <div class="login-container">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-25 sm:px-15" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-8">歡迎回來 TalkingTopia!</div>
                    </div>
                    <div>
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">電子信箱</label>
                        <InputText id="email1" type="text" placeholder="電子信箱" class="w-full md:w-[31rem] mb-8" v-model="email" />

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">密碼</label>
                        <Password id="password1" v-model="password" placeholder="密碼" :toggleMask="true" class="md:w-[31rem] mb-4" fluid :feedback="false"></Password>

                        <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                            <div class="flex items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">記住我</label>
                            </div>
                            <span class="font-medium no-underline ml-1 text-right cursor-pointer text-primary">忘記密碼？</span>
                        </div>
                        <Button label="Sign In" class="w-full" as="router-link" to="/" :loading="loading" @click="login">登入</Button>

                        <div v-if="error" class="text-red-500 mt-4">
                            {{ error }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.login-container {
    max-width: 500px;
    margin: 80px auto;
    padding: 30px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    text-align: left;
}
</style>
<!-- <style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style> -->
