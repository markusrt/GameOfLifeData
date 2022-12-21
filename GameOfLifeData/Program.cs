const int FixedMatrixSize = 30 * 30;

var gameStates = new Dictionary<string,int[]>();
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseDefaultFiles();
app.UseStaticFiles(new StaticFileOptions
{
    ServeUnknownFileTypes = true,
    DefaultContentType = "text/plain"
});

app.MapGet("/api/game/{gameId}", GetGameById)
    .WithDescription("Get game matrix by gameId")
    .WithOpenApi();
app.MapPost("/api/game/{gameId}", UpdateGameById)
    .WithDescription("Update game matrix for gameId")
    .WithOpenApi();

int[] GetGameById(string gameId)
{
    EnsureGameExists(gameId);
    return gameStates[gameId];
}

IResult UpdateGameById(string gameId, int[] gameState)
{
    if (gameState.Length != FixedMatrixSize)
    {
        return Results.BadRequest($"Gamestate matrix needs to have a fixed size of {FixedMatrixSize}, i.e. 30x30 in the current version");
    }
    EnsureGameExists(gameId);
    gameStates[gameId] = gameState;
    return Results.NoContent(); 
}

void EnsureGameExists(string gameId)
{
    if (!gameStates.ContainsKey(gameId))
    {
        gameStates.Add(gameId, new int[FixedMatrixSize]);
    }
}

app.Run();
