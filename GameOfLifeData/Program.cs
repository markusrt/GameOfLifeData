var gameStates = new Dictionary<string,int[]>();
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
//builder.Services.AddRazorPages();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

//app.UseHttpsRedirection();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseRouting();

//app.UseAuthorization();

app.MapGet("/api/game/{gameId}", 
    (string gameId) => gameStates[gameId]);

app.MapPost("/api/game/{gameId}", (string gameId, int[] gameState) => 
    {
        gameStates[gameId] = gameState;
        return Results.NoContent(); 
    });
//app.MapRazorPages();

app.Run();
