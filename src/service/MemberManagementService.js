
import { getAllMemberDataList, updateMemberData } from '@/api/index';

export const MemberData = {
    getAllMemberDataList() {
        return new Promise((resolve, reject) => {
            getAllMemberDataList()
                .then((data) => {
                    console.log('會員資料:', data); //
                    resolve(data); 
                })
                .catch((error) => {
                    console.error('獲取會員資料失敗:', error); 
                    reject(error); 
                });
        });
    },
    updateMemberDataList(memberData) {
        return new Promise((resolve, reject) => {
            updateMemberData(memberData)
                .then((data) => {
                    console.log('會員資料:', data); 
                    resolve(data); 
                })
                .catch((error) => {
                    console.error('獲取會員資料失敗:', error); 
                    reject(error); 
                });
        });
    }
};