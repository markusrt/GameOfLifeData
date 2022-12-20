var gameStates = new Dictionary<string,int[]>();
var builder = WebApplication.CreateBuilder(args);


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseDefaultFiles();
app.UseStaticFiles(new StaticFileOptions
{
    ServeUnknownFileTypes = true,
    DefaultContentType = "text/plain"
});

app.UseRouting();

app.MapGet("/api/game/{gameId}", 
    (string gameId) =>
    {
        if (!gameStates.ContainsKey(gameId))
        {
            gameStates.Add(gameId, new int[30*30]);
        }
        return gameStates[gameId];
    });

app.MapPost("/api/game/{gameId}", (string gameId, int[] gameState) => 
    {
        gameStates[gameId] = gameState;
        return Results.NoContent(); 
    });

app.Run();
