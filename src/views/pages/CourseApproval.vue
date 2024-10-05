<script setup>
import { CourseApprovalService } from '@/service/CourseApprovalService';
import { ShipperService } from '@/service/ShipperService';
import { onMounted, ref } from 'vue';

const shipperDialog = ref(false);

const shippers = ref(null);
const shipper = ref({});
const submitted = ref(false);
const rejectApplicationDialog = ref(false);
const courseImagesDialog = ref(false);
const courseApprovalList = ref([]);
const selectedCourseImages = ref([]);

onMounted(() => {
    ShipperService.getShippers().then((data) => (shippers.value = data));
    CourseApprovalService.getCourseApprovalList().then((data) => {
        courseApprovalList.value = data;
        console.log('課程審核列表:', data);
    });
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
    rejectApplicationDialog.value = true;
    shipper.value = data;
}

function deleteShipper() {
    console.log('準備要刪除Shipper!!!!!!');
    // todo 串接API
    console.log('刪除Shipper!!!!!!');
    console.log(shipper.value);
    deleteShipperDialog.value = false;
}

function showCourseImages(images) {
    selectedCourseImages.value = images;
    courseImagesDialog.value = true;
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
        <DataTable :value="courseApprovalList" paginator :rows="6" :rowsPerPageOptions="[6, 12, 18]" tableStyle="min-width: 50rem">
            <Column field="tutorName" header="教師姓名"></Column>
            <Column field="applyDate" header="申請時間">
                <template #body="slotProps">
                    <span v-html="slotProps.data.applyDate.substring(0, 19).replace('T', '<br />')"></span>
                </template>
            </Column>
            <Column field="courseTitle" header="課程標題"></Column>
            <Column field="courseCategory" header="分類"></Column>
            <Column field="courseSubject" header="科目"></Column>
            <Column field="twentyFiveMinUnitPrice" header="25分鐘($)"></Column>
            <Column field="fiftyMinUnitPrice" header="50分鐘($)"></Column>
            <Column field="description" header="課程介紹"> </Column>
            <Column field="courseImages" header="課程圖片">
                <template #body="slotProps">
                    <img
                        v-if="slotProps.data.courseImages && slotProps.data.courseImages.length > 0"
                        :src="slotProps.data.courseImages[0]"
                        alt="課程圖片"
                        style="width: 100px; height: 100px; object-fit: contain; cursor: pointer"
                        @click="showCourseImages(slotProps.data.courseImages)"
                    />
                    <span v-else style="font-size: 12px; color: #aaa">教師未上傳課程圖片</span>
                </template>
            </Column>
            <Column field="videoUrl" header="自介影片">
                <template #body="slotProps">
                    <Button label="點擊查看" outlined @click="viewImage(slotProps.data.thumbnailUrl)" />
                </template>
            </Column>
            <Column :exportable="false" style="min-width: 12rem" header="課程審核">
                <template #body="slotProps">
                    <Button icon="pi pi-check-circle" label="通過" severity="help" class="mr-2" @click="editShipper(slotProps.data)" />
                    <Button icon="pi pi-times-circle" label="駁回" severity="danger" @click="confirmDeleteShipper(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="courseImagesDialog" header="課程圖片" :style="{ width: '700px' }" :modal="true">
            <div class="course-images-dialog">
                <img v-for="(image, index) in selectedCourseImages" :key="index" :src="image" alt="課程圖片" style="width: 300px; height: 200px; object-fit: contain" />
            </div>
        </Dialog>
        <Dialog v-model:visible="rejectApplicationDialog" :style="{ width: '450px' }" header="駁回申請" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="shipper"
                    >確定駁回 <b>{{ shipper.companyName }}</b
                    >的申請嗎?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="rejectApplicationDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteShipper" />
            </template>
        </Dialog>
    </div>
</template>

<style scoped>
.course-images-dialog {
    display: flex;
    flex-wrap: wrap;
    max-height: 600px;
    gap: 20px;
}
</style>
