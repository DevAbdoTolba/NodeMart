import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let doc;

    // If searchBy is provided, delete by that field; otherwise, delete by ID
    if (req.params.searchBy) {
      doc = await Model.findOneAndDelete({
        [req.params.searchBy]: req.params.value,
      });
    } else {
      doc = await Model.findByIdAndDelete(req.params.id);
    }

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let doc;

    const updateOptions = { new: true, runValidators: true };

    // If searchBy is provided, update by that field; otherwise, update by ID
    if (req.params.searchBy) {
      doc = await Model.findOneAndUpdate(
        { [req.params.searchBy]: req.params.value },
        req.body,
        updateOptions,
      );
    } else {
      doc = await Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        updateOptions,
      );
    }

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

// Model: The Mongoose model to query (e.g., Tour, User)
// popOptions: Optional Mongoose populate options (string path or object) passed to query.populate()
export const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query;

    // If searchBy is provided, find by that field; otherwise, find by ID
    if (req.params.searchBy) {
      query = Model.findOne({ [req.params.searchBy]: req.params.value });
    } else {
      query = Model.findById(req.params.id);
    }
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1. Prepare Filter
    const queryObj = { ...req.query }; // ?price=100&category=electronics&page=2&limit=10&sort=-price,createdAt
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((field) => delete queryObj[field]); // we are going for only simple queries now...
    // For advanced searching we might use ?price[gte]=100&price[lte]=200 and replace it with $gte : 100 $lte : 200 with regex

    // 2. Initialize Query
    let query = Model.find(queryObj);

    // 3. Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // 4. Paginate
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    if (limit > 20) {
      return next(
        new AppError("Limit should be less than or equal to 20", 400),
      );
    }
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    // 5. Execute
    const doc = await query;

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
