const Design = require('../models/Design')

exports.getAllDesigns = async (req, res) => {
  try {
    const designs = await Design.find({ user: req.user.id }).sort('-createdAt')
    res.status(200).json({ status: 'success', results: designs.length, data: { designs } })
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message })
  }
}

exports.createDesign = async (req, res) => {
  try {
    const newDesign = await Design.create({
      ...req.body,
      user: req.user.id
    })
    res.status(201).json({ status: 'success', data: { design: newDesign } })
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message })
  }
}

exports.getDesign = async (req, res) => {
  try {
    const design = await Design.findOne({ _id: req.params.id, user: req.user.id })
    if (!design) return res.status(404).json({ status: 'fail', message: 'No design found with that ID' })
    res.status(200).json({ status: 'success', data: { design } })
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message })
  }
}

exports.updateDesign = async (req, res) => {
  try {
    const design = await Design.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    )
    if (!design) return res.status(404).json({ status: 'fail', message: 'No design found with that ID' })
    res.status(200).json({ status: 'success', data: { design } })
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message })
  }
}

exports.deleteDesign = async (req, res) => {
  try {
    const design = await Design.findOneAndDelete({ _id: req.params.id, user: req.user.id })
    if (!design) return res.status(404).json({ status: 'fail', message: 'No design found with that ID' })
    res.status(204).json({ status: 'success', data: null })
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message })
  }
}
