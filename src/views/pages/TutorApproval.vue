<script setup>
import { MemberData } from '@/service/MemberManagementService';
import { onMounted, ref } from 'vue';



const showEditDialog = ref(false);
const submitted = ref(false);
const allTutorData = ref([]);



onMounted(() => {
    MemberData.getAllTutorDataList().then((data) =>(allTutorData.value = data));
});

</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 lg:col-span-6 xl:col-span-6">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">當前教師數量</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-shopping-cart text-blue-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">24 new </span>
                <span class="text-muted-color">since last visit</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-6">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">已上架課程教師數量</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">300</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-dollar text-orange-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">52 new </span>
                <span class="text-muted-color">從平台開放以來</span>
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
            <Column :exportable="false" style="min-width: 12rem" header="編輯/刪除">
                <!-- <template #body="slotProps">
                    <Button icon="pi-check-circle" outlined rounded class="mr-2" @click="editShipper(slotProps.data)" />
                    <Button icon="pi-times-circle" outlined rounded severity="danger" @click="confirmDeleteShipper(slotProps.data)" />
                </template> -->
            </Column>
        </DataTable>

        <!-- <Dialog v-model:visible="deleteShipperDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="shipper"
                    >確定駁回 <b>{{ shipper.companyName }}</b
                    >的申請嗎?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteShipperDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteShipper" />
            </template>
        </Dialog> -->
    </div>
</template>
