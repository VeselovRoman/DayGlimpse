using Microsoft.EntityFrameworkCore;
using server.Entities;

namespace server.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Agent> Agents { get; set; }
        public DbSet<Respondent> Respondents { get; set; }
        public DbSet<Branch> Branches { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<ReportEntry> ReportEntries { get; set; }
        public DbSet<Procedure> Procedures { get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Report>()
                .HasOne(r => r.Agent)
                .WithMany(a => a.Reports)
                .HasForeignKey(r => r.AgentId);

            modelBuilder.Entity<Report>()
                .HasOne(r => r.Respondent)
                .WithMany(rp => rp.Reports)
                .HasForeignKey(r => r.RespondentId);

            modelBuilder.Entity<ReportEntry>()
                .HasOne(re => re.Report)
                .WithMany(r => r.ReportEntries)
                .HasForeignKey(re => re.ReportId);

            modelBuilder.Entity<ReportEntry>()
                .HasOne(re => re.Procedure)
                .WithMany()
                .HasForeignKey(re => re.ProcedureId);

            modelBuilder.Entity<Agent>()
                .HasOne(a => a.Branch)
                .WithMany(b => b.Agents)
                .HasForeignKey(a => a.BranchId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Respondent>()
                .HasOne(r => r.Branch)
                .WithMany(b => b.Respondents)
                .HasForeignKey(r => r.BranchId);
        }
    }
}
