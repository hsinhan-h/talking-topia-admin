<script setup>
import { CourseManagementService } from '@/service/CourseManagementService';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const disableCourseDialog = ref(false);
const enableCourseDialog = ref(false);

const courseManagementDataArray = ref([]);
const selectedCourse = ref({});
const categories = ref(['語言學習', '程式設計', '升學科目']);
const selectedCategory = ref(null);

const isLoading = ref(true);
const toast = useToast();

onMounted(async () => {
    try {
        const [courseManagementData] = await Promise.all([await CourseManagementService.getCourseManagementData()]);

        courseManagementDataArray.value = courseManagementData;
        console.log('課程管理列表:', courseManagementData);
    } catch (error) {
        console.error('加載數據失敗', error);
    } finally {
        isLoading.value = false;
    }
});

function showDisableCourseDialog(course) {
    selectedCourse.value = course;
    disableCourseDialog.value = true;
}

function showEnableCourseDialog(course) {
    selectedCourse.value = course;
    enableCourseDialog.value = true;
}

async function switchCoursePublishingStatus(courseId, courseEnable) {
    try {
        await CourseManagementService.enableCourse(courseId, courseEnable);
        if (courseEnable) {
            toast.add({ severity: 'success', summary: '成功', detail: '已重新上架此課程！', life: 3000 });
            enableCourseDialog.value = false;
        } else {
            toast.add({ severity: 'info', summary: '成功', detail: '已下架此課程！', life: 3000 });
            disableCourseDialog.value = false;
        }
        await updateCourseManagementList();
    } catch (error) {
        console.error('上架/下架課程失敗', error);
    }
}

async function updateCourseManagementList() {
    try {
        const updatedCourseManagementData = await CourseManagementService.getCourseManagementData();
        courseManagementDataArray.value = updatedCourseManagementData;
    } catch (error) {
        console.error('更新課程資訊列表失敗', error);
        toast.add({ severity: 'error', summary: '錯誤', detail: '無法加載課程資訊列表，請稍後再試。', life: 3000 });
    }
}

function getPublishStatusLabel(publishStatus, isUnderReview) {
    if (isUnderReview) {
        return '審核中';
    }
    if (publishStatus) {
        return '已上架';
    }
    return '已下架';
}

