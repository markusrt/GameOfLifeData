var gameStates = new Dictionary<string,int[]>();
var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles(new StaticFileOptions
{
    ServeUnknownFileTypes = true,
    DefaultContentType = "text/plain"
});

app.MapGet("/api/game/{gameId}", GetGameById);
app.MapPost("/api/game/{gameId}", UpdateGameById);

int[] GetGameById(string gameId)
{
    EnsureGameExists(gameId);
    return gameStates[gameId];
}

IResult UpdateGameById(string gameId, int[] gameState)
{
    EnsureGameExists(gameId);
    gameStates[gameId] = gameState;
    return Results.NoContent(); 
}

void EnsureGameExists(string gameId)
{
    if (!gameStates.ContainsKey(gameId))
    {
        gameStates.Add(gameId, new int[30 * 30]);
    }
}

app.Run();
