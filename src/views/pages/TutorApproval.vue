<script setup>
import { MemberData } from '@/service/MemberManagementService';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref, computed} from 'vue';
import { retryWithDelay } from '@/helpers/retryWithDelay';
import { getImageDimensions } from '@/helpers/imageHelper';
import { ComfyUIService } from '@/service/ComfyUIService';
import { useAuthStore } from '@/stores/authStore'

const allTutorData = ref([]);
const approveApplicationDialog = ref(false);
const rejectApplicationDialog = ref(false);
const aiApplicationDialog = ref(false);
const selectedTutor = ref({});
const rejectReason = ref('');
const toast = useToast();
const today = new Date().toISOString();//有可能出問題的地方
const allTutorDataCount = ref({});
const authStore = useAuthStore(); 


//AI需要
const seed = ref(1);
const width = ref(1280);
const height = ref(720);
const count = ref(1);
const stylePrompt = ref('A professional portrait of an Asian male teacher around 30 years old, with a warm smile and approachable demeanor, set against a clean and tidy background.');
const promptId = ref('');
const sourceImageName = ref('');
const sourceImageUrl = ref('');
const createImageButtonState = computed(() => {
    return sourceImageUrl.value !== '' && stylePrompt.value !== '';
});
const getPromptResultState = ref(false);
const styleChangeImageUrls = ref([]);
const isLoading = ref(false);
const aiEnabled = ref(false);
const updateDbImg = ref(false);

onMounted(() => {
    // 獲取導師數據列表
    MemberData.getAllTutorDataList()
        .then((data) => {
            allTutorData.value = data;
        })
        .catch((error) => {
            console.error('獲取導師數據時發生錯誤:', error);
            toast.add({
                severity: 'error',
                summary: '錯誤',
                detail: '無法加載導師數據，請稍後再試。',
                life: 3000
            });
        });

    // 獲取導師統計數據
    MemberData.tutorInformation()
        .then((data) => {
            allTutorDataCount.value = data;
        })
        .catch((error) => {
            console.error('獲取導師統計信息時發生錯誤:', error);
            toast.add({
                severity: 'error',
                summary: '錯誤',
                detail: '無法加載導師統計信息，請稍後再試。',
                life: 3000
            });
        });
});
//AI 相關
async function onFileSelect (memberId) {
    try {
         // 1. 從後端取得圖片 URL 及檔名
         formLoading();
        const { headImgUrl, fileName } = await MemberData.getDbImgUrlfuntion(memberId);

        if (!headImgUrl) throw new Error('無法取得圖片 URL');

        // 2. 將 URL 轉為 File 物件
        const file = await urlToFile(headImgUrl, fileName);
        console.log('取得的圖片 URL:', headImgUrl);
        const imageDimension = await getImageDimensions(file);
        
        width.value = imageDimension.width;
        height.value = imageDimension.height;
        const uploadResult = await ComfyUIService.uploadStyleChangeImage(file);
        sourceImageName.value = uploadResult.name;
        const sourceImageUrlResult = await ComfyUIService.getPublicImageUrl(sourceImageName.value);
        sourceImageUrl.value = sourceImageUrlResult.publicUrl;
        toast.add({ severity: 'success', summary: '成功', detail: '圖片上傳成功', life: 3000 });
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: '錯誤', detail: '圖片上傳失敗', life: 3000 });
    } finally {
        formLoaded();
    }
};

const urlToFile = async (imageUrl, fileName) => {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new File([blob], fileName, { type: blob.type });
    };

const createCharacterPhotos = async () => {
    const body = {
        image_path: sourceImageName.value,
        style: stylePrompt.value,
        seed: seed.value,
        count: count.value,
        width: width.value,
        height: height.value
    };
    try {
        formLoading();
        const result = await ComfyUIService.createCharacterDesignImages(body);
        promptId.value = result.body.prompt_id;
        getPromptResultState.value = true;
        toast.add({ severity: 'success', summary: '成功', detail: result.message, life: 3000 });
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: '錯誤', detail: '圖片建立失敗', life: 3000 });
    } finally {
        formLoaded();
    }
};
const getPromptResult = async () => {
    try {
        formLoading();
        const result = await retryWithDelay(
            async () => {
                const response = await ComfyUIService.getCharacterDesignImages(promptId.value);
                if (response.isSuccess !== true) {
                    throw new Error('Result not ready');
                }
                return response;
            },
            {
                maxRetries: 6,
                delay: 10000,
                onRetry: (retryCount) => {
                    toast.add({
                        severity: 'info',
                        summary: '提示',
                        detail: `嘗試第 ${retryCount} 次失敗。將在 ${10000 / 1000} 秒後重新嘗試`,
                        life: 3000
                    });
                }
            }
        );
        styleChangeImageUrls.value = result.body.public_urls;
        getPromptResultState.value = false;
        updateDbImg.value =true;
        toast.add({ severity: 'success', summary: '成功', detail: '取得結果成功', life: 3000 });
    } catch (error) {
        console.error(error);
        updateDbImg.value =false;
        toast.add({ severity: 'error', summary: '錯誤', detail: '取得結果失敗', life: 3000 });
    } finally {
        formLoaded();
        // updateDbImg.value =true;
    }
};

