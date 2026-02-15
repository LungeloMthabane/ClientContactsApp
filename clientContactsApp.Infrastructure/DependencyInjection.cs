using clientContactsApp.Application.Interfaces;
using clientContactsApp.Infrastructure.Data;
using clientContactsApp.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace clientContactsApp.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Register DbContext
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlite(
                configuration.GetConnectionString("DefaultConnection")));
        
        // Register Repositories
        services.AddScoped<IClientRepository, ClientRepository>();
        
        return services;
    }
}