const sequelize = require('../../config/db');
const ExcelJS = require('exceljs');

exports.timesheetReport = async (req, res) => {
  try {
    let {
      start_date,
      end_date,
      employee_ids,
      project_ids,
      activity_types,
      aggregationDimensions,
      limit,
      offset,
      exportType
    } = req.body;

    // Ensure aggregationDimensions is an array
    if (!Array.isArray(aggregationDimensions)) {
      aggregationDimensions = [];
    }

    const isExport = exportType === 'excel';

    // If not exporting, apply pagination defaults
    if (!isExport) {
      if (limit == null || limit > 100) limit = 100; 
      if (offset == null) offset = 0;
    }

    const selectFields = [];
    const groupByFields = [];

    // Build selectFields and groupByFields based on aggregationDimensions
    aggregationDimensions.forEach(dim => {
      if (dim === "employee") {
        selectFields.push("CONCAT(e.first_name, ' ', e.last_name) AS Employee");
        groupByFields.push("e.id", "e.first_name", "e.last_name");
      } else if (dim === "project") {
        selectFields.push("p.proj_name AS Project");
        groupByFields.push("p.proj_id", "p.proj_name");
      } else if (dim === "activity_type") {
        selectFields.push("a.activity_type AS Activity_type");
        groupByFields.push("a.activity_type");
      } else if (dim === "day") {
        selectFields.push("da.day AS Date");
        groupByFields.push("da.day");
      }
    });

    let selectClause = "";
    let groupByClause = "";

    const whereConditions = [];
    if (start_date) whereConditions.push("da.day >= :start_date");
    if (end_date) whereConditions.push("da.day <= :end_date");
    if (employee_ids && employee_ids.length > 0) whereConditions.push("da.employee IN (:employee_ids)");
    if (project_ids && project_ids.length > 0) whereConditions.push("p.proj_id IN (:project_ids)");
    if (activity_types && activity_types.length > 0) whereConditions.push("a.activity_type IN (:activity_types)");

    const whereClause = whereConditions.length > 0 ? "WHERE " + whereConditions.join(" AND ") : "";

    let baseQuery = `
      FROM days_activities da
      JOIN activity a ON da.activity = a.activity_id
      JOIN projects p ON a.proj_id = p.proj_id
      JOIN employees e ON da.employee = e.id
      ${whereClause}
    `;

    // Aggregation or detailed
    if (aggregationDimensions.length > 0) {
      const dimensionSelect = selectFields.length > 0 ? selectFields.join(", ") + ", " : "";
      selectClause = `${dimensionSelect}ROUND(SUM(da.effort_placed)/60, 1) AS Hours`;
      groupByClause = groupByFields.length > 0 ? "GROUP BY " + groupByFields.join(", ") : "";
    } else {
      selectClause = `
        CONCAT(e.first_name, ' ', e.last_name) AS Employee,
        p.proj_name AS Project,
        a.activity_name AS Activity_name,
        a.activity_type AS Activity_type,
        da.day AS Date,
        ROUND(da.effort_placed/60, 1) AS Hours
      `;
    }

    if (isExport) {
      // Exporting to Excel (no pagination)
      const exportQuery = `
        SELECT
          ${selectClause}
        ${baseQuery}
        ${groupByClause}
      `;

      const replacements = {
        start_date,
        end_date,
        employee_ids,
        project_ids,
        activity_types
      };

      const results = await sequelize.query(exportQuery, {
        replacements,
        type: sequelize.QueryTypes.SELECT
      });

      // Generate Excel
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Report');

      if (results.length) {
        // Add column headers
        worksheet.addRow(Object.keys(results[0]));

        // Add data rows
        for (const row of results) {
          worksheet.addRow(Object.values(row));
        }
      }

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="report.xlsx"');
      await workbook.xlsx.write(res);
      res.end();
      return;
    }

    // Normal JSON response with pagination and totalCount
    // First, get totalCount
    let totalCountQuery = "";
    if (aggregationDimensions.length > 0) {
      const dimensionSelect = selectFields.length > 0 ? selectFields.join(", ") + "," : "";
      const aggregateCountSQL = `
        SELECT COUNT(*) as total 
        FROM (
          SELECT ${dimensionSelect} SUM(da.effort_placed) as total_effort
          ${baseQuery}
          ${groupByClause}
        ) as subquery
      `;
      totalCountQuery = aggregateCountSQL;
    } else {
      totalCountQuery = `
        SELECT COUNT(*) as total
        ${baseQuery}
      `;
    }

    const [countResult] = await sequelize.query(totalCountQuery, {
      replacements: {
        start_date,
        end_date,
        employee_ids,
        project_ids,
        activity_types
      },
      type: sequelize.QueryTypes.SELECT
    });

    const totalCount = parseInt(countResult.total, 10);

    // Fetch paginated data
    const dataQuery = `
      SELECT
        ${selectClause}
      ${baseQuery}
      ${groupByClause}
      LIMIT :limit OFFSET :offset
    `;

    const results = await sequelize.query(dataQuery, {
      replacements: {
        start_date,
        end_date,
        employee_ids,
        project_ids,
        activity_types,
        limit,
        offset
      },
      type: sequelize.QueryTypes.SELECT
    });

    // Return both results and totalCount as JSON
    res.json({ totalCount, results });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};