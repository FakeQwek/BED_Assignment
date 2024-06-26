const sql = require("mssql");
const dbConfig = require("../../dbConfig");

class Discussion {
    constructor(dscName, dscDesc, accName) {
        this.dscName = dscName;
        this.dscDesc = dscDesc;
        this.accName = accName;
    }

    static async getAllDiscussions() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Discussion`;

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map((row) => new Discussion(row.DscName, row.DscDesc, row.AccName));
    }

    static async getDiscussionByName(dscName) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Discussion WHERE DscName = @dscName`;

        const request = connection.request();
        request.input("dscName", dscName);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0]
            ? new Discussion(
                result.recordset[0].DscName,
                result.recordset[0].DscDesc,
                result.recordset[0].AccName
            )
            : null;
    }

    static async createDiscussion(newDiscussionData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT INTO Discussion (DscName, DscDesc, AccName) VALUES(@dscName, @dscDesc, @accName);`;

        const request = connection.request();
        request.input("dscName", newDiscussionData.dscName);
        request.input("dscDesc", newDiscussionData.dscDesc);
        request.input("accName", newDiscussionData.accName);

        const result = await request.query(sqlQuery);

        connection.close();
    }

    static async updateDiscussion(dscName, dscDesc) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `UPDATE Discussion SET DscDesc = @dscDesc WHERE DscName = @dscName`;

        const request = connection.request();
        request.input("dscName", sql.VarChar, dscName);
        request.input("dscDesc", sql.VarChar, dscDesc);

        await request.query(sqlQuery);
        connection.close();
    }
}

module.exports = Discussion;