async function updateFilebyAI(memberId){
    try {
    const updateDbImgUrl  = styleChangeImageUrls.value[0]
    await MemberData.updateImageUrlInDB(memberId, updateDbImgUrl);
    toast.add({
            severity: 'success',
            summary: '成功',
            detail: '圖片 URL 已成功更新至資料庫',
            life: 3000
        });
    } 
    catch (error) {
        console.error('更新失敗:', error);
        toast.add({
            severity: 'error',
            summary: '錯誤',
            detail: '無法更新圖片 URL',
            life: 3000
        });
    }
}

async function login() {
    const body = {
        email: "bs2024summer@build-school.com",
        password: "bs2024summer@build-school.com"
    };

    try {
        // 非同步等待伺服器回應
        const result = await ComfyUIService.login(body); 
        
        // 檢查 result.body 內的結構，取得 token
        const token = result.body?.token;  // 確認 token 存在

        if (!token) {
            throw new Error('Token not found in response');
        }

        // 使用 Pinia Store 儲存 token
        const authStore = useAuthStore();
        authStore.setToken(token);
    } catch (error) {
        console.error('Login Error:', error);
        toast.add({ 
            severity: 'error', 
            summary: '錯誤', 
            detail: 'Login Failed', 
            life: 3000 
        });
    }
    finally{
        aiEnabled.value = true;
    }
}

// 模擬登出行為，移除 token
function logout() {
  authStore.removeToken(); // 移除 token
  aiEnabled.value = false;
}


function showAIApplicationDialog(tutorData) {
    selectedTutor.value = { ...tutorData };
    console.log('AI的 selectedTutor:', tutorData);
    aiApplicationDialog.value = true;
    sourceImageName.value = ''; 
    sourceImageUrl.value = '';
    styleChangeImageUrls.value='';  
    promptId.value="";
    updateDbImg.value =false;
}

const formLoading = () => {
    isLoading.value = true;
};

const formLoaded = () => {
    isLoading.value = false;
};

//以上是AI相關


function showapproveApplicationDialog(tutorData) {
    selectedTutor.value = { ...tutorData };
    console.log('設置的 selectedTutor:', tutorData);
    approveApplicationDialog.value = true;
}

function showRejectApplicationDialog(tutorData) {
    selectedTutor.value = { ...tutorData };
    rejectApplicationDialog.value = true;
}



async function approveresumefuntion(memberId, ApplyStatus, hasSubmittedResume) {
    console.log('調用 approveresumefuntion:', memberId, ApplyStatus, hasSubmittedResume);
    if (hasSubmittedResume === 'N/A') {
        toast.add({
            severity: 'warn',
            summary: '提示',
            detail: '尚未填提交履歷！',
            life: 3000
        });
        return; // 終止函數執行
    }
    try {
        const tutorDto = {
            memberId,
            ApplyStatus,
            rejectReason: null,
            isTutor: true,
            approvedDateTime: today
        };

        console.log('發送的數據:', tutorDto);
        const response = await MemberData.approveTutorDataList(tutorDto);
        console.log('API 請求回應:', response);
        if (ApplyStatus === true) {
            toast.add({
                severity: 'success',
                summary: '成功',
                detail: '通過教師審核！',
                life: 3000
            });
            approveApplicationDialog.value = false;
        } else {
            toast.add({
                severity: 'info',
                summary: '成功',
                detail: '申請未通過！',
                life: 3000
            });
            rejectApplicationDialog.value = false;
        }

        // 更新教師數據列表
        await updateTutorDataList();
        await updateTutorStatistics();
    } catch (error) {
        console.error('教師審核失敗', error);
    }
}
async function rejectresumefuntion(memberId, ApplyStatus, hasSubmittedResume, rejectresonitem) {
    console.log('調用 approveresumefuntion:', memberId, ApplyStatus, hasSubmittedResume, rejectresonitem);
    if (hasSubmittedResume === 'N/A') {
        toast.add({
            severity: 'warn',
            summary: '提示',
            detail: '尚未填提交履歷！',
            life: 3000
        });
        return;
    }
    try {
        const tutorDto = {
            memberId,
            ApplyStatus,
            rejectReason: rejectresonitem == '無' ? null : rejectresonitem.toString().trim(),
            isTutor: false,
            approvedDateTime: today
        };

        console.log('發送的數據:', tutorDto);
        const response = await MemberData.rejectTutorDataList(tutorDto);
        console.log('API 請求回應:', response);
        if (ApplyStatus === true) {
            toast.add({
                severity: 'success',
                summary: '成功',
                detail: '通過教師審核！',
                life: 3000
            });
            approveApplicationDialog.value = false;
        } else {
            toast.add({
                severity: 'info',
                summary: '提示',
                detail: '申請未通過！',
                life: 3000
            });
            rejectApplicationDialog.value = false;
        }

        // 更新教師數據列表
        await updateTutorDataList();
        await updateTutorStatistics();
    } catch (error) {
        console.error('教師審核過程失敗', error);
    }
}

