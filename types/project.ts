export interface ProjectListItem {
  id: string;
  name: string;
  ownerType: "owned" | "shared";
  createdAt: string;
  updatedAt: string;
}
