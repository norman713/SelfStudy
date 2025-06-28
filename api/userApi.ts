import axiosInstance from "./axiosConfig";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;

}
interface UserInfoResponse {
  username: string;
  dateOfBirth: string;
  gender: string;
  avatarUrl: string;
  id: string
}
const userApi = {
  getUserInfoById(userId: string) {
    let url = "/users/" + userId

    return axiosInstance.get(url);
  },
  getUserInfo(): Promise<UserInfoResponse> {

    let url = "/users"
    return axiosInstance.get(url);
  },

  updateUserInfo(userId: string, userData: { username: string; dateOfBirth: string; gender: string }) {
    let url = "/users/" + userId;

    // Send a PATCH request to update user info
    return axiosInstance.patch(url, userData);
  },

  login(email: string, password: string): Promise<LoginResponse> {
    const url = "/auth/cred";
    const body = { email, password };
    return axiosInstance.post(url, body);
  },

  validate(username: string, email: string, password: string, dateOfBirth: string, gender: string) {
    const url = "/auth/validate";
    const body = { username, email, password, dateOfBirth, gender };
    console.log(body);
    return axiosInstance.post(url, body);
  },

  register(username: string, email: string, password: string, dateOfBirth: string, gender: string, code: string) {
    const url = "/auth/register";
    const body = { username, email, password, dateOfBirth, gender, verificationCode: code };
    console.log(body);
    return axiosInstance.post(url, body);
  },
  resendCode(email: string) {
    const url = "/auth/reset/" + email;
    return axiosInstance.get(url);
  },

  getPersonalPlansInMonths(month: number, year: number) {
    return axiosInstance.get(`/plans/month`, {
      params: { month, year }
    });
  },
  getPersonalPlans(date: string) {
    return axiosInstance.get(`/plans/date?date=${date}`);
  },

  getPlansById(planId: string) {
    return axiosInstance.get(`/plans/${planId}`);
  },

  addPlan(planData: {
    name: string,
    description: string,
    startAt: string,
    endAt: string,
    remindTimes: string[],
    tasks: string[]
  }) {
    return axiosInstance.post("/plans", planData);
  },

  updatePlan(planId: string, planData: {
    name: string,
    description: string,
    startAt: string,
    endAt: string,
  }) {
    return axiosInstance.patch(`/plans/${planId}`, planData);
  },

  updateTask(planId: string, planData: {
    name: string,
    description: string,
    startAt: string,
    endAt: string,
    remindTimes: string[],
  }) {
    return axiosInstance.patch(`/tasks/personal`, planData);
  },
  getPlanByID(planId: string) {
    return axiosInstance.get(`/plans/${planId}`);
  },
  deleteTasks(planId: string, taskIds: string[]) {
    return axiosInstance.delete(`/tasks`, {
      data: { planId, taskIds }
    });
  },
  addTasks(planId: string, tasks: string[]) {
    return axiosInstance.post(`/tasks/personal`, {
      planId, tasks
    });
  },
  updateTasksStatus(planId: string, tasks: { id: string, isCompleted: boolean }[]) {
    return axiosInstance.patch(`/tasks/status`, {
      planId: planId,
      tasks: tasks
    });
  },

}
export default userApi;