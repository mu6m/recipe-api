import { Elysia, t } from "elysia";
import { prisma } from "@/libs/prisma";

export const sort = (app: Elysia) =>
  app
    .get(
      "/sort",
      async ({ query, set }) => {
        const { maxcal, mincal } = query;
        if (Number.isNaN(Number(maxcal)) || Number.isNaN(Number(maxcal))) {
          set.status = 400;
          return {
            success: false,
            data: null,
            message: "mincal, maxcal Should Be Positive",
          };
        }
        const intmaxcal = Number(maxcal);
        const intmincal = Number(mincal);

        if (intmaxcal < 0 || intmincal < 0) {
          set.status = 400;
          return {
            success: false,
            data: null,
            message: "mincal, maxcal Should Be Positive",
          };
        }

        const meals = await prisma.meal.findMany({
          where: {
            calories: {
              lte: intmaxcal,
              gte: intmincal,
            },
          },
          include: {
            tag: true,
          },
          orderBy: [
            {
              calories: "desc",
            },
          ],
        });

        if (!meals || meals.length <= 0) {
          set.status = 400;
          return {
            success: false,
            data: null,
            message: "Cannot Find Any Recipe",
          };
        }

        return {
          success: true,
          data: meals,
          message: `Found ${meals.length} Recipes`,
        };
      },
      {
        query: t.Object({
          maxcal: t.String(),
          mincal: t.String(),
        }),
      }
    )
    .onError(() => "Some Fields Are Required");
