using Microsoft.EntityFrameworkCore;
using server.Entities;

namespace server.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions options) : base(options)
    {
    }
    public DbSet<Agent> Agents { get; set; }
    public DbSet<Respondent> Respondents { get; set; }
    public DbSet<Report> Reports { get; set; }
    public DbSet<Branch> Branches { get; set; }

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

        modelBuilder.Entity<Agent>()
            .HasOne(a => a.Branch)
            .WithMany(b => b.Agents)
            .HasForeignKey(a => a.BranchId);

        modelBuilder.Entity<Respondent>()
            .HasOne(r => r.Branch)
            .WithMany(b => b.Respondents)
            .HasForeignKey(r => r.BranchId);
    }
}
