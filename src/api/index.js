import ApiRequest from '@/utilities/ApiRequest';

const api = {
    getAllShippers: '/api/Shipper/GetAllShippers',
    updateShipper: '/api/Shipper/UpdateShipper',
    getAllOrders: '/api/Order/GetAllOrders',
    updateOrder: '/api/Order/UpdateOrder',
    getAllBookings: '/api/Booking/GetAllBookings',
    updateBooking: '/api/Booking/UpdateBooking',
    deleteBooking: '/api/Booking/DeleteBooking',
    getAllMemberDataList:'api/MemberManagermentApi/GetMemberDataList',
    updateMemberDatas:'api/MemberManagermentApi/UpdateMemberDataList',
    getAllTutorDataApi:'api/MemberManagermentApi/GetTutorDataList',
    updateMemberDatas:'api/MemberManagermentApi/UpdateMemberDataList',
    getAllReviewData:'/api/Review/GetAllReviews',
    deleteReview:'/api/Review/DeleteReview'
};

export function getAllShippers() {
    return ApiRequest.httpGet(api.getAllShippers);
}

export function updateShipper(shipperId, companyName, phone) {
    const request = {
        shipperId: shipperId,
        companyName: companyName,
        phone: phone
    };
    return ApiRequest.httpPut(api.updateShipper, request);
}

export function getAllOrders() {
    return ApiRequest.httpGet(api.getAllOrders);
}

export function updateOrderItem(orderId, OrderStatusId) {
    console.log(`ID是${orderId},狀態是${OrderStatusId} `);
    const request = {
        orderId,
        OrderStatusId
    };
    return ApiRequest.httpPut(api.updateOrder, request);
}

export function getAllBookings() {
    return ApiRequest.httpGet(api.getAllBookings);
}

export function updateBookingItem(bookingId, bookingDate, bookingTime) {
    const request = {
        bookingId,
        bookingDate,
        bookingTime
    };
    return ApiRequest.httpPut(api.updateBooking, request);
}

export function deleteBookingItem(bookingId) {
    const request = {
        bookingId
    };
    return ApiRequest.httpPut(api.deleteBooking, request);
}
export function getAllMemberDataList() {
    return ApiRequest.httpGet(api.getAllMemberDataList);
}
export function updateMemberData(memberData) {
    return ApiRequest.httpPut(api.updateMemberDatas, memberData);
}
export function getAllTutorData() {
    return ApiRequest.httpGet(api.getAllTutorDataApi);
}

export function getAllReviewData(){
    return ApiRequest.httpGet(api.getAllReviewData);
}

export function deleteReview(reviewId) {
    const request={
        reviewId
    }
   
    return ApiRequest.httpDelete(api.deleteReview,request);
}

