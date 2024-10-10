<script setup>
import { CourseApprovalService } from '@/service/CourseApprovalService';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const descriptionDialog = ref(false);
const courseImagesDialog = ref(false);
const courseVideoDialog = ref(false);
const approveApplicationDialog = ref(false);
const rejectApplicationDialog = ref(false);

const courseApprovalList = ref([]);
const unApprovedCourseQty = ref(0);
const approvedCourseQty = ref(0);
const rejectedCourseQty = ref(0);
const selectedCourse = ref({});
const selectedDescription = ref(null);
const selectedCourseImages = ref([]);
const selectedVideoUrl = ref(null);
const selectedThumbnailUrl = ref(null);

const isLoading = ref(true);
const toast = useToast();

onMounted(async () => {
    try {
        const [courseApprovalData, unApprovedCourseQtyData, approvedCourseQtyData, rejectedCourseQtyData] = await Promise.all([
            CourseApprovalService.getCourseApprovalList(),
            CourseApprovalService.getUnapprovedCourseQtyStartingFrom2024(),
            CourseApprovalService.getApprovedCourseQtyStartingFrom2024(),
            CourseApprovalService.getRejectedCourseQtyStartingFrom2024()
        ]);

        courseApprovalList.value = courseApprovalData;
        unApprovedCourseQty.value = unApprovedCourseQtyData;
        approvedCourseQty.value = approvedCourseQtyData;
        rejectedCourseQty.value = rejectedCourseQtyData;
        console.log('課程審核列表:', courseApprovalData);
    } catch (error) {
        console.error('加載數據失敗', error);
    } finally {
        isLoading.value = false;
    }
});

function showCourseImages(images) {
    selectedCourseImages.value = images;
    courseImagesDialog.value = true;
}

function showCourseDescription(description) {
    selectedDescription.value = description;
    descriptionDialog.value = true;
}

function showCourseVideo(videoUrl) {
    selectedVideoUrl.value = videoUrl;
    courseVideoDialog.value = true;
}

function showapproveApplicationDialog(course) {
    selectedCourse.value = course;
    approveApplicationDialog.value = true;
}

function showRejectApplicationDialog(course) {
    selectedCourse.value = course;
    rejectApplicationDialog.value = true;
}

async function approveCoursePublishing(courseId, courseApprove) {
    try {
        await CourseApprovalService.approveCourse(courseId, courseApprove);
        if (courseApprove === true) {
            toast.add({ severity: 'success', summary: '成功', detail: '通過課程審核！', life: 3000 });
            approveApplicationDialog.value = false;
        } else {
            toast.add({ severity: 'info', summary: '成功', detail: '駁回課程申請！', life: 3000 });
            rejectApplicationDialog.value = false;
        }
        await updateCourseApprovalList();
    } catch (error) {
        console.error('審核課程失敗', error);
    }
}

async function updateCourseApprovalList() {
    try {
        const updatedCourseApprovalData = await CourseApprovalService.getCourseApprovalList();
        courseApprovalList.value = updatedCourseApprovalData;
    } catch (error) {
        console.error('更新課程審核列表失敗', error);
        toast.add({ severity: 'error', summary: '錯誤', detail: '無法加載課程審核列表，請稍後再試。', life: 3000 });
    }
}
</script>

