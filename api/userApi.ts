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
  register(username: string, email: string, password: string) {
    const url = "/auth/register";
    const body = { username, email, password };
    return axiosInstance.post(url, body);
  },

  getPersonalPlansInMonths(month: number, year: number) {
    return axiosInstance.get(`/plans/months`, {
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

}
export default userApi;