import { check, validationResult } from "express-validator";

class CreateUserDto {
  constructor() {
    this.allowedRoles = ["freelancer", "admin", "project_manager"];
  }

  #validateRequiredCreateUserKeys(req, res, next) {
    const requiredCreateUserFields = ["fullName", "email", "password", "role"];

    if (req.body.role === "freelancer") {
      requiredCreateUserFields.push("hourlyRate");
      req.body.hourlyRate = req.body.hourlyRate ?? 20;
    }

    const bodyKeys = Object.keys(req.body);
    const missingFields = requiredCreateUserFields.filter(
      (field) => !bodyKeys.includes(field)
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }
    next();
  }

  #createUserValidationRules() {
    return [
      check("fullName")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Full name is required"),

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

      check("role")
        .notEmpty()
        .withMessage("Role is required")
        .isIn(this.allowedRoles)
        .withMessage(`Role must be one of: ${this.allowedRoles.join(", ")}`),

      check("hourlyRate")
        .optional()
        .custom((value, { req }) => {
          if (req.body.role === "freelancer") {
            if (isNaN(value) || value <= 0) {
              throw new Error("Hourly rate must be a positive number");
            }
          }
          return true;
        }),
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
      this.#validateRequiredCreateUserKeys.bind(this),
      ...this.#createUserValidationRules(),
      this.#validationHandler.bind(this),
    ];
  }
}

export default new CreateUserDto();
