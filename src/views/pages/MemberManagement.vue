<script setup>
import { ShipperService } from '@/service/ShipperService';
import { onMounted, ref } from 'vue';
import { MemberData } from '@/service/MemberManagementService';





// member相關
const showEditDialog = ref(false);
const submitted = ref(false);

//member相關
const allmemberdata = ref([]);
const editMember = ref({
    memberId: null,
    lastName:'',
    firstName:'',
    memeberName: '',
    nickName: '',
    gender: '',
    birthday: '',
    phone: '',
    email: '',
    cdate: ''
});
const genderOptions = [
    { label: '男', value: '男' },
    { label: '女', value: '女' }
];

onMounted(() => {
    ShipperService.getShippers().then((data) => (shippers.value = data));
    MemberData.getAllMemberDataList().then((data) =>(allmemberdata.value = data))
    console.log(allmemberdata.value);
});

function hideDialog() {
    showEditDialog.value = false;
    submitted.value = false;
}
function saveMemeberData() {
    submitted.value = true;
    MemberData.updateMemberDataList(editMember.value)
        .then((response) => {
            console.log('更新成功', response);
            showEditDialog.value = false;
            submitted.value = false;
            MemberData.getAllMemberDataList().then((data) => (allmemberdata.value = data));
        })
        .catch((error) => {
            console.error('更新失敗', error);
        });
    }
//member更新相關
function editMemberData(member) {
    editMember.value = { ...member };  
    showEditDialog.value = true;  
}


</script>
<template>
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 lg:col-span-6 xl:col-span-6">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">當前會員數量</span>
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
                        <span class="block text-muted-color font-medium mb-4">有消費會員數量</span>
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
        <DataTable :value="allmemberdata" paginator :rows="6" :rowsPerPageOptions="[6, 12, 18]" tableStyle="min-width: 50rem">
            <Column field="memberId" header="編號" sortable=""></Column>
            <Column field="nationName" header="國籍"></Column>
            <Column field="memeberName" header="姓名"></Column>
            <Column field="nickName" header="暱稱"></Column>
            <Column field="gender" header="性別"></Column>
            <Column field="birthday" header="生日"></Column>
            <Column field="phone" header="電話"></Column>
            <Column field="email" header="信箱"></Column>
            <Column field="cdate" header="註冊時間"></Column>
            <Column :exportable="false" style="min-width: 12rem" header="編輯/刪除">
                <template #body="slotProps">
                    <Button icon="pi pi-user-edit" outlined rounded class="mr-2" @click="editMemberData(slotProps.data)" />
                    <Button icon="pi pi-lock" outlined rounded severity="danger" @click="confirmDeleteShipper(slotProps.data)"/>
                </template>
            </Column>
        </DataTable>
        <Dialog header="編輯會員資料" v-model:visible="showEditDialog" :style="{ width: '450px' }" :modal="true"> 
        <div class="flex flex-col gap-6" >
            <div>
                <label class="font-bold mb-3">名字</label>
                <InputText v-model="editMember.lastName" fluid/>
                <label class="font-bold mb-3">姓氏</label>
                <InputText v-model="editMember.firstName" fluid />
            </div>
            <div>
                <label class="block font-bold mb-3">暱稱</label>
                <InputText v-model="editMember.nickName" fluid />
            </div>
            <div>
                <label class="block font-bold mb-3">性別</label>
                <Dropdown v-model="editMember.gender" :options="genderOptions" optionLabel="label" optionValue="value" fluid/>
            </div>
            <div>
                <label class="block font-bold mb-3">生日</label>
                <InputText v-model="editMember.birthday" placeholder="YYYY-MM-DD" fluid/>
            </div>
            <div>
                <label class="block font-bold mb-3">電話</label>
                <InputText v-model="editMember.phone" fluid/>
            </div>
            <div>
                <label class="block font-bold mb-3">信箱</label>
                <InputText v-model="editMember.email" fluid />
            </div>
            <div>
                <label class="block font-bold mb-3">註冊時間</label>
                <InputText v-model="editMember.cdate" disabled  fluid/>
            </div>
        </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveMemeberData" />
            </template>
        </Dialog>
    </div>
</template>
