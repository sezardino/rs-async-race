import jsonServer from 'json-server';

const generateCars = (count) => {
  const carBrands = [
    'Tesla',
    'BMW',
    'Mercedes',
    'Ford',
    'Audi',
    'Toyota',
    'Honda',
    'Nissan',
    'Chevrolet',
    'Volkswagen',
    'Volvo',
    'Porsche',
    'Lexus',
    'Mazda',
    'Subaru',
    'Jaguar',
    'Ferrari',
    'Lamborghini',
    'Bugatti',
    'McLaren',
    'Hyundai',
    'Kia',
    'Peugeot',
    'Renault',
    'Skoda',
    'Citroen',
    'Mitsubishi',
    'Jeep',
    'Cadillac',
    'Chrysler',
    'Dodge',
    'Alfa Romeo',
    'Maserati',
    'Infiniti',
    'Acura',
    'Genesis',
    'Mini',
    'Suzuki',
    'Land Rover',
    'Seat',
  ];

  const carModels = [
    'Model S',
    'X5',
    'C-Class',
    'Mustang',
    'A4',
    'Corolla',
    'Civic',
    'Altima',
    'Camaro',
    'Passat',
    'XC90',
    '911',
    'RX',
    'CX-5',
    'Forester',
    'F-Type',
    '488',
    'Huracan',
    'Chiron',
    '720S',
    'Tucson',
    'Sportage',
    '308',
    'Megane',
    'Octavia',
    'C4',
    'Outlander',
    'Wrangler',
    'Escalade',
    '300C',
    'Challenger',
    'Giulia',
    'Levante',
    'Q50',
    'TLX',
    'G80',
    'Cooper',
    'Swift',
    'Discovery',
    'Leon',
  ];

  const colors = [
    '#e6e6fa',
    '#fede00',
    '#6c779f',
    '#ef3c40',
    '#ff5733',
    '#4caf50',
    '#3498db',
    '#9b59b6',
    '#f39c12',
    '#2c3e50',
    '#8e44ad',
    '#16a085',
    '#c0392b',
    '#d35400',
    '#27ae60',
    '#2980b9',
    '#2ecc71',
    '#f1c40f',
    '#95a5a6',
    '#7f8c8d',
    '#bdc3c7',
    '#1abc9c',
    '#e74c3c',
    '#34495e',
    '#e67e22',
    '#ecf0f1',
    '#d35400',
    '#7f8c8d',
    '#9b59b6',
    '#f39c12',
    '#27ae60',
    '#2980b9',
    '#c0392b',
    '#8e44ad',
    '#2c3e50',
    '#f1c40f',
    '#16a085',
    '#95a5a6',
    '#d35400',
    '#ff5733',
  ];

  return Array.from({ length: count }, (_, index) => ({
    name: carBrands[index % carBrands.length],
    model: carModels[index % carModels.length],
    color: colors[index % colors.length],
    id: index + 1,
  }));
};

const generateWinners = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    wins: Math.floor(Math.random() * 100) + 1,
    time: (Math.random() * 5 + 1).toFixed(2),
  }));
};

const db = {
  garage: generateCars(1000),
  winners: generateWinners(1000),
};

const server = jsonServer.create();
const router = jsonServer.router(db);
const middlewares = jsonServer.defaults();

const PORT = process.env.SERVER_PORT || 3001;

const state = { velocity: {}, blocked: {} };

server.use(middlewares);

const STATUS = {
  STARTED: 'started',
  STOPPED: 'stopped',
  DRIVE: 'drive',
};

// @ts-ignore
server.patch('/engine', (req, res) => {
  const { id, status } = req.query;

  if (!id || Number.isNaN(+id) || +id <= 0) {
    return res
      .status(400)
      .send('Required parameter "id" is missing. Should be a positive number');
  }

  // @ts-ignore
  if (!status || !/^(started)|(stopped)|(drive)$/.test(status)) {
    return res
      .status(400)
      .send(
        `Wrong parameter "status". Expected: "started", "stopped" or "drive". Received: "${status}"`
      );
  }

  if (!db.garage.find((car) => car.id === +id)) {
    return res
      .status(404)
      .send('Car with such id was not found in the garage.');
  }

  const distance = 500000;

  if (status === STATUS.DRIVE) {
    if (state.blocked[id]) {
      return res
        .status(429)
        .send(
          "Drive already in progress. You can't run drive for the same car twice while it's not stopped."
        );
    }

    const velocity = state.velocity[id];

    if (!velocity) {
      return res
        .status(404)
        .send(
          'Engine parameters for car with such id was not found in the garage. Have you tried to set engine status to "started" before?'
        );
    }

    state.blocked[id] = true;

    const x = Math.round(distance / velocity);

    delete state.velocity[id];

    if (new Date().getMilliseconds() % 3 === 0) {
      setTimeout(
        () => {
          delete state.blocked[id];
          res
            .header('Content-Type', 'application/json')
            .status(500)
            .send(
              "Car has been stopped suddenly. It's engine was broken down."
            );
        },
        (Math.random() * x) ^ 0
      );
    } else {
      setTimeout(() => {
        delete state.blocked[id];
        res
          .header('Content-Type', 'application/json')
          .status(200)
          .send(JSON.stringify({ success: true }));
      }, x);
    }
  } else {
    const x = req.query.speed ? +req.query.speed : (Math.random() * 2000) ^ 0;

    const velocity =
      status === STATUS.STARTED ? Math.max(50, (Math.random() * 200) ^ 0) : 0;

    if (velocity) {
      state.velocity[id] = velocity;
    } else {
      delete state.velocity[id];
      delete state.blocked[id];
    }

    setTimeout(
      () =>
        res
          .header('Content-Type', 'application/json')
          .status(200)
          .send(JSON.stringify({ velocity, distance })),
      x
    );
  }
});

server.use(router);
server.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
