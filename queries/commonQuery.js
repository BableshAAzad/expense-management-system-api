// &----------------save query ---------------------------------------------------------------------
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

// &-------------------------------------------------------------------------------------
