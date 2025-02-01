import { check, validationResult } from "express-validator";

class LoginUserDto {
  constructor() {
    this.requiredLoginUserFields = ["email", "password"];
    this.allowedRoles = ["freelancer", "admin", "project_manager"];
  }

  #validateRequiredLoginUserKeys(req, res, next) {
    const bodyKeys = Object.keys(req.body);
    let missingFields = this.requiredCreateUserFields.filter(
      (field) => !bodyKeys.includes(field)
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }
    next();
  }

  #loginUserValidationRules() {
    return [
      check("email")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),

      check("password")
        .isStrongPassword({
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 0,
        })
        .withMessage(
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
        ),
    ];
  }

  #validationHandler(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  }

  validate() {
    return [
      this.#validateRequiredLoginUserKeys.bind(this),
      ...this.#loginUserValidationRules(),
      this.#validationHandler.bind(this),
    ];
  }
}

export default new LoginUserDto();
