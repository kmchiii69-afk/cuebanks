/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as authMigrate from "../authMigrate.js";
import type * as authSession from "../authSession.js";
import type * as chat from "../chat.js";
import type * as cueInstructions from "../cueInstructions.js";
import type * as freebie from "../freebie.js";
import type * as http from "../http.js";
import type * as lib_bootstrap from "../lib/bootstrap.js";
import type * as lib_userRole from "../lib/userRole.js";
import type * as members from "../members.js";
import type * as users from "../users.js";
import type * as webinars from "../webinars.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  authMigrate: typeof authMigrate;
  authSession: typeof authSession;
  chat: typeof chat;
  cueInstructions: typeof cueInstructions;
  freebie: typeof freebie;
  http: typeof http;
  "lib/bootstrap": typeof lib_bootstrap;
  "lib/userRole": typeof lib_userRole;
  members: typeof members;
  users: typeof users;
  webinars: typeof webinars;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
