<script setup>
import { onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { MemberData } from '@/service/MemberManagementService';



const allTutorData = ref([]);
const approveApplicationDialog = ref(false);
const rejectApplicationDialog = ref(false);
const selectedTutor = ref({});
const rejectReason = ref('');
const toast = useToast();
const today = new Date().toLocaleString();;
const allTutorDataCount = ref({});




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
            rejectReason:null,
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
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{allTutorDataCount.memberCount}}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-blue-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ allTutorDataCount.monthlyNewMemberCount }} new </span>
                <div class="text-muted-color">自{{ allTutorDataCount.currentMonth}}月以來</div>
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
                <div class="text-muted-color">自{{ allTutorDataCount.currentMonth}}月以來</div>
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
                <div class="text-muted-color">自{{ allTutorDataCount.currentMonth}}月以來</div>
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
                <div class="text-muted-color">自{{ allTutorDataCount.currentMonth}}月以來</div>
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
            <div class ="flex flex-col gap-4 justify-center items-center text-center">
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
    </div>
</template>

<style scoped>

.custom-secondary-button {
    background-color: #02cab9;
    border-color: #02cab9;
    color: #fff;
}

.custom-secondary-button:hover {
    background-color: #02ebd6;
    border-color: #02ebd6;
}

</style>