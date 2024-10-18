
import { getAllMemberDataList, updateMemberData, getAllTutorData, approveTutorStatus, rejectTutorStatus, tutorInformationStatus, lockingStatus, getmemberDataCount, getDbImgUrlInformaiton, updateImageUrl} from '@/api/index';

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
    },
    getAllTutorDataList() {
        return new Promise((resolve, reject) => {
            getAllTutorData()
                .then((data) => {
                    console.log('教師資料:', data); 
                    resolve(data); 
                })
                .catch((error) => {
                    console.error('獲取教師資料失敗:', error); 
                    reject(error); 
                });
        });
    },
    approveTutorDataList(tutorDto) {
        return new Promise((resolve, reject) => {
            approveTutorStatus(tutorDto)
                .then((data) => {
                    console.log('教師資料:', data); 
                    resolve(data); 
                })
                .catch((error) => {
                    console.error('獲取教師資料失敗:', error); 
                    reject(error); 
                });
        });
    },
    rejectTutorDataList(tutorDto) {
        return new Promise((resolve, reject) => {
            rejectTutorStatus(tutorDto)
                .then((data) => {
                    console.log('教師資料:', data); 
                    resolve(data); 
                })
                .catch((error) => {
                    console.error('獲取教師資料失敗:', error); 
                    reject(error); 
                });
        });
    },
    tutorInformation() {
        return new Promise((resolve, reject) => {
            tutorInformationStatus()
                .then((data) => {
                    console.log('教師資料:', data); 
                    resolve(data); 
                })
                .catch((error) => {
                    console.error('獲取教師資料失敗:', error); 
                    reject(error); 
                });
        });
    },
    updateLockingStatus(memberId) {
        return new Promise((resolve, reject) => {
            lockingStatus(memberId)
                .then((data) => {
                    console.log('教師資料:', data); 
                    resolve(data); 
                })
                .catch((error) => {
                    console.error('獲取教師資料失敗:', error); 
                    reject(error); 
                });
        });
    },
    getmemberDataCountStatus() {
        return new Promise((resolve, reject) => {
            getmemberDataCount()
                .then((data) => {
                    console.log('教師資料:', data); 
                    resolve(data); 
                })
                .catch((error) => {
                    console.error('獲取教師資料失敗:', error); 
                    reject(error); 
                });
        });
    },
    getDbImgUrlfuntion(memberId) {
        return new Promise((resolve, reject) => {
            getDbImgUrlInformaiton(memberId)
                .then((data) => {
                    console.log('教師資料:', data); 
                    resolve(data); 
                })
                .catch((error) => {
                    console.error('獲取教師資料失敗:', error); 
                    reject(error); 
                });
        });
    },
    updateImageUrlInDB(memberId, imageUrls) {
        return new Promise((resolve, reject) => {
            updateImageUrl(memberId, imageUrls)
                .then((data) => {
                    console.log('教師資料:', data); 
                    resolve(data); 
                })
                .catch((error) => {
                    console.error('獲取教師資料失敗:', error); 
                    reject(error); 
                });
        });
    }
    
};