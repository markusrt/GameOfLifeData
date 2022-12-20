using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NSubstitute;
using NUnit.Framework;
using System.Text;
using System.Text.Json;
using GameOfLifeData;

namespace GameOfLifeDataTests
{
    public class CallTests
    {
        [Test]
        public async Task RetrieveGameState_ReturnsDummyData()
        {
            var version = new Version(280, 280, 280, Int16.MaxValue);

            version.ToString().Should().Be("280.280.280.280");
            var logger = Substitute.For<ILogger<Game>>();
            var request = CreateMockRequest(null);
            var sut = new Game(logger);
            
            var result = await sut.RetrieveGameState(null, "test");

            var okResponse = result.Should().BeOfType<OkObjectResult>().Subject;
            okResponse.Value.Should().BeOfType<int[]>().Subject.Should().HaveCount(6);
        }


        [Test]
        public async Task UpdateGameState_StoresIntegerArray()
        {
            var logger = Substitute.For<ILogger<Game>>();
            var request = CreateMockRequest(new []{1,2,3,4,5,6});
            var sut = new Game(logger);
            
            var result = await sut.UpdateGameState(request, "test");

            result.Should().BeOfType<OkResult>();
        }

        [Test]
        public async Task UpdateGameState_InvalidPayload_ReturnsBadRequest()
        {
            var logger = Substitute.For<ILogger<Game>>();
            var request = CreateMockRequest(new object []{1,2,"foo",4,5,6});
            var sut = new Game(logger);
            
            var result = await sut.UpdateGameState(request, "test");

            result.Should().BeOfType<BadRequestObjectResult>()
                .Subject.Value.Should().BeOfType<string>();
        }
        

        private static HttpRequest CreateMockRequest(object? body)
        {
            var json = JsonSerializer.Serialize(body);
            var byteArray = Encoding.ASCII.GetBytes(json);
 
            var memoryStream = new MemoryStream(byteArray);
 
            var mockRequest = Substitute.For<HttpRequest>();
            mockRequest.Body.Returns(memoryStream);
 
            return mockRequest;
        }
    }
}