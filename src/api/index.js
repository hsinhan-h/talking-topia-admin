import ApiRequest from '@/utilities/ApiRequest';

const api = {
    getAllShippers: '/api/Shipper/GetAllShippers',
    updateShipper: '/api/Shipper/UpdateShipper',
    getAllOrders: '/api/Order/GetAllOrders',
    updateOrder: '/api/Order/UpdateOrder'
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
