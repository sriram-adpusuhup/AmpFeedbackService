const app = require('./src/services/feedback');

app.listen(process.env.PORT, () => {
    console.log(`AMP feedback service is live on ${process.env.PORT}`);
});