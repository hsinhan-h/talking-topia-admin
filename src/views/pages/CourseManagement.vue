<script setup>
import { CourseManagementService } from '@/service/CourseManagementService';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';

const disableCourseDialog = ref(false);
const enableCourseDialog = ref(false);
const editCourseDialog = ref(false);

const courseManagementDataArray = ref([]);
const categoryOptions = ref([
    { label: '語言學習', value: 1 },
    { label: '程式設計', value: 2 },
    { label: '升學科目', value: 3 }
]);
const subjectsMapping = {
    1: [
        { label: '英文', value: 1 },
        { label: '日文', value: 2 },
        { label: '中文', value: 3 },
        { label: '德文', value: 4 },
        { label: '法文', value: 5 },
        { label: '西班牙文', value: 6 }
    ],
    2: [
        { label: 'HTML/CSS', value: 7 },
        { label: 'JavaScript', value: 8 },
        { label: 'C#', value: 9 },
        { label: 'SQL', value: 10 },
        { label: 'Python', value: 11 },
        { label: 'Java', value: 12 }
    ],
    3: [
        { label: '數學', value: 13 },
        { label: '物理', value: 14 },
        { label: '化學', value: 15 },
        { label: '歷史', value: 16 },
        { label: '地理', value: 17 },
        { label: '生物', value: 18 }
    ]
};
const selectedCourse = ref({ courseCategory: null, courseSubject: null });

//錯誤訊息
const titleErrorMessage = ref(null);
const subTitleErrorMessage = ref(null);
const priceErrorMessage = ref({
    twentyFiveMinUnitPrice: '',
    fiftyMinUnitPrice: ''
});
const videoUrlErrorMessage = ref(null);
const descriptionErrorMessage = ref(null);

const firstDayOfMonthText = ref(null);
const courseQty = ref(0);
const newCourseQty = ref(0);
const publishedCourseQty = ref(0);
const newPublishedCourseQty = ref(0);
const unPublishedCourseQty = ref(0);
const newUnPublishedCourseQty = ref(0);

const isLoading = ref(true);
const toast = useToast();

const subjectOptions = computed(() => {
    return subjectsMapping[selectedCourse.value.courseCategory] || [];
});

const publishedPercentage = computed(() => {
    return ((publishedCourseQty.value / courseQty.value) * 100).toFixed(2);
});

onMounted(async () => {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    firstDayOfMonthText.value = `${firstDayOfMonth.getFullYear()}/${(firstDayOfMonth.getMonth() + 1).toString().padStart(2, '0')}/${firstDayOfMonth.getDate().toString().padStart(2, '0')} 00:00`;

    loadCourseData();
});

async function loadCourseData() {
    try {
        const [courseManagementData, courseQtyData, newCourseQtyData, publishedCourseQtyData, newPublishedCourseQtyData, unPublishedCourseQtyData, newUnPublishedCourseQtyData] = await Promise.all([
            await CourseManagementService.getCourseManagementData(),
            CourseManagementService.getCourseQty(false),
            CourseManagementService.getCourseQty(true),
            CourseManagementService.getCourseQtyByPublishingStatus(true, false),
            CourseManagementService.getCourseQtyByPublishingStatus(true, true),
            CourseManagementService.getCourseQtyByPublishingStatus(false, true),
            CourseManagementService.getCourseQtyByPublishingStatus(false, true)
        ]);
        courseManagementDataArray.value = courseManagementData;
        courseQty.value = courseQtyData;
        newCourseQty.value = newCourseQtyData;
        publishedCourseQty.value = publishedCourseQtyData;
        newPublishedCourseQty.value = newPublishedCourseQtyData;
        unPublishedCourseQty.value = unPublishedCourseQtyData;
        newUnPublishedCourseQty.value = newUnPublishedCourseQtyData;
        console.log('課程管理列表:', courseManagementData);
    } catch (error) {
        console.error('加載數據失敗', error);
    } finally {
        isLoading.value = false;
    }
}

