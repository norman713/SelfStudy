import axiosInstance from "./axiosConfig";

const teamApi = {
  getAll(userId: string, cursor: string, size: number) {
    let url = "/teams/all?userId=" + userId + "&size=" + size;
    if (cursor.length === 0) {
      url += "&cursor=" + cursor;
    }
    return axiosInstance.get(url);
  },


  getTeamInfo(teamId: string) {
    return axiosInstance.get(`/teams/${teamId}`);
  },
  create(userId: string, name: string, description: string) {
    const url = "/teams?/userId=" + userId;
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
    const body: any = {};
    if (name !== undefined) body.name = name;
    if (description !== undefined) body.description = description;

    return axiosInstance.patch(url, body, {
      params: { teamId, userId },
    });
  },

  resetCode(teamId: string, userId: string) {
    const url = "/teams/reset/" + teamId + "?userId=" + userId;
    return axiosInstance.patch(url);

  },
  deleteTeam(teamId: string, userId: string) {
    const url = "/teams/" + teamId + "?userId=" + userId;
    return axiosInstance.delete(url, {
      params: { userId },
    });
  },

  searchMembers(teamId: string, search: string) {
    return axiosInstance.get('/members/search', {
      params: {
        teamId: teamId,
        keyword: search,
        size: 1000,
      }
    });
  },

  listPlansByDate(date: string, teamId: string) {
    return axiosInstance.get(`/plans/team/date`, {
      params: {
        teamId: teamId,
        date: date,
      }
    });
  },
  getPlansMarkInMonth(teamId: string, month: number, year: number) {
    return axiosInstance.get(`/plans/team/month`, {
      params: {
        teamId: teamId,
        month: month,
        year: year,
      }
    });
  },

  getPlan(planId: string) {
    return axiosInstance.get(`/plans/${planId}`);
  },

  addPlan(planData: {
    name: string,
    description: string,
    teamId: string,
    startAt: string,
    endAt: string,
    remindTimes: string[],
    tasks: { name: string, assigneeId?: string }[]
  }) {
    return axiosInstance.post("/plans/team", planData);
  },
  updatePlan(planId: string, planData: {
    name: string,
    description: string,
    startAt: string,
    endAt: string,
  }) {
    return axiosInstance.patch(`/plans/${planId}`, planData);
  },
  deleteTasks(planId: string, taskIds: string[]) {
    return axiosInstance.delete(`/tasks`, {
      data: { planId, taskIds }
    });
  },
  addTask(data: {
    planId: string,
    tasks: { name: string, assigneeId: string }[]
  }) {
    return axiosInstance.post("/tasks/team", {
      tasks: data.tasks
    });
  },
  updateTasksStatus(planId: string, tasks: { id: string, isCompleted: boolean }[]) {
    return axiosInstance.patch(`/tasks/status`, {
      planId: planId,
      tasks: tasks
    });
  }
}
export default teamApi;