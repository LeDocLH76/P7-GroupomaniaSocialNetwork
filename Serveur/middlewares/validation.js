const validation = (schema) => async (req, res, next) => {
   try {
      const validatedBody = await schema.validate(req.body);
      req.body = validatedBody;
      next();
   } catch (error) {
      res.status(400).json({ error });
   }
};

module.exports = validation;
