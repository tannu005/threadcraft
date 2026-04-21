const express = require('express')
const designController = require('../controllers/designController')
const authController = require('../controllers/authController')

const router = express.Router()

// Protect all routes after this middleware
router.use(authController.protect)

router
  .route('/')
  .get(designController.getAllDesigns)
  .post(designController.createDesign)

router
  .route('/:id')
  .get(designController.getDesign)
  .patch(designController.updateDesign)
  .delete(designController.deleteDesign)

module.exports = router
