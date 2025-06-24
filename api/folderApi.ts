// src/api/folderApi.ts
import axiosInstance from "./axiosConfig";
import { Alert } from "react-native";

export interface FolderSummary {
  id: string;
  name: string;
  documentCount: number;
}

export interface GetAllFoldersResponse {
  folders: FolderSummary[];
  total: number;
  nextCursor: string | null;
}

const folderApi = {
  getAllFolders(cursor: string = "", size: number = 20): Promise<GetAllFoldersResponse> {
    const url = "/folders";
    return axiosInstance.get(url, {
      params: { cursor, size },
    });
  },

  create(name: string): Promise<FolderSummary> {
    const url = "/folders";
    return axiosInstance.post(url, { name });
  },

  uploadFile(folderId: string, file: any, name: string) {
    const url = `/documents/${folderId}`;
    const formData = new FormData();
    const fileToUpload: any = {
      uri: file.uri,
      name: file.name,
      type: file.mimeType || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
    formData.append('file', fileToUpload);
    console.log(url + `?name=${encodeURIComponent(name)}`);
    try {
      return axiosInstance.post(url + `?name=${encodeURIComponent(name)}`, formData, {
        headers: {
          'Accept': '*/*',
        },
      });
    } catch (err: any) {
      console.log('UPLOAD ERROR:', err?.response?.data || err);
      Alert.alert("Lỗi", "Không thể upload file: " + (err?.message || JSON.stringify(err)));
    }
  },
};

export default folderApi;
