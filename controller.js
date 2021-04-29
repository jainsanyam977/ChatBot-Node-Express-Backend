const express = require('express');
const app = express();
const port = 5500;
const pkg = require('cors');

const {toRouter} = require('./router');

app.use(pkg());
app.use(express.json());

app.get('/', async (req, res) => {
    res.send("API IS ONLINE");
});

app.post('/rooms', async(req, res) => {
    const data = await toRouter(req.body);
    res.send(data);
})

app.listen(port, () => {
    console.log(`Running at ${port}`);
});
