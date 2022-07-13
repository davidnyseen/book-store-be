require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'client', 'build')));
}

app.get('/test', (req, res) => res.send('howdy doody'));

app.get('/cookie', (req, res) => {
    res.cookie('bobnik', 'bobnik bobnik', {
        httpOnly: true,
    });
    res.send('bobnik');
});

app.listen(process.env.PORT, () =>
    console.log(`Server running on http://localhost:${process.env.PORT}`)
);
