import { Elysia } from "elysia";
import { rateLimit } from "elysia-rate-limit";
import { search } from "@/modules/search";
import { sort } from "@/modules/sort";

const app = new Elysia()
	.use(
		rateLimit({
			duration: 10000,
			max: 20,
			responseMessage: "Ratelimited",
		})
	)
	.get("/", () => "Go To /api/ Route To Use It !")
	.get("/ping", () => "pong")
	.group("/api", (app: any) =>
		app
			.get("/", () => "/api/search?text=(STRING) To Search For Name By Text\n/api/sort?mincal=(INT)&maxcal=(INT) To Sort All Recipes By Calories\n")
			.use(search)
			.use(sort)
			.onError(() => "Unknown Error")
	)
	.listen(3000);
console.log(`app is running at ${app.server?.hostname}:${app.server?.port}`);
