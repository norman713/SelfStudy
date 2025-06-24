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

}
export default userApi;