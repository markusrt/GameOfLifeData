using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace GameOfLifeData
{
    public class Game
    {
        private readonly ILogger<Game> _logger;

        public Game(ILogger<Game> log)
        {
            _logger = log;
        }

        [FunctionName("RetrieveGameState")]
        [OpenApiOperation(operationId: "retrieve-game-state")]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiParameter(name: "id", In = ParameterLocation.Path, Required = true, Type = typeof(string), Description = "The game id")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/plain", bodyType: typeof(int[]), Description = "The current game state array")]
        public async Task<IActionResult> RetrieveGameState(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "game/{id:alpha}")] HttpRequest req, string id)
        {
            _logger.LogInformation($"Retrieve game state for game '{id}'");


            var dummyData = new[] { 1, 0, 1, 1, 0, 0 };
            return new OkObjectResult(dummyData);
        }

        [FunctionName("UpdateGameState")]
        [OpenApiOperation(operationId: "update-game-state")]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiRequestBody("application/json",  typeof(int[]), Description = "The current game state array", Required = true)]
        [OpenApiParameter(name: "id", In = ParameterLocation.Path, Required = true, Type = typeof(string), Description = "The game id")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/plain", bodyType: typeof(int[]), Description = "The current game state array")]
        public async Task<IActionResult> UpdateGameState(
            //[Table("GameState")] object table,
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "game/{id:alpha}")] HttpRequest req, string id)
        {
            _logger.LogInformation($"Update game state for game '{id}'");

            var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic request = JsonConvert.DeserializeObject(requestBody);
            
            if (request is JArray jArray && jArray.All(s => s.Type == JTokenType.Integer))
            {
                var data = jArray.ToObject<int[]>();
                _logger.LogInformation($"Update game state for id {id}");
                return new OkResult();
            }

            _logger.LogWarning($"Update received invalid data {request}");
            return new BadRequestObjectResult("Posted data needs to be an integer array");
        }


        /*
         *         [FunctionName("UpdateGameState")]
        [OpenApiOperation(operationId: "update-game-state")]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiRequestBody("application/json",  typeof(int[]), Description = "The current game state array", Required = true)]
        [OpenApiParameter(name: "id", In = ParameterLocation.Path, Required = true, Type = typeof(string), Description = "The game id")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/plain", bodyType: typeof(int[]), Description = "The current game state array")]
        [return: Table("GameState")]
        public async Task<GameState> UpdateGameState(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "game/{id:alpha}")] HttpRequest req, string id)
        {
            _logger.LogInformation($"Update game state for game '{id}'");

            var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic request = JsonConvert.DeserializeObject(requestBody);
            
            if (request is JArray jArray && jArray.All(s => s.Type == JTokenType.Integer))
            {
                _logger.LogInformation($"Update game state for id {id}");

                var data = jArray.ToObject<int[]>();
                return new GameState() { PartitionKey = "Http", GameId = id, State = data};
                //return new OkResult();
            }

            _logger.LogWarning($"Update received invalid data {request}");
            return null;// new BadRequestObjectResult("Posted data needs to be an integer array");
        }
         */
    }
}

