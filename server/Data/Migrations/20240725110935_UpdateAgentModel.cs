using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAgentModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AgentName",
                table: "Agents");

            migrationBuilder.DropColumn(
                name: "PasswordHash",
                table: "Agents");

            migrationBuilder.DropColumn(
                name: "PasswordSalt",
                table: "Agents");

            migrationBuilder.RenameColumn(
                name: "Role",
                table: "Agents",
                newName: "Login");

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "Agents",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LastName",
                table: "Agents",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "Agents");

            migrationBuilder.DropColumn(
                name: "LastName",
                table: "Agents");

            migrationBuilder.RenameColumn(
                name: "Login",
                table: "Agents",
                newName: "Role");

            migrationBuilder.AddColumn<string>(
                name: "AgentName",
                table: "Agents",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "PasswordHash",
                table: "Agents",
                type: "bytea",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "PasswordSalt",
                table: "Agents",
                type: "bytea",
                nullable: true);
        }
    }
}
