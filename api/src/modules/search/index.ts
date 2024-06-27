import { Elysia, t } from "elysia";
import { prisma } from "@/libs/prisma";

export const search = (app: Elysia) =>
  app
    .get(
      "/search",
      async ({ query, set }) => {
        const { text } = query;

        if (!text) {
          set.status = 400;
          return {
            success: false,
            data: null,
            message: "Empty Search Text",
          };
        }

        const meals = await prisma.meal.findMany({
          where: {
            name: {
              contains: text,
              mode: "insensitive",
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
          text: t.String(),
        }),
      }
    )
    .onError(() => "Some Fields Are Required");