function showEditCourseDialog(course) {
    selectedCourse.value = { ...course };
    console.log(selectedCourse.value);

    //清空錯誤訊息
    titleErrorMessage.value = '';
    subTitleErrorMessage.value = '';
    priceErrorMessage.value.twentyFiveMinUnitPrice = '';
    priceErrorMessage.value.fiftyMinUnitPrice = '';
    videoUrlErrorMessage.value = '';
    descriptionErrorMessage.value = '';

    const category = categoryOptions.value.find((opt) => opt.label === course.courseCategory);
    if (course.courseCategory) {
        selectedCourse.value.courseCategory = category.value;
    }
    const subject = subjectOptions.value.find((opt) => opt.label === course.courseSubject);
    if (course.courseSubject) {
        selectedCourse.value.courseSubject = subject.value;
    }
    editCourseDialog.value = true;
}

async function saveUpdatedCourseData() {
    if (validateFormInput()) {
        await CourseManagementService.updateCourseData(selectedCourse.value);
        toast.add({ severity: 'success', summary: '編輯成功', detail: '成功編輯課程資訊！', life: 3000 });
        editCourseDialog.value = false;
        await updateCourseManagementList();
    } else {
        toast.add({ severity: 'error', summary: '編輯失敗', detail: '請修正表單中的錯誤！', life: 3000 });
    }
}

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
        await loadCourseData();
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

