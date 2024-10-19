<script setup>
import { ReviewService } from '@/service/ReviewService';
import { computed, onMounted, ref } from 'vue';



const deleteReviewDialog = ref(false);
const reviewList = ref(null);
const review = ref({});
const selectedReviews = ref();
const deleteSelectedReviewsDialog = ref(false);



onMounted(() => {
    ReviewService.getReviews().then((data)=>(reviewList.value = data));
    console.log(reviewList.value);

});

// 獲取今天日期的函數
const getFirstDayOfDay = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}/${month}/${day} ${hours}:${minutes}`;
};

// 獲取本周開始日期的函數 (周日)
const getFirstDayOfWeek = () => {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  startOfWeek.setHours(0, 0, 0, 0);
  const year = startOfWeek.getFullYear();
  const month = String(startOfWeek.getMonth() + 1).padStart(2, '0');
  const day = String(startOfWeek.getDate()).padStart(2, '0');
  const hours = String(startOfWeek.getHours()).padStart(2, '0');
  const minutes = String(startOfWeek.getMinutes()).padStart(2, '0');
  return `${year}/${month}/${day} ${hours}:${minutes}`;
};

// 計算今天新評論的數量
const todayReviewCount = computed(() => {
  if (!Array.isArray(reviewList.value) || reviewList.value === null) return 0; // 確保 reviews 是一個陣列且不為 null
  // 獲取今天的日期並將時間部分設置為 00:00:00 以確保只比較日期部分
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // 篩選出評論日期大於等於今天的評論並計算數量
  return reviewList.value.filter(review => {
    if (!review.createDateTime) return false;
    const reviewDate = new Date(review.createDateTime.replace(' ', 'T')); // 將 createDateTime 轉換為可解析的格式
    return reviewDate >= today;
  }).length;
});

// 計算本周評論的總數
const weekReviewCount = computed(() => {
  if (!Array.isArray(reviewList.value) || reviewList.value === null) return 0; // 確保 reviews 是一個陣列且不為 null
  // 獲取今天的日期並計算本周的開始日期 (周日)
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  startOfWeek.setHours(0, 0, 0, 0); // 將時間部分設置為 00:00:00 以確保只比較日期部分
  // 篩選出評論日期大於等於本周開始日期的評論並計算數量
  return reviewList.value.filter(review => {
    if (!review.createDateTime) return false;
    const reviewDate = new Date(review.createDateTime.replace(' ', 'T')); // 將 createDateTime 轉換為可解析的格式
    return reviewDate >= startOfWeek;
  }).length;
});
const today = ref(getFirstDayOfDay());
const firstDayOfWeek = ref(getFirstDayOfWeek());

const selectedReviewIds = computed(() => {
  if (!Array.isArray(selectedReviews.value)) return []; // 確保 selectedReviews 是一個陣列
  return selectedReviews.value.map(review => review.reviewId);
});


function confirmedDeleteReview(data) {
    review.value = data;
    console.log(review.value);
    deleteReviewDialog.value = true;
}
function confirmedDeleteSelectedReviews() {
    deleteSelectedReviewsDialog.value = true;
    console.log(selectedReviewIds.value);
}
function deleteReview(){
    ReviewService.deleteReview(review.value.reviewId)
    .then((response)=>{
        console.log("要刪除評論囉!!");
        console.log(review.value);
        console.log('刪除成功', response);
        deleteReviewDialog.value=false;
        ReviewService.getReviews()
            .then((result)=>{reviewList.value = result})
    })
    .catch((error) => {
            console.error('刪除失敗', error);
        });
}

function deleteSelectedReviews(){
    ReviewService.deleteSelectedReviews(selectedReviewIds.value)
        .then((response)=>{
            console.log('要刪除這些評論囉');
            deleteSelectedReviewsDialog.value=false;
            selectedReviews.value = [];
            ReviewService.getReviews()
                .then((result)=>{reviewList.value = result})
        })
        .catch((error) => {
            console.error('刪除失敗', error);
        });
}
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 lg:col-span-6 xl:col-span-6">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">今日評論數量</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{todayReviewCount}}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-shopping-cart text-blue-500 !text-xl"></i>
                    </div>
                </div>
                <!-- <span class="text-primary font-medium">24 new </span> -->
                <span class="text-muted-color">自 {{today}} 以來</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-6">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">本週評論數量</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{weekReviewCount}}</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-dollar text-orange-500 !text-xl"></i>
                    </div>
                </div>
                <!-- <span class="text-primary font-medium">52 new </span> -->
                <span class="text-muted-color">自 {{firstDayOfWeek}} 以來</span>
            </div>
        </div>
    </div>

    <div style="margin: 50px"></div>

    <div className="card">
        <DataTable :value="reviewList" paginator :rows="6" :rowsPerPageOptions="[6, 12, 18]" tableStyle="min-width: 50rem" v-model:selection="selectedReviews">
            <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
            <Column field="reviewId" header="編號" :sortable="true"></Column>
            <Column field="courseTitle" header="課程名稱" :sortable="true"></Column>
            <Column field="fullName" header="使用者名稱"></Column>
            <Column field="rating" header="評分" :sortable="true"></Column>
            <Column field="commentText" header="評論內容"></Column>
            <Column field="createDateTime" header="評論時間"></Column>
            <Column :exportable="false" style="min-width: 12rem" header="刪除">
                <template #body="slotProps">
                    <!-- <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editShipper(slotProps.data)" /> -->
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmedDeleteReview(slotProps.data)" />
                </template>
            </Column>
            <Button icon="pi pi-trash" label="刪除選取項目" outlined rounded severity="danger" @click="confirmedDeleteSelectedReviews()" :disabled="!selectedReviews || !selectedReviews.length"  />
        </DataTable>

        

        <Dialog v-model:visible="deleteReviewDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="review"
                    >確定刪除 <b>{{ review.fullName }}</b>對<b>{{review.courseTitle}}</b>的評論嗎?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteReviewDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteReview" />
            </template>
        </Dialog>
        <Dialog v-model:visible="deleteSelectedReviewsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span 
                    >確定刪除評論嗎?</span
                >
            </div>
            <template #footer>
                <Button label="取消" icon="pi pi-times" text @click="deleteSelectedReviewsDialog = false" />
                <Button label="確認" icon="pi pi-check" @click="deleteSelectedReviews" />
            </template>
        </Dialog>
    </div>
</template>
