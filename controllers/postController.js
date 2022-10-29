import axios from 'axios';
import catchAsync from '../utils/catchAsync.js';
import PostModel from '../models/posts.js';

/**
 * @function add
 * @method POST
 * @param req
 * @param res
 * @returns {success or fail}
 */
const add = catchAsync(async (req, res) => {
  try {
    const data = await axios.get('https://jsonplaceholder.typicode.com/todos');

    console.log(data.data);

    const addData = await PostModel.insertMany(data.data);

    return res.status(201).send({
      status: 'success',
      data: addData,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      status: 'fail',
      errors: error,
    });
  }
});

/**
 * @function fetch
 * @method POST
 * @param req
 * @param res
 * @returns {success or fail}
 */
const fetch = catchAsync(async (req, res) => {
  if (req.query.id) {
    try {
      const posts = await PostModel.findOne({ id: req.query.id });

      return res.status(200).send({
        status: 'success',
        data: posts,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        status: 'fail',
        errors: error,
      });
    }
  }

  try {
    const posts = await PostModel.find({});

    return res.status(200).send({
      status: 'success',
      data: posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      status: 'fail',
      errors: error,
    });
  }
});

export default { add, fetch };
