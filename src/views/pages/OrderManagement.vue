<script setup>
import { OrderService } from '@/service/OrderService';
import { onMounted, ref } from 'vue';

const orderDialog = ref(false);
const orders = ref(null);
const order = ref({});
const submitted = ref(false);
const monthCount = ref(0);
const yearCount = ref(0);

const isLoading = ref(true);

const dropdownItems = ref([
    { name: '待付款：0', code: '0' },
    { name: '已成功：1', code: '1' }
]);

onMounted(() => {
    try {
        OrderService.getOrders().then((data) => {
            orders.value = data;
            if (orders.value && orders.value.length > 0) {
                monthCount.value = orders.value[0].monthCount;
                yearCount.value = orders.value[0].yearCount;
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
function editOrder(data) {
    order.value = { ...data };
    console.log(`order物件的內容物是${JSON.stringify(order.value)}`);
    orderDialog.value = true;
}
// Dialog的Cancel@click="hideDialog"
function hideDialog() {
    orderDialog.value = false;
    submitted.value = false;
}
// Dialog的Save@click="saveOrder"
function saveOrder() {
    submitted.value = true;

    console.log(`order物件的內容物是${order.value.orderID}orderID 的型別是 ${typeof order.value.orderID}`);
    console.log(`order物件的內容物是${order.value.orderStatusId}orderID 的型別是 ${typeof order.value.orderStatusId}`);

    // if (order.value && order.value.orderID && order.value.orderStatusId) {
    OrderService.updateOrder(order.value.orderID, order.value.orderStatusId)
        .then((response) => {
            console.log('更新成功', response);
            orderDialog.value = false;
            submitted.value = false;
            OrderService.getOrders().then((data) => (orders.value = data));
        })
        .catch((error) => {
            console.error('更新失敗', error);
        });
    // } else {
    //     console.error('訂單 ID 或訂單狀態不存在，請檢查 order.value:', JSON.stringify(order.value, null, 2));
    // }
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
                        <span class="block text-muted-color font-medium mb-4">本月訂單數量</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ monthCount }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
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
                        <span class="block text-muted-color font-medium mb-4">年度訂單數量</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ yearCount }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-dollar text-orange-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-muted-color">自 {{ firstDayOfYear }} 以來</span>
            </div>
        </div>
    </div>

    <div style="margin: 50px"></div>

    <div className="card">
        <DataTable :value="orders" tableStyle="min-width: 50rem" paginator :rows="10" :rowsPerPageOptions="[10, 20, 30]">
            <Column field="transactionDate" header="訂單日期" sortable=""></Column>
            <Column field="merchantTradeNo" header="訂單編號" sortable=""></Column>
            <Column field="orderStatusId" header="訂單狀態" sortable=""></Column>
            <Column field="subTotal" header="小計金額"></Column>
            <Column field="totalPrice" header="訂單總額" sortable=""></Column>
            <Column :exportable="false" style="min-width: 5rem" header="編輯">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" style="color: #02cab9; border-color: #02cab9" outlined rounded class="mr-2" @click="editOrder(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="orderDialog" :style="{ width: '450px' }" header="訂單明細" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="orderStatusId" class="block font-bold mb-3">訂單狀態</label>
                    <Select id="orderStatusId" v-model="order.orderStatusId" :options="dropdownItems" optionLabel="name" optionValue="code" placeholder="訂單狀態" class="w-full" :invalid="submitted && !order.orderStatusId"></Select>
                </div>
                <div>
                    <label for="fullName" class="block font-bold mb-3">會員姓名</label>
                    <InputText id="fullName" v-model.trim="order.fullName" fluid disabled />
                </div>
                <div>
                    <label for="email" class="block font-bold mb-3">電子信箱</label>
                    <InputText id="email" v-model.trim="order.email" :invalid="submitted && !order.email" fluid disabled />
                </div>
                <div>
                    <label for="courseTitle" class="block font-bold mb-3">課程名稱</label>
                    <InputText id="courseTitle" v-model.trim="order.courseTitle" :invalid="submitted && !order.courseTitle" fluid disabled />
                </div>
                <div>
                    <label for="courseType" class="block font-bold mb-3">課程時長（單位：分鐘）</label>
                    <InputText id="courseType" v-model.trim="order.courseType" :invalid="submitted && !order.courseType" fluid disabled />
                </div>
                <div>
                    <label for="quantity" class="block font-bold mb-3">課程堂數</label>
                    <InputText id="quantity" v-model.trim="order.quantity" :invalid="submitted && !order.quantity" fluid disabled />
                </div>
                <div>
                    <label for="unitPrice" class="block font-bold mb-3">課程單價</label>
                    <InputText id="unitPrice" v-model.trim="order.unitPrice" :invalid="submitted && !order.unitPrice" fluid disabled />
                </div>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveOrder" />
            </template>
        </Dialog>
    </div>
</template>
