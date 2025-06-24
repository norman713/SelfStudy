import axiosInstance from "./axiosConfig";

const notificationApi = {
    get(size: number, cursor: string) {
        const url = cursor !== '' ? "notifications?cursor="+cursor +"&size="+ size :
        "notifications?size=" + size;
        return axiosInstance.get(url);
    }

}     
export default notificationApi;