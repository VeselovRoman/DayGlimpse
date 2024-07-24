using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace server.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "ReportEntries",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MainGroup = table.Column<string>(type: "text", nullable: false),
                    CostGroup = table.Column<string>(type: "text", nullable: false),
                    CostCategory = table.Column<string>(type: "text", nullable: false),
                    CostIndex = table.Column<string>(type: "text", nullable: false),
                    CostName = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ReportEntries_CategoryId",
                table: "ReportEntries",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_ReportEntries_Categories_CategoryId",
                table: "ReportEntries",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReportEntries_Categories_CategoryId",
                table: "ReportEntries");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_ReportEntries_CategoryId",
                table: "ReportEntries");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "ReportEntries");
        }
    }
}
