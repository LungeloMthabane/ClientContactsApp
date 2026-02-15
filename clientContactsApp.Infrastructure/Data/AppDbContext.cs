using clientContactsApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace clientContactsApp.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Contact> Contacts => Set<Contact>();
    public DbSet<ClientContact> ClientContacts => Set<ClientContact>();
    
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // CONTACT
        builder.Entity<Contact>(entity =>
        {
            entity.ToTable("Contacts");
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Name)
                .IsRequired()
                .HasMaxLength(100);
            
            entity.Property(x => x.Surname)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(x => x.Email)
                .IsRequired()
                .HasMaxLength(150);
        });

        // Client
        builder.Entity<Client>(entity =>
        {
            entity.ToTable("Clients");
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Name)
                .IsRequired()
                .HasMaxLength(100);
            
            entity.Property(x => x.Code)
                .IsRequired()
                .HasMaxLength(6);
        });

        // MANY TO MANY (Junction table)
        builder.Entity<ClientContact>(entity =>
        {
            entity.ToTable("ClientContacts");

            // Composite keys 
            entity.HasKey(x => new { x.ContactId, x.ClientId });

            entity.HasOne(x => x.Contact)
                .WithMany(c => c.ClientContacts)
                .HasForeignKey(x => x.ContactId);

            entity.HasOne(x => x.Client)
                .WithMany(g => g.ClientContacts)
                .HasForeignKey(x => x.ClientId);
        });
    }
}