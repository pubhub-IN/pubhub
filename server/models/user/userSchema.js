import mongoose from "mongoose";

const { Schema } = mongoose;

const repositorySchema = new Schema(
  {
    repo_id: { type: Number, required: true },
    name: { type: String, required: true },
    full_name: { type: String },
    html_url: { type: String },
    description: { type: String, default: "" },
    language: { type: String, default: "" },
    stargazers_count: { type: Number, default: 0 },
    forks_count: { type: Number, default: 0 },
    open_issues_count: { type: Number, default: 0 },
    default_branch: { type: String, default: "main" },
    updated_at: { type: Date },
    pushed_at: { type: Date },
  },
  { _id: false }
);

export const userSchema = new Schema(
  {
    github_id: { type: Number, unique: true, sparse: true, index: true },
    github_username: { type: String, required: true, unique: true, trim: true, index: true },
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    avatar_url: { type: String, default: "" },
    profession: { type: String, default: "" },
    technologies: { type: [String], default: [] },
    total_public_repos: { type: Number, default: 0 },
    total_commits: { type: Number, default: 0 },
    languages: { type: Map, of: Number, default: {} },
    github_data: { type: Schema.Types.Mixed, default: {} },
    linkedin_username: { type: String, default: null },
    x_username: { type: String, default: null },
    repositories: { type: [repositorySchema], default: [] },
    activity_days: { type: [String], default: [] },
    github_access_token: { type: String, default: null },
    last_active_at: { type: Date, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        ret.created_at = ret.createdAt;
        ret.updated_at = ret.updatedAt;
        delete ret._id;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      },
    },
  }
);