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
updateTeam(teamId: string, userId: string, name?: string, description?: string) {
  const url = "/teams/" + teamId + "?userId=" + userId;

  // Tạo body chỉ với những field không undefined
  const body: any = {};
  if (name !== undefined) body.name = name;
  if (description !== undefined) body.description = description;

  return axiosInstance.patch(url, body, {
    params: { teamId, userId },
  });
},

resetCode(teamId:string, userId:string ){
  const url="/teams/reset/"+teamId+"?userId="+userId;
  return axiosInstance.patch(url);

},
deleteTeam(teamId: string, userId: string) {
  const url = "/teams/"+teamId+"?userId="+userId;
  return axiosInstance.delete(url, {
    params: { userId },
  });
},

addPlan(planData: {
  name: string,
  description: string,
  startAt: string,
  endAt: string,
  remindTimes: string[],
  tasks: { name: string, assigneeId: string }[]  
}) {
  return axiosInstance.post("/plans/team", planData);
},

addTask(data: {
  planId: string,
  tasks: { name: string, assigneeId: string }[]
}) {
  return axiosInstance.post("/tasks/team", {
    tasks: data.tasks    
  });
}




}
export default teamApi;