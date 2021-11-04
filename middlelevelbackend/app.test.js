var request = require('supertest');
var app =  require('./app')
//"routes":["A1","B1","C1"]
describe("POST /getCoordinates", () => {
  describe("given coordinates, start and end", () => {

    test('should respond with 200 status code', async () => {
      const response = await request(app).post("/api/getCoordinates").send({
        coordinates: {"A1": ["B1", "A2"], "B1": ["C1", "B2", "A1"], "C1": ["D1", "C2", "B1"], "D1": ["D2, C1"]},
        start: "A1",
        end: "D1"
      });
      expect(response.statusCode).toBe(200);
    });

    test('should specify json in the content type header', async () => {
      const response = await request(app).post("/api/getCoordinates").send({
        coordinates: {"A1": ["B1", "A2"], "B1": ["C1", "B2", "A1"], "C1": ["D1", "C2", "B1"], "D1": ["D2, C1"]},
        start: "A1",
        end: "D1"
      });
      expect(response.headers['content-type']).toEqual(expect.stringContaining("json"));
    });

    test('should return routes with array and mode', async () => {
      const response = await request(app).post("/api/getCoordinates").send({
        coordinates: {"A1": ["B1", "A2"], "B1": ["C1", "B2", "A1"], "C1": ["D1", "C2", "B1"], "D1": ["D2, C1"]},
        start: "A1",
        end: "D1"
      });

      let res = JSON.parse(response.text);
      if (res.mode == "dfs") {
        expect(response.text).toEqual('{"routes":["A1","B1","C1"],"mode":"dfs"}');
      } else {
        expect(response.text).toEqual('{"routes":["A1","B1","C1"],"mode":"bfs"}');
      }

    });
  })
})