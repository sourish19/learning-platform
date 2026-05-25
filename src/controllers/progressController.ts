import { Elysia, t } from "elysia";
import { pool } from "../config/db";

export const progressController = new Elysia().get(
  "/progress",
  async ({ query }) => {
    const { user_id } = query;

    const getUserAllCourseQuery = await pool.query(
      `
      SELECT
        progress.completion_percentage,
        courses.title as course
      FROM progress
      INNER JOIN courses
        ON progress.course_id=courses.id
      WHERE progress.user_id=$1
      `,
      [user_id],
    );

    return {
      status: 200,
      message: "Fetched all user courses",
      data: getUserAllCourseQuery.rows,
    };
  },
  {
    query: t.Object({
      user_id: t.Number(),
    }),
  },
);
