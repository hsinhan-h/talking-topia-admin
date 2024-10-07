<script setup>
import { ReviewService } from '@/service/ReviewService';
import { onMounted, ref } from 'vue';


const shipperDialog = ref(false); // Dialog相當於Bootsrap的Modal!

const shippers = ref(null);
const shipper = ref({});
const submitted = ref(false);
const deleteShipperDialog = ref(false);
const reviewList = ref(null);

onMounted(() => {
    ReviewService.getReviews().then((data)=>(reviewList.value = data));
    console.log(reviewList.value);

});

function hideDialog() {
    shipperDialog.value = false;
    submitted.value = false;
}

function saveShipper() {
    submitted.value = true;
    console.log('準備要更新Shipper!!!!!!');

    // todo 串接API
}

function editShipper(data) {
    shipper.value = { ...data };
    shipperDialog.value = true;
}

function confirmDeleteShipper(data) {
    deleteShipperDialog.value = true;
    shipper.value = data;
}

function deleteShipper() {
    console.log('準備要刪除Shipper!!!!!!');
    // todo 串接API
    console.log('刪除Shipper!!!!!!');
    console.log(shipper.value);
    deleteShipperDialog.value = false;
}
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 lg:col-span-6 xl:col-span-6">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">今日評論數量</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-shopping-cart text-blue-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">24 new </span>
                <span class="text-muted-color">自 2024/09/30 00:00 以來</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-6">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">本週評論數量</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">300</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-dollar text-orange-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">52 new </span>
                <span class="text-muted-color">自 2024/09/29 以來</span>
            </div>
        </div>
    </div>

    <div style="margin: 50px"></div>

    <div className="card">
        <DataTable :value="reviewList" paginator :rows="6" :rowsPerPageOptions="[6, 12, 18]" tableStyle="min-width: 50rem">
            <Column field="reviewId" header="編號" :sortable="true"></Column>
            <Column field="courseTitle" header="課程名稱" :sortable="true"></Column>
            <Column field="fullName" header="使用者名稱"></Column>
            <Column field="rating" header="評分" :sortable="true"></Column>
            <Column field="commentText" header="評論內容"></Column>
            <Column field="createDateTime" header="評論時間"></Column>
            <Column :exportable="false" style="min-width: 12rem" header="編輯/刪除">
                <template #body="slotProps">
                    <Button icon="pi-check-circle" outlined rounded class="mr-2" @click="editShipper(slotProps.data)" />
                    <Button icon="pi-times-circle" outlined rounded severity="danger" @click="confirmDeleteShipper(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="deleteShipperDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
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
        </Dialog>
    </div>
</template>
