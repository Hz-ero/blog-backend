import { ObjectId } from "mongodb";
import { Overwrite } from "tsrpc-proto";
import { Post } from "../shared/models";

export type DbPost = Overwrite<Post, { _id: ObjectId }>;