async function updateTutorDataList() {
    try {
        const updatedTutorApprovalData = await MemberData.getAllTutorDataList();
        allTutorData.value = updatedTutorApprovalData;
    } catch (error) {
        console.error('更新教師審核失敗', error);
        toast.add({ severity: 'error', summary: '錯誤', detail: '無法加載教師審核列表，請稍後再試。', life: 3000 });
    }
}
async function updateTutorStatistics() {
    try {
        const updatedStatistics = await MemberData.tutorInformation();
        allTutorDataCount.value = updatedStatistics || {};
    } catch (error) {
        console.error('更新導師統計數據失敗:', error);
    }
}
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 lg:col-span-3 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">當前會員數量</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ allTutorDataCount.memberCount }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-blue-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ allTutorDataCount.monthlyNewMemberCount }} new </span>
                <div class="text-muted-color">自{{ allTutorDataCount.currentMonth }}月以來</div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-3 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">已成為教師的數量</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ allTutorDataCount.isTutorCount }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-green-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-verified text-green-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ allTutorDataCount.monthlyIsTutorCount }} new </span>
                <div class="text-muted-color">自{{ allTutorDataCount.currentMonth }}月以來</div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-3 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">已申請履歷數量</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ allTutorDataCount.applyCount }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-red-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-book text-red-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ allTutorDataCount.monthlyApplyCount }} new </span>
                <div class="text-muted-color">自{{ allTutorDataCount.currentMonth }}月以來</div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-3 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">已駁回申請的數量</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ allTutorDataCount.pendingReviewCount }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-yellow-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-thumbs-down text-orange-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ allTutorDataCount.monthlyPendingReviewCount }} new </span>
                <div class="text-muted-color">自{{ allTutorDataCount.currentMonth }}月以來</div>
            </div>
        </div>
    </div>

    <div style="margin: 50px"></div>

    <div className="card">
        <DataTable :value="allTutorData" paginator :rows="6" :rowsPerPageOptions="[6, 12, 18]" tableStyle="min-width: 50rem">
            <Column field="memberId" header="會員編號" sortable=""></Column>
            <Column field="memberName" header="姓名" sortable=""></Column>
            <Column field="applyDateTime" header="履歷申請時間"></Column>
            <Column field="approvedDateTime" header="履歷審核通過時間"></Column>
            <Column field="resumeStatus" header="履歷審核狀態"></Column>
            <Column field="istutor" header="教師審核狀態"></Column>
            <Column field="rejectReason" header="教師申請駁回原因"></Column>
            <Column :exportable="false" style="min-width: 12rem" header="教師審核">
                <template #body="slotProps">
                    <Button icon="pi pi-check-circle" label="通過" class="mr-2" @click="showapproveApplicationDialog(slotProps.data)" />
                    <Button icon="pi pi-times-circle" label="駁回" @click="showRejectApplicationDialog(slotProps.data)" class="custom-secondary-button" />
                </template>
            </Column>
            <Column :exportable="false" style="min-width: 12rem" header="產生定裝照">
                <template #body="slotProps">
                    <Button icon="pi pi-check-circle" label="確認" class="mr-2" @click="showAIApplicationDialog(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="approveApplicationDialog" :style="{ width: '450px' }" header="通過申請" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span>是否已確認履歷等相關資訊 ?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="approveApplicationDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="approveresumefuntion(selectedTutor.memberId, true, selectedTutor.applyDateTime)" />
            </template>
        </Dialog>

        <Dialog v-model:visible="rejectApplicationDialog" :style="{ width: '450px' }" header="駁回申請" :modal="true">
            <div class="flex flex-col gap-4 justify-center items-center text-center">
                <div class="flex items-center gap-4">
                    <i class="pi pi-exclamation-triangle !text-3xl" />
                    <span>確定駁回教師申請 ?</span>
                </div>
                <Textarea v-model="rejectReason" rows="3" cols="50" placeholder="請輸入駁回原因"></Textarea>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="rejectApplicationDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="rejectresumefuntion(selectedTutor.memberId, false, selectedTutor.applyDateTime, rejectReason)" />
            </template>
        </Dialog>
        <Dialog v-model:visible="aiApplicationDialog" :style="{ width: '450px' }" header="產生定裝照" :modal="true">
            <div>
                <Button class="m-2 custom-secondary-button" @click="login" label="啟動AI產圖功能"></Button>
                <Button @click="logout" label="關閉AI產圖功能"></Button>
            </div>
        <div class="card flex flex-col gap-4 w-full" v-if="aiEnabled" >
            <div class="font-semibold text-xl">Character Change</div>
            <div class="flex flex-wrap">
                <label for="width" class="mb-2">Width</label>
                <InputNumber v-model="width" id="width" rows="4" :max="1280" fluid/>
            </div>
            <div class="flex flex-wrap">
                <label for="height" class="mb-2">Height</label>
                <InputNumber v-model="height" id="height" rows="4" :max="1280" fluid/>
            </div>
            <div class="flex flex-wrap">
                <label for="seed" class="mb-2">Seed</label>
                <InputNumber v-model="seed" id="seed" rows="4" :max="12000000" fluid />
            </div>
            <div class="flex flex-wrap">
                <label for="count" class="mb-2">Count</label>
                <InputNumber v-model="count" id="count" rows="4" :max="4" fluid disabled="true"/>
            </div>
            <div class="flex flex-wrap">
                <label for="style-prompt" class="mb-2">Style Prompt</label>
                <Textarea v-model="stylePrompt" id="style-prompt" rows="4" maxlength="5000" fluid />
            </div>
            <div class="flex flex-wrap">
                <label for="image-upload" class="w-full mb-2">Image Upload</label>
                <div class="card w-full p-0">
                    <Button mode="basic" @click="onFileSelect(selectedTutor.memberId)" customUpload auto severity="secondary" class="custom-secondary-button" v-if="!sourceImageUrl" id="image-upload" file-limit="1" label="載入原圖"/>
                    <Image :src="sourceImageUrl" alt="Image" width="250" preview v-if="sourceImageUrl" />
                    <InputText v-if="sourceImageUrl" v-model="sourceImageUrl" class="w-full" readonly />
                </div>
            </div>
            <div class="flex flex-wrap mb-2">
                <label for="promptId" class="mb-2">Prompt Id</label>
                <InputText v-model="promptId" id="promptId" rows="4" disabled fluid/>
            </div>
            <div class="flex flex-wrap" v-if="styleChangeImageUrls">
                <label for="style-change-image" class="w-full mb-2">Style Change Image</label>
                <div class="flex flex-wrap gap-2" v-for="(styleChangeImageUrl, index) in styleChangeImageUrls" :key="index">
                    <Image :src="styleChangeImageUrl" alt="Image" width="250" preview />
                    <InputText :model-value="styleChangeImageUrl" class="w-full block" readonly />
                </div>
            </div>
            <div class="flex flex-wrap gap-2">
                <Button label="Get Prompt Id" icon="pi pi-check" :disabled="!createImageButtonState" @click="createCharacterPhotos" />
                <Button label="Try Get Prompt Result" icon="pi pi-check" :disabled="!getPromptResultState" @click="getPromptResult" />
            </div>
            <div class="flex flex-wrap gap-2" >
                <Button label="確認變更成定裝照" icon="pi pi-check" @click="updateFilebyAI(selectedTutor.memberId)" :disabled="!updateDbImg"/>
            </div>
            <div v-if="isLoading" class="fixed inset-0 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div class="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center">
                <ProgressSpinner style="width: 70px; height: 70px" strokeWidth="3" fill="transparent" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
            </div>
        </div>

        </div>
        
        </Dialog>
    </div>
</template>

<style scoped>
.custom-secondary-button {
    background-color: #02cab9;
    border-color: #02cab9;
    color: #fff;
}

.custom-secondary-button:hover {
    background-color: #01b7a7;
    border-color: #01b7a7;
}
.custom-text-color{
 color: white;
}
</style>
