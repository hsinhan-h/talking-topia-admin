<script setup>
import { ReviewService } from '@/service/ReviewService';
import { onMounted, ref } from 'vue';



const deleteReviewDialog = ref(false);
const reviewList = ref(null);
const review = ref({});

onMounted(() => {
    ReviewService.getReviews().then((data)=>(reviewList.value = data));
    console.log(reviewList.value);

});

function confirmedDeleteReview(data) {
    review.value = data;
    console.log(review.value);
    deleteReviewDialog.value = true;
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
            <Column :exportable="false" style="min-width: 12rem" header="刪除">
                <template #body="slotProps">
                    <!-- <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editShipper(slotProps.data)" /> -->
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmedDeleteReview(slotProps.data)" />
                </template>
            </Column>
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
    </div>
</template>
