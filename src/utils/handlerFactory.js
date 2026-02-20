// handlerFactory.js
export const createOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.create(req.body);
    res.status(201).json({ status: 'success', data: doc });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

export const getOne = (Model, populateOptions) => async (req, res) => {
  try {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;
    if (!doc) return res.status(404).json({ status: 'fail', message: 'Not found' });
    res.status(200).json({ status: 'success', data: doc });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

export const getAll = (Model) => async (req, res) => {
  try {
    const docs = await Model.find();
    res.status(200).json({ status: 'success', results: docs.length, data: docs });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

export const updateOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ status: 'fail', message: 'Not found' });
    res.status(200).json({ status: 'success', data: doc });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

export const deleteOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ status: 'fail', message: 'Not found' });
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
