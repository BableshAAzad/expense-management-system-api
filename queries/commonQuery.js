// &---------------- save query ---------------------------------------------------------------------
module.exports.saveDataQuery = function (tableName, newProcedureInfoData) {
    const columns = Object.keys(newProcedureInfoData).join(', '); // Create a comma-separated list of column names
    const values = Object.values(newProcedureInfoData)
        .map(value => {
            // Escape single quotes and wrap string values in quotes
            if (typeof value === 'string') {
                return `'${value.replace(/'/g, "''")}'`;
            }
            if (value === null || value === undefined) {
                return 'NULL'; // Handle null/undefined values
            }
            return value; // Return numbers and dates as-is
        })
        .join(', ');

    return `
    INSERT INTO ${tableName} (${columns})
    VALUES (${values});
    `;
};

// ^------------------ update query -------------------------------------------------------------------
module.exports.updateDataQuery = function (tableName, newProcedureInfoData, condition) {
    const setClauses = Object.keys(newProcedureInfoData).map(column => {
        const value = newProcedureInfoData[column];
        // Escape single quotes and wrap string values in quotes
        if (typeof value === 'string') {
            return `${column} = '${value.replace(/'/g, "''")}'`;
        }
        if (value === null || value === undefined) {
            return `${column} = NULL`; // Handle null/undefined values
        }
        return `${column} = ${value}`; // Return numbers and dates as-is
    }).join(', ');

    // Ensure the condition is provided for the WHERE clause
    if (!condition) {
        throw new Error("Condition for the WHERE clause is required");
    }

    return `
    UPDATE ${tableName}
    SET ${setClauses}
    WHERE ${condition};
    `;
};
