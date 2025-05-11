import axiosInstance from "./axiosConfig";

const teamApi = {
    getAll(userId: string, cursor: string, size: number){
        let url="/teams/all?userId="+userId+ "&size=" +size;
        if(cursor.length===0){
            url +="&cursor="+ cursor;
        }
        return axiosInstance.get(url);
    },
  create(userId: string, name: string, description: string) {
    const url = "/teams/userId="+userId; // Endpoint tạo đội mới
    const body = {
      name: name,
      description: description,
    };
    return axiosInstance.post(url, body, {
      params: { userId },
    });
  },

}
export default teamApi;