<template>
    <Toast></Toast>
    <div v-if="isLoading" class="loading-container">
        <ProgressSpinner style="width: 100px; height: 100px; stroke: #02cab9" strokeWidth="3" fill="transparent" animationDuration=".7s" aria-label="Custom ProgressSpinner" class="custom-spinner" />
        <div class="loading-text">Loading...</div>
    </div>

    <div v-else>
        <div class="grid grid-cols-12 gap-8">
            <div class="col-span-12 lg:col-span-6 xl:col-span-4">
                <div class="card mb-0">
                    <div class="flex justify-between mb-4">
                        <div>
                            <span class="block text-muted-color font-medium mb-4">當前待審數量</span>
                            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ unApprovedCourseQty }}</div>
                        </div>
                        <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-shopping-cart text-blue-500 !text-xl"></i>
                        </div>
                    </div>
                    <!-- <span class="text-primary font-medium">24 new </span> -->
                    <span class="text-muted-color">自 2024/01/01 00:00 以來</span>
                </div>
            </div>
            <div class="col-span-12 lg:col-span-6 xl:col-span-4">
                <div class="card mb-0">
                    <div class="flex justify-between mb-4">
                        <div>
                            <span class="block text-muted-color font-medium mb-4">歷史已通過數量</span>
                            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ approvedCourseQty }}</div>
                        </div>
                        <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-dollar text-orange-500 !text-xl"></i>
                        </div>
                    </div>
                    <!-- <span class="text-primary font-medium">52 new </span> -->
                    <span class="text-muted-color">自 2024/01/01 00:00 以來</span>
                </div>
            </div>
            <div class="col-span-12 lg:col-span-6 xl:col-span-4">
                <div class="card mb-0">
                    <div class="flex justify-between mb-4">
                        <div>
                            <span class="block text-muted-color font-medium mb-4">歷史已駁回數量</span>
                            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ rejectedCourseQty }}</div>
                        </div>
                        <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-dollar text-orange-500 !text-xl"></i>
                        </div>
                    </div>
                    <!-- <span class="text-primary font-medium">52 new </span> -->
                    <span class="text-muted-color">自 2024/01/01 00:00 以來</span>
                </div>
            </div>
        </div>
        <div style="margin: 50px"></div>

        <div className="card">
            <DataTable :value="courseApprovalList" paginator :rows="6" :rowsPerPageOptions="[6, 12, 18]" tableStyle="min-width: 50rem" class="course-approval-table" emptyMessage="目前沒有待審核的課程">
                <Column field="tutorName" header="教師姓名"></Column>
                <Column field="applyDate" header="申請時間" :sortable="true">
                    <template #body="slotProps">
                        <span v-html="slotProps.data.applyDate.substring(0, 19).replace('T', '<br />')"></span>
                    </template>
                </Column>
                <Column field="courseTitle" header="課程標題"></Column>
                <Column field="courseCategory" header="類別"></Column>
                <Column field="courseSubject" header="科目"></Column>
                <Column field="twentyFiveMinUnitPrice" header="25分鐘($)"></Column>
                <Column field="fiftyMinUnitPrice" header="50分鐘($)"></Column>
                <Column field="description" header="課程介紹">
                    <template #body="slotProps">
                        <Button label="點擊查看" severity="secondary" outlined @click="showCourseDescription(slotProps.data.description)" />
                    </template>
                </Column>
                <Column field="courseImages" header="課程圖片">
                    <template #body="slotProps">
                        <img
                            v-if="slotProps.data.courseImages && slotProps.data.courseImages.length > 0"
                            :src="slotProps.data.courseImages[0]"
                            alt="課程圖片"
                            style="width: 120px; height: 100px; object-fit: contain; cursor: pointer"
                            @click="showCourseImages(slotProps.data.courseImages)"
                        />
                        <span v-else style="font-size: 12px; color: #aaa">未上傳圖片</span>
                    </template>
                </Column>
                <Column field="videoUrl" header="自介影片">
                    <template #body="slotProps">
                        <img
                            v-if="slotProps.data.thumbnailUrl && slotProps.data.videoUrl"
                            :src="slotProps.data.thumbnailUrl"
                            alt="自介影片封面"
                            style="width: 120px; height: 100px; object-fit: contain; cursor: pointer"
                            @click="showCourseVideo(slotProps.data.videoUrl)"
                        />
                        <span v-else style="font-size: 12px; color: #aaa">未上傳影片</span>
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 12rem" header="課程審核">
                    <template #body="slotProps">
                        <Button icon="pi pi-check-circle" label="通過" class="mr-2" @click="showapproveApplicationDialog(slotProps.data)" />
                        <Button icon="pi pi-times-circle" label="駁回" @click="showRejectApplicationDialog(slotProps.data)" class="custom-secondary-button" />
                    </template>
                </Column>
                <template #empty>
                    <div class="w-100 text-center empty-approval-list-text">目前沒有待審核的課程</div>
                </template>
            </DataTable>
        </div>

        <Dialog v-model:visible="descriptionDialog" header="課程介紹" :style="{ width: '680px' }" :modal="true">
            <div class="course-images-dialog">
                <span v-if="selectedDescription">{{ selectedDescription }}</span>
                <span v-else style="color: #aaa">沒有課程介紹</span>
            </div>
        </Dialog>
        <Dialog v-model:visible="courseImagesDialog" header="課程圖片" :style="{ width: '680px' }" :modal="true">
            <div class="course-images-dialog">
                <img v-for="(image, index) in selectedCourseImages" :key="index" :src="image" alt="課程圖片" style="width: 300px; height: 200px; object-fit: contain" />
            </div>
        </Dialog>
        <Dialog v-model:visible="courseVideoDialog" header="教師自介影片" :style="{ width: '680px' }" :modal="true">
            <div class="course-video-dialog">
                <div>影片連結:</div>
                <a :href="selectedVideoUrl" target="_blank" style="display: block; margin-bottom: 0.8em; width: fit-content">{{ selectedVideoUrl }}</a>
                <!-- <div>影片封面:</div>
                <img :src="selectedThumbnailUrl" alt="自介影片封面" style="width: 80%; aspect-ratio: 16 / 9; object-fit: contain" /> -->
            </div>
        </Dialog>
        <Dialog v-model:visible="approveApplicationDialog" :style="{ width: '450px' }" header="通過申請" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="selectedCourse"
                    >確定通過教師 <b>{{ selectedCourse.tutorName }} </b> 的課程申請嗎? <br />課程名稱: {{ selectedCourse.courseTitle }}</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="approveApplicationDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="approveCoursePublishing(selectedCourse.courseId, true)" />
            </template>
        </Dialog>
        <Dialog v-model:visible="rejectApplicationDialog" :style="{ width: '450px' }" header="駁回申請" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="selectedCourse"
                    >確定駁回教師 <b>{{ selectedCourse.tutorName }} </b> 的課程申請嗎? <br />課程名稱: {{ selectedCourse.courseTitle }}</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="rejectApplicationDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="approveCoursePublishing(selectedCourse.courseId, false)" />
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

.custom-secondary-button {
    background-color: #02cab9;
    border-color: #02cab9;
    color: #fff;
}

.custom-secondary-button:hover {
    background-color: #02ebd6;
    border-color: #02ebd6;
}

.empty-approval-list-text {
    color: #02cab9;
    font-size: 32px;
    height: 40vh;
    margin-top: 12px;
}
</style>
