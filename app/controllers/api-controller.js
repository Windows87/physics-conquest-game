const apiController = {};
apiController.get = (req, res) => res.json({ name: 'Physics Conquest Game', version: '1.0.0' });
module.exports = apiController;