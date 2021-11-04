import {useState} from 'react';
import './App.css';

const alphabets = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

function App(props) {
  const [maps, setMaps] = useState(getEmptyArray(0));
  const [number, setNumber] = useState(getEmptyArray(0));
  const [selects, setSelects] = useState(getEmptyArray(0));
  const [adjencyList, setAdjencyList] = useState({});
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectValues, setSelectValue] = useState({
    end: '',
    start: ''
  });

  var interval;

  function resetPage() {
    setSelectValue({
      end: '',
      start: ''
    });
    setLoading(false);
    setRoutes([]);
  }
  
  function generateNewMap () {
    resetPage();
    let randomInt = getRndInteger(5, 14);
    let randomAlphabetNumber = getRndInteger(5, 26);

    setMaps(getEmptyArray(randomAlphabetNumber));
    setNumber(getEmptyArray(randomInt));
    getSelects(randomAlphabetNumber, randomInt);
  }

  function getSelects(alphabetNumber, randomInt) {
    let paths = [];
    let adjencyList = {};

    for (let i = 0; i < alphabetNumber; i++) {
      for (let j = 0; j < randomInt; j++) {
        adjencyList[`${alphabets[i]}${j + 1}`] = getAdjecencyList(i, j, alphabetNumber, randomInt)
        paths.push(`${alphabets[i]}${j + 1}`);
      }
    }
    
    setSelects(paths);
    setAdjencyList(adjencyList);
  }

  function getAdjecencyList(i, j, alphabetNumber, randomInt) {

    let top = j != 0 ? `${alphabets[i]}${j}` : 'undefined';
    let right = i + 1 < alphabetNumber ? `${alphabets[i + 1]}${j + 1}` : 'undefined';
    let down = j + 2 <= randomInt ? `${alphabets[i]}${j + 2}` : 'undefined';
    let left = i != 0 ? `${alphabets[i - 1]}${j + 1}` : 'undefined';

    let newArray = [];
    
    !top.includes('undefined') && newArray.push(top);
    !right.includes('undefined') && newArray.push(right);
    !down.includes('undefined') && newArray.push(down);
    !left.includes('undefined') && newArray.push(left);

    return newArray;
  }

  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

  function getEmptyArray(num) {
    return Array.apply(null, Array(num));
  }

  async function drive() {
    clearInterval(interval);
    setRoutes([]);
    setLoading(true);
    let data = {
      "coordinates": adjencyList,
      "start": selectValues.start,
      "end": selectValues.end
    }

    await fetch('http://localhost:4000/api/getCoordinates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(res => res.json())
    .then(data => {
      let routes = [];
      if (data.mode == 'bfs') {
        routes = data.routes[0];
      } else {
        data.routes.shift();
        routes = data.routes
      }
      configureRoutes(routes);
    })
    .catch(err => console.log({err}))
    .finally(() => setLoading(false));
  }

  function configureRoutes(routesFromApi) {
    let count = routesFromApi.length;
    let added = 0;

    interval = setInterval(() => {
      setRoutes([...routes, routesFromApi[added]]);
      ++added;
      if (added > count) {
        clearInterval(interval);
        let startIndex = routesFromApi.indexOf(selectValues.start);
        if (startIndex > -1) routesFromApi.splice(startIndex, 1);
        setRoutes(routesFromApi)
      };
    }, 300)
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="header">
          <button
            data-testid="generatebtn"
            className="btn"
            onClick={() => {
              generateNewMap();
              props.onChange({
                maps: !maps, number: !number, selects: !selects
              });
            }}
          >
            Generate New Map
          </button>
          <div>
            <div>
              <span>Start:</span>
              <select
                name="start"
                value={selectValues.start}
                onChange={(e) => setSelectValue({...selectValues, start: e.target.value})}
              >
                {
                  selects.map(select => <option value={select} key={select}>{select}</option>)
                }
              </select>
            </div>
            <div style={{margin: '0 1rem'}}>
              <span>End:</span>
              <select
                name="end"
                value={selectValues.end}
                onChange={(e) => setSelectValue({...selectValues, end: e.target.value})}
              >
                {
                  selects.map(select => <option value={select} key={select}>{select}</option>)
                }
              </select>
            </div>

            <button
              data-testid="drivebtn"
              className="btn-sm"
              onClick={() => {
                drive();
                props.onChange({
                  maps: !maps, number: !number, selects: !selects
                });
              }}
              disabled={loading}
            >
              drive
            </button>
          </div>
        </div>
        {
          loading ? <h6 className="note">Getting Coordinates....</h6> : routes.length > 0 ? <h6 className="note">Gotten Coordinates....</h6> : ''
        }
        <div style={{marginTop: '2rem'}}>
          {
            number.map((p, i) =>
              <div className="roadContainer" key={i}>
                {
                  maps.map((x, y) =>
                    <div
                      className={
                        `road ${selectValues.start == `${alphabets[y]}${i + 1}` ? 'greenBackground' : ''} 
                          ${selectValues.end == `${alphabets[y]}${i + 1}` ? 'redBackground' : ''}
                          ${routes.indexOf(`${alphabets[y]}${i + 1}`) > -1 ? 'blueBackground': ''}
                        `
                      }
                      key={y}
                    >
                        {alphabets[y]}{i + 1}
                    </div>
                  )
                }
              </div>
            )
          }
          
        </div>
      </header>
    </div>
  );
}

export default App;
