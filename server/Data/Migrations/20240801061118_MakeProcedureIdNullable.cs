using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Data.Migrations
{
    /// <inheritdoc />
    public partial class MakeProcedureIdNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReportEntries_Procedures_ProcedureId",
                table: "ReportEntries");

            migrationBuilder.AlterColumn<int>(
                name: "ProcedureId",
                table: "ReportEntries",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_ReportEntries_Procedures_ProcedureId",
                table: "ReportEntries",
                column: "ProcedureId",
                principalTable: "Procedures",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReportEntries_Procedures_ProcedureId",
                table: "ReportEntries");

            migrationBuilder.AlterColumn<int>(
                name: "ProcedureId",
                table: "ReportEntries",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ReportEntries_Procedures_ProcedureId",
                table: "ReportEntries",
                column: "ProcedureId",
                principalTable: "Procedures",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
