<script setup>
import { ShipperService } from '@/service/ShipperService';
import { onMounted, ref } from 'vue';
import { MemberData } from '@/service/MemberManagementService';
import { useToast } from 'primevue/usetoast';





// member相關
const showEditDialog = ref(false);
const submitted = ref(false);
const toast = useToast();
const phoneError = ref(false);
const emailError = ref(false);

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
    cdate: '',
});
const allmemberDatacount = ref({});
const selectedTutor =  ref({});
const memberLockDialog  = ref(false);
const genderOptions = [
    { label: '男', value: '男' },
    { label: '女', value: '女' }
];

onMounted(() => {
    ShipperService.getShippers().then((data) => (shippers.value = data));
    MemberData.getAllMemberDataList().then((data) =>(allmemberdata.value = data))
    console.log(allmemberdata.value);
    MemberData.getmemberDataCountStatus().then((data) =>(allmemberDatacount.value = data))
    console.log(`count:${allmemberDatacount.value}`);
});

function hideDialog() {
    showEditDialog.value = false;
    submitted.value = false;
}
function saveMemeberData() {
    validatePhone();
    validateEmail();

    // 如果 phoneError 為 true，表示手機號碼不符合規範，阻止提交
    if (phoneError.value ) {
        console.log('手機號碼無效，無法提交');
        // 可以顯示一個錯誤提示給使用者，或使用 toast 通知
        toast.add({
            severity: 'error',
            summary: '錯誤',
            detail: '手機號碼格式不正確，必須以09開頭且長度為10位數。',
            life: 3000
        });
        return; // 阻止提交
    }
    if (emailError.value ) {
        console.log('信箱無效，無法提交');
        // 可以顯示一個錯誤提示給使用者，或使用 toast 通知
        toast.add({
            severity: 'error',
            summary: '錯誤',
            detail: '信箱格式不正確，必須為example@mail.com。',
            life: 3000
        });
        return; // 阻止提交
    }
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
function showMemberLockDialog(tutorData) {
    selectedTutor.value = { ...tutorData };
    memberLockDialog.value = true;
}
function MemberLockfuntion(memberId){
    console.log("Selected Member ID:", memberId);
    MemberData.updateLockingStatus(memberId)
    .then((response) => {
            console.log('更新成功', response);
            memberLockDialog.value= false
            MemberData.getAllMemberDataList().then((data) => (allmemberdata.value = data));
            MemberData.getmemberDataCountStatus().then((data) => (allmemberDatacount.value = data));
            toast.add({
                severity: 'success',
                summary: '成功',
                detail: '會員停權成功！',
                life: 3000
            });
        })
        .catch((error) => {
            console.error('更新失敗', error);
            toast.add({
                severity: 'error',
                summary: '失敗',
                detail: '會員停權失敗！',
                life: 3000
            });
        });
}
function validatePhone() {
const phonePattern = /^09\d{8}$/;
phoneError.value = !phonePattern.test(editMember.value.phone);
}
function validateEmail() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    emailError.value = !emailPattern.test(editMember.value.email);
}


</script>
<template>
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 lg:col-span-6 xl:col-span-6">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">當前會員數量</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{allmemberDatacount.memberCount}}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-blue-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ allmemberDatacount.monthlyNewMemberCount}} new </span>
                <div class="text-muted-color">自{{ allmemberDatacount.currentMonth}}月以來</div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-6">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">已停權會員的數量</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{allmemberDatacount.blockAccessCount}}</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-eye-slash text-orange-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ allmemberDatacount.monthlyBlockAccessCount}} new </span>
                <div class="text-muted-color">自{{ allmemberDatacount.currentMonth}}月以來</div>
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
            <Column field="isEmailConfirmed" header="是否停權"></Column>
            <Column :exportable="false" style="min-width: 12rem" header="編輯/停權">
                <template #body="slotProps">
                    <Button icon="pi pi-user-edit" outlined rounded class="mr-2" @click="editMemberData(slotProps.data)" :disabled="slotProps.data.isEmailConfirmed === '已停權'"  />
                    <Button icon="pi pi-lock" outlined rounded severity="danger" @click="showMemberLockDialog(slotProps.data)"/>
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
                <InputText 
                    v-model="editMember.phone" 
                    @input="validatePhone" 
                    :class="{ 'p-invalid': phoneError }" 
                    placeholder="09XXXXXXXX" 
                    fluid
                />
                <small v-if="phoneError" class="p-error custom-text-danger">手機號碼必須以09開頭且長度為10位數。</small>
            </div>
            <div>
                <label class="block font-bold mb-3">信箱</label>
                <InputText 
                    v-model="editMember.email" 
                    @input="validateEmail" 
                    :class="{ 'p-invalid': emailError }" 
                    placeholder="example@mail.com" 
                    fluid
                />
                <small v-if="emailError" class="p-error custom-text-danger">請輸入正確的信箱格式</small>
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
        <Dialog v-model:visible="memberLockDialog" :style="{ width: '450px' }" header="駁回申請" :modal="true">
            <div class ="flex flex-col gap-4 justify-center items-center text-center">
                <div class="flex items-center gap-4">
                    <i class="pi pi-exclamation-triangle !text-3xl" />
                    <span>確定要禁止此帳號權限 ?</span>
                </div>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="memberLockDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="MemberLockfuntion(selectedTutor.memberId)" />
            </template>
        </Dialog>
    </div>
</template>
<style scoped>

.custom-text-danger{
color: rgb(232, 171, 158);
}


</style>