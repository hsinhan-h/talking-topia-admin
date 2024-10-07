<script setup>
import { BookingService } from '@/service/BookingService';
import { onMounted, ref } from 'vue';

const bookingDialog = ref(false);
const bookings = ref(null);
const booking = ref({});
const submitted = ref(false);
const monthCount = ref(0);
const yearCount = ref(0);
const deleteBookingDialog = ref(false);

const isLoading = ref(true);

onMounted(() => {
    try {
        BookingService.getBookings().then((data) => {
            bookings.value = data;
            if (bookings.value && bookings.value.length > 0) {
                monthCount.value = bookings.value[0].monthCount;
                yearCount.value = bookings.value[0].yearCount;
            }
        });
    } catch (error) {
        console.error('加載數據失敗', error);
    } finally {
        isLoading.value = false;
    }
});

// 找每個月初
const getFirstDayOfMonth = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

    const year = firstDay.getFullYear();
    const month = String(firstDay.getMonth() + 1).padStart(2, '0');
    const day = String(firstDay.getDate()).padStart(2, '0');
    const hours = String(firstDay.getHours()).padStart(2, '0');
    const minutes = String(firstDay.getMinutes()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}`;
};
const firstDayOfMonth = ref(getFirstDayOfMonth());

// 找每年初
const getFirstDayOfYear = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), 0, 1);
    const year = firstDay.getFullYear();
    const month = String(firstDay.getMonth() + 1).padStart(2, '0');
    const day = String(firstDay.getDate()).padStart(2, '0');
    const hours = String(firstDay.getHours()).padStart(2, '0');
    const minutes = String(firstDay.getMinutes()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}`;
};
const firstDayOfYear = ref(getFirstDayOfYear());

// 觸發editDialog的按鈕事件
function editBooking(data) {
    booking.value = { ...data };
    console.log(`booking物件的內容物是${JSON.stringify(booking.value)}`);
    bookingDialog.value = true;
}
// Dialog的Cancel@click="hideDialog"
function hideDialog() {
    bookingDialog.value = false;
    submitted.value = false;
}
// Dialog的Save@click="saveBooking"
function saveBooking() {
    submitted.value = true;

    console.log(`booking物件的內容物是${booking.value.bookingID}bookingID 的型別是 ${typeof booking.value.bookingID}`);

    // if (booking.value && booking.value.bookingID && booking.value.bookingStatusId) {
    BookingService.updateBooking(booking.value.bookingID, booking.value.bookingDate, booking.value.bookingTime)
        .then((response) => {
            console.log('更新成功', response);
            bookingDialog.value = false;
            submitted.value = false;
            BookingService.getBookings().then((data) => (bookings.value = data));
        })
        .catch((error) => {
            console.error('更新失敗', error);
        });
    // } else {
    //     console.error('預約 ID 或預約狀態不存在，請檢查 booking.value:', JSON.stringify(booking.value, null, 2));
    // }
}

function confirmDeleteBooking(data) {
    deleteBookingDialog.value = true;
    console.log(data);
    booking.value = data;
}

function deleteBooking() {
    console.log('準備要刪除Booking!!!!!');
    BookingService.deleteBooking(booking.value.bookingID)
        .then((response) => {
            console.log('刪掉Booking');
            console.log(booking.value);
            console.log('刪除成功', response);
            deleteBookingDialog.value = false;
            BookingService.getBookings().then((data) => (bookings.value = data));
        })
        .catch((error) => {
            console.error('刪除失敗', error);
        });
}
</script>

<template>
    <div v-if="isLoading" class="loading-container">
        <ProgressSpinner style="width: 100px; height: 100px; stroke: #02cab9" strokeWidth="3" fill="transparent" animationDuration=".7s" aria-label="Custom ProgressSpinner" class="custom-spinner" />
        <div class="loading-text">Loading...</div>
    </div>

    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 lg:col-span-6 xl:col-span-6">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">本月預約數量</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ monthCount }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-bbooking" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-shopping-cart text-blue-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-muted-color">自 {{ firstDayOfMonth }} 以來</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-6">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">年度預約數量</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ yearCount }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-bbooking" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-dollar text-orange-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-muted-color">自 {{ firstDayOfYear }} 以來</span>
            </div>
        </div>
    </div>

    <div style="margin: 50px"></div>

    <div className="card">
        <DataTable :value="bookings" tableStyle="min-width: 50rem" paginator :rows="10" :rowsPerPageOptions="[10, 20, 30]">
            <Column field="bookingDate" header="預約日期" sortable=""></Column>
            <Column field="bookingTime" header="預約時間"></Column>
            <Column field="courseTitle" header="課程名稱"></Column>
            <Column field="studentName" header="學員" sortable=""></Column>
            <Column field="surplus" header="剩餘堂數" sortable=""></Column>
            <Column :exportable="false" style="min-width: 5rem" header="編輯/刪除">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editBooking(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteBooking(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="bookingDialog" :style="{ width: '450px' }" header="預約明細" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="courseTitle" class="block font-bold mb-3">課程名稱</label>
                    <InputText id="courseTitle" v-model.trim="booking.courseTitle" :invalid="submitted && !booking.courseTitle" fluid disabled />
                </div>
                <div>
                    <label for="tutorName" class="block font-bold mb-3">教師名稱</label>
                    <InputText id="tutorName" v-model.trim="booking.tutorName" :invalid="submitted && !booking.tutorName" fluid disabled />
                </div>
                <div>
                    <label for="bookingDate" class="block font-bold mb-3">預約日期</label>
                    <InputText id="bookingDate" v-model.trim="booking.bookingDate" autofocus required="true" :invalid="submitted && !booking.bookingDate" fluid />
                </div>
                <div>
                    <label for="bookingTime" class="block font-bold mb-3">預約時間</label>
                    <InputText id="bookingTime" v-model.trim="booking.bookingTime" required="true" :invalid="submitted && !booking.bookingDate" fluid />
                </div>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveBooking" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteBookingDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="booking"
                    >確定刪除 <b>{{ booking.studentName }}</b
                    >對<b>{{ booking.courseTitle }}</b
                    >的預約嗎?</span
                >
            </div>
            <template #footer>
                <Button label="否，取消刪除" icon="pi pi-times" text @click="deleteBookingDialog = false" />
                <Button label="是，確定刪除" icon="pi pi-check" @click="deleteBooking" />
            </template>
        </Dialog>
    </div>
</template>
