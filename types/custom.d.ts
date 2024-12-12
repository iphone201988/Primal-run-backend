// custom.d.ts (placed inside the global 'types' folder)

import { Request } from "express";
import { UserModel } from "./Database/types";

declare global {
  namespace Express {
    interface Request {
      user?: UserModel;
      userId?: string;
    }
  }
}
