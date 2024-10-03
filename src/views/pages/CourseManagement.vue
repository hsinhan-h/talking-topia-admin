<script setup>
import { ShipperService } from '@/service/ShipperService';
import { onMounted, ref } from 'vue';

const shipperDialog = ref(false); // Dialog相當於Bootsrap的Modal!

const shippers = ref(null);
const shipper = ref({});
const submitted = ref(false);
const deleteShipperDialog = ref(false);

onMounted(() => {
    ShipperService.getShippers().then((data) => (shippers.value = data));
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
                        <span class="block text-muted-color font-medium mb-4">當前待審數量</span>
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
                        <span class="block text-muted-color font-medium mb-4">歷史上架數量</span>
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
        <DataTable :value="shippers" paginator :rows="6" :rowsPerPageOptions="[6, 12, 18]" tableStyle="min-width: 50rem">
            <Column field="courseID" header="編號" sortable=""></Column>
            <Column field="applicant" header="申請人"></Column>
            <Column field="category" header="分類"></Column>
            <Column field="subject" header="科目"></Column>
            <Column field="courseTitle" header="課程標題"></Column>
            <Column field="subtitle" header="副標題"></Column>
            <Column field="description" header="課程介紹"></Column>
            <Column field="twentyFiveMinUnitPrice" header="25分鐘($)"></Column>
            <Column field="fiftyMinUnitPrice" header="50分鐘($)"></Column>
            <Column field="thumbnailUrl" header="課程圖片"></Column>
            <Column field="videoUrl" header="課程影片"></Column>
            <Column :exportable="false" style="min-width: 12rem" header="通過/駁回">
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
    <!-- <Paginator :rows="6" :totalRecords="120" :rowsPerPageOptions="[6, 12, 18]"></Paginator> -->
</template>
