module.exports = {
    url: process.env.INFLUX_URL || 'http://localhost:8086',
    token: process.env.INFLUX_TOKEN || 'your-token-here',
    org: process.env.INFLUX_ORG || 'your-org',
    bucket: process.env.INFLUX_BUCKET || 'serre_db',
    measurement: 'Serre'
  };