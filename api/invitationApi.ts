import axiosInstance from "./axiosConfig";

const invitationApi = {
     get(size: number, cursor: string) {
        const url = cursor !== '' ? "invitations?cursor="+cursor +"&size="+ size :
        "invitations?size=" + size;
        return axiosInstance.get(url);
    },
    reply(id: string, accept: boolean) {
        const url = "invitations/"+ id + "?accept=" + accept;
        return axiosInstance.post(url);
    }
}
export default invitationApi;