function validateFormInput() {
    let isValid = true;

    //驗證標題/副標題資訊
    if (!selectedCourse.value.courseTitle.trim()) {
        titleErrorMessage.value = '課程標題不得為空';
        isValid = false;
    } else {
        titleErrorMessage.value = '';
    }
    if (!selectedCourse.value.courseSubTitle.trim()) {
        subTitleErrorMessage.value = '課程副標題不得為空';
        isValid = false;
    } else {
        subTitleErrorMessage.value = '';
    }

    //驗證價格資訊
    if (!selectedCourse.value.twentyFiveMinUnitPrice || !Number.isInteger(Number(selectedCourse.value.twentyFiveMinUnitPrice))) {
        priceErrorMessage.value.twentyFiveMinUnitPrice = '請輸入有效的25分鐘價格';
        isValid = false;
    } else {
        priceErrorMessage.value.twentyFiveMinUnitPrice = '';
    }

    if (!selectedCourse.value.fiftyMinUnitPrice || !Number.isInteger(Number(selectedCourse.value.fiftyMinUnitPrice))) {
        priceErrorMessage.value.fiftyMinUnitPrice = '請輸入有效的50分鐘價格';
        isValid = false;
    } else {
        priceErrorMessage.value.fiftyMinUnitPrice = '';
    }

    //驗證影片url
    const youtubeEmbedRegex = /^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]+$/;
    if (!youtubeEmbedRegex.test(selectedCourse.value.videoUrl)) {
        videoUrlErrorMessage.value = '請輸入有效的Youtube embed影片連結';
        isValid = false;
    } else {
        videoUrlErrorMessage.value = '';
    }

    //驗證課程介紹
    if (!selectedCourse.value.description.trim()) {
        descriptionErrorMessage.value = '課程介紹不得為空';
        isValid = false;
    } else if (selectedCourse.value.description.length < 50) {
        descriptionErrorMessage.value = '課程介紹不得少於50個字';
        isValid = false;
    } else {
        descriptionErrorMessage.value = '';
    }

    return isValid;
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
                <div class="card mb-0 flex justify-between">
                    <div>
                        <div class="flex justify-between mb-4">
                            <div>
                                <span class="block text-muted-color font-medium mb-4">當前總課程數量</span>
                                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ courseQty }}</div>
                            </div>
                        </div>
                        <span class="text-primary font-medium">{{ newCourseQty }} new </span>
                        <div class="text-muted-color">自 {{ firstDayOfMonthText }} 以來</div>
                    </div>
                    <div>
                        <span class="block text-muted-color font-medium text-center">已上架比例</span>
                        <Knob v-model="publishedPercentage" valueTemplate="{value}%" />
                    </div>
                    <!-- <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-shopping-cart text-blue-500 !text-xl"></i>
                    </div> -->
                </div>
            </div>
            <div class="col-span-12 lg:col-span-6 xl:col-span-4">
                <div class="card mb-0">
                    <div>
                        <div class="flex justify-between mb-4">
                            <div>
                                <span class="block text-muted-color font-medium mb-4">已上架課程數量</span>
                                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ publishedCourseQty }}</div>
                            </div>
                            <div>
                                <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                                    <i class="pi pi-verified text-orange-500 !text-xl"></i>
                                </div>
                            </div>
                        </div>
                        <span class="text-primary font-medium">{{ newPublishedCourseQty }} new </span>
                        <div class="text-muted-color">自 {{ firstDayOfMonthText }} 以來</div>
                    </div>
                </div>
            </div>
            <div class="col-span-12 lg:col-span-6 xl:col-span-4">
                <div class="card mb-0">
                    <div class="flex justify-between mb-4">
                        <div>
                            <span class="block text-muted-color font-medium mb-4">已下架課程數量</span>
                            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ unPublishedCourseQty }}</div>
                        </div>
                        <div>
                            <div class="flex items-center justify-center bg-green-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                                <i class="pi pi-ban text-green-500 !text-xl"></i>
                            </div>
                        </div>
                    </div>
                    <span class="text-primary font-medium">{{ newUnPublishedCourseQty }} new </span>
                    <div class="text-muted-color">自 {{ firstDayOfMonthText }} 以來</div>
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
                <Column header="課程資訊" :body="actionTemplate">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" label="編輯資訊" severity="secondary" outlined @click="showEditCourseDialog(slotProps.data)" :disabled="slotProps.data.isUnderReview === true" />
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

            <Dialog v-model:visible="editCourseDialog" :style="{ width: '650px' }" header="編輯課程資料" :modal="true">
                <div class="flex flex-col gap-6">
                    <div>
                        <label class="font-bold mb-3">課程ID</label>
                        <InputText v-model="selectedCourse.courseId" disabled fluid />
                    </div>
                    <div>
                        <label class="font-bold mb-3">課程標題</label>
                        <InputText v-model="selectedCourse.courseTitle" fluid />
                        <Message v-if="titleErrorMessage" severity="error"><i class="pi pi-times-circle"></i> {{ titleErrorMessage }}</Message>
                    </div>
                    <div>
                        <label class="font-bold mb-3">課程副標題</label>
                        <InputText v-model="selectedCourse.courseSubTitle" fluid />
                        <Message v-if="subTitleErrorMessage" severity="error"><i class="pi pi-times-circle"></i> {{ subTitleErrorMessage }}</Message>
                    </div>
                    <div class="flex gap-5">
                        <div class="flex-1">
                            <label class="block font-bold mb-3">類別</label>
                            <Dropdown v-model="selectedCourse.courseCategory" :options="categoryOptions" optionLabel="label" optionValue="value" fluid />
                        </div>
                        <div class="flex-1">
                            <label class="block font-bold mb-3">科目</label>
                            <Dropdown v-model="selectedCourse.courseSubject" :options="subjectOptions" optionLabel="label" optionValue="value" fluid />
                        </div>
                    </div>
                    <div class="flex gap-5">
                        <div class="flex-1">
                            <label class="block font-bold mb-3">25分鐘價格</label>
                            <InputText v-model="selectedCourse.twentyFiveMinUnitPrice" fluid />
                            <Message v-if="priceErrorMessage.twentyFiveMinUnitPrice" severity="error"><i class="pi pi-times-circle"></i> {{ priceErrorMessage.twentyFiveMinUnitPrice }}</Message>
                        </div>
                        <div class="flex-1">
                            <label class="block font-bold mb-3">50分鐘價格</label>
                            <InputText v-model="selectedCourse.fiftyMinUnitPrice" fluid />
                            <Message v-if="priceErrorMessage.fiftyMinUnitPrice" severity="error"><i class="pi pi-times-circle"></i> {{ priceErrorMessage.fiftyMinUnitPrice }}</Message>
                        </div>
                    </div>
                    <div>
                        <label class="font-bold mb-3">課程影片連結</label>
                        <InputText v-model="selectedCourse.videoUrl" fluid />
                        <Message v-if="videoUrlErrorMessage" severity="error"><i class="pi pi-times-circle"></i> {{ videoUrlErrorMessage }}</Message>
                    </div>
                    <div>
                        <label class="font-bold mb-3">課程介紹</label>
                        <Textarea v-model="selectedCourse.description" rows="6" fluid />
                        <Message v-if="descriptionErrorMessage" severity="error"><i class="pi pi-times-circle"></i> {{ descriptionErrorMessage }}</Message>
                    </div>
                </div>
                <template #footer>
                    <Button label="Cancel" icon="pi pi-times" text @click="editCourseDialog = false" />
                    <Button label="Save" icon="pi pi-check" @click="saveUpdatedCourseData()" />
                </template>
            </Dialog>
        </div>
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

.text-truncate {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    margin-top: 6px;
}
</style>
