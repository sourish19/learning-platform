import { Elysia, t } from "elysia";
import { pool } from "../config/db";

export const submitController = new Elysia().post(
  "/submit",
  async ({ body }) => {
    const { user_id, problem_id } = body;

    const userExistsQuery = await pool.query(
      `
    SELECT EXISTS (
      SELECT 1 FROM users WHERE id=$1
    )`,
      [user_id],
    );

    if (!userExistsQuery.rows[0].exists)
      return { status: 404, message: "user dosen't exists" };

    const problemExistsQuery = await pool.query(
      `SELECT course_id FROM problems WHERE id=$1 `,
      [problem_id],
    );

    if (problemExistsQuery.rows.length < 1)
      return { status: 404, message: "problem with this id dosen't exists" };

    const duplicateSubmissionQuery = await pool.query(
      `
      SELECT EXISTS(
        SELECT 1 FROM submissions WHERE user_id=$1 AND problem_id=$2
      )`,
      [user_id, problem_id],
    );

    if (duplicateSubmissionQuery.rows[0].exists)
      return { status: 400, message: "problem already submitted" };

    const tsx = await pool.connect();
    try {
      await tsx.query(`BEGIN`);

      await tsx.query(
        `
        INSERT INTO submissions(user_id,problem_id) VALUES($1,$2)
        RETURNING *
        `,
        [user_id, problem_id],
      );

      const totalProblemsQuery = await tsx.query(
        `
        SELECT COUNT(*)
        FROM problems
        WHERE course_id=$1
        `,
        [problemExistsQuery.rows[0].course_id],
      );

      const totalSubmissionsQuery = await tsx.query(
        `
        SELECT COUNT(*)
        FROM submissions
        INNER JOIN problems
          ON submissions.problem_id = problems.id
        WHERE user_id=$1
          AND problems.course_id = $2
        `,
        [user_id, problemExistsQuery.rows[0].course_id],
      );

      const percentage =
        (Number(totalSubmissionsQuery.rows[0].count) /
          Number(totalProblemsQuery.rows[0].count)) *
        100;

      await tsx.query(
        `
        INSERT INTO progress(user_id,course_id,completion_percentage)
        VALUES($1,$2,$3)
        ON CONFLICT(user_id,course_id)
        DO UPDATE SET
          completion_percentage=EXCLUDED.completion_percentage
        `,
        [user_id, problemExistsQuery.rows[0].course_id, percentage],
      );

      await tsx.query(`COMMIT`);

      return {status:200,message:"Problem submitted"}
    } catch (error) {
      console.error("Error in transaction: ", error);
      await tsx.query(`ROLLBACK`);
      return { status: 500, message: "Something went wrong" };
    } finally {
      tsx.release();
    }
  },
  {
    body: t.Object({
      user_id: t.Number(),
      problem_id: t.Number(),
    }),
  },
);

/*
  user_id & problem_id

  - Validate user
  - Validate problem
  - Check duplicate
  - BEGIN
  - Insert submission
  - Calculate completed problems in that course
  - Calculate percentage
  - Update/insert progress
  - COMMIT

  - (completed problems/total problems)*100
*/
