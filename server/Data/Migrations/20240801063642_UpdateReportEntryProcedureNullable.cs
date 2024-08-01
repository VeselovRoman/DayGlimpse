using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateReportEntryProcedureNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReportEntries_Procedures_ProcedureId",
                table: "ReportEntries");

            migrationBuilder.AddForeignKey(
                name: "FK_ReportEntries_Procedures_ProcedureId",
                table: "ReportEntries",
                column: "ProcedureId",
                principalTable: "Procedures",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReportEntries_Procedures_ProcedureId",
                table: "ReportEntries");

            migrationBuilder.AddForeignKey(
                name: "FK_ReportEntries_Procedures_ProcedureId",
                table: "ReportEntries",
                column: "ProcedureId",
                principalTable: "Procedures",
                principalColumn: "Id");
        }
    }
}
