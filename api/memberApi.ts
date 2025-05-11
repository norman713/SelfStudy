import axiosInstance from "./axiosConfig";
const memberApi= {
join(userId: string, teamCode: string){
    const url="/members?userId="+userId+"&teamCode="+teamCode;
    return axiosInstance.post(url, null,{
        params:{userId},
    })
},
getUserInfo(userId: string, teamId: string){
    const url="/members?userId="+userId+"&teamId="+teamId;
    return axiosInstance.get(url);
},
getList(teamId: string, cursor: string, size: number){

    let url="members/list?teamId="+teamId+"&size"+ size;
       if(cursor.length===0){
            url +="&cursor="+ cursor;
        }
        return axiosInstance.get(url);

},
search(teamId:string,cursor: string, size: number, keyword:string){
  let url="members/search?teamId="+teamId+"&keyword="+keyword+ "&size"+ size;
       if(cursor.length===0){
            url +="&cursor="+ cursor;
        }
        return axiosInstance.get(url);
},
}     
export default memberApi;                                                                        