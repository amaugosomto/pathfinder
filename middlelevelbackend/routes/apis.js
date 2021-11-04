var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/getCoordinates', async function(req, res) {
  let {coordinates, start, end} = req.body;
  
  let newCordinates = Object.entries(coordinates);
  const adjencyList = new Map(newCordinates);
  
  // bfs
  // const routes = await findRouteV2(start, end, adjencyList);

  // dfs
  const routes = await findRoute(start, end, [], adjencyList);

  res.send({routes, mode: 'dfs'})
});

async function findRoute(start, end, visited = [], adjencyList) {

  visited.push(start);
  const childCoordinates = adjencyList.get(start);

  for (const coordinate of childCoordinates) {

    if (coordinate == end) {
      return visited;
    }

    if (!visited.includes(coordinate)) {
      return findRoute(coordinate, end, visited, adjencyList);
    }
  }
}

async function findRouteV2(start, end, adjencyList) {
  const queue = [start];
  const visited = new Set(); 
  const paths = [];

  while (queue.length > 0) {
    const coordinate = queue.shift();
    const childCoordinates = adjencyList.get(coordinate);

    for (const coordinate of childCoordinates) {
      if (coordinate == end) {
        paths.push(Array.from(visited))
      }

      if (!visited.has(coordinate)){
        visited.add(coordinate);
        queue.push(coordinate);
      }
    }
    
  }

  return paths;
}

module.exports = router;
