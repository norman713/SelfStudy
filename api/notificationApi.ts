import axiosInstance from "./axiosConfig";

const notificationApi = {
    get(size: number, cursor: string) {
        const url = cursor !== '' ? "notifications?cursor="+cursor +"&size="+ size :
        "notifications?size=" + size;
        return axiosInstance.get(url);
    },
    deleteSelected(ids: Set<string>) {
        const url = "notifications";
        const idArray = Array.from(ids);
        return axiosInstance.delete(url, {
            data: {
                ids: idArray,
            },
        });
    },
    deleteAll() {
        const url = "notifications/all";
        return axiosInstance.delete(url);
    },
    markSelected(ids: Set<string>) {
        const url = "notifications/mark";
        const idArray = Array.from(ids);
        return axiosInstance.post(url, {
            data: {
                ids: idArray,
            },
        });
    },
    markAll() {
        const url = "notifications/mark/all";
        return axiosInstance.post(url);
    }
}     
export default notificationApi;