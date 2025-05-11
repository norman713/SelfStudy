import axiosInstance from "./axiosConfig";

const teamApi = {
    getAll(userId: string, cursor: string, size: number){
        let url="/teams/all?userId="+userId+ "&size=" +size;
        if(cursor.length===0){
            url +="&cursor="+ cursor;
        }
        return axiosInstance.get(url);
    },

    getTeamInfo(id: string){
  const url="/teams/"+id;
  return axiosInstance.get(url);
},
  create(userId: string, name: string, description: string) {
    const url = "/teams?/userId="+userId; 
    const body = {
      name: name,
      description: description,
    };
    return axiosInstance.post(url, body, {
      params: { userId },
    });
  },
  updateTeam(teamId: string, userId:string, name:string, description:string) {
    const url = "/teams/"+teamId+"?userId="+userId;
    const body = {
        name: name,
        description: description
    };
    return axiosInstance.patch(url, body, {
        params: { teamId,userId }
    });
}


}
export default teamApi;