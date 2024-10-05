<script setup>
import { OrderService } from '@/service/OrderService';
import { onMounted, ref } from 'vue';

const orderDialog = ref(false);

const orders = ref(null);
const order = ref({});
const submitted = ref(false);
const deleteOrderDialog = ref(false);

onMounted(() => {
    OrderService.getOrders().then((data) => (orders.value = data));
});

// Dialog的Cancel@click="hideDialog"
function hideDialog() {
    orderDialog.value = false;
    submitted.value = false;
}
// Dialog的Save@click="saveOrder"
function saveOrder() {
    submitted.value = true;
    console.log('準備要更新order!!!!!!');

    // todo 串接API
}

function editOrder(data) {
    order.value = { ...data };
    orderDialog.value = true;
}

function confirmDeleteOrder(data) {
    deleteOrderDialog.value = true;
    order.value = data;
}

function deleteOrder() {
    console.log('準備要刪除order!!!!!!');
    // todo 串接API
    console.log('刪除order!!!!!!');
    console.log(order.value);
    deleteOrderDialog.value = false;
}
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 lg:col-span-6 xl:col-span-6">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">今日訂單數量</span>
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
                        <span class="block text-muted-color font-medium mb-4">本週訂單數量</span>
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
        <DataTable :value="orders" tableStyle="min-width: 50rem">
            <Column field="transactionDate" header="訂單日期" sortable=""></Column>
            <Column field="merchantTradeNo" header="訂單編號" sortable=""></Column>
            <Column field="orderStatusId" header="訂單狀態" sortable=""></Column>
            <Column field="subTotal" header="小計金額"></Column>
            <Column field="totalPrice" header="訂單總額" sortable=""></Column>
            <Column :exportable="false" style="min-width: 5rem" header="編輯/刪除">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editOrder(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteOrder(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="orderDialog" :style="{ width: '450px' }" header="Order Details" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="fullName" class="block font-bold mb-3">會員姓名</label>
                    <InputText id="fullName" v-model.trim="order.fullName" fluid disabled />
                </div>
                <div>
                    <label for="email" class="block font-bold mb-3">電子信箱</label>
                    <InputText id="email" v-model.trim="order.email" autofocus :invalid="submitted && !order.email" fluid disable />
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
                <div>
                    <label for="orderStatusId" class="block font-bold mb-3">訂單狀態（待付款：0／已成功：1）</label>
                    <InputText id="orderStatusId" v-model.trim="order.orderStatusId" required="true" :invalid="submitted && !order.orderStatusId" fluid />
                </div>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveOrder" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteOrderDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="order"
                    >確定刪除 <b>{{ order.fullName }}</b
                    >的訂單嗎?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteOrderDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteOrder" />
            </template>
        </Dialog>
    </div>
</template>