function getPublishStatusSeverity(publishStatus, isUnderReview) {
    if (isUnderReview) {
        return 'info';
    }
    if (publishStatus) {
        return 'success';
    }
    return 'secondary';
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
            <div class="col-span-12 lg:col-span-6 xl:col-span-6">
                <div class="card mb-0">
                    <div class="flex justify-between mb-4">
                        <div>
                            <span class="block text-muted-color font-medium mb-4">當前總課程數量</span>
                            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152</div>
                        </div>
                        <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-shopping-cart text-blue-500 !text-xl"></i>
                        </div>
                    </div>
                    <span class="text-muted-color">自 2024/01/01 00:00 以來</span>
                </div>
            </div>
            <div class="col-span-12 lg:col-span-6 xl:col-span-6">
                <div class="card mb-0">
                    <div class="flex justify-between mb-4">
                        <div>
                            <span class="block text-muted-color font-medium mb-4">歷史已上架數量</span>
                            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">300</div>
                        </div>
                        <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-dollar text-orange-500 !text-xl"></i>
                        </div>
                    </div>
                    <span class="text-muted-color">自 2024/01/01 00:00 以來</span>
                </div>
            </div>
        </div>

        <div style="margin: 50px"></div>

        <div className="card">
            <DataTable :value="courseManagementDataArray" paginator :rows="6" :rowsPerPageOptions="[6, 12, 18]" tableStyle="min-width: 50rem" emptyMessage="沒有任何課程資訊">
                <Column field="courseId" header="課程ID" sortable=""></Column>
                <Column field="courseTitle" header="課程標題" style="max-width: 200px">
                    <template #body="slotProps">
                        <span class="text-truncate">{{ slotProps.data.courseTitle }}</span>
                    </template>
                </Column>
                <Column field="tutorName" header="教師姓名"></Column>
                <Column field="courseCategory" header="類別" :filter="true" :filterElement="categoryFilter"></Column>
                <Column field="courseSubject" header="科目"></Column>
                <!-- <Column field="twentyFiveMinUnitPrice" header="25分鐘($)"></Column>
            <Column field="fiftyMinUnitPrice" header="50分鐘($)"></Column> -->
                <!-- <Column field="courseImages" header="課程圖片">
                <template #body="slotProps">
                    <img v-if="slotProps.data.courseImages && slotProps.data.courseImages.length > 0" :src="slotProps.data.courseImages[0]" alt="課程圖片" style="width: 120px; height: 100px; object-fit: contain; cursor: pointer" />
                    <span v-else style="font-size: 12px; color: #aaa">未上傳圖片</span>
                </template>
            </Column> -->
                <Column field="publishStatus" header="上架狀態" sortable>
                    <template #body="slotProps">
                        <Tag :value="getPublishStatusLabel(slotProps.data.publishStatus, slotProps.data.isUnderReview)" :severity="getPublishStatusSeverity(slotProps.data.publishStatus, slotProps.data.isUnderReview)" />
                    </template>
                </Column>
                <Column field="publishDate" header="上架日期" sortable>
                    <template #body="slotProps">
                        <span v-html="slotProps.data.publishDate.substring(0, 19).replace('T', '<br />')"></span>
                    </template>
                </Column>
                <Column field="courseInfo" header="課程資訊" :body="actionTemplate">
                    <template>
                        <Button icon="pi pi-user-edit" outlined rounded class="mr-2" @click="editCourseData(slotProps.data)" tooltip="Edit Course" />
                    </template>
                </Column>
                <Column field="courseDisable" header="下架/重新上架" :body="actionTemplate">
                    <template #body="slotProps">
                        <span v-if="slotProps.data.isUnderReview"></span>
                        <Button v-else-if="slotProps.data.publishStatus" label="下架" @click="showDisableCourseDialog(slotProps.data)" />
                        <Button v-else label="重新上架" @click="showEnableCourseDialog(slotProps.data)" class="custom-secondary-button" />
                    </template>
                </Column>
            </DataTable>

            <Dialog v-model:visible="disableCourseDialog" :style="{ width: '450px' }" header="下架課程" :modal="true">
                <div class="flex items-center gap-4">
                    <i class="pi pi-exclamation-triangle !text-3xl" />
                    <span class="mb-3" v-if="selectedCourse"
                        >確定要下架此課程嗎? <br />課程名稱: <b>{{ selectedCourse.courseTitle }}</b></span
                    >
                </div>
                <template #footer>
                    <Button label="No" icon="pi pi-times" text @click="disableCourseDialog = false" />
                    <Button label="Yes" icon="pi pi-check" @click="switchCoursePublishingStatus(selectedCourse.courseId, false)" />
                </template>
            </Dialog>

            <Dialog v-model:visible="enableCourseDialog" :style="{ width: '450px' }" header="重新上架課程" :modal="true">
                <div class="flex items-center gap-4">
                    <i class="pi pi-exclamation-triangle !text-3xl" />
                    <span class="mb-3" v-if="selectedCourse"
                        >確定要重新上架此課程嗎? <br />課程名稱: <b>{{ selectedCourse.courseTitle }}</b></span
                    >
                </div>
                <template #footer>
                    <Button label="No" icon="pi pi-times" text @click="enableCourseDialog = false" />
                    <Button label="Yes" icon="pi pi-check" @click="switchCoursePublishingStatus(selectedCourse.courseId, true)" />
                </template>
            </Dialog>
        </div>
    </div>
    <!-- <Paginator :rows="6" :totalRecords="120" :rowsPerPageOptions="[6, 12, 18]"></Paginator> -->
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

.text-truncate {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    margin-top: 6px;
}
</style>
