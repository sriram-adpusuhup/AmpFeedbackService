const express = require('express');

const app = express();

app.use(express.json());

app.post('/', (req, res) => {
    const feedback = req.body;
    console.log({ feedback });
    return res.send();
})

app.listen(process.env.MOCK_API_PORT, () => {
    console.log(`Server started on ${process.env.MOCK_API_PORT}`);
});