import axiosInstance from "./axiosConfig";

const invitationApi = {
     get(size: number, cursor: string) {
        const url = cursor !== '' ? "invitations?cursor="+cursor +"&size="+ size :
        "invitations?size=" + size;
        return axiosInstance.get(url);
    }
}
export default invitationApi;