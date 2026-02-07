export enum ViewEditModeRoles {
  ADMIN = "admin",
  MANAGER = "manager",
  USER = "user",
}

export type ViewEditMode = {
  userId: string | null;
  userRole: ViewEditModeRoles | null;
  viewModeEdit: boolean;
  updatedAt: string;
};
