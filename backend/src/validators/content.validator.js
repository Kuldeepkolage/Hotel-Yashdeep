import { body } from "express-validator";

export const updateContentValidator = [
  body("phone").optional({ checkFalsy: true }).isString(),
  body("email").optional({ checkFalsy: true }).isEmail().withMessage("Invalid email address"),
  body("address").optional({ checkFalsy: true }).isString(),
  body("googleMap").optional({ checkFalsy: true }).isString(),
  body("heroTitle").optional({ checkFalsy: true }).isString(),
  body("heroSubtitle").optional({ checkFalsy: true }).isString(),
  body("about").optional({ checkFalsy: true }).isString(),
  body("openingHours").optional().isObject().withMessage("Opening hours must be an object"),
  body("socialLinks").optional().isObject().withMessage("Social links must be an object"),
];
