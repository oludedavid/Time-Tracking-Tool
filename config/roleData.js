export default {
  roles: [
    {
      name: "admin",
      grants: ["*"],
    },
    {
      name: "project_manager",
      grants: [
        "hours:review",
        "hours:approve",
        "hours:reject",
        "projects:create",
        "projects:edit",
        "projects:delete",
        "projects:view",
        "projects:manage",
        "projects:assign",
        "users:create",
        "users:update",
        "users:delete",
        "comments:manage",
        "comments:create",
        "replys:create",
        "replycomments:create",
      ],
    },
    {
      name: "freelancer",
      grants: [
        "users:update_own",
        "hours:create",
        "hours:edit_own",
        "hours:view_own",
        "projects:view",
        "comments:create",
        "replys:create",
        "replycomments:create",
      ],
    },
  ],
};
