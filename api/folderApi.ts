// src/api/folderApi.ts
import axiosInstance from "./axiosConfig";

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
};

export default folderApi;
