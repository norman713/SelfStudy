import axiosInstance from "./axiosConfig";

const chatApi = {
    getChatMessages(params: {teamId: string; cursor?: string; size?: number;}){
        return axiosInstance.get('/chat/all', { params });
    },
    sendChatMessage(content: string, teamId: string | null){
        return axiosInstance.post(`/chat/${teamId}`, {content: content});
    },
    sendChatImage(formData: FormData, teamId: string | null){
        return axiosInstance.post(`/chat/${teamId}/image`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
        }, transformRequest: () => formData});
    },
    deleteChatMessage(id: string){
        return axiosInstance.delete(`/chat/${id}`);
    }   
}

export default chatApi;