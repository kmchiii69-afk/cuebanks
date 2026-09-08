import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { cueOptions, cuePost, freebieCuePost } from "./cueHttp";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({ path: "/cue", method: "POST", handler: cuePost });
http.route({ path: "/cue", method: "OPTIONS", handler: cueOptions });
http.route({ path: "/freebie-cue", method: "POST", handler: freebieCuePost });
http.route({ path: "/freebie-cue", method: "OPTIONS", handler: cueOptions });

export default